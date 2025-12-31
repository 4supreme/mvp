"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/products", label: "Товары" },
  { href: "/warehouses", label: "Склады" },
  { href: "/stock", label: "Остатки" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-2xl font-semibold tracking-tight">MVP ERP</div>
            <div className="text-sm text-muted-foreground">Простой, быстрый, понятный</div>
          </div>
          <div className="text-xs text-muted-foreground">Backend: 127.0.0.1:8000</div>
        </div>

        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <Card className="p-3">
            <div className="text-sm font-medium mb-2">Навигация</div>
            <Separator className="mb-2" />
            <nav className="flex flex-col gap-1">
              {nav.map((n) => {
                const active = path === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={[
                      "rounded-lg px-3 py-2 text-sm transition",
                      active ? "bg-muted font-medium" : "hover:bg-muted/60",
                    ].join(" ")}
                  >
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </Card>

          <Card className="p-4">{children}</Card>
        </div>
      </div>
    </div>
  );
}
