import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

/**
 * API endpoint to get current customer data including tags and pricing metafield
 *
 * Usage: GET /apps/configurator/api/customer-data
 * Returns: Customer data with tags and Prices metafield
 */

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    // Authenticate with app proxy (widget calls this endpoint)
    const { session, admin } = await authenticate.public.appProxy(request);

    if (!session?.shop) {
      return json({
        success: false,
        error: "No shop session found"
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!admin) {
      return json({
        success: false,
        error: "Admin API not available"
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Get customer ID from URL parameters (app proxy passes it as logged_in_customer_id)
    const url = new URL(request.url);
    let customerId = url.searchParams.get('logged_in_customer_id');

    // If not in URL params, try session (fallback for other auth methods)
    if (!customerId) {
      customerId = session.customerId || null;
    }

    console.log('🔍 [API] Customer ID extraction:', {
      fromUrlParams: url.searchParams.get('logged_in_customer_id'),
      fromSession: session.customerId,
      finalCustomerId: customerId
    });

    if (!customerId) {
      // Not logged in - return null customer data
      console.log('⚠️ [API] No customer ID found - customer not logged in');
      return json({
        success: true,
        customer: null
      }, {
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Convert to GID format if needed (GraphQL expects gid://shopify/Customer/ID)
    const customerGid = customerId.startsWith('gid://shopify/Customer/')
      ? customerId
      : `gid://shopify/Customer/${customerId}`;

    console.log('📊 Fetching customer data for:', customerGid);

    // Fetch customer with tags and metafields (prices, saved_configurations)
    const customerQuery = `
      query getCustomer($id: ID!) {
        customer(id: $id) {
          id
          email
          firstName
          lastName
          tags
          pricesMetafield: metafield(namespace: "custom", key: "prices") {
            value
          }
          savedConfigsMetafield: metafield(namespace: "custom", key: "saved_configurations") {
            value
          }
        }
      }
    `;

    const response = await admin.graphql(customerQuery, {
      variables: {
        id: customerGid
      }
    });

    const data = await response.json();

    if (data.errors) {
      console.error('❌ GraphQL errors:', data.errors);
      return json({
        success: false,
        error: 'Failed to fetch customer data',
        details: data.errors
      }, {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const customer = data.data.customer;

    if (!customer) {
      return json({
        success: true,
        customer: null
      }, {
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Format response
    const customerData = {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      tags: customer.tags || [],
      metafields: {
        prices: customer.pricesMetafield?.value || null,
        saved_configurations: customer.savedConfigsMetafield?.value || null
      }
    };

    console.log('✅ Customer data fetched:', {
      id: customerData.id,
      tagsCount: customerData.tags.length,
      hasPrices: !!customerData.metafields.prices
    });

    // 🧪 TESTING: Detailed customer pricing data
    console.log('🧪 [CUSTOMER-DATA] Full customer info:', {
      customerId: customerData.id,
      email: customerData.email,
      name: `${customerData.firstName} ${customerData.lastName}`,
    });

    console.log('🧪 [CUSTOMER-TAGS] Tags array:', customerData.tags);

    if (customerData.metafields.prices) {
      console.log('🧪 [CUSTOMER-PRICES] Raw metafield value:', customerData.metafields.prices.substring(0, 200));
      try {
        const pricesJson = JSON.parse(customerData.metafields.prices);
        const skuCount = Object.keys(pricesJson).length;
        console.log('🧪 [CUSTOMER-PRICES] Metafield found:', {
          skuCount,
          firstFewSKUs: Object.keys(pricesJson).slice(0, 5),
          samplePricing: Object.entries(pricesJson).slice(0, 2).map(([sku, data]: [string, any]) => ({
            sku,
            price: data.p,
            discount: data.d,
            base: data.b
          }))
        });
      } catch (e) {
        console.error('🧪 [CUSTOMER-PRICES] Failed to parse prices metafield:', e);
      }
    } else {
      console.log('🧪 [CUSTOMER-PRICES] No prices metafield found');
    }

    // Log saved_configurations metafield
    if (customerData.metafields.saved_configurations) {
      console.log('🧪 [CUSTOMER-CONFIGS] Saved configurations metafield found (length:', customerData.metafields.saved_configurations.length, 'chars)');
    } else {
      console.log('🧪 [CUSTOMER-CONFIGS] No saved_configurations metafield found');
    }

    return json({
      success: true,
      customer: customerData
    }, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });

  } catch (error) {
    console.error('💥 Customer data fetch failed:', error);

    return json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" }
    });
  }
}
