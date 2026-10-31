
import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Create Account",
  description: "Create your StudioSpace account.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
