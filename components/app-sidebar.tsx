"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  FileText,
  SquarePen,
  Hash,
  ShieldCheck,
  Clock,
  Star,
  Trash2,
  ChevronRight,
  User,
  Search,
  X,
  type LucideIcon,
} from "lucide-react"
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
  { label: "Lixeira", icon: Trash2 },
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
const WORDS_LIMIT = 100000

export function AppSidebar() {
  const [active, setActive] = useState("Dashboard")
  const [menuOpen, setMenuOpen] = useState(false)
  const percent = Math.round((WORDS_USED / WORDS_LIMIT) * 100)

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

        {/* Rodapé: usuário + uso */}
        <div className="flex flex-col gap-3 p-3">
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3 text-left transition-colors hover:bg-accent"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="size-5" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-semibold text-foreground">Usuário</span>
              <span className="truncate text-xs text-muted-foreground">Plano Premium</span>
            </span>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
          </button>

          <div className="rounded-xl border border-border p-4">
            <p className="text-sm font-medium text-foreground">Palavras usadas</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {WORDS_USED.toLocaleString("pt-BR")} / {WORDS_LIMIT.toLocaleString("pt-BR")}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${percent}%` }}
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Palavras usadas"
                />
              </div>
              <span className="text-sm font-medium text-foreground">{percent}%</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Navegação mobile (abaixo de md) ===== */}
      {/* Overlay do menu em tela cheia, estilo Vercel */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-background md:hidden">
          <nav
            className="flex-1 overflow-y-auto p-2 pb-32 pt-4"
            aria-label="Navegação principal"
          >
            <div className="rounded-2xl bg-card p-1">
              {navItems.map(({ label, icon: Icon }) => {
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
                    className={cn(
                      "flex w-full items-center gap-4 rounded-xl px-4 py-4 text-left text-lg font-medium transition-colors",
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
        <div className="flex w-auto max-w-full items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-lg">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input
            type="search"
            placeholder="Find..."
            aria-label="Pesquisar"
            className="w-32 min-w-0 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
          />
          <span className="h-6 w-px shrink-0 bg-border" aria-hidden="true" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
            className="flex size-6 shrink-0 items-center justify-center text-foreground transition-opacity hover:opacity-70"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>
    </>
  )
}
