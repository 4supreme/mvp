async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  // Products
  listProducts: () => request<Array<{ id: number; name: string; sku: string | null }>>(`/catalog/products`),
  createProduct: (body: { name: string; sku?: string | null }) =>
    request(`/catalog/products`, { method: "POST", body: JSON.stringify(body) }),

  // Warehouses
  listWarehouses: () => request<Array<{ id: number; name: string }>>(`/warehouse/warehouses`),
  createWarehouse: (body: { name: string }) =>
    request(`/warehouse/warehouses`, { method: "POST", body: JSON.stringify(body) }),

  // Customers
  listCustomers: () => request<Array<{ id: number; name: string; phone: string | null }>>(`/crm/customers`),
  createCustomer: (body: { name: string; phone?: string | null }) =>
    request(`/crm/customers`, { method: "POST", body: JSON.stringify(body) }),

  // Receipt (поступление)
  createReceipt: (body: { warehouse_id: number; lines: Array<{ product_id: number; qty: number }> }) =>
    request(`/warehouse/receipts`, { method: "POST", body: JSON.stringify(body) }),

  // Sale (продажа)
  createSale: (body: {
    warehouse_id: number;
    customer_id: number;
    lines: Array<{ product_id: number; qty: number; price: number }>;
  }) => request(`/sales/sales`, { method: "POST", body: JSON.stringify(body) }),

  // Stock
  listStock: () => request<Array<{ product_id: number; warehouse_id: number; qty: number }>>(`/warehouse/stock`),
};
