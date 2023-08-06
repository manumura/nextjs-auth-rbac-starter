import Link from "next/link";

export default function NotFound() {
  return (
    <section className="h-section bg-slate-200">
      <div className="flex flex-col items-center py-20">
        <h1 className="mb-4 text-center text-4xl font-[600]">
          404 - Page Not Found
        </h1>
        <Link href="/">Go back home</Link>
      </div>
    </section>
  );
}
