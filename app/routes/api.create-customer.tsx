import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

// Types for structured error responses
interface FieldError {
  field: string;
  message: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  fieldErrors?: FieldError[];
  details?: any;
}

// Validation functions
function validateEmail(email: string): string | null {
  if (!email || !email.trim()) {
    return "E-mailová adresa je povinná";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Zadajte platnú e-mailovú adresu";
  }
  return null;
}

function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) {
    return `${fieldName} je povinné`;
  }
  return null;
}

function validatePhone(phone: string): string | null {
  if (!phone) return null; // Phone is optional

  // Remove spaces and check if it's a valid format
  const cleanPhone = phone.replace(/\s/g, '');

  // Must start with + and contain only digits after that
  if (!/^\+\d{10,15}$/.test(cleanPhone)) {
    return "Telefónne číslo musí byť vo formáte +421123456789";
  }

  return null;
}

// Map Shopify GraphQL field names to our form field names
function mapShopifyFieldToFormField(shopifyField: string[]): string {
  if (!shopifyField || shopifyField.length === 0) return 'general';

  const field = shopifyField[shopifyField.length - 1];

  const fieldMap: Record<string, string> = {
    'firstName': 'firstName',
    'lastName': 'lastName',
    'email': 'email',
    'phone': 'phone',
    'first_name': 'firstName',
    'last_name': 'lastName',
    'address1': 'address1',
    'address2': 'address2',
    'city': 'city',
    'zip': 'zip',
    'countryCode': 'country',
    'country': 'country',
  };

  return fieldMap[field] || 'general';
}

// Translate common Shopify error messages to Slovak
function translateShopifyError(message: string): string {
  const translations: Record<string, string> = {
    'Email has already been taken': 'Tento e-mail je už zaregistrovaný',
    'Email is invalid': 'E-mailová adresa nie je platná',
    'Phone is invalid': 'Telefónne číslo nie je platné',
    'First name can\'t be blank': 'Meno je povinné',
    'Last name can\'t be blank': 'Priezvisko je povinné',
    'Email can\'t be blank': 'E-mailová adresa je povinná',
  };

  // Check for exact match
  if (translations[message]) {
    return translations[message];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(translations)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return message;
}

// Handle CORS preflight
export async function loader({ request }: LoaderFunctionArgs) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
  return json({ error: "Method not allowed" }, { status: 405 });
}

export async function action({ request }: ActionFunctionArgs) {
  console.log('👤 Create customer endpoint hit');

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, {
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }

  try {
    // Parse request body
    const {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      ico,
      dic,
      marketingConsent,
      shopDomain,
      address
    } = await request.json();

    console.log('📝 Received:', { firstName, lastName, email, shopDomain, address });

    // Get shop domain from body
    const shop = shopDomain || "iw-trend.myshopify.com";

    // Load session from storage
    const { sessionStorage } = await import("~/shopify.server");
    const sessionId = await sessionStorage.findSessionsByShop(shop);

    if (!sessionId || sessionId.length === 0) {
      console.error('❌ No session found for shop:', shop);
      return json({
        error: "No session found for shop. Make sure the app is installed.",
        shop
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const session = sessionId[0];

    // Create admin API client with session access token
    const accessToken = session.accessToken;
    if (!accessToken) {
      console.error('❌ No access token in session');
      return json({
        error: "No access token found in session"
      }, {
        status: 401,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const { apiVersion } = await import("~/shopify.server");

    // Create GraphQL client
    const admin = {
      graphql: async (query: string, options?: { variables?: any }) => {
        const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': accessToken,
          },
          body: JSON.stringify({
            query,
            variables: options?.variables
          })
        });
        return {
          json: () => response.json()
        };
      }
    };

    console.log('✅ Session loaded for shop:', shop);

    // Validate all fields
    const fieldErrors: FieldError[] = [];

    // Validate required fields
    const firstNameError = validateRequired(firstName, "Meno");
    if (firstNameError) {
      fieldErrors.push({ field: 'firstName', message: firstNameError });
    }

    const lastNameError = validateRequired(lastName, "Priezvisko");
    if (lastNameError) {
      fieldErrors.push({ field: 'lastName', message: lastNameError });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      fieldErrors.push({ field: 'email', message: emailError });
    }

    // Validate optional fields
    const phoneError = validatePhone(phone);
    if (phoneError) {
      fieldErrors.push({ field: 'phone', message: phoneError });
    }

    // Validate address fields
    if (address) {
      if (!address.address1 || !address.address1.trim()) {
        fieldErrors.push({ field: 'address1', message: 'Ulica a číslo je povinné' });
      }
      if (!address.city || !address.city.trim()) {
        fieldErrors.push({ field: 'city', message: 'Mesto je povinné' });
      }
      if (!address.zip || !address.zip.trim()) {
        fieldErrors.push({ field: 'zip', message: 'PSČ je povinné' });
      }
      if (!address.country || !address.country.trim()) {
        fieldErrors.push({ field: 'country', message: 'Krajina je povinná' });
      }
    }

    // Return validation errors if any
    if (fieldErrors.length > 0) {
      return json({
        success: false,
        error: "Prosím opravte chyby vo formulári",
        fieldErrors
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    // Normalize phone number - Shopify requires space after country code
    let normalizedPhone = phone;
    if (phone) {
      // If phone starts with + and has no space after country code, add it
      // Example: +421123456789 -> +421 123456789
      normalizedPhone = phone.replace(/^(\+\d{1,3})(\d)/, '$1 $2');
    }

    console.log('📝 Creating customer:', {
      firstName,
      lastName,
      email,
      phone: normalizedPhone,
      companyName,
      ico,
      dic,
      marketingConsent
    });

    // Prepare metafields array
    const metafields: Array<{
      namespace: string;
      key: string;
      value: string;
      type: string;
    }> = [];

    // Add company name metafield if provided
    if (companyName) {
      metafields.push({
        namespace: "custom",
        key: "nazov_firmy",
        value: companyName,
        type: "single_line_text_field"
      });
    }

    // Add IČO metafield if provided
    if (ico) {
      metafields.push({
        namespace: "custom",
        key: "ico",
        value: String(ico),
        type: "single_line_text_field"
      });
    }

    // Add DIČ metafield if provided
    if (dic) {
      metafields.push({
        namespace: "custom",
        key: "dic",
        value: String(dic),
        type: "single_line_text_field"
      });
    }

    // Prepare customer note with business info
    const noteLines: string[] = [];
    if (ico) noteLines.push(`IČO: ${ico}`);
    if (dic) noteLines.push(`DIČ: ${dic}`);
    if (companyName) noteLines.push(`Firma: ${companyName}`);
    const note = noteLines.join('\n');

    // Create customer using GraphQL Admin API
    const mutation = `
      mutation customerCreate($input: CustomerInput!) {
        customerCreate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
            phone
            note
            emailMarketingConsent {
              marketingState
              marketingOptInLevel
              consentUpdatedAt
            }
            addresses {
              id
              address1
              address2
              city
              zip
              countryCode
              phone
            }
            defaultAddress {
              id
              address1
              city
              zip
              countryCode
            }
            metafields(first: 10) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    // Prepare addresses array if provided
    const addresses = [];
    if (address && address.address1 && address.city && address.zip && address.country) {
      addresses.push({
        address1: address.address1,
        address2: address.address2 || null,
        city: address.city,
        zip: address.zip,
        countryCode: address.country, // Note: countryCode not country
        firstName: firstName,
        lastName: lastName,
        ...(normalizedPhone && { phone: normalizedPhone })
      });
      console.log('📍 Adding address to customer input:', addresses[0]);
    }

    // Prepare customer input
    const customerInput: any = {
      firstName,
      lastName,
      email,
      ...(normalizedPhone && { phone: normalizedPhone }),
      ...(note && { note }),
      ...(metafields.length > 0 && { metafields }),
      ...(addresses.length > 0 && { addresses }),
    };

    // Add email marketing consent if provided
    if (marketingConsent !== undefined) {
      customerInput.emailMarketingConsent = {
        marketingState: marketingConsent ? "SUBSCRIBED" : "NOT_SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
        consentUpdatedAt: new Date().toISOString()
      };
    }

    const variables = {
      input: customerInput
    };

    const response = await admin.graphql(mutation, { variables });
    const result = await response.json();

    // Log the full response for debugging
    console.log('📦 GraphQL Response:', JSON.stringify(result, null, 2));

    // Check for GraphQL errors
    const resultData = result as any;
    if (resultData.errors) {
      console.error('❌ GraphQL errors:', JSON.stringify(resultData.errors, null, 2));
      return json({
        success: false,
        error: "Nastala chyba pri komunikácii so serverom. Prosím skúste to znova.",
        details: resultData.errors
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (result.data?.customerCreate?.userErrors?.length > 0) {
      console.error('❌ User errors:', JSON.stringify(result.data.customerCreate.userErrors, null, 2));

      // Map Shopify userErrors to our field-level errors
      const mappedFieldErrors: FieldError[] = result.data.customerCreate.userErrors.map((error: any) => {
        const field = mapShopifyFieldToFormField(error.field || []);
        const translatedMessage = translateShopifyError(error.message);
        return {
          field,
          message: translatedMessage
        };
      });

      // Separate general errors from field-specific errors
      const fieldSpecificErrors = mappedFieldErrors.filter(e => e.field !== 'general');
      const generalErrors = mappedFieldErrors.filter(e => e.field === 'general');

      return json({
        success: false,
        error: generalErrors.length > 0
          ? generalErrors.map(e => e.message).join('; ')
          : "Nepodarilo sa vytvoriť účet. Prosím skontrolujte zadané údaje.",
        fieldErrors: fieldSpecificErrors.length > 0 ? fieldSpecificErrors : undefined,
        details: result.data.customerCreate.userErrors
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    if (!result.data?.customerCreate?.customer) {
      console.error('❌ No customer returned:', JSON.stringify(result, null, 2));
      return json({
        success: false,
        error: "Customer creation returned null"
      }, {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" }
      });
    }

    const customer = result.data.customerCreate.customer;
    console.log('✅ Customer created successfully:', customer.id);

    // Log created addresses
    if (customer.addresses && customer.addresses.length > 0) {
      console.log('✅ Customer addresses created:', customer.addresses);
      console.log('✅ Default address:', customer.defaultAddress);
    } else {
      console.log('ℹ️ No addresses were created');
    }

    // Send account activation email
    console.log('📧 Sending account activation email...');

    const emailMutation = `
      mutation customerSendAccountInviteEmail($customerId: ID!) {
        customerSendAccountInviteEmail(customerId: $customerId) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const emailVariables = {
      customerId: customer.id
    };

    try {
      const emailResponse = await admin.graphql(emailMutation, { variables: emailVariables });
      const emailResult = await emailResponse.json();

      if (emailResult.data?.customerSendAccountInviteEmail?.userErrors?.length > 0) {
        console.error('⚠️ Email send errors:', emailResult.data.customerSendAccountInviteEmail.userErrors);
      } else {
        console.log('✅ Activation email sent successfully');
      }
    } catch (emailError) {
      console.error('⚠️ Failed to send activation email (non-critical):', emailError);
    }

    return json({
      success: true,
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        note: customer.note,
        emailMarketingConsent: customer.emailMarketingConsent,
        addresses: customer.addresses || [],
        defaultAddress: customer.defaultAddress || null,
        metafields: customer.metafields?.edges?.map((edge: any) => ({
          namespace: edge.node.namespace,
          key: edge.node.key,
          value: edge.node.value
        })) || []
      },
      message: "Customer created successfully. Activation email has been sent."
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });

  } catch (error) {
    console.error('💥 Error creating customer:', error);

    return json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    }, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      }
    });
  }
}
