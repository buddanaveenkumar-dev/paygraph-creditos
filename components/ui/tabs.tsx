"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
const Tabs = TabsPrimitive.Root;
function TabsList({ className, variant = "default", ...props }: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: "default" | "line" }) { return <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={cn("inline-flex items-center", className)} {...props} />; }
function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) { return <TabsPrimitive.Trigger data-slot="tabs-trigger" className={cn("relative inline-flex items-center justify-center whitespace-nowrap transition-colors data-[state=active]:text-foreground data-[state=active]:after:opacity-100 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-current after:opacity-0", className)} {...props} />; }
function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) { return <TabsPrimitive.Content data-slot="tabs-content" className={cn("outline-none", className)} {...props} />; }
export { Tabs, TabsList, TabsTrigger, TabsContent };
