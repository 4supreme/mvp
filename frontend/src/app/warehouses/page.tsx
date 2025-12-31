"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

type Warehouse = { id: number; name: string };

export default function WarehousesPage() {
  const [items, setItems] = useState<Warehouse[]>([]);
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      setItems(await api.listWarehouses());
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
      await api.createWarehouse({ name: name.trim() });
      setName("");
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
        <div className="text-xl font-semibold">Склады</div>
        <div className="text-sm text-muted-foreground">Справочник складов</div>
      </div>

      <Card className="p-4 space-y-3">
        <div className="text-sm font-medium">Добавить склад</div>
        <Input placeholder="Название склада" value={name} onChange={(e) => setName(e.target.value)} />
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((w) => (
              <TableRow key={w.id}>
                <TableCell>{w.id}</TableCell>
                <TableCell>{w.name}</TableCell>
              </TableRow>
            ))}
            {!items.length && (
              <TableRow>
                <TableCell colSpan={2} className="text-sm text-muted-foreground">
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
