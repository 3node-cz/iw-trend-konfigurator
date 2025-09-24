import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log('🛒 Create storefront cart endpoint hit');

  try {
    // Authenticate with app proxy
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session?.shop) {
      return json({ error: "No shop session found" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { items = [], buyerIdentity = {} } = body;

    console.log('🛒 Creating storefront cart with items:', items);

    // Get or create storefront access token dynamically
    let storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!storefrontAccessToken) {
      console.log('🔑 No storefront token in env, creating one dynamically...');

      // Create storefront access token using Admin API
      const tokenMutation = `
        mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
          storefrontAccessTokenCreate(input: $input) {
            storefrontAccessToken {
              accessToken
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const tokenResponse = await admin.graphql(tokenMutation, {
        variables: {
          input: {
            title: "Dynamic Cart Creation Token"
          }
        }
      });

      const tokenResult = await tokenResponse.json() as any;

      if (tokenResult.errors || tokenResult.data?.storefrontAccessTokenCreate?.userErrors?.length > 0) {
        console.error('❌ Failed to create storefront token:', tokenResult);
        return json({ error: "Could not create storefront access token" }, { status: 500 });
      }

      storefrontAccessToken = tokenResult.data.storefrontAccessTokenCreate.storefrontAccessToken.accessToken;
      console.log('✅ Created dynamic storefront token');
    }

    const cartCreateMutation = `
      mutation cartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            totalQuantity
            estimatedCost {
              totalAmount
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  estimatedCost {
                    totalAmount
                  }
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price
                      product {
                        title
                        handle
                      }
                    }
                  }
                  attributes {
                    key
                    value
                  }
                }
              }
            }
            attributes {
              key
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Transform items to cart lines format
    const cartLines = items.map((item: any) => ({
      merchandiseId: item.variantId,
      quantity: item.quantity || 1,
      attributes: item.attributes || []
    }));

    const variables = {
      input: {
        lines: cartLines,
        attributes: [
          {
            key: '_order_source',
            value: 'cutting_configurator'
          },
          {
            key: '_created_at',
            value: new Date().toISOString()
          }
        ],
        buyerIdentity: {
          countryCode: buyerIdentity.countryCode || "SK",
          ...buyerIdentity
        }
      }
    };

    console.log('🚀 Executing cart create mutation via Storefront API:', variables);

    // Make server-side request to Storefront API (no CORS issues)
    const storefrontUrl = `https://${session.shop}/api/2025-01/graphql.json`;

    const response = await fetch(storefrontUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({
        query: cartCreateMutation,
        variables
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.error('❌ Storefront API errors:', result.errors);
      return json({ error: "Cart creation failed", details: result.errors }, { status: 400 });
    }

    const cartData = result.data.cartCreate;

    // Handle user errors
    if (cartData.userErrors?.length > 0) {
      console.error('❌ User errors:', cartData.userErrors);
      return json({
        error: "Cart creation failed",
        userErrors: cartData.userErrors
      }, { status: 400 });
    }

    if (!cartData.cart) {
      return json({ error: "Failed to create cart" }, { status: 400 });
    }

    console.log('✅ Storefront cart created successfully:', cartData.cart.id);

    return json({
      cart: {
        id: cartData.cart.id,
        checkoutUrl: cartData.cart.checkoutUrl,
        totalQuantity: cartData.cart.totalQuantity,
        estimatedCost: cartData.cart.estimatedCost,
        lines: cartData.cart.lines.edges.map((edge: any) => edge.node)
      }
    });

  } catch (error) {
    console.error('💥 Error creating storefront cart:', error);

    return json({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}