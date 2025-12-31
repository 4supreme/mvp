"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function SalesPage() {
  const [warehouses, setWarehouses] = useState<Array<{id:number; name:string}>>([]);
  const [products, setProducts] = useState<Array<{id:number; name:string}>>([]);
  const [customers, setCustomers] = useState<Array<{id:number; name:string}>>([]);

  const [warehouseId, setWarehouseId] = useState<number>(1);
  const [customerId, setCustomerId] = useState<number>(1);
  const [productId, setProductId] = useState<number>(1);
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);

  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function init() {
    setErr(null); setOk(null);
    try {
      const [w, p, c] = await Promise.all([api.listWarehouses(), api.listProducts(), api.listCustomers()]);
      setWarehouses(w);
      setProducts(p.map(x => ({id:x.id, name:x.name})));
      setCustomers(c.map(x => ({id:x.id, name:x.name})));
      if (w[0]) setWarehouseId(w[0].id);
      if (p[0]) setProductId(p[0].id);
      if (c[0]) setCustomerId(c[0].id);
    } catch (e:any) { setErr(e.message ?? String(e)); }
  }

  async function postSale() {
    setErr(null); setOk(null);
    try {
      const res:any = await api.createSale({
        warehouse_id: warehouseId,
        customer_id: customerId,
        lines: [{ product_id: productId, qty, price }]
      });
      setOk(`Продажа проведена. sale_id=${res?.id ?? "?"}`);
    } catch (e:any) {
      // сюда прилетит ошибка "Недостаточно товара..." — это как раз запрет минуса
      setErr(e.message ?? String(e));
    }
  }

  useEffect(() => { init(); }, []);

  return (
    <div style={{display:"grid", gap:12}}>
      <h2>Продажа</h2>

      <div style={{border:"1px solid #ddd", padding:12, borderRadius:10, display:"grid", gap:8}}>
        <label>Склад</label>
        <select value={warehouseId} onChange={e=>setWarehouseId(Number(e.target.value))}>
          {warehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>

        <label>Клиент</label>
        <select value={customerId} onChange={e=>setCustomerId(Number(e.target.value))}>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <label>Товар</label>
        <select value={productId} onChange={e=>setProductId(Number(e.target.value))}>
          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>

        <label>Количество</label>
        <input type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))} />

        <label>Цена (KZT)</label>
        <input type="number" min={0} value={price} onChange={e=>setPrice(Number(e.target.value))} />

        <button onClick={postSale}>Провести продажу</button>

        {ok && <div style={{color:"green"}}>{ok}</div>}
        {err && <div style={{color:"crimson", whiteSpace:"pre-wrap"}}>{err}</div>}
      </div>
    </div>
  );
}
