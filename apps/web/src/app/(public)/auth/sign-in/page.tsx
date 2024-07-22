import { Suspense } from "react";
import { SignInForm } from "./signInForm";

export default function SignIn() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
