import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/db/client";
import type { User, Session } from "@supabase/supabase-js";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export function useIsAdmin() {
  const { user } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.role === "admin" || data?.role === "owner");
      })
      .catch(() => setIsAdmin(false));
  }, [user]);

  return isAdmin;
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);
    const { error: e } = await supabase.auth.signInWithPassword({ email, password });
    if (e) setError(e.message);
    setLoading(false);
    return !e;
  }

  return { login, loading, error };
}

export function useLogout() {
  const navigate = useNavigate();
  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }
  return { logout };
}

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(email: string, password: string, name: string) {
    setLoading(true);
    setError(null);
    const { error: e } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (e) setError(e.message);
    setLoading(false);
    return !e;
  }

  return { register, loading, error };
}

export function useAuthHelpers() {
  async function sendPasswordReset(email: string) {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  }

  async function updatePassword(password: string) {
    return supabase.auth.updateUser({ password });
  }

  return { sendPasswordReset, updatePassword };
}
