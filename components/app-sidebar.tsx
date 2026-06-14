"use client"

import { useState, useEffect } from "react"
import {
  LayoutDashboard,
  FileText,
  SquarePen,
  Hash,
  ShieldCheck,
  Clock,
  Star,
  Search,
  X,
  Menu,
  type LucideIcon,
} from "lucide-react"
import { MetalFx } from "metal-fx"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  icon: LucideIcon
  /** Mostrar na barra de navegação inferior (mobile) */
  mobile?: boolean
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, mobile: true },
  { label: "Minhas redações", icon: FileText, mobile: true },
  { label: "Criar redação", icon: SquarePen, mobile: true },
  { label: "Temas", icon: Hash, mobile: true },
  { label: "Corretor de redação", icon: ShieldCheck },
  { label: "Detector de IA", icon: AiIcon },
  { label: "Histórico", icon: Clock },
  { label: "Favoritos", icon: Star, mobile: true },
]

// Ícone custom "AI" em caixa para o Detector de IA
function AiIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-[5px] border-[1.5px] border-current text-[10px] font-bold leading-none tracking-tight",
        className,
      )}
      aria-hidden="true"
    >
      Ai
    </span>
  )
}

const WORDS_USED = 12450

// Decoração de órbita com "Aa" (lado direito do card)
function OrbitDecoration() {
  return (
    <div className="relative size-24 shrink-0" aria-hidden="true">
      {/* Anel da órbita */}
      <div className="absolute inset-0 rounded-full border border-violet-500/30" />
      {/* Pontos orbitando */}
      <span className="absolute right-1 top-2 size-2 rounded-full bg-violet-400 shadow-[0_0_8px_2px_rgba(167,139,250,0.6)]" />
      <span className="absolute bottom-3 left-1 size-2 rounded-full bg-violet-400 shadow-[0_0_8px_2px_rgba(167,139,250,0.6)]" />
      {/* Caixa central "Aa" */}
      <div className="absolute inset-0 m-auto flex size-12 items-center justify-center rounded-2xl border border-violet-500/40 bg-violet-500/10 text-xl font-bold text-violet-200">
        Aa
      </div>
    </div>
  )
}

// Card de palavras usadas no estilo escuro com acento roxo
function WordsUsedCard() {
  return (
    <MetalFx preset="chromatic" theme="light" variant="button" strength={1} borderRadius={12}>
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-3 text-card-foreground">
        {/* Decoração da órbita (fundo, canto superior direito) */}
        <div className="pointer-events-none absolute -right-6 -top-4 scale-75 opacity-80">
          <OrbitDecoration />
        </div>

        <div className="relative flex flex-col">
        {/* Cabeçalho: ícone + título */}
        <div className="flex items-center gap-2">
          <MetalFx preset="chromatic" theme="light" variant="icon" strength={1}>
            <span className="flex size-8 shrink-0 items-center justify-center text-violet-600">
              <FileText className="size-5" />
            </span>
          </MetalFx>
          <p className="text-sm font-bold leading-tight text-foreground">Palavras usadas</p>
        </div>
        <p className="mt-1.5 max-w-[70%] text-[11px] leading-snug text-muted-foreground">
          Total de palavras utilizadas no seu conteúdo
        </p>

        {/* Número em destaque */}
        <MetalFx preset="chromatic" theme="light" variant="text" strength={1}>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-violet-600">
            {WORDS_USED.toLocaleString("pt-BR")}
          </p>
        </MetalFx>

        {/* Indicador em tempo real */}
        <div className="mt-2 flex items-center gap-2">
          <span className="relative flex size-2 shrink-0">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-violet-500 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-violet-500" />
          </span>
          <span className="text-[11px] text-muted-foreground">Contagem atualizada em tempo real</span>
        </div>
        </div>
      </div>
    </MetalFx>
  )
}

export function AppSidebar() {
  const [active, setActive] = useState("Dashboard")
  const [menuOpen, setMenuOpen] = useState(false)
  // Mantém o overlay montado durante a animação de saída
  const [menuMounted, setMenuMounted] = useState(false)
  // Controla as classes de transição (ativadas no frame seguinte à montagem)
  const [menuVisible, setMenuVisible] = useState(false)

  // Trava o scroll do site enquanto o menu mobile estiver aberto
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  // Controla montagem/desmontagem para animar abertura e fechamento
  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true)
      // Aplica o estado visível após o navegador pintar o estado inicial (duplo rAF)
      let inner = 0
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setMenuVisible(true))
      })
      return () => {
        cancelAnimationFrame(outer)
        cancelAnimationFrame(inner)
      }
    }
    setMenuVisible(false)
    const timeout = setTimeout(() => setMenuMounted(false), 250)
    return () => clearTimeout(timeout)
  }, [menuOpen])

  return (
    <>
      {/* ===== Sidebar (md e acima) ===== */}
      <aside className="hidden h-dvh w-72 flex-col border-r border-border bg-background md:flex">
        {/* Navegação */}
        <nav className="flex flex-1 flex-col gap-1 px-3 pt-10" aria-label="Navegação principal">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = active === label
            return (
              <button
                key={label}
                type="button"
                onClick={() => setActive(label)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Rodapé: uso */}
        <div className="flex flex-col gap-3 p-3">
          <WordsUsedCard />
        </div>
      </aside>

      {/* ===== Navegação mobile (abaixo de md) ===== */}
      {/* Overlay do menu em tela cheia, estilo Vercel */}
      {menuMounted && (
        <div
          className={cn(
            "fixed inset-0 z-40 flex flex-col bg-background transition-opacity duration-200 ease-out md:hidden",
            menuVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <nav
            className="flex-1 overflow-y-auto overscroll-contain p-2 pb-32 pt-4"
            aria-label="Navegação principal"
          >
            <div className="rounded-2xl bg-card p-1">
              {navItems.map(({ label, icon: Icon }, index) => {
                const isActive = active === label
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => {
                      setActive(label)
                      setMenuOpen(false)
                    }}
                    aria-current={isActive ? "page" : undefined}
                    style={{ transitionDelay: menuVisible ? `${index * 30}ms` : "0ms" }}
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left text-lg font-medium transition-all duration-300 ease-out",
                      menuVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                      isActive
                        ? "bg-accent text-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                    )}
                  >
                    <Icon className="size-6 shrink-0" />
                    <span className="flex-1 truncate">{label}</span>
                  </button>
                )
              })}
            </div>
          </nav>
        </div>
      )}

      {/* Pílula de busca flutuante (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="flex w-auto max-w-full items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-lg">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="search"
            placeholder="Find..."
            aria-label="Pesquisar"
            className="w-24 min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          <span className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            className="flex size-6 shrink-0 items-center justify-center text-foreground transition-opacity hover:opacity-70"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
    </>
  )
}
