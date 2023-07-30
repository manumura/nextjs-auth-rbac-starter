"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormInput from "../../../components/FormInput";
import FormSelect from "../../../components/FormSelect";
import { sleep } from "../../../lib/utils";

export default function EditUserPage({ user }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const methods = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      passwordConfirm: "",
      role: user.role,
    },
  });
  const { handleSubmit, watch } = methods;

  const onSubmit = async (data) => {
    if (!data || submitting) {
      return;
    }

    setSubmitting(true);
    // TODO remove this
    await sleep(1000);
    // const res = await updateUser(
    //   user.id,
    //   data.name,
    //   data.email,
    //   data.role,
    //   data.password,
    // );
    const body = {
      name: data.name,
      email: data.email,
      role: data.role,
      ...(data.password ? { password: data.password } : {}),
    };
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    const json = await res.json();

    if (res.ok) {
      toast(`User successfully updated: ${json.name}`, {
        type: "success",
        position: "top-center",
      });
      router.back();
      router.refresh();
    } else {
      toast(`Error updating user: ${json.message}`, {
        type: "error",
        position: "top-center",
      });
    }

    setSubmitting(false);
  };

  const onCancel = () => {
    router.back();
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
  const roleConstraints = {
    required: { value: true, message: "Role is required" },
  };

  const roles = [
    { label: "--- Please select a role ---", value: "" },
    { label: "Admin", value: "ADMIN" },
    { label: "User", value: "USER" },
  ];

  const btn = (
    <button className="btn btn-primary mx-1">
      Save
    </button>
  );
  const btnLoading = (
    <button className="btn btn-primary mx-1 btn-disabled">
      <span className="loading loading-spinner"></span>
      Save
    </button>
  );

  const editUserForm = (
    <div className="w-full py-10">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-slate-50 p-8 shadow-lg"
        >
          <h2 className="mb-4 text-center text-2xl font-[600]">Edit user</h2>
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
          <FormSelect
            label="Role"
            name="role"
            options={roles}
            constraints={roleConstraints}
          />
          <div className="flex justify-center space-x-5">
            {submitting ? btnLoading : btn}
            <button
              type="button"
              id="btn-cancel"
              className="btn-outline btn mx-1"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      {editUserForm}
    </section>
  );
}
