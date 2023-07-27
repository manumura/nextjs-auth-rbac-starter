"use client";

import FormInput from "@/components/FormInput";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormSelect from "../../components/FormSelect";
import { sleep } from "../../lib/util";

export default function CreateUserPage() {
  const router = useRouter();
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const { handleSubmit } = methods;

  const onSubmit = async (data) => {
    if (!data || loading) {
      return;
    }

    setLoading(true);
    // TODO remove this
    await sleep(1000);
    // const res = await createUser(data.email, data.name, data.role);
    const body = {
      email: data.email,
      name: data.name,
      role: data.role,
    };
    const res = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (res.ok) {
      toast(`User successfully created: ${json.name}`, {
        type: "success",
        position: "top-center",
      });
      router.push("/users");
    } else {
      toast(`User creation failed: ${json.message}`, {
        type: "error",
        position: "top-center",
      });
    }

    setLoading(false);
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
  const roleConstraints = {
    required: { value: true, message: "Role is required" },
  };

  const roles = [
    { label: "--- Please select a role ---", value: "" },
    { label: "Admin", value: "ADMIN" },
    { label: "User", value: "USER" },
  ];

  const btnClass = clsx(
    "btn-primary btn mx-1",
    `${loading ? "loading btn-disabled" : ""}`,
  );

  const onCancel = () => {
    router.back();
  };

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200 py-20">
      <div className="w-full">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-slate-50 p-8 shadow-lg"
          >
            <h2 className="mb-4 text-center text-2xl font-[600]">
              Create a new user
            </h2>
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
            <FormSelect
              label="Role"
              name="role"
              options={roles}
              constraints={roleConstraints}
            />
            <div className="flex justify-center space-x-5">
              <button
                type="button"
                id="btn-cancel"
                className="btn-outline btn mx-1"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button className={btnClass}>Create</button>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
}
