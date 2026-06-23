"use client"

import { useState, useRef, useEffect } from "react"
import { PlusIcon, ImageUp, Moon } from "lucide-react"
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Rows3, GalleryHorizontalEnd } from "lucide-react"
import type { NavStyle } from "@/app/page"

const DEFAULT_USER = {
  name: "Nome do Usuário",
  email: "usuario@email.com",
  cpf: "123.456.789-00",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export function ConfiguracoesPage({
  navStyle = "navbar",
  onNavStyleChange,
}: {
  navStyle?: NavStyle
  onNavStyleChange?: (style: NavStyle) => void
}) {
  const [user, setUser] = useState(DEFAULT_USER)
  const [draftName, setDraftName] = useState(user.name)
  const [draftEmail, setDraftEmail] = useState(user.email)
  const [showUpload, setShowUpload] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [darkMode, setDarkMode] = useState(false)

  function toggleDarkMode(checked: boolean) {
    setDarkMode(checked)
    document.documentElement.classList.toggle("dark", checked)
  }
  const wrapperRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!showUpload) return
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowUpload(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showUpload])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const apply = () => {
      setAvatarUrl(url)
      setShowUpload(false)
    }
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      ;(document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(apply)
    } else {
      apply()
    }
    e.target.value = ""
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setUser((u) => ({ ...u, name: draftName, email: draftEmail }))
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 md:py-12">
      <h1 className="mb-6 text-2xl font-semibold text-foreground">Configurações</h1>

      <section aria-labelledby="perfil-heading">
        <h2
          id="perfil-heading"
          className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground"
        >
          Perfil
        </h2>

        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
          {/* Avatar + badge */}
          <div ref={wrapperRef} className="relative shrink-0">
            <Avatar size="lg" className="size-14">
              <AvatarImage
                src={avatarUrl}
                alt={user.name}
                style={{ viewTransitionName: "profile-avatar" }}
              />
              <AvatarFallback className="text-base font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
              <AvatarBadge
                role="button"
                tabIndex={0}
                aria-label="Trocar foto de perfil"
                onClick={() => setShowUpload((v) => !v)}
                onKeyDown={(e: React.KeyboardEvent) =>
                  e.key === "Enter" && setShowUpload((v) => !v)
                }
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <PlusIcon />
              </AvatarBadge>
            </Avatar>

            {/* Input de arquivo oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Card de upload */}
            {showUpload && (
              <div className="absolute left-0 top-[calc(100%+0.5rem)] z-10 w-64 rounded-2xl border border-border bg-card shadow-lg">
                <Empty className="m-3 border border-dashed">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <ImageUp className="size-4" />
                    </EmptyMedia>
                    <EmptyTitle>Foto de perfil</EmptyTitle>
                    <EmptyDescription>
                      Envie uma imagem para usar como sua foto de perfil.
                    </EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Escolher imagem
                    </Button>
                  </EmptyContent>
                </Empty>
              </div>
            )}
          </div>

          {/* Nome + botão editar */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-base font-semibold text-foreground">{user.name}</p>

              <Dialog>
                <DialogTrigger
                  className="inline-flex h-7 cursor-pointer items-center justify-center rounded-md border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => {
                    setDraftName(user.name)
                    setDraftEmail(user.email)
                  }}
                >
                  Editar
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <form onSubmit={handleSave}>
                    <DialogHeader>
                      <DialogTitle>Editar perfil</DialogTitle>
                      <DialogDescription>
                        Altere suas informações e clique em salvar.
                      </DialogDescription>
                    </DialogHeader>
                    <FieldGroup className="my-4">
                      <Field>
                        <Label htmlFor="edit-name">Nome</Label>
                        <Input
                          id="edit-name"
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="edit-email">E-mail</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={draftEmail}
                          onChange={(e) => setDraftEmail(e.target.value)}
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="edit-cpf">CPF</Label>
                        <Input
                          id="edit-cpf"
                          value={user.cpf}
                          readOnly
                          className="cursor-not-allowed opacity-60"
                          aria-label="CPF não editável"
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter>
                      <DialogClose className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-transparent px-4 text-sm font-medium transition-colors hover:bg-accent">
                        Cancelar
                      </DialogClose>
                      <DialogClose
                        type="submit"
                        onClick={handleSave}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        Salvar
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </section>

      <Separator className="my-6" />

      {/* Exclusivo Mobile — só aparece em telas pequenas */}
      <section aria-labelledby="mobile-heading" className="md:hidden">
        <h2
          id="mobile-heading"
          className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground"
        >
          Exclusivo Mobile
        </h2>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold text-foreground">Navegação</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Escolha como a barra de navegação aparece no seu dispositivo.
              </p>
            </div>
          </div>

          <Tabs
            value={navStyle}
            onValueChange={(val) => onNavStyleChange?.(val as NavStyle)}
            className="mt-4"
          >
            <TabsList className="w-full">
              <TabsTrigger value="navbar" className="flex-1 gap-2">
                <Rows3 className="size-4 shrink-0" />
                NavBar
              </TabsTrigger>
              <TabsTrigger value="floating-tabs" className="flex-1 gap-2">
                <GalleryHorizontalEnd className="size-4 shrink-0" />
                FloatingTabs
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <Separator className="my-6 md:hidden" />

      <section aria-labelledby="opcoes-heading">
        <h2
          id="opcoes-heading"
          className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground"
        >
          Opções
        </h2>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Moon className="size-4 shrink-0 text-muted-foreground" />
                <p className="text-lg font-bold text-foreground">Tema escuro</p>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Ativa o modo escuro em toda a aplicação. Ideal para ambientes com pouca luz, reduz o cansaço visual e economiza bateria em telas OLED.
              </p>
            </div>
            <Checkbox
              id="dark-mode"
              name="dark-mode"
              checked={darkMode}
              onCheckedChange={(val) => toggleDarkMode(val === true)}
              className="size-5 rounded-md"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
