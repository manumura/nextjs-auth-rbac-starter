import { welcome } from "@/server/api";

export const getServerSideProps = async () => {
  const res = await welcome();

  return {
    props: {
      message: res.data,
    },
  };
};

export default function Home({ message }) {
  return (
    <>
      <section className="min-h-screen bg-primary pt-20">
        <div className="mx-auto flex h-[20rem] max-w-4xl items-center justify-center rounded-md bg-secondary">
          <p className="text-3xl font-semibold">{message}</p>
        </div>
      </section>
    </>
  );
}
