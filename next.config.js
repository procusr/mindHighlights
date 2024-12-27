/** @type {import('next').NextConfig} */

const { default: withPWAInit } = require("@ducanh2912/next-pwa");

module.exports = withPWAInit({
  dest: "public", // The folder where service worker and other static assets will be placed
  cacheOnFrontEndNav: true, // Enable caching for front-end navigation
  aggressiveFrontEndNavCaching: true, // Aggressive caching for smoother navigation
  reloadOnOnline: true, // Force reload when going back online
  swcMinify: true, // Enable SWC minification for better performance
  workboxOptions: {
    disableDevLogs: true, // Optional: Reduce Workbox logging for cleaner production builds
  },
});
