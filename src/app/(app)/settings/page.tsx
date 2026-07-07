import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";
import { ProfileForm } from "@/components/settings/profile-form";

export const metadata = buildMetadata({ title: "الإعدادات", noIndex: true });

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
      <h1 className="text-display-m font-medium">الإعدادات</h1>

      {/* Account info */}
      <section className="mt-10">
        <h2 className="eyebrow mb-4">الحساب</h2>
        <div className="divide-y divide-border rounded-r3 border border-border">
          <dl className="flex items-center gap-4 px-5 py-4">
            <dt className="w-28 flex-shrink-0 font-mono text-label-mono uppercase text-muted-foreground">البريد</dt>
            <dd className="text-body-m">{user?.email}</dd>
          </dl>
          <dl className="flex items-center gap-4 px-5 py-4">
            <dt className="w-28 flex-shrink-0 font-mono text-label-mono uppercase text-muted-foreground">عضو منذ</dt>
            <dd className="text-body-m">
              {user?.createdAt
                ? new Intl.DateTimeFormat("ar-SA", { month: "long", year: "numeric" }).format(user.createdAt)
                : "—"}
            </dd>
          </dl>
          <dl className="flex items-center gap-4 px-5 py-4">
            <dt className="w-28 flex-shrink-0 font-mono text-label-mono uppercase text-muted-foreground">الخطة</dt>
            <dd className="text-body-m">{user?.role === "FREE" ? "مجاني" : user?.role === "MEMBER" ? "عضو" : user?.role?.toLowerCase() ?? "مجاني"}</dd>
          </dl>
        </div>
      </section>

      {/* Profile */}
      <section className="mt-10">
        <h2 className="eyebrow mb-4">الملف الشخصي</h2>
        <ProfileForm
          initialName={user?.name ?? ""}
          initialTimezone={profile?.timezone ?? ""}
        />
      </section>

      {/* Sign out */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="eyebrow mb-4">الجلسة</h2>
        <p className="mb-4 text-body-s text-muted-foreground">
          تسجيل الخروج ينهي جلستك على هذا الجهاز. بياناتك تبقى في مكانها.
        </p>
        <form action={handleSignOut}>
          <Button type="submit" variant="secondary">تسجيل الخروج</Button>
        </form>
      </section>

      {/* Data & deletion — placeholder */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="eyebrow mb-4">بياناتك</h2>
        <p className="text-body-s text-muted-foreground">
          يمكنك تصدير مجلتك وسجلّك بصيغة JSON، أو طلب حذف الحساب بالكامل، في أي وقت.
          كلا الخيارين سيظهران هنا حين يكون لديك بيانات للتصدير.
        </p>
      </section>
    </div>
  );
}
