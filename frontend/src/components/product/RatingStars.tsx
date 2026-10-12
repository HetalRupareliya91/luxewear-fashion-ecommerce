export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating);
  return (
    <p className="flex items-center gap-2 text-sm text-gray-600" aria-label={`Rated ${rating} out of 5`}>
      <span aria-hidden="true" className="tracking-widest text-amber-500">
        {"★".repeat(full)}
        <span className="text-gray-300">{"★".repeat(5 - full)}</span>
      </span>
      <span>{rating.toFixed(1)}</span>
      {count !== undefined ? <span className="text-gray-400">({count})</span> : null}
    </p>
  );
}
