```diff
--- /dev/null
+++ b/src/components/DonationCard.tsx
@@ -0,0 +1,34 @@
+import React from 'react';
+import { Card } from './Card';
+import { Button } from './Button';
+
+export function DonationCard() {
+  const handleDonateClick = () => {
+    window.open('https://example.com/donate', '_blank'); // Placeholder URL
+  };
+
+  return (
+    <Card className="overflow-hidden p-0">
+      {/* Top gradient section */}
+      <div className="h-24 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
+        {/* You can add an icon or simple graphic here if desired */}
+      </div>
+
+      <div className="p-4">
+        <h3 className="text-lg font-semibold text-gray-900 mb-2">Dukung Reviotax</h3>
+        <p className="text-sm text-gray-600 mb-4">
+          Reviotax dibuat gratis untuk freelancer & creator Indonesia. Donasi kamu akan membantu biaya domain & pengembangan fitur baru 🙌
+        </p>
+        <Button 
+          onClick={handleDonateClick} 
+          className="w-full"
+          size="sm"
+        >
+          Donasi Sekarang
+        </Button>
+      </div>
+    </Card>
+  );
+}
+
+```