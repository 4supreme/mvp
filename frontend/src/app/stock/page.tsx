"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type StockLine = { product_id: number; warehouse_id: number; qty: number };

export default function StockPage() {
  const [items, setItems] = useState<StockLine[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      setItems(await api.listStock());
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
        <div className="text-xl font-semibold">Остатки</div>
        <div className="text-sm text-muted-foreground">Сумма движений по товарам и складам</div>
      </div>

      <Card className="p-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {loading ? "Загрузка..." : `Строк: ${items.length}`}
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>Обновить</Button>
      </Card>

      {err && <div className="text-sm text-red-600 whitespace-pre-wrap">{err}</div>}

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>product_id</TableHead>
              <TableHead>warehouse_id</TableHead>
              <TableHead>qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((s, i) => (
              <TableRow key={i}>
                <TableCell>{s.product_id}</TableCell>
                <TableCell>{s.warehouse_id}</TableCell>
                <TableCell>{s.qty}</TableCell>
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
