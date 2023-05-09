"use client";

export default function HomePage({ message, information }) {
  return (
    <>
      <section className="h-[calc(100vh-72px)] bg-slate-200 pt-20">
        <div className="mx-auto flex h-[20rem] max-w-4xl flex-col items-center justify-center rounded-md bg-slate-50">
          <p className="text-3xl font-semibold">{message}</p>
          <p className="text-2xl font-semibold">{information.env}</p>
          <p className="text-2xl font-semibold">{information.userAgent}</p>
          <p className="text-2xl font-semibold">{information.ip}</p>
        </div>
      </section>
    </>
  );
}
