"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  LayoutDashboard,
  FileText,
  SquarePen,
  Hash,
  ShieldCheck,
  Bot,
  Clock,
  Settings,
  Search,
  X,
  Menu,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import type { DesktopNavStyle } from "@/components/configuracoes-page"

type AnyIcon = (props: { className?: string; style?: React.CSSProperties }) => React.ReactNode

type ChildItem = {
  label: string
  icon: AnyIcon
}

type NavItem = {
  label: string
  icon: AnyIcon
  style?: "primary" | "accent"
  children?: ChildItem[]
}

function AiIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-[5px] border-[1.5px] border-current text-[10px] font-bold leading-none tracking-tight",
        className,
      )}
      style={style}
      aria-hidden="true"
    >
      Ai
    </span>
  )
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Minhas redações", icon: FileText },
  { label: "Criar redação", icon: SquarePen },
  { label: "Temas", icon: Hash },
  { label: "Corretor de redação", icon: ShieldCheck },
  {
    label: "AI",
    icon: Bot,
    children: [{ label: "Detector de IA", icon: AiIcon }],
  },
  { label: "Histórico", icon: Clock },
  { label: "Configurações", icon: Settings },
]

export function AppSidebar({
  active,
  onSelect,
  navStyle = "navbar",
  desktopNavStyle = "sidebar",
}: {
  active: string
  onSelect: (label: string) => void
  navStyle?: "navbar" | "floating-tabs"
  desktopNavStyle?: DesktopNavStyle
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const [aiExpanded, setAiExpanded] = useState(true)
  const [commandOpen, setCommandOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  const dragStartX = useRef<number | null>(null)
  const dragMoved = useRef(false)

  const handleDragStart = useCallback((clientX: number) => {
    dragStartX.current = clientX
    dragMoved.current = false
  }, [])

  const handleDragMove = useCallback((clientX: number) => {
    if (dragStartX.current === null) return
    const delta = clientX - dragStartX.current
    if (Math.abs(delta) > 5) dragMoved.current = true
    if (!sidebarExpanded && delta > 40) {
      setSidebarExpanded(true)
      dragStartX.current = clientX
    } else if (sidebarExpanded && delta < -40) {
      setSidebarExpanded(false)
      dragStartX.current = clientX
    }
  }, [sidebarExpanded])

  const handleDragEnd = useCallback(() => {
    if (!dragMoved.current) {
      setSidebarExpanded((v) => !v)
    }
    dragStartX.current = null
    dragMoved.current = false
  }, [])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleDragMove(e.clientX)
    const onMouseUp = () => {
      if (dragStartX.current !== null) handleDragEnd()
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [handleDragMove, handleDragEnd])

  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true)
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

  // keyboard shortcut: Cmd/Ctrl+K opens command on desktop floating-search mode
  useEffect(() => {
    if (desktopNavStyle !== "floating-search") return
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [desktopNavStyle])

  function handleSelect(label: string) {
    onSelect(label)
    setMenuOpen(false)
  }

  function handleCommandSelect(label: string) {
    onSelect(label)
    setCommandOpen(false)
  }

  // Flat list of all items (including children) for command palette
  const allNavItems = navItems.flatMap((item) =>
    item.children
      ? [item, ...item.children]
      : [item],
  )

  return (
    <>
      {/* ===== Sidebar desktop (md e acima) — only when desktopNavStyle is "sidebar" ===== */}
      {desktopNavStyle === "sidebar" && (
        <aside
          className={cn(
            "relative hidden h-dvh shrink-0 flex-col overflow-hidden border-r border-border transition-[width] duration-300 ease-in-out md:flex",
            sidebarExpanded ? "w-64" : "w-[60px]",
          )}
        >
          {/* Search bar */}
          <div className="px-2.5 pt-5">
            <button
              type="button"
              onClick={() => setSidebarExpanded(true)}
              aria-label="Expandir sidebar e pesquisar"
              className="flex w-full items-center gap-2 rounded-xl border border-border bg-muted px-2.5 py-2.5 transition-colors hover:bg-accent"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-left text-sm text-muted-foreground transition-[opacity,width] duration-200 ease-in-out",
                  sidebarExpanded ? "opacity-100" : "w-0 opacity-0",
                )}
              >
                Pesquisar
              </span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-0.5 px-2.5 pt-3" aria-label="Navegação principal">
            {navItems.map(({ label, icon: Icon, style, children }) => {
              const isActive = active === label
              const isGroup = !!children

              return (
                <div key={label}>
                  <button
                    type="button"
                    onClick={() => {
                      if (isGroup) {
                        setAiExpanded((v) => !v)
                      } else {
                        onSelect(label)
                      }
                    }}
                    aria-current={isActive && !isGroup ? "page" : undefined}
                    title={label}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl px-2.5 py-3 text-left text-sm font-medium transition-colors",
                      style === "accent"
                        ? "text-violet-600 hover:bg-accent"
                        : isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className={cn("size-5 shrink-0", style === "accent" && "text-violet-500")} />
                    <span
                      className={cn(
                        "flex-1 truncate whitespace-nowrap transition-opacity duration-150",
                        sidebarExpanded ? "opacity-100 delay-100" : "opacity-0 delay-0",
                      )}
                    >
                      {label}
                    </span>
                    {isGroup && (
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 text-muted-foreground transition-[opacity,transform] duration-150",
                          sidebarExpanded ? "opacity-100 delay-100" : "opacity-0 delay-0",
                          aiExpanded && "rotate-180",
                        )}
                      />
                    )}
                  </button>

                  {isGroup && aiExpanded && children && (
                    <div
                      className={cn(
                        "ml-2 mt-0.5 flex-col gap-0.5 border-l border-border pl-2.5",
                        sidebarExpanded ? "flex" : "hidden",
                      )}
                    >
                      {children.map(({ label: cl, icon: CIcon }) => {
                        const isChildActive = active === cl
                        return (
                          <button
                            key={cl}
                            type="button"
                            onClick={() => onSelect(cl)}
                            aria-current={isChildActive ? "page" : undefined}
                            title={cl}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left text-sm font-medium transition-colors",
                              isChildActive
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground",
                            )}
                          >
                            <CIcon className="size-4 shrink-0" />
                            <span
                              className={cn(
                                "truncate whitespace-nowrap transition-opacity duration-150",
                                sidebarExpanded ? "opacity-100 delay-100" : "opacity-0 delay-0",
                              )}
                            >
                              {cl}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

        </aside>
      )}

      {/* Drag handle — floating pill, independent of sidebar edge */}
      {desktopNavStyle === "sidebar" && (
        <div
          className={cn(
            "fixed top-1/2 z-50 hidden -translate-y-1/2 cursor-col-resize select-none items-center justify-center md:flex",
            "transition-[left] duration-300 ease-in-out",
          )}
          style={{ left: sidebarExpanded ? 256 + 10 : 60 + 10 }}
          onMouseDown={(e) => {
            e.preventDefault()
            handleDragStart(e.clientX)
          }}
          onTouchStart={(e) => {
            handleDragStart(e.touches[0].clientX)
          }}
          onTouchMove={(e) => {
            handleDragMove(e.touches[0].clientX)
          }}
          onTouchEnd={handleDragEnd}
          aria-label={sidebarExpanded ? "Recolher sidebar" : "Expandir sidebar"}
          role="separator"
          aria-orientation="vertical"
        >
          <div className="flex h-16 w-4 items-center justify-center">
            <span className="h-8 w-[3px] rounded-full bg-muted-foreground/50 transition-colors duration-150 hover:bg-muted-foreground/80" />
          </div>
        </div>
      )}

      {/* ===== Floating search bar desktop (md e acima) — only when desktopNavStyle is "floating-search" ===== */}
      {desktopNavStyle === "floating-search" && (
        <>
          <div className="fixed inset-x-0 top-0 z-50 hidden justify-center px-6 pt-4 md:flex">
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              aria-label="Abrir pesquisa"
              className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-lg transition-colors hover:bg-accent"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 text-left text-sm text-muted-foreground">Pesquisar...</span>
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:inline-flex">
                ⌘K
              </kbd>
            </button>
          </div>

          <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
            <CommandInput placeholder="Pesquisar ou navegar..." />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              <CommandGroup heading="Navegação">
                {allNavItems.map(({ label, icon: Icon }) => (
                  <CommandItem
                    key={label}
                    value={label}
                    onSelect={() => handleCommandSelect(label)}
                  >
                    <Icon className="size-4 shrink-0 text-muted-foreground" />
                    <span>{label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </>
      )}

      {/* ===== Menu mobile overlay ===== */}
      {menuMounted && (
        <div
          className={cn(
            "fixed inset-0 z-40 flex flex-col bg-background transition-opacity duration-200 ease-out md:hidden",
            menuVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <div
            className="mx-3 mt-24 flex w-[calc(100%-1.5rem)] flex-col overflow-hidden rounded-[28px] border border-border bg-card shadow-md"
            style={{ padding: 20 }}
          >
            <nav
              className="flex flex-col gap-1 overflow-y-auto overscroll-contain"
              style={{ maxHeight: "calc(100dvh - 18rem - env(safe-area-inset-bottom))" }}
              aria-label="Navegação principal"
            >
              {navItems.map(({ label, icon: Icon, style, children }, index) => {
                const isActive = active === label
                const isGroup = !!children

                return (
                  <div key={label}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isGroup) {
                          setAiExpanded((v) => !v)
                        } else {
                          handleSelect(label)
                        }
                      }}
                      aria-current={isActive && !isGroup ? "page" : undefined}
                      style={{
                        height: 56,
                        transitionDelay: menuVisible ? `${index * 25}ms` : "0ms",
                        borderRadius: 14,
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 text-left text-base font-medium",
                        "transition-all duration-300 ease-out",
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground",
                        style === "accent" && !isActive && "text-violet-600 hover:text-violet-600",
                        menuVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-5 shrink-0",
                          style === "accent" ? "text-violet-500" : "text-muted-foreground",
                        )}
                      />
                      <span className="flex-1 truncate">{label}</span>
                      {isGroup && (
                        <ChevronDown
                          className={cn(
                            "size-4 text-muted-foreground transition-transform duration-200",
                            aiExpanded && "rotate-180",
                          )}
                        />
                      )}
                    </button>

                    {isGroup && aiExpanded && children && (
                      <div className="mb-1 ml-4 mt-1 flex flex-col gap-0.5">
                        {children.map(({ label: cl, icon: CIcon }) => {
                          const isChildActive = active === cl
                          return (
                            <button
                              key={cl}
                              type="button"
                              onClick={() => handleSelect(cl)}
                              aria-current={isChildActive ? "page" : undefined}
                              style={{ height: 48, borderRadius: 12 }}
                              className={cn(
                                "flex w-full items-center gap-3 px-4 text-left text-sm font-medium transition-colors",
                                isChildActive
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                              )}
                            >
                              <CIcon className="size-4 shrink-0 text-muted-foreground" />
                              <span className="truncate">{cl}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* ===== Barra inferior mobile ===== */}
      {navStyle === "floating-tabs" ? (
        <div className="fixed inset-x-0 bottom-0 z-50 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden">
          <div className="mx-3 overflow-x-auto rounded-2xl border border-border bg-card shadow-lg">
            <div className="flex min-w-max items-stretch">
              {navItems.map(({ label, icon: Icon }) => {
                const isActive = active === label
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => onSelect(label)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-w-[4.5rem] flex-1 flex-col items-center justify-center gap-1 px-3 py-3 text-[10px] font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className={cn("size-5 shrink-0", isActive && "text-primary")} />
                    <span className="w-full truncate text-center leading-none">{label}</span>
                    {isActive && (
                      <span className="absolute bottom-[max(0.5rem,env(safe-area-inset-bottom))] h-0.5 w-8 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
          <div className="flex w-auto max-w-full items-center gap-2.5 rounded-2xl border border-border bg-card px-4 py-2.5 shadow-lg">
            <Search className="size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
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
      )}
    </>
  )
}
