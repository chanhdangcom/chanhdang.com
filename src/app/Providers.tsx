import React from "react";
import { ThemeProvider } from "next-themes";

type IProps = {
  children: React.ReactNode;
};

export const Providers = ({ children }: IProps) => {
  return (
    <ThemeProvider
      defaultTheme="system"
      attribute="class"
      enableSystem
      enableColorScheme={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
