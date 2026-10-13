import { DataTable, type Column } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { customers } from "@/data/customers";
import { adminOrders } from "@/data/orders";
import { formatDate, formatMoney } from "@/lib/format";
import { REVENUE_STATUSES } from "@/lib/orderStatus";
import { orderTotal } from "@/lib/orders";
import type { Customer } from "@/lib/types";

function summary(customerId: string) {
  const orders = adminOrders.filter((o) => o.customerId === customerId);
  const spent = orders.filter((o) => REVENUE_STATUSES.includes(o.status)).reduce((s, o) => s + orderTotal(o), 0);
  return { count: orders.length, spent };
}

const columns: Column<Customer>[] = [
  { key: "name", header: "Customer", render: (c) => <div><p className="font-medium">{c.name}</p><p className="text-xs text-gray-500">{c.email}</p></div> },
  { key: "city", header: "City", render: (c) => c.city },
  { key: "joined", header: "Joined", render: (c) => formatDate(c.joinedAt) },
  { key: "orders", header: "Orders", align: "right", render: (c) => summary(c.id).count },
  { key: "spent", header: "Total spent", align: "right", render: (c) => formatMoney(summary(c.id).spent) },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description={`${customers.length} registered customers`} />
      <DataTable columns={columns} rows={customers} rowKey={(c) => c.id} />
    </div>
  );
}
