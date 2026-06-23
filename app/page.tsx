"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ConfiguracoesPage } from "@/components/configuracoes-page"

export type NavStyle = "navbar" | "floating-tabs"

export default function Page() {
  const [active, setActive] = useState("Dashboard")
  const [navStyle, setNavStyle] = useState<NavStyle>("navbar")

  return (
    <main className="flex min-h-dvh bg-muted/40">
      <AppSidebar active={active} onSelect={setActive} navStyle={navStyle} />
      <section className="flex flex-1 flex-col">
        {active === "Configurações" ? (
          <ConfiguracoesPage navStyle={navStyle} onNavStyleChange={setNavStyle} />
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            <p className="text-sm text-muted-foreground">{active}</p>
          </div>
        )}
      </section>
    </main>
  )
}
