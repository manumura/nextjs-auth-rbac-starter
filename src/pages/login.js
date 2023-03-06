import FormInput from "@/components/FormInput";
import Link from "next/link";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

const Login = () => {
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

  const onSubmit = (data) => {
    console.log("data, ", data);
  };

  const emailConstraints = {
    required: { value: true, message: "Email is required" },
  };
  const passwordConstraints = {
    required: { value: true, message: "Password is required" },
  };

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
              <button className="btn-primary btn w-full">Login</button>
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

export const getServerSideProps = async () => {
  return {
    props: {
      requireAuth: false,
      enableAuth: false,
    },
  };
};

export default Login;
