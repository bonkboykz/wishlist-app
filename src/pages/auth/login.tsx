import { BlitzPage } from "@blitzjs/next";
import Layout from "src/core/layouts/Layout";
import { LoginForm } from "src/auth/components/LoginForm";
import { useRouter } from "next/router";
import BaseLayout from "src/core/layouts/BaseLayout";

const LoginPage: BlitzPage = () => {
  const router = useRouter();

  return (
    <BaseLayout title="Log In">
      <LoginForm
        onSuccess={(_user) => {
          const next = router.query.next ? decodeURIComponent(router.query.next as string) : "/";
          return router.push(next);
        }}
      />
    </BaseLayout>
  );
};

export default LoginPage;
