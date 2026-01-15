self.addEventListener("install", () => {
  console.log("✅ Service Worker installed");
});

self.addEventListener("activate", () => {
  console.log("🚀 Service Worker activated");
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("./index.html")
  );
});
