import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { ProfileForm } from "@/components/settings/profile-form";

export const metadata = buildMetadata({ title: "Settings", noIndex: true });

export default async function SettingsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true, role: true, createdAt: true } }),
    prisma.profile.findUnique({ where: { userId }, select: { timezone: true } }),
  ]);

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-display-m font-medium">Settings</h1>

      {/* Account info */}
      <section className="mt-10">
        <h2 className="eyebrow mb-4">Account</h2>
        <div className="divide-y divide-border rounded-r3 border border-border">
          <dl className="flex items-center gap-4 px-5 py-4">
            <dt className="w-24 flex-shrink-0 font-mono text-label-mono uppercase text-muted-foreground">Email</dt>
            <dd className="text-body-m">{user?.email}</dd>
          </dl>
          <dl className="flex items-center gap-4 px-5 py-4">
            <dt className="w-24 flex-shrink-0 font-mono text-label-mono uppercase text-muted-foreground">Member since</dt>
            <dd className="text-body-m">
              {user?.createdAt
                ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(user.createdAt)
                : "—"}
            </dd>
          </dl>
          <dl className="flex items-center gap-4 px-5 py-4">
            <dt className="w-24 flex-shrink-0 font-mono text-label-mono uppercase text-muted-foreground">Plan</dt>
            <dd className="text-body-m capitalize">{user?.role?.toLowerCase() ?? "Free"}</dd>
          </dl>
        </div>
      </section>

      {/* Profile */}
      <section className="mt-10">
        <h2 className="eyebrow mb-4">Profile</h2>
        <ProfileForm
          initialName={user?.name ?? ""}
          initialTimezone={profile?.timezone ?? ""}
        />
      </section>

      {/* Sign out */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="eyebrow mb-4">Session</h2>
        <p className="mb-4 text-body-s text-muted-foreground">
          Signing out ends your session on this device. Your data stays where you left it.
        </p>
        <form action={handleSignOut}>
          <Button type="submit" variant="secondary">Sign out</Button>
        </form>
      </section>

      {/* Data & deletion — placeholder */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="eyebrow mb-4">Your data</h2>
        <p className="text-body-s text-muted-foreground">
          You can export your journal and Ledger as JSON, or request full account deletion, at any time.
          Both options arrive in this section when you have data to export.
        </p>
      </section>
    </div>
  );
}
