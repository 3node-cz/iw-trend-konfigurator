import React, { createContext, useContext } from "react";
import type { EmotionCache } from "@emotion/cache";

interface PortalContextValue {
  portalContainer: HTMLElement | null;
  portalEmotionCache: EmotionCache | null;
}

const PortalContext = createContext<PortalContextValue>({
  portalContainer: null,
  portalEmotionCache: null,
});

export const usePortalContainer = () => {
  const context = useContext(PortalContext);
  return context.portalContainer;
};

export const usePortalEmotionCache = () => {
  const context = useContext(PortalContext);
  return context.portalEmotionCache;
};

export const PortalProvider: React.FC<{
  portalContainer: HTMLElement;
  portalEmotionCache: EmotionCache;
  children: React.ReactNode;
}> = ({ portalContainer, portalEmotionCache, children }) => {
  return (
    <PortalContext.Provider value={{ portalContainer, portalEmotionCache }}>
      {children}
    </PortalContext.Provider>
  );
};
