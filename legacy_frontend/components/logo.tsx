"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
  width?: number;
  height?: number;
  alt?: string;
}

export function Logo({
  width = 150,
  height = 40,
  alt = "ReferralNetworkHub Logo",
}: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  // Select logo based on theme
  const logoSrc =
    resolvedTheme === "dark" ? "/logo-light.svg" : "/logo-dark.svg";

  return (
    <Image
      src={logoSrc}
      alt={alt}
      width={width}
      height={height}
      className="object-contain"
    />
  );
}
