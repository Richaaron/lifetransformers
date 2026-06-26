import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lifetransformers.app',
  appName: 'Life Transformers',
  webDir: 'out', // Or use 'public' if you prefer, but we'll use server.url below
  server: {
    androidScheme: 'https',
    url: 'https://lifetransformers.netlify.app' // Replace with your actual deployed URL!
  }
};

export default config;
