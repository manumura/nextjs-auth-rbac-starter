import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getUser, updateUser } from "../../lib/api";

const EditUser = () => {
  const router = useRouter();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      role: '',
    },
  });
  const { handleSubmit, watch, reset } = methods;

  const doGetUser = async (id, signal) => {
    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await getUser(id, signal);
      if (res?.data) {
        const user = res.data;
        setUser(user);
        reset({
          name: user.name,
          email: user.email,
          role: user.role,
      });
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error(error.message);
        /* Logic for non-aborted error handling goes here. */
        if (error.response?.data?.statusCode === 404) {
          router.push("/users");
          toast("User not found!", {
            type: "error",
            position: "top-center",
          });
        }

        if (error.response?.data?.statusCode === 401) {
          router.push(`/login?error=${error?.response?.data?.statusCode}`);
        }
      }
    } finally {
      setLoading(false);
    }

    // TODO test to remove
    function sleep(ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const abortController = new AbortController();
    doGetUser(router.query.id, abortController.signal);

    /* 
      Abort the request as it isn't needed anymore, the component being 
      unmounted. It helps avoid, among other things, the well-known "can't
      perform a React state update on an unmounted component" warning.
    */
    return () => abortController.abort();
  }, [router.isReady, router.query.id]);

  const onSubmit = async (data) => {
    console.log('data ', data);
    if (!data) {
      return;
    }

    try {
      setSubmitting(true);
      // TODO remove this
      await sleep(1000);
      const res = await updateUser(router.query.id, data.name, data.email, data.role, data.password);

      if (res) {
        toast(`User successfully updated: ${res.data.name}`, {
          type: "success",
          position: "top-center",
        });
        router.back();
      }
    } catch (err) {
      console.error(err.message);
      toast(`User update failed: ${err.response?.data?.message}`, {
        type: "error",
        position: "top-center",
      });
    } finally {
      setSubmitting(false);
    }

    // TODO test to remove
    function sleep(ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }
  };

  const onCancel = () => {
    router.back();
  };

  const loadingSpinner = <LoadingSpinner />;

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

  const btnClass = clsx("btn-primary btn mx-1", `${submitting ? "loading" : ""}`);

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
            <button
              type="button"
              id="btn-cancel"
              className="btn-outline btn mx-1"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button className={btnClass}>Save</button>
          </div>
        </form>
      </FormProvider>
    </div>
  );

  return (
    <section className="h-[calc(100vh-72px)] bg-slate-200">
      {loading || !user ? loadingSpinner : editUserForm}
    </section>
  );
};

export default EditUser;
