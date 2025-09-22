import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { session } = await authenticate.public.appProxy(request);

    return json({
      message: "App Proxy is working!",
      shop: session?.shop,
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method
    });
  } catch (error) {
    return json(
      {
        error: "App proxy verification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        url: request.url,
        method: request.method
      },
      { status: 500 }
    );
  }
};

export const action = loader;