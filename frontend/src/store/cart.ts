export type CartItem = { productId: string; size: string; quantity: number };

export type CartAction =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; item: CartItem }
  | { type: "setQuantity"; productId: string; size: string; quantity: number }
  | { type: "remove"; productId: string; size: string }
  | { type: "clear" };

export const MAX_QUANTITY = 10;
export const CART_STORAGE_KEY = "luxewear.cart.v1";

const clamp = (n: number) => Math.min(Math.max(Math.floor(n), 1), MAX_QUANTITY);
const same = (a: CartItem, productId: string, size: string) => a.productId === productId && a.size === size;

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "hydrate":
      return action.items;
    case "add": {
      const existing = state.find((i) => same(i, action.item.productId, action.item.size));
      if (!existing) return [...state, { ...action.item, quantity: clamp(action.item.quantity) }];
      return state.map((i) => (i === existing ? { ...i, quantity: clamp(i.quantity + action.item.quantity) } : i));
    }
    case "setQuantity":
      if (action.quantity < 1) return state.filter((i) => !same(i, action.productId, action.size));
      return state.map((i) => (same(i, action.productId, action.size) ? { ...i, quantity: clamp(action.quantity) } : i));
    case "remove":
      return state.filter((i) => !same(i, action.productId, action.size));
    case "clear":
      return [];
  }
}

export const cartCount = (items: CartItem[]): number => items.reduce((sum, i) => sum + i.quantity, 0);

/** Reads whatever is in localStorage and keeps only well-formed lines. */
export function parseStoredCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((i): i is CartItem => !!i && typeof i.productId === "string" && typeof i.size === "string" && Number.isFinite(i.quantity) && i.quantity >= 1)
      .map((i) => ({ productId: i.productId, size: i.size, quantity: clamp(i.quantity) }));
  } catch {
    return [];
  }
}
