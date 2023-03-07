import FormInput from "@/components/FormInput";
import { useAuth } from "@/lib/AuthContext";
import { login } from "@/server/api";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

// export const getServerSideProps = async () => {
//   return {
//     props: {
//       requireAuth: false,
//       enableAuth: false,
//     },
//   };
// };

const Login = () => {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const methods = useForm();
  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmit = async (data) => {
    if (data) {
      try {
        setLoading(true);
        // TODO remove this
        await sleep(1000);
        const res = await login(data.email, data.password);
        console.log(res);

        if (res) {
          toast(`Welcome ${res.data.user.name}!`, {
            type: "success",
            position: "top-right",
          });
          setUser(res.data.user);
          router.push("/");
        }
      } catch (err) {
        console.error(err);

        toast('Login failed! Please check your email and password.', {
          type: "error",
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
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
    <section className="grid min-h-screen place-items-center bg-primary">
      <div className="w-full">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-secondary p-8 shadow-lg"
          >
            <h1 className="text-ct-yellow-600 mb-4 text-center text-4xl font-[600] xl:text-6xl">
              MyApp
            </h1>
            <h2 className="text-ct-dark-200 mb-4 text-center text-lg">
              Please Login
            </h2>
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

            <div className="text-right text-primary">
              <Link href="#" className="">
                Forgot Password?
              </Link>
            </div>
            <div>
              <button className={btnClass}>Login</button>
            </div>
            <span className="block">
              Need an account?{" "}
              <Link href="/register" className="text-primary">
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
