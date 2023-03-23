import FormInput from "@/components/FormInput";
import { login } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { clearStorage, saveUser } from "@/lib/storage";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

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

  const props = query?.error
    ? {
        error: query?.error,
      }
    : {};

  return {
    props,
  };
}

const Login = ({ error }) => {
  const router = useRouter();
  const methods = useForm();
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Handle access token expired
    if (error === "401") {
      clearStorage();
      setUser(null);
      toast("Session expired, please login again.", {
        type: "error",
        position: "top-center",
        toastId: "401",
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
    if (!data) {
      return;
    }
    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await login(data.email, data.password);

      if (res) {
        toast(`Welcome ${res.data.user.name}!`, {
          type: "success",
          position: "top-center",
        });
        setUser(res.data.user);
        saveUser(res.data.user);
        router.push("/");
      }
    } catch (err) {
      toast("Login failed! Please check your email and password.", {
        type: "error",
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }

    // TODO test to remove
    function sleep(ms) {
      return new Promise((resolve, reject) => setTimeout(resolve, ms));
    }
  };

  const emailConstraints = {
    required: { value: true, message: "Email is required" },
  };
  const passwordConstraints = {
    required: { value: true, message: "Password is required" },
  };
  const btnClass = clsx("w-full btn", `${loading ? "loading" : ""}`);

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
              <Link href="#" className="text-secondary">
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
};

export default Login;
