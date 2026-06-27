import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifetransformers.app',
  appName: 'Life Transformers',
  webDir: 'public',
  server: {
    androidScheme: 'https'
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
