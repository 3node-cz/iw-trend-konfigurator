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
          boardTrim: 15,
          minPieceSize: 10
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
          boardTrim: 15,
          minPieceSize: 10
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
      const minPieceSize = parseFloat(formData.get("minPieceSize") as string);

      if (sawWidth < 1 || sawWidth > 5) {
        return json({ success: false, error: "Šírka píly musí byť medzi 1-5mm" }, { status: 400 });
      }
      if (edgeBuffer < 0 || edgeBuffer > 50) {
        return json({ success: false, error: "Nárazník hrany musí byť medzi 0-50mm" }, { status: 400 });
      }
      if (boardTrim < 0 || boardTrim > 30) {
        return json({ success: false, error: "Orez dosky musí byť medzi 0-30mm" }, { status: 400 });
      }
      if (minPieceSize < 1 || minPieceSize > 100) {
        return json({ success: false, error: "Minimálna veľkosť dielca musí byť medzi 1-100mm" }, { status: 400 });
      }

      const config = { sawWidth, edgeBuffer, boardTrim, minPieceSize };

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
  const [minPieceSize, setMinPieceSize] = useState(cuttingConfig.minPieceSize);

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
    formData.append("minPieceSize", minPieceSize.toString());
    fetcher.submit(formData, { method: "POST", action: "/app?index" });
  }, [fetcher, sawWidth, edgeBuffer, boardTrim, minPieceSize]);

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
      shopify.toast.show("Farba widgetu bola úspešne aktualizovaná!");
    } else if (type === "cutting_config") {
      shopify.toast.show("Konfigurácia rezania bola úspešne uložená!");
    } else if (type === "order_form_options") {
      shopify.toast.show("Možnosti formulára objednávky boli úspešne uložené!");
    }
  }

  return (
    <Page>
      <TitleBar title="IW Trend Konfigurátor - Nastavenia" />
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {/* Widget Color Settings */}
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Nastavenia Farby Widgetu
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Prispôsobte primárnu farbu pre váš konfiguračný widget.
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
                        label="Primárna Farba"
                        type="color"
                        value={colorValue}
                        onChange={handleColorChange}
                        helpText="Vyberte farbu, ktorá zodpovedá vašej značke"
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
                      Uložiť Farbu
                    </Button>
                    <Button
                      onClick={() => setColorValue(currentColor)}
                      disabled={colorValue === currentColor || isLoading}
                    >
                      Resetovať
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
                    Konfigurácia Rezania
                  </Text>
                  <Text variant="bodyMd" as="p">
                    Nastavte parametre rezania pre spracovanie materiálov.
                  </Text>
                </BlockStack>

                <BlockStack gap="400">
                  <TextField
                    label="Šírka píly (mm)"
                    type="number"
                    value={sawWidth.toString()}
                    onChange={(value) => setSawWidth(parseFloat(value) || 2)}
                    helpText="Rozostup medzi kusmi počas rezania (1-5mm)"
                    autoComplete="off"
                    min={1}
                    max={5}
                    step={0.1}
                  />

                  <TextField
                    label="Nárazník hrany na stranu (mm)"
                    type="number"
                    value={edgeBuffer.toString()}
                    onChange={(value) => setEdgeBuffer(parseFloat(value) || 30)}
                    helpText="Extra dĺžka pridaná k materiálu hrany na každú stranu (0-50mm). Príklad: 500mm hrana → 560mm potrebné (500 + 30 + 30)"
                    autoComplete="off"
                    min={0}
                    max={50}
                    step={1}
                  />

                  <TextField
                    label="Orez dosky na stranu (mm)"
                    type="number"
                    value={boardTrim.toString()}
                    onChange={(value) => setBoardTrim(parseFloat(value) || 15)}
                    helpText="Orez z každej strany dosky pred rezaním (0-30mm)"
                    autoComplete="off"
                    min={0}
                    max={30}
                    step={1}
                  />

                  <TextField
                    label="Minimálna veľkosť strany dielca (mm)"
                    type="number"
                    value={minPieceSize.toString()}
                    onChange={(value) => setMinPieceSize(parseFloat(value) || 10)}
                    helpText="Minimálna prípustná dĺžka alebo šírka dielca (1-100mm)"
                    autoComplete="off"
                    min={1}
                    max={100}
                    step={1}
                  />

                  <InlineStack gap="200">
                    <Button
                      variant="primary"
                      onClick={handleCuttingConfigSubmit}
                      loading={isLoading}
                    >
                      Uložiť Konfiguráciu Rezania
                    </Button>
                    <Button
                      onClick={() => {
                        setSawWidth(cuttingConfig.sawWidth);
                        setEdgeBuffer(cuttingConfig.edgeBuffer);
                        setBoardTrim(cuttingConfig.boardTrim);
                        setMinPieceSize(cuttingConfig.minPieceSize);
                      }}
                      disabled={isLoading}
                    >
                      Resetovať
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
