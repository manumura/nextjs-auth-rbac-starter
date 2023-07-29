"use client";

import FormInput from "@/components/FormInput";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { sleep } from "../../lib/utils";

export default function ResetPasswordPage({ token }) {
  const router = useRouter();
  const methods = useForm();
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
    watch,
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
    // const res = await resetPassword(data.password, token);
    const body = {
      password: data.password,
      token,
    };
    const res = await fetch("/api/reset-password", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (res.ok) {
      toast("Password successfully updated!", {
        type: "success",
        position: "top-center",
      });
      router.push("/login");
    } else {
      toast("Password update failed", {
        type: "error",
        position: "top-center",
      });
    }

    setLoading(false);
  };

  const passwordConstraints = {
    required: { value: true, message: "Password is required" },
    minLength: {
      value: 8,
      message: "Password is min 8 characters",
    },
  };
  const passwordConfirmConstraints = {
    required: { value: true, message: "Confirm Password is required" },
    validate: (value) => {
      if (watch("password") !== value) {
        return "Passwords do no match";
      }
    },
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
              Reset password
            </h1>
            <FormInput
              label="New Password"
              name="password"
              type="password"
              constraints={passwordConstraints}
            />
            <FormInput
              label="Confirm New Password"
              name="passwordConfirm"
              type="password"
              constraints={passwordConfirmConstraints}
            />

            <div>
              <button className={btnClass}>Submit</button>
            </div>
            <div className="text-center">
              <Link href="/" className="text-secondary">
                Cancel
              </Link>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
