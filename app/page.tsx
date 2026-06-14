import { AppSidebar } from "@/components/app-sidebar"

export default function Page() {
  return (
    <main className="flex min-h-dvh bg-muted/40">
      <AppSidebar />
      <section className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm text-muted-foreground">Área de conteúdo</p>
      </section>
    </main>
  )
}
