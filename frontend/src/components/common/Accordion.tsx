export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y rounded-2xl border">
      {items.map((item) => (
        <details key={item.question} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
            {item.question}
            <span aria-hidden="true" className="ml-4 text-xl transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 leading-7 text-gray-600">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
