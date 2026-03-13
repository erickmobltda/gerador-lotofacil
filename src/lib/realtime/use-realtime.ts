import { useEffect } from "react";
import { supabase } from "@/lib/db/client";

export function useRealtime(
  channel: string,
  table: string,
  callback: () => void
) {
  useEffect(() => {
    const sub = supabase
      .channel(channel)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        callback
      )
      .subscribe();
    return () => {
      supabase.removeChannel(sub);
    };
  }, [channel, table, callback]);
}
