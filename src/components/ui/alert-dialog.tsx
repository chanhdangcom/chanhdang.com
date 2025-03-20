"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { AnimatePresence, motion } from "motion/react";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ children, ...props }, ref) => (
  <AlertDialogPrimitive.Portal>
    {/* Overlay để chặn click ra ngoài */}
    <AlertDialogPrimitive.Overlay className="fixed inset-0" />
    <AnimatePresence>
      <motion.div layoutId="audio-bar">
        <AlertDialogPrimitive.Content
          ref={ref}
          className="fixed h-full w-full"
          {...props}
        >
          <AlertDialogPrimitive.Title></AlertDialogPrimitive.Title>
          <div className="mt-2">{children}</div>
        </AlertDialogPrimitive.Content>
      </motion.div>
    </AnimatePresence>
  </AlertDialogPrimitive.Portal>
));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

export { AlertDialog, AlertDialogTrigger, AlertDialogContent };
