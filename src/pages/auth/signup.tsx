import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import { SignupForm } from "src/auth/components/SignupForm";
import { BlitzPage, Routes } from "@blitzjs/next";
import BaseLayout from "src/core/layouts/BaseLayout";

const SignupPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <BaseLayout title="Sign Up">
      <SignupForm onSuccess={() => router.push(Routes.Home())} />
    </BaseLayout>
  );
};

export default SignupPage;
