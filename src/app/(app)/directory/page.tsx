import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { DirectoryBrowser } from "@/components/directory/directory-browser";
import { INSTITUTIONS } from "@/lib/directory/institutions";

export const metadata = { title: "Who to notify" };

export default async function DirectoryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/begin");
  const primary = await getPrimaryCase(user.id);
  if (!primary) redirect("/begin");

  const caseInstitutions = await getRepository().listCaseInstitutions(
    primary.id
  );
  const tracked = caseInstitutions
    .filter((ci) => ci.institutionId)
    .map((ci) => ({
      id: ci.id,
      institutionId: ci.institutionId as string,
      status: ci.status,
    }));

  return (
    <PageContainer>
      <PageHeader
        title="Who to notify"
        description="A directory of the organizations people often need to contact — how to reach them, what they'll ask for, and a few tips. Add any to your own list to track your progress."
      />
      <DirectoryBrowser institutions={INSTITUTIONS} tracked={tracked} />
    </PageContainer>
  );
}
