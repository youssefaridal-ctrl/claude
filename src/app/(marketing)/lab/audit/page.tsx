import { AuditFlow } from "@/components/audit/audit-flow";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The Inner Dialogue Audit — free, 4 minutes, no signup",
  description:
    "Twelve honest questions. Meet the narrator that runs your inner monologue — and get your Dialogue Profile immediately, before we ever ask for an email.",
  path: "/lab/audit",
});

export default function AuditPage() {
  return (
    <div className="container">
      <p className="sr-only">
        This is a self-reflection tool, not a diagnosis. Honest answers beat impressive ones.
      </p>
      <AuditFlow />
    </div>
  );
}
