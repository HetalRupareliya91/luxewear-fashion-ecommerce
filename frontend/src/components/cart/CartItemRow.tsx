"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { MAX_QUANTITY, type CartItem } from "@/store/cart";
import { formatPrice } from "@/utils/format";
import { QuantityStepper } from "./QuantityStepper";

type Props = {
  item: CartItem;
  product: Product;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
};

export function CartItemRow({ item, product, onQuantity, onRemove }: Props) {
  return (
    <li className="flex gap-4 py-6">
      <Link href={`/product/${product.id}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        <Image src={product.image} alt={product.name} fill sizes="96px" className="object-cover" />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          <div>
            <Link href={`/product/${product.id}`} className="font-semibold hover:underline">{product.name}</Link>
            <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
          </div>
          <p className="font-semibold">{formatPrice(product.price * item.quantity)}</p>
        </div>
        <div className="flex items-center justify-between">
          <QuantityStepper value={item.quantity} max={MAX_QUANTITY} onChange={onQuantity} label={`quantity of ${product.name}`} />
          <button type="button" onClick={onRemove} className="text-sm text-gray-500 underline hover:text-black">Remove</button>
        </div>
      </div>
    </li>
  );
}
