import { STATUS_LABEL, STATUS_STYLE, type ApiOrderStatus } from "@/utils/orderStatus";

export function OrderStatusBadge({ status }: { status: ApiOrderStatus }) {
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>;
}
