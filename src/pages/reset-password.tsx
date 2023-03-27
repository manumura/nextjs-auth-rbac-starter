import FormInput from "@/components/FormInput";
import {
  axiosInstance,
  forgotPassword,
  getUserByToken,
  resetPassword,
} from "@/lib/api";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { sleep } from "../lib/util";

export async function getServerSideProps({ req, query }) {
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

  const token = query.token;
  if (!token) {
    return {
      redirect: {
        permanent: false,
        destination: "/error?code=404",
      },
      props: {},
    };
  }

  try {
    const response = await getUserByToken(token);
    const user = response.data;
    return { props: { token, user } };
  } catch (err) {
    console.error(
      "Reset Password getServerSideProps error: ",
      err.response?.data,
    );
    return {
      redirect: {
        permanent: false,
        destination: `/error?code=${err.response?.data?.statusCode}`,
      },
      props: {},
    };
  }
}

const ResetPassword = ({ token, user }) => {
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

    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await resetPassword(data.password, token);

      if (res) {
        toast("Password successfully updated!", {
          type: "success",
          position: "top-center",
        });
        router.push("/login");
      }
    } catch (err) {
      console.error(err.message);
      toast(`Password update failed: ${err.response?.data?.message}`, {
        type: "error",
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
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
};

export default ResetPassword;
