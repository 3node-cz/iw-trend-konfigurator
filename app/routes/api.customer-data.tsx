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

    // Get customer ID from session
    const customerId = session.customerId;

    if (!customerId) {
      // Not logged in - return null customer data
      return json({
        success: true,
        customer: null
      }, {
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    console.log('📊 Fetching customer data for:', customerId);

    // Fetch customer with tags and prices metafield
    const customerQuery = `
      query getCustomer($id: ID!) {
        customer(id: $id) {
          id
          email
          firstName
          lastName
          tags
          metafield(namespace: "custom", key: "prices") {
            value
          }
        }
      }
    `;

    const response = await admin.graphql(customerQuery, {
      variables: {
        id: customerId
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
        prices: customer.metafield?.value || null
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
