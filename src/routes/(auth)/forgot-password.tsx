import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthHelpers } from "@/hooks/auth-hooks";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuthHelpers();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await sendPasswordReset(email);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Email de redefinição enviado! Verifique sua caixa de entrada.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 p-4">
      <div className="w-full max-w-md bg-white dark:bg-card rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Recuperar senha</h1>
        <p className="text-center text-muted-foreground mb-6">
          Digite seu email para receber as instruções
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-background"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar email de recuperação"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-purple-600 hover:underline">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
