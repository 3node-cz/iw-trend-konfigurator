import { useState, useCallback } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  BlockStack,
  InlineStack,
  Button,
  TextField,
  Banner,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);

  // Try to get existing color preference from shop metafields
  try {
    const response = await admin.graphql(`
      query {
        shop {
          metafields(first: 10, namespace: "configurator") {
            edges {
              node {
                id
                key
                value
              }
            }
          }
        }
      }
    `);

    const data = await response.json();
    const metafields = data.data?.shop?.metafields?.edges || [];
    const colorMetafield = metafields.find((edge: any) => edge.node.key === "primary_color");

    return json({
      currentColor: colorMetafield?.node?.value || "#007cba",
      shop: session.shop
    });
  } catch (error) {
    return json({
      currentColor: "#007cba",
      shop: session.shop
    });
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const primaryColor = formData.get("primaryColor") as string;

  if (!primaryColor || !primaryColor.match(/^#[0-9a-fA-F]{6}$/)) {
    return json({ success: false, error: "Invalid color format" }, { status: 400 });
  }

  try {
    // First get the shop ID
    const shopResponse = await admin.graphql(`
      query {
        shop {
          id
        }
      }
    `);

    const shopData = await shopResponse.json();
    const shopId = shopData.data?.shop?.id;

    if (!shopId) {
      return json({ success: false, error: "Could not get shop ID" }, { status: 500 });
    }

    // Save color to shop metafield using metafieldSet
    const response = await admin.graphql(`
      mutation metafieldSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      variables: {
        metafields: [{
          ownerId: shopId,
          namespace: "configurator",
          key: "primary_color",
          value: primaryColor,
          type: "single_line_text_field"
        }]
      }
    });

    const data = await response.json();

    if (data.data?.metafieldsSet?.userErrors?.length > 0) {
      return json({
        success: false,
        error: data.data.metafieldsSet.userErrors[0].message
      }, { status: 400 });
    }

    return json({ success: true, color: primaryColor });
  } catch (error) {
    return json({
      success: false,
      error: "Failed to save color preference"
    }, { status: 500 });
  }
};

export default function Index() {
  const { currentColor, shop } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();
  const [colorValue, setColorValue] = useState(currentColor);

  const handleColorChange = useCallback((value: string) => {
    setColorValue(value);
  }, []);

  const handleSubmit = useCallback(() => {
    fetcher.submit(
      { primaryColor: colorValue },
      { method: "POST", action: "/app?index" }
    );
  }, [fetcher, colorValue]);

  const isLoading = fetcher.state === "submitting";
  const showSuccess = fetcher.data?.success;
  const showError = fetcher.data?.error;

  // Show toast on success
  if (showSuccess && fetcher.state === "idle") {
    shopify.toast.show("Widget color updated successfully!");
  }

  return (
    <Page>
      <TitleBar title="IW Trend Konfigurator Settings" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Widget Color Settings
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Customize the primary color for your configurator widget. This color will be used for buttons, links, and accents in the theme extension.
                  </Text>
                </BlockStack>

                {showError && (
                  <Banner status="critical">
                    {showError}
                  </Banner>
                )}

                <BlockStack gap="400">
                  <InlineStack gap="400" align="start">
                    <div style={{ flex: 1 }}>
                      <TextField
                        label="Primary Color"
                        type="color"
                        value={colorValue}
                        onChange={handleColorChange}
                        helpText="Choose a color that matches your brand"
                        autoComplete="off"
                      />
                    </div>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: colorValue,
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      marginTop: "24px"
                    }} />
                  </InlineStack>

                  <InlineStack gap="200">
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      loading={isLoading}
                      disabled={colorValue === currentColor}
                    >
                      Save Color
                    </Button>
                    <Button
                      onClick={() => setColorValue(currentColor)}
                      disabled={colorValue === currentColor || isLoading}
                    >
                      Reset
                    </Button>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>

            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  Theme Extension
                </Text>
                <Text as="p" variant="bodyMd">
                  Add the "Universal Konfigurator" block to any page in your theme to allow customers to view and edit their saved configurations. The widget will automatically use your selected primary color.
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Current shop: {shop}
                </Text>
              </BlockStack>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
