"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function CustomersPage() {
  const [items, setItems] = useState<Array<{id:number; name:string; phone:string|null}>>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    try { setItems(await api.listCustomers()); }
    catch (e:any) { setErr(e.message ?? String(e)); }
  }

  async function add() {
    setErr(null);
    if (!name.trim()) return setErr("Имя обязательно");
    try {
      await api.createCustomer({ name: name.trim(), phone: phone.trim() || null });
      setName(""); setPhone("");
      await load();
    } catch (e:any) { setErr(e.message ?? String(e)); }
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{display:"grid", gap:12}}>
      <h2>Клиенты</h2>

      <div style={{border:"1px solid #ddd", padding:12, borderRadius:10}}>
        <div style={{display:"grid", gap:8}}>
          <input placeholder="Имя" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Телефон (необязательно)" value={phone} onChange={e=>setPhone(e.target.value)} />
          <div style={{display:"flex", gap:8}}>
            <button onClick={add}>Добавить</button>
            <button onClick={load}>Обновить</button>
          </div>
          {err && <div style={{color:"crimson", whiteSpace:"pre-wrap"}}>{err}</div>}
        </div>
      </div>

      <div style={{border:"1px solid #ddd", padding:12, borderRadius:10}}>
        <b>Список</b>
        <ul>
          {items.map(c => <li key={c.id}>#{c.id} — {c.name} ({c.phone ?? "-"})</li>)}
        </ul>
      </div>
    </div>
  );
}
