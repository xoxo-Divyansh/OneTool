import RegisterForm from "@/components/auth/RegisterForm";
import { getAuthenticatedUserId } from "@/lib/auth/requireAuth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const userId = await getAuthenticatedUserId();
  if (userId) {
    redirect("/dashboard");
  }
  return <RegisterForm />;
}
