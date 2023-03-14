import { welcome } from "@/lib/api";

export const getServerSideProps = async () => {
  let message = 'Welcome fallback!';
  try {
    const res = await welcome();
    message = res.data;
  } catch (err) {
    console.error('Welcome message error: ', err.message);
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
      <section className="h-[calc(100vh-72px)] pt-20 bg-slate-200">
        <div className="mx-auto flex h-[20rem] max-w-4xl items-center justify-center rounded-md bg-slate-50">
          <p className="text-3xl font-semibold">{message}</p>
        </div>
      </section>
    </>
  );
}
