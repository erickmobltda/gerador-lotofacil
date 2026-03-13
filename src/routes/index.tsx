import { createFileRoute, Link } from "@tanstack/react-router";
import { Shuffle, Trophy, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-purple-700 dark:text-purple-400 mb-4">
            Gerador Lotofácil
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Maximize suas chances na Lotofácil com desdobramentos e fechamentos inteligentes
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Começar agora <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 border border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950 text-purple-700 dark:text-purple-300 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Criar conta grátis
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Shuffle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold">Desdobramentos</h2>
            </div>
            <p className="text-muted-foreground">
              Jogue com mais de 15 números e gere todos os bilhetes possíveis. Por exemplo, 17
              números geram 136 jogos de 15, cobrindo todas as combinações.
            </p>
          </div>

          <div className="bg-white dark:bg-card rounded-xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <Trophy className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-xl font-semibold">Fechamentos</h2>
            </div>
            <p className="text-muted-foreground">
              Reduza o número de bilhetes usando fechamentos matemáticos que garantem um prêmio
              mínimo (12, 13 ou 14 pontos) com muito menos jogos.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-card rounded-xl p-8 shadow-sm border text-center">
          <h2 className="text-2xl font-bold mb-4">Como funciona?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">1</div>
              <h3 className="font-semibold mb-1">Escolha seus números</h3>
              <p className="text-sm text-muted-foreground">
                Selecione de 15 a 25 números na grade interativa
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
              <h3 className="font-semibold mb-1">Configure a estratégia</h3>
              <p className="text-sm text-muted-foreground">
                Escolha desdobramento completo ou fechamento reduzido
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <h3 className="font-semibold mb-1">Gere e baixe</h3>
              <p className="text-sm text-muted-foreground">
                Gere seus bilhetes otimizados e baixe em formato TXT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
