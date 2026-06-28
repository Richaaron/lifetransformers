import type { CapacitorConfig } from '@capacitor/cli';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: `.env.${process.env.NODE_ENV}` });
loadEnv();

const serverUrl = process.env.CAPACITOR_SERVER_URL || process.env.NEXT_PUBLIC_APP_URL;

const config: CapacitorConfig = {
  appId: 'com.lifetransformers.app',
  appName: 'Life Transformers',
  webDir: 'public',
  server: {
    androidScheme: 'https',
    ...(serverUrl ? { url: serverUrl } : {})
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#020617',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#ffffff'
    }
  },
  android: {
    allowMixedContent: false,
    captureInput: true
  }
};

export default config;
