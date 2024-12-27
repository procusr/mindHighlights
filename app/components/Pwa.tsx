"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const iOS =
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const standaloneIOS = (navigator as any).standalone === true;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || standaloneIOS;

    setIsIOS(iOS);
    setIsStandalone(standalone);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <Button>Add to Home Screen</Button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon" />
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}
