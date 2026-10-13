import { customers } from "@/data/customers";
import type { AdminOrder, Customer } from "./types";

export const orderSubtotal = (order: AdminOrder): number => order.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
export const orderTotal = (order: AdminOrder): number => Math.round((orderSubtotal(order) + order.shipping) * 100) / 100;
export const orderUnits = (order: AdminOrder): number => order.items.reduce((sum, i) => sum + i.quantity, 0);
export const getCustomer = (id: string): Customer | undefined => customers.find((c) => c.id === id);
export const getOrder = (orders: AdminOrder[], id: string): AdminOrder | undefined => orders.find((o) => o.id === id);
