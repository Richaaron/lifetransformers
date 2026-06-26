"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

export const useNativeApp = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const initNativeFeatures = async () => {
      try {
        // Status Bar customization
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: "#ffffff" });

        // Back button handling
        App.addListener("backButton", ({ canGoBack }) => {
          if (!canGoBack) {
            App.minimizeApp();
          } else {
            window.history.back();
          }
        });

        // App state listeners
        App.addListener("appStateChange", ({ isActive }) => {
          console.log("App state changed:", isActive);
        });

        // App URL open listener
        App.addListener("appUrlOpen", (data) => {
          console.log("App opened with URL:", data.url);
        });
      } catch (error) {
        console.error("Error initializing native features:", error);
      }
    };

    initNativeFeatures();

    return () => {
      // Clean up listeners if needed
      App.removeAllListeners();
    };
  }, []);

  // Haptic feedback helpers
  const vibrateLight = async () => {
    if (!Capacitor.isNativePlatform()) return;
    await Haptics.impact({ style: ImpactStyle.Light });
  };

  const vibrateMedium = async () => {
    if (!Capacitor.isNativePlatform()) return;
    await Haptics.impact({ style: ImpactStyle.Medium });
  };

  const vibrateHeavy = async () => {
    if (!Capacitor.isNativePlatform()) return;
    await Haptics.impact({ style: ImpactStyle.Heavy });
  };

  return {
    vibrateLight,
    vibrateMedium,
    vibrateHeavy,
  };
};
