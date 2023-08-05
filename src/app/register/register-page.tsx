"use client";

import FormInput from "@/components/FormInput";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { sleep } from "../../lib/utils";
import { register } from "../../lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
  } = methods;

  const onSubmit = async (data) => {
    if (!data || loading) {
      return;
    }

    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await register(data.email, data.password, data.name);
      const response = res?.data;

      if (response) {
        toast(`You are successfully registered ${response.name}!`, {
          type: "success",
          position: "top-center",
        });
        router.push("/login");
      } else {
        toast(
          "Registration failed! Did you already register with this email?",
          {
            type: "error",
            position: "top-center",
          },
        );
      }
    } catch (error) {
      toast("Registration failed! Did you already register with this email?", {
        type: "error",
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const nameConstraints = {
    required: { value: true, message: "Full Name is required" },
    minLength: {
      value: 5,
      message: "Full Name is min 5 characters",
    },
  };
  const emailConstraints = {
    required: { value: true, message: "Email is required" },
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
  const btn = <button className="w-full btn">Register</button>;
  const btnLoading = (
    <button className="w-full btn btn-disabled">
      <span className="loading loading-spinner"></span>
      Register
    </button>
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
              Register to MyApp!
            </h1>
            <FormInput
              label="Full Name"
              name="name"
              constraints={nameConstraints}
            />
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
            <FormInput
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
              constraints={passwordConfirmConstraints}
            />
            <span className="block">
              Already have an account?{" "}
              <Link href="/login" className="text-secondary">
                Login Here
              </Link>
            </span>
            <div>{loading ? btnLoading : btn}</div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
