"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section className="h-section bg-slate-200">
      <div className="flex flex-col items-center py-20">
        <h1 className="mb-4 text-center text-4xl font-[600]">
          An error occurred
        </h1>
        {error.message && (
          <p className="mb-4 text-center text-2xl text-red-500">{error.message}</p>
        )}
        <Link href="/">Go back home</Link>
      </div>
    </section>
  );
}
