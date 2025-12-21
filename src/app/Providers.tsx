"use client";

import React from "react";
import { ThemeProvider } from "next-themes";
import { AppProgressProvider as ProgressProvider } from "@bprogress/next";
import { MusicProvider } from "@/components/music-provider";
import { SessionProvider } from "next-auth/react";

type IProps = {
  children: React.ReactNode;
};

export const Providers = ({ children }: IProps) => {
  return (
    <SessionProvider>
      <ThemeProvider
        defaultTheme="system"
        attribute="class"
        enableSystem
        enableColorScheme={false}
        disableTransitionOnChange
      >
        <ProgressProvider
          height="4px"
          color="#db2777"
          options={{ showSpinner: false }}
          delay={500}
          shallowRouting
        >
          <MusicProvider>{children}</MusicProvider>
        </ProgressProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};
