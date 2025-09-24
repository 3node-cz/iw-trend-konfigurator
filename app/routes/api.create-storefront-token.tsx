import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export async function action({ request }: ActionFunctionArgs) {
  console.log('🔑 Create storefront access token endpoint hit');

  try {
    // Authenticate with admin
    const { session, admin } = await authenticate.admin(request);

    if (!session?.shop) {
      return json({ error: "No shop session found" }, { status: 401 });
    }

    if (!admin) {
      return json({ error: "Admin API not available" }, { status: 401 });
    }

    // Create storefront access token
    const mutation = `
      mutation storefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
        storefrontAccessTokenCreate(input: $input) {
          storefrontAccessToken {
            id
            accessToken
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        title: "IW Trend Konfigurator - Cart Creation"
      }
    };

    console.log('🚀 Creating storefront access token');

    const response = await admin.graphql(mutation, { variables });
    const result = await response.json();

    if (result.errors) {
      console.error('❌ GraphQL errors:', result.errors);
      return json({ error: "Token creation failed", details: result.errors }, { status: 400 });
    }

    const tokenData = result.data.storefrontAccessTokenCreate;

    if (tokenData.userErrors?.length > 0) {
      console.error('❌ User errors:', tokenData.userErrors);
      return json({
        error: "Token creation failed",
        userErrors: tokenData.userErrors
      }, { status: 400 });
    }

    if (!tokenData.storefrontAccessToken) {
      return json({ error: "Failed to create storefront access token" }, { status: 400 });
    }

    console.log('✅ Storefront access token created');

    return json({
      storefrontAccessToken: {
        id: tokenData.storefrontAccessToken.id,
        accessToken: tokenData.storefrontAccessToken.accessToken,
        title: tokenData.storefrontAccessToken.title
      }
    });

  } catch (error) {
    console.error('💥 Error creating storefront access token:', error);

    return json({
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}