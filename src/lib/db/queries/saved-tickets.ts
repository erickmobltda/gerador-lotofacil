// Stub - will be fully implemented in next task
import { supabase } from "@/lib/db/client";

export interface SavedTicketInput {
  name: string;
  numbers_selected: number[];
  fixed_numbers: number[];
  strategy: "full" | "fechamento";
  guarantee: number | null;
  tickets: number[][];
  ticket_count: number;
}

export async function createSavedTicket(userId: string, data: SavedTicketInput): Promise<void> {
  const { error } = await supabase.from("saved_tickets").insert({
    user_id: userId,
    ...data,
  });
  if (error) throw new Error(error.message);
}

export async function listSavedTickets(userId: string) {
  const { data, error } = await supabase
    .from("saved_tickets")
    .select("id, name, ticket_count, strategy, guarantee, numbers_selected, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSavedTicket(id: string) {
  const { data, error } = await supabase
    .from("saved_tickets")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSavedTicket(id: string): Promise<void> {
  const { error } = await supabase.from("saved_tickets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
