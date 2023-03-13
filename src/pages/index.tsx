import { welcome } from "@/lib/api";

export const getServerSideProps = async () => {
  let message = 'Welcome fallback!';
  try {
    const res = await welcome();
    message = res.data;
  } catch (err) {
    console.error(err);
  }

  return {
    props: {
      message,
    },
  };
};

export default function Home({ message }) {
  return (
    <>
      <section className="min-h-screen pt-20 bg-slate-200">
        <div className="mx-auto flex h-[20rem] max-w-4xl items-center justify-center rounded-md bg-slate-50">
          <p className="text-3xl font-semibold">{message}</p>
        </div>
      </section>
    </>
  );
}
