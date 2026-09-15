import "../globals.css";
import "../contrast-fix.css";
import type { ReactNode } from "react";
import { AdSenseScript } from "@/src/components/adsense-script";

export default function RootLandingLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AdSenseScript />
      </body>
    </html>
  );
}
