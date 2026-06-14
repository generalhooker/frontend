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
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Minhas redações", icon: FileText },
  { label: "Criar redação", icon: SquarePen },
  { label: "Temas", icon: Hash },
  { label: "Corretor de redação", icon: ShieldCheck },
  { label: "Detector de IA", icon: AiIcon },
  { label: "Histórico", icon: Clock },
  { label: "Favoritos", icon: Star },
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
  const percent = Math.round((WORDS_USED / WORDS_LIMIT) * 100)

  return (
    <aside className="flex h-dvh w-72 flex-col border-r border-border bg-background">
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
  )
}
