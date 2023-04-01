import { LabeledTextField } from "src/core/components/LabeledTextField";
import { Form, FORM_ERROR } from "src/core/components/Form";
import signup from "src/auth/mutations/signup";
import { Signup } from "src/auth/validations";
import { useMutation } from "@blitzjs/rpc";
import { Routes } from "@blitzjs/next";
import Link from "next/link";

type SignupFormProps = {
  onSuccess?: () => void;
};

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation] = useMutation(signup);
  return (
    <div>
      <h1>Create an Account</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values);
            props.onSuccess?.();
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
              // This error comes from Prisma
              return { email: "This email is already being used" };
            } else {
              return { [FORM_ERROR]: error.toString() };
            }
          }
        }}
      >
        <LabeledTextField
          name="email"
          label="Email"
          placeholder="Email"
          className="w-full lg:max-w-md"
        />
        <LabeledTextField
          name="password"
          label="Password"
          placeholder="Password"
          type="password"
          className="w-full lg:max-w-md"
        />
      </Form>

      <div style={{ marginTop: "1rem" }}>
        Or{" "}
        <Link href={Routes.LoginPage()} className="btn btn-outline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
