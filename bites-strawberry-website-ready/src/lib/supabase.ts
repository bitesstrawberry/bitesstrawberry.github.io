/**
 * Minimal Supabase Data API helper.
 * The publishable key is intended for browser use; the orders table is protected
 * by RLS and only exposes INSERT to anonymous visitors.
 */
const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL || 'https://fytsueuehzfplicjqcvx.supabase.co'
).replace(/\/+$/, '');

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_BjRhaMUJjWEe4nyFbwDC3w_P27njsI6';

export interface OrderInsert {
  product_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  unit_price: number;
  subtotal: number;
  fulfillment_method: 'pickup' | 'delivery';
  pickup_outlet: string | null;
  delivery_address: string | null;
  customer_name: string | null;
  notes: string | null;
}

export async function saveOrder(order: OrderInsert): Promise<void> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Supabase order insert failed (${response.status}): ${details.slice(0, 240)}`);
  }
}
