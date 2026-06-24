import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ConfiguracoesPage } from "@/components/configuracoes-page"
import type { NavStyle, DesktopNavStyle, Theme } from "@/components/configuracoes-page"

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("theme") as Theme | null
  if (saved === "dark" || saved === "light") return saved
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: Theme) {
  const el = document.documentElement
  el.classList.remove("light", "dark", "slate")
  el.classList.add(theme)
  localStorage.setItem("theme", theme)
}

function App() {
  const [active, setActive] = useState("Dashboard")
  const [navStyle, setNavStyle] = useState<NavStyle>("navbar")
  const [desktopNavStyle, setDesktopNavStyle] = useState<DesktopNavStyle>("sidebar")
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return (
    <main className="flex h-dvh overflow-hidden bg-muted/40">
      <AppSidebar
        active={active}
        onSelect={setActive}
        navStyle={navStyle}
        desktopNavStyle={desktopNavStyle}
      />
      <section className="flex flex-1 flex-col overflow-y-auto">
        {active === "Configurações" ? (
          <ConfiguracoesPage
            navStyle={navStyle}
            onNavStyleChange={setNavStyle}
            desktopNavStyle={desktopNavStyle}
            onDesktopNavStyleChange={setDesktopNavStyle}
            theme={theme}
            onThemeChange={setTheme}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">{active}</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
