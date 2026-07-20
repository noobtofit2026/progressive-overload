import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: sets } = await supabase
    .from("sets")
    .select("*")
    .order("performed_at", { ascending: false })
    .order("created_at", { ascending: false });

  return <DashboardClient initialSets={sets ?? []} userEmail={user.email ?? ""} />;
}
