import Link from "next/link";

export async function getServerSideProps({ query }) {
  const code = query?.code;
  if (code === "401") {
    return {
      redirect: {
        permanent: false,
        destination: "/login?error=401",
      },
      props: {},
    };
  }

  const props = code
    ? {
        code,
      }
    : {};

  return {
    props,
  };
}

export default function Error({ code }) {
  let message = "";
  if (code === "403") {
    message = "You are not allowed to access this page";
  }
  if (code === "404") {
    message = "The page was not found!";
  }

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      <div className="flex flex-col items-center py-20">
        <h1 className="mb-4 text-center text-4xl font-[600]">
          An error occurred
        </h1>
        {message && (
          <p className="mb-4 text-center text-2xl text-red-500">{message}</p>
        )}
        <Link href="/">Go back home</Link>
      </div>
    </section>
  );
}
