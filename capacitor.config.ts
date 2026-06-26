import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifetransformers.app',
  appName: 'Life Transformers',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    url: 'https://lifetransformers.netlify.app',
    cleartext: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
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
    captureInput: true,
    hardwareBackButton: true
  }
};

export default config;
