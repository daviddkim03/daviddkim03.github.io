import { AdminEditor } from "@/components/admin/AdminEditor";
import { getLeanProjects } from "@/lib/projects";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  const projects = getLeanProjects().map((p) => ({ slug: p.slug, title: p.title }));
  return <AdminEditor projects={projects} />;
}
