import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  const commands = [
    {
      label: "Gerador",
      action: () => {
        navigate({ to: "/dashboard" });
        setOpen(false);
      },
    },
    {
      label: "Salvas",
      action: () => {
        navigate({ to: "/dashboard/saved" });
        setOpen(false);
      },
    },
    {
      label: "Configurações",
      action: () => {
        navigate({ to: "/dashboard/settings" });
        setOpen(false);
      },
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-white dark:bg-card rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b">
          <input
            autoFocus
            className="w-full bg-transparent outline-none text-sm"
            placeholder="Pesquisar..."
          />
        </div>
        <div className="p-2">
          {commands.map((cmd) => (
            <button
              key={cmd.label}
              onClick={cmd.action}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-sm transition-colors"
            >
              {cmd.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
