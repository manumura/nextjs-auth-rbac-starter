import FormInput from "@/components/FormInput";
import { register } from "@/server/api";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Register = () => {
  const router = useRouter();
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors, isSubmitSuccessful },
    watch,
  } = methods;

  const onSubmit = async (data) => {
    console.log(data);

    if (data) {
      try {
        setLoading(true);
        // TODO remove this
        await sleep(1000);
        const res = await register(data.email, data.password, data.name);
        console.log(res.data);

        if (res) {
          toast(`You are successfully registered ${res.data.name}!`, {
            type: "success",
            position: "top-right",
          });
          router.push("/login");
        }
      } catch (err) {
        console.error(err);
        toast('Registration failed! Did you already register with this email?', {
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
      message: "Password is min 8 characters"
    },
  };
  const passwordConfirmConstraints = {
    required: { value: true, message: "Confirm Password is required" },
    validate: (value) => {
      if (watch('password') !== value) {
        return "Passwords do no match";
      }
    },
  };
  const btnClass = clsx("w-full btn", `${loading ? "loading" : ""}`);

  return (
    <section className="grid min-h-screen bg-primary py-20">
      <div className="w-full">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-md space-y-5 overflow-hidden rounded-2xl bg-secondary p-8 shadow-lg"
          >
            <h1 className="text-ct-yellow-600 mb-4 text-center text-4xl font-[600] xl:text-6xl">
              Register to MyApp!
            </h1>
            <FormInput label="Full Name" name="name" constraints={nameConstraints} />
            <FormInput label="Email" name="email" type="email" constraints={emailConstraints} />
            <FormInput label="Password" name="password" type="password" constraints={passwordConstraints} />
            <FormInput
              label="Confirm Password"
              name="passwordConfirm"
              type="password"
              constraints={passwordConfirmConstraints}
            />
            <span className="block">
              Already have an account?{" "}
              <Link href="/login" className="text-primary">
                Login Here
              </Link>
            </span>
            <div>
              <button className={btnClass}>Register</button>
            </div>
          </form>
        </FormProvider>
      </div>
    </section>
  );
};

export default Register;