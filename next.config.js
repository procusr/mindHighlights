/** @type {import('next').NextConfig} */

module.exports = withPWA({
  dest: "public", // The folder where service worker and other static assets will be placed
  cacheOnFrontEndNav: true, // Enable caching for front-end navigation
  aggressiveFrontEndNavCaching: true, // Aggressive caching for smoother navigation
  reloadOnOnline: true, // Force reload when going back online
  swcMinify: true, // Enable SWC minification for better performance
  workboxOptions: {
    disableDevLogs: true, // Optional: Reduce Workbox logging for cleaner production builds
  },
});
