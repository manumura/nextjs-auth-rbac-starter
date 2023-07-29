"use client";

import FormInput from "@/components/FormInput";
import { clearStorage, saveIdToken } from "@/lib/storage";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getUserFromIdToken } from "../../lib/jwt.utils";
import useUserStore from "../../lib/user-store";
import { sleep } from "../../lib/utils";

export default function LoginPage({ error }) {
  const router = useRouter();
  const methods = useForm();
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const userStore = useUserStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle access token expired
    if (error === "401") {
      clearStorage();
      userStore.setUser(undefined);
      toast("Session expired, please login again.", {
        type: "error",
        position: "top-center",
        toastId: "401",
      });
    }

    if (error === "404") {
      toast("Not Found!", {
        type: "error",
        position: "top-center",
        toastId: "404",
      });
    }
  }, [error]);

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
    // const res = await login(data.email, data.password);
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      const user = await getUserFromIdToken(json.idToken);

      userStore.setUser(user);
      toast(`Welcome ${user?.name}!`, {
        type: "success",
        position: "top-center",
      });
      saveIdToken(json.idToken);

      router.replace("/");
      router.refresh();
    } else {
      toast("Login failed! Please check your email and password", {
        type: "error",
        position: "top-center",
      });
    }

    setLoading(false);
  };

  const emailConstraints = {
    required: { value: true, message: "Email is required" },
  };
  const passwordConstraints = {
    required: { value: true, message: "Password is required" },
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
              Login to MyApp
            </h1>
            <FormInput
              label="Email"
              name="email"
              type="email"
              constraints={emailConstraints}
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              constraints={passwordConstraints}
            />

            <div className="text-right">
              <Link href="/forgot-password" className="text-secondary">
                Forgot Password?
              </Link>
            </div>
            <div>
              <button className={btnClass}>Login</button>
            </div>
            <span className="block">
              Need an account?{" "}
              <Link href="/register" className="text-secondary">
                Sign Up Here
              </Link>
            </span>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
