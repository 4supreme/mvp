"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ReceiptsPage() {
  const [warehouses, setWarehouses] = useState<Array<{id:number; name:string}>>([]);
  const [products, setProducts] = useState<Array<{id:number; name:string}>>([]);
  const [warehouseId, setWarehouseId] = useState<number>(1);
  const [productId, setProductId] = useState<number>(1);
  const [qty, setQty] = useState<number>(1);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function init() {
    setErr(null); setOk(null);
    try {
      const [w, p] = await Promise.all([api.listWarehouses(), api.listProducts()]);
      setWarehouses(w);
      setProducts(p.map(x => ({id:x.id, name:x.name})));
      if (w[0]) setWarehouseId(w[0].id);
      if (p[0]) setProductId(p[0].id);
    } catch (e:any) { setErr(e.message ?? String(e)); }
  }

  async function postReceipt() {
    setErr(null); setOk(null);
    try {
      const res:any = await api.createReceipt({
        warehouse_id: warehouseId,
        lines: [{ product_id: productId, qty }]
      });
      setOk(`Поступление проведено. doc_id=${res?.doc_id ?? "?"}`);
    } catch (e:any) { setErr(e.message ?? String(e)); }
  }

  useEffect(() => { init(); }, []);

  return (
    <div style={{display:"grid", gap:12}}>
      <h2>Поступление</h2>

      <div style={{border:"1px solid #ddd", padding:12, borderRadius:10, display:"grid", gap:8}}>
        <label>Склад</label>
        <select value={warehouseId} onChange={e=>setWarehouseId(Number(e.target.value))}>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>

        <label>Товар</label>
        <select value={productId} onChange={e=>setProductId(Number(e.target.value))}>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <label>Количество</label>
        <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))} />

        <button onClick={postReceipt}>Провести поступление</button>

        {ok && <div style={{color:"green"}}>{ok}</div>}
        {err && <div style={{color:"crimson", whiteSpace:"pre-wrap"}}>{err}</div>}
      </div>
    </div>
  );
}
