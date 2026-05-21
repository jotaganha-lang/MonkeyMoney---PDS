"use client";

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://kjhcbzpsikeltmiwpire.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaGNienBzaWtlbHRtaXdwaXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNDIyODMsImV4cCI6MjA5MzgxODI4M30.M7l1hrRLzFkV5nzsEvLbSGaseoqJ4Zs7BSZ152hRZF4";

  return createBrowserClient(url, key);
}
