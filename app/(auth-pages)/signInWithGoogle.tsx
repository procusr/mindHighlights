"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function GoogleSignInButton() {
  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Button
      className="mt-2"
      onClick={handleSignIn}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "0 16px",
        height: "40px",
        background: "white",
        border: "1px solid #dadce0",
        borderRadius: "4px",
        fontSize: "14px",
        fontFamily: "Roboto, arial, sans-serif",
        fontWeight: "500",
        color: "#3c4043",
        cursor: "pointer",
        transition: "background 0.2s",
      }}
      // onMouseOver={(e) => (e.currentTarget.style.background = "#f6f9fe")}
      // onMouseOut={(e) => (e.currentTarget.style.background = "white")}
    >
      <Image src="/google.svg" alt="Google Logo" width={18} height={18} />
      Sign in with Google
    </Button>
  );
}
