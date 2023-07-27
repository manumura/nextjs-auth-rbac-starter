"use client";

import FormInput from "@/components/FormInput";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { sleep } from "../../lib/util";

export default function ForgotPasswordPage() {
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

    setLoading(true);
    // TODO remove this
    await sleep(1000);
    // const res = await forgotPassword(data.email);
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast(`Success! Please check the email sent at ${data.email}`, {
        type: "success",
        position: "top-center",
      });
      router.push("/");
    } else {
      toast("An error occured, please try again", {
        type: "error",
        position: "top-center",
      });
    }

    setLoading(false);
  };

  const emailConstraints = {
    required: { value: true, message: "Email is required" },
  };
  const btnClass = clsx(
    "w-full btn",
    `${loading ? "loading btn-disabled" : ""}`,
  );

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
}
