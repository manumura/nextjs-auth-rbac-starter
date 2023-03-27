import FormInput from "@/components/FormInput";
import { forgotPassword } from "@/lib/api";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { sleep } from "../lib/util";

export async function getServerSideProps({ query, req }) {
  // Redirect if user is authenticated
  const accessToken = req?.cookies?.accessToken;
  if (accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  }

  return {
    props: {},
  };
}

const ForgotPassword = () => {
  const router = useRouter();
  const methods = useForm();
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmit = async (data) => {
    if (!data || loading) {
      return;
    }
    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await forgotPassword(data.email);

      if (res) {
        toast(`Success! Please check the email sent at ${data.email}`, {
          type: "success",
          position: "top-center",
        });
        router.push("/");
      }
    } catch (err) {
      toast("An error occured, please try again", {
        type: "error",
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const emailConstraints = {
    required: { value: true, message: "Email is required" },
  };
  const btnClass = clsx("w-full btn", `${loading ? "loading btn-disabled" : ""}`);

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200 py-20">
      <div className="w-full">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-slate-50 p-8 shadow-lg"
          >
            <h1 className="mb-4 text-center text-4xl font-[600]">
              Forgot password?
            </h1>
            <FormInput
              label="Email"
              name="email"
              type="email"
              constraints={emailConstraints}
            />

            <div>
              <button className={btnClass}>Submit</button>
            </div>
            <div className="text-center">
              <Link href="/login" className="text-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default ForgotPassword;
