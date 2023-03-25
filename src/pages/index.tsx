import { welcome } from "@/lib/api";
import { info } from "@/lib/api";

export const getServerSideProps = async () => {
  let message = 'Welcome fallback!';
  let information = {};
  try {
    const welcomeRes = await welcome();
    message = welcomeRes.data;
    const infoRes = await info();
    information = infoRes.data;
  } catch (err) {
    console.error('Welcome message error: ', err.message);
  }

  return {
    props: {
      message,
      information,
    },
  };
};

export default function Home({ message, information }) {
  return (
    <>
      <section className="h-[calc(100vh-72px)] pt-20 bg-slate-200">
        <div className="mx-auto flex flex-col h-[20rem] max-w-4xl items-center justify-center rounded-md bg-slate-50">
          <p className="text-3xl font-semibold">{message}</p>
          <p className="text-2xl font-semibold">{information.env}</p>
          <p className="text-2xl font-semibold">{information.userAgent}</p>
          <p className="text-2xl font-semibold">{information.ip}</p>
        </div>
      </section>
    </>
  );
}
