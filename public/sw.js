// Minimal service worker stub — prevents 404 errors in the browser console.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
