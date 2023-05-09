"use client";

import { updateProfile } from "@/lib/api";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormInput from "../components/FormInput";
import { sleep } from "../lib/util";

export default function EditProfilePage({ user }) {
  const router = useRouter();
  const methods = useForm({
    defaultValues: {
      name: user.name,
      password: "",
      passwordConfirm: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const {
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
    setError,
  } = methods;

  const onSubmit = async (data) => {
    if (!data || loading) {
      return;
    }

    if (!data.name && !data.password) {
      setError("name", { message: "Please edit at least 1 field" });
      setError("password", { message: "Please edit at least 1 field" });
      return;
    }

    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await updateProfile(data.name, data.password);

      if (res) {
        toast(`Profile successfully updated!`, {
          type: "success",
          position: "top-center",
        });
        router.push("/profile");
      }
    } catch (err) {
      console.error(err.message);
      toast("Profile update failed!", {
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
  const passwordConstraints = {
    // required: { value: true, message: "Password is required" },
    minLength: {
      value: 8,
      message: "Password is min 8 characters",
    },
  };
  const passwordConfirmConstraints = {
    // required: { value: true, message: "Confirm Password is required" },
    validate: (value) => {
      if (watch("password") !== value) {
        return "Passwords do no match";
      }
    },
  };
  const btnClass = clsx(
    "btn-primary btn",
    `${loading ? "loading btn-disabled" : ""}`,
  );

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex max-w-2xl flex-col items-center overflow-hidden py-20"
        >
          <div className="card w-3/4 bg-slate-50 shadow-xl">
            <div className="card-body">
              <div className="card-title">
                <h1>Edit my Profile</h1>
              </div>
              <FormInput
                label="Full Name"
                name="name"
                constraints={nameConstraints}
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
              <div className="card-actions justify-end">
                <div>
                  <button
                    type="button"
                    className="btn-outline btn-accent btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div>
                  <button className={btnClass}>Save</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </section>
  );
}
