"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type Product = { id: number; name: string; sku: string | null };

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      setItems(await api.listProducts());
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  async function add() {
    setErr(null);
    if (!name.trim()) return setErr("Название обязательно");
    setLoading(true);
    try {
      await api.createProduct({ name: name.trim(), sku: sku.trim() || null });
      setName("");
      setSku("");
      await load();
    } catch (e: any) {
      setErr(e.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold">Товары</div>
        <div className="text-sm text-muted-foreground">Создание и просмотр номенклатуры</div>
      </div>

      <Card className="p-4 space-y-3">
        <div className="text-sm font-medium">Добавить товар</div>
        <div className="grid gap-2 md:grid-cols-2">
          <Input placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="SKU (необязательно)" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button onClick={add} disabled={loading}>Добавить</Button>
          <Button variant="secondary" onClick={load} disabled={loading}>Обновить</Button>
        </div>
        {err && <div className="text-sm text-red-600 whitespace-pre-wrap">{err}</div>}
      </Card>

      <Card className="p-4">
        <div className="text-sm font-medium mb-3">Список</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Название</TableHead>
              <TableHead>SKU</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.sku ?? ""}</TableCell>
              </TableRow>
            ))}
            {!items.length && (
              <TableRow>
                <TableCell colSpan={3} className="text-sm text-muted-foreground">
                  {loading ? "Загрузка..." : "Пока пусто"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
