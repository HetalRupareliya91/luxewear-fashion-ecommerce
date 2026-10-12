import Link from "next/link";

type EmptyStateProps = { title: string; message?: string; actionLabel?: string; actionHref?: string };

export function EmptyState({ title, message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      {message ? <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{message}</p> : null}
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
