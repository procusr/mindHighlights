"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    };

    // Check if device is iOS
    const checkIOS = () => {
      return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        !(window as any).MSStream
      );
    };

    // Check if device is Android
    const checkAndroid = () => {
      return /Android/i.test(navigator.userAgent);
    };

    setIsMobile(checkMobile());
    setIsIOS(checkIOS());
    setIsAndroid(checkAndroid());
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Handle installation prompt for Android devices
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
  };

  // Don't show if already installed or not on mobile
  if (isStandalone || !isMobile) {
    return null;
  }

  return (
    <div>
      <h3>Install App</h3>
      {isAndroid && deferredPrompt && (
        <Button onClick={handleInstallClick}>Add to Home Screen</Button>
      )}
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
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

export default InstallPrompt;
