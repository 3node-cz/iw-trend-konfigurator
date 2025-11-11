import { useState, useCallback } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher, useRouteError, isRouteErrorResponse } from "@remix-run/react";
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
  try {
    const { admin, session } = await authenticate.admin(request);

    // Try to get all configuration from shop metafields
    try {
      const response = await admin.graphql(`
        query {
          shop {
            metafields(first: 20, namespace: "configurator") {
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

      const getMetafieldValue = (key: string, defaultValue: any) => {
        const metafield = metafields.find((edge: any) => edge.node.key === key);
        if (!metafield) return defaultValue;
        try {
          // Try to parse as JSON first
          return JSON.parse(metafield.node.value);
        } catch {
          // If not JSON, return as string
          return metafield.node.value;
        }
      };

      return json({
        currentColor: getMetafieldValue("primary_color", "#22C55E"),
        transferLocations: getMetafieldValue("transfer_locations", [
          "ZIL - IW TREND, s.r.o., K cintorínu, Žilina",
          "DCD - IW TREND, s.r.o., Lieskavská cesta 20, Žilina",
          "PAR - IW TREND, s.r.o., Nitrianska cesta 50360, CEBO HOLDING, Partizánske",
          "CEN - IW TREND, s.r.o., Pri majerí 6, Bratislava"
        ]),
        deliveryMethods: getMetafieldValue("delivery_methods", [
          "Osobný odber",
          "Doprava IW Trend"
        ]),
        processingTypes: getMetafieldValue("processing_types", [
          "Formátovať",
          "Zlikvidovať",
          "Uskladniť",
          "Priebaliť k dielcom",
          "Odber s objednávkou"
        ]),
        cuttingConfig: getMetafieldValue("cutting_config", {
          sawWidth: 2,
          edgeBuffer: 30,
          boardTrim: 15
        }),
        shop: session.shop
      });
    } catch (error) {
      return json({
        currentColor: "#22C55E",
        transferLocations: [
          "ZIL - IW TREND, s.r.o., K cintorínu, Žilina",
          "DCD - IW TREND, s.r.o., Lieskavská cesta 20, Žilina",
          "PAR - IW TREND, s.r.o., Nitrianska cesta 50360, CEBO HOLDING, Partizánske",
          "CEN - IW TREND, s.r.o., Pri majerí 6, Bratislava"
        ],
        deliveryMethods: ["Osobný odber", "Doprava IW Trend"],
        processingTypes: [
          "Formátovať",
          "Zlikvidovať",
          "Uskladniť",
          "Priebaliť k dielcom",
          "Odber s objednávkou"
        ],
        cuttingConfig: {
          sawWidth: 2,
          edgeBuffer: 30,
          boardTrim: 15
        },
        shop: session.shop
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Response(
      JSON.stringify({
        message: error instanceof Error ? error.message : "Authentication failed. Please check your environment variables.",
        details: "Make sure SHOPIFY_API_KEY, SHOPIFY_API_SECRET, and SHOPIFY_APP_SESSION_SECRET are set correctly."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { admin, session } = await authenticate.admin(request);
    const formData = await request.formData();
    const actionType = formData.get("actionType") as string;

    // Get shop ID first
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

    // Handle different action types
    if (actionType === "color") {
      const primaryColor = formData.get("primaryColor") as string;

      if (!primaryColor || !primaryColor.match(/^#[0-9a-fA-F]{6}$/)) {
        return json({ success: false, error: "Invalid color format" }, { status: 400 });
      }

      const response = await admin.graphql(`
        mutation metafieldSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { id namespace key value }
            userErrors { field message }
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
        return json({ success: false, error: data.data.metafieldsSet.userErrors[0].message }, { status: 400 });
      }

      return json({ success: true, type: "color" });
    }

    if (actionType === "cutting_config") {
      const sawWidth = parseFloat(formData.get("sawWidth") as string);
      const edgeBuffer = parseFloat(formData.get("edgeBuffer") as string);
      const boardTrim = parseFloat(formData.get("boardTrim") as string);

      if (sawWidth < 1 || sawWidth > 5) {
        return json({ success: false, error: "Saw width must be between 1-5mm" }, { status: 400 });
      }
      if (edgeBuffer < 0 || edgeBuffer > 50) {
        return json({ success: false, error: "Edge buffer must be between 0-50mm" }, { status: 400 });
      }
      if (boardTrim < 0 || boardTrim > 30) {
        return json({ success: false, error: "Board trim must be between 0-30mm" }, { status: 400 });
      }

      const config = { sawWidth, edgeBuffer, boardTrim };

      const response = await admin.graphql(`
        mutation metafieldSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { id namespace key value }
            userErrors { field message }
          }
        }
      `, {
        variables: {
          metafields: [{
            ownerId: shopId,
            namespace: "configurator",
            key: "cutting_config",
            value: JSON.stringify(config),
            type: "json"
          }]
        }
      });

      const data = await response.json();
      if (data.data?.metafieldsSet?.userErrors?.length > 0) {
        return json({ success: false, error: data.data.metafieldsSet.userErrors[0].message }, { status: 400 });
      }

      return json({ success: true, type: "cutting_config" });
    }

    if (actionType === "order_form_options") {
      const transferLocations = JSON.parse(formData.get("transferLocations") as string);
      const deliveryMethods = JSON.parse(formData.get("deliveryMethods") as string);
      const processingTypes = JSON.parse(formData.get("processingTypes") as string);

      const metafields = [
        {
          ownerId: shopId,
          namespace: "configurator",
          key: "transfer_locations",
          value: JSON.stringify(transferLocations),
          type: "json"
        },
        {
          ownerId: shopId,
          namespace: "configurator",
          key: "delivery_methods",
          value: JSON.stringify(deliveryMethods),
          type: "json"
        },
        {
          ownerId: shopId,
          namespace: "configurator",
          key: "processing_types",
          value: JSON.stringify(processingTypes),
          type: "json"
        }
      ];

      const response = await admin.graphql(`
        mutation metafieldSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { id namespace key value }
            userErrors { field message }
          }
        }
      `, {
        variables: { metafields }
      });

      const data = await response.json();
      if (data.data?.metafieldsSet?.userErrors?.length > 0) {
        return json({ success: false, error: data.data.metafieldsSet.userErrors[0].message }, { status: 400 });
      }

      return json({ success: true, type: "order_form_options" });
    }

    return json({ success: false, error: "Unknown action type" }, { status: 400 });
  } catch (error) {
    return json({
      success: false,
      error: error instanceof Error ? error.message : "Failed to save configuration"
    }, { status: 500 });
  }
};

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "An unexpected error occurred";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    try {
      const errorData = JSON.parse(error.data);
      errorMessage = errorData.message || errorMessage;
      errorDetails = errorData.details || "";
    } catch {
      errorMessage = error.data || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <Text as="h2" variant="headingLg">
                Configuration Error
              </Text>
              <Banner status="critical">
                <BlockStack gap="200">
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    {errorMessage}
                  </Text>
                  {errorDetails && (
                    <Text as="p" variant="bodySm">
                      {errorDetails}
                    </Text>
                  )}
                </BlockStack>
              </Banner>
              <Text as="p" variant="bodyMd">
                Please contact your system administrator or check the server logs for more information.
              </Text>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();
  const { currentColor, shop, transferLocations, deliveryMethods, processingTypes, cuttingConfig } = loaderData;
  const fetcher = useFetcher<typeof action>();
  const shopify = useAppBridge();

  // Color state
  const [colorValue, setColorValue] = useState(currentColor);

  // Cutting config state
  const [sawWidth, setSawWidth] = useState(cuttingConfig.sawWidth);
  const [edgeBuffer, setEdgeBuffer] = useState(cuttingConfig.edgeBuffer);
  const [boardTrim, setBoardTrim] = useState(cuttingConfig.boardTrim);

  // Order form options state
  const [locations, setLocations] = useState<string[]>(transferLocations);
  const [methods, setMethods] = useState<string[]>(deliveryMethods);
  const [types, setTypes] = useState<string[]>(processingTypes);

  const handleColorChange = useCallback((value: string) => {
    setColorValue(value);
  }, []);

  const handleColorSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("actionType", "color");
    formData.append("primaryColor", colorValue);
    fetcher.submit(formData, { method: "POST", action: "/app?index" });
  }, [fetcher, colorValue]);

  const handleCuttingConfigSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("actionType", "cutting_config");
    formData.append("sawWidth", sawWidth.toString());
    formData.append("edgeBuffer", edgeBuffer.toString());
    formData.append("boardTrim", boardTrim.toString());
    fetcher.submit(formData, { method: "POST", action: "/app?index" });
  }, [fetcher, sawWidth, edgeBuffer, boardTrim]);

  const handleOrderFormSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("actionType", "order_form_options");
    formData.append("transferLocations", JSON.stringify(locations));
    formData.append("deliveryMethods", JSON.stringify(methods));
    formData.append("processingTypes", JSON.stringify(types));
    fetcher.submit(formData, { method: "POST", action: "/app?index" });
  }, [fetcher, locations, methods, types]);

  const isLoading = fetcher.state === "submitting";
  const showSuccess = fetcher.data?.success;
  const showError = fetcher.data?.error;

  // Show toast on success
  if (showSuccess && fetcher.state === "idle") {
    const type = (fetcher.data as any).type;
    if (type === "color") {
      shopify.toast.show("Widget color updated successfully!");
    } else if (type === "cutting_config") {
      shopify.toast.show("Cutting configuration saved successfully!");
    } else if (type === "order_form_options") {
      shopify.toast.show("Order form options saved successfully!");
    }
  }

  return (
    <Page>
      <TitleBar title="IW Trend Konfigurator Settings" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Widget Color Settings */}
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Widget Color Settings
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Customize the primary color for your configurator widget.
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
                      onClick={handleColorSubmit}
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

            {/* Cutting Configuration */}
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Cutting Configuration
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Configure cutting parameters for material processing.
                  </Text>
                </BlockStack>

                <BlockStack gap="400">
                  <TextField
                    label="Saw Blade Width (mm)"
                    type="number"
                    value={sawWidth.toString()}
                    onChange={(value) => setSawWidth(parseFloat(value) || 2)}
                    helpText="Spacing between pieces during cutting (1-5mm)"
                    autoComplete="off"
                    min={1}
                    max={5}
                    step={0.1}
                  />

                  <TextField
                    label="Edge Buffer per side (mm)"
                    type="number"
                    value={edgeBuffer.toString()}
                    onChange={(value) => setEdgeBuffer(parseFloat(value) || 30)}
                    helpText="Extra length added to edge material on each side (0-50mm). Example: 500mm edge → 560mm needed (500 + 30 + 30)"
                    autoComplete="off"
                    min={0}
                    max={50}
                    step={1}
                  />

                  <TextField
                    label="Board Trim per side (mm)"
                    type="number"
                    value={boardTrim.toString()}
                    onChange={(value) => setBoardTrim(parseFloat(value) || 15)}
                    helpText="Trim from each side of the board before cutting (0-30mm)"
                    autoComplete="off"
                    min={0}
                    max={30}
                    step={1}
                  />

                  <InlineStack gap="200">
                    <Button
                      variant="primary"
                      onClick={handleCuttingConfigSubmit}
                      loading={isLoading}
                    >
                      Save Cutting Configuration
                    </Button>
                    <Button
                      onClick={() => {
                        setSawWidth(cuttingConfig.sawWidth);
                        setEdgeBuffer(cuttingConfig.edgeBuffer);
                        setBoardTrim(cuttingConfig.boardTrim);
                      }}
                      disabled={isLoading}
                    >
                      Reset
                    </Button>
                  </InlineStack>
                </BlockStack>
              </BlockStack>
            </Card>

            {/* Order Form Options - Will implement in next update */}
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  Order Form Options (Coming Soon)
                </Text>
                <Text as="p" variant="bodyMd">
                  Configuration for transfer locations, delivery methods, and processing types will be added here.
                </Text>
              </BlockStack>
            </Card>

            {/* Theme Extension Info */}
            <Card>
              <BlockStack gap="200">
                <Text as="h3" variant="headingMd">
                  Theme Extension
                </Text>
                <Text as="p" variant="bodyMd">
                  Add the "Universal Konfigurator" block to any page in your theme. All settings above will be applied automatically.
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
