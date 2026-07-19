import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { getPrimaryCase } from "@/lib/services/case-service";
import { getRepository } from "@/lib/db";
import { PageContainer, PageHeader } from "@/components/app/page-header";
import { DirectoryBrowser } from "@/components/directory/directory-browser";
import { getDirectoryForCountry } from "@/lib/directory/institutions";

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

  const country = primary.profile.jurisdiction?.country;
  const { institutions, countryCode, countryLabel, matched } =
    getDirectoryForCountry(country);

  // A gentle banner only when the region is worth calling out.
  let notice: string | undefined;
  if (!matched) {
    notice = `We don't have a detailed government directory for ${countryLabel} yet, so this shows the organizations that apply everywhere. Your Companion can help you find the specific bodies — tax, benefits, death registration — for ${countryLabel}.`;
  } else if (countryCode !== "US") {
    notice = `Tailored for ${countryLabel}. These are a starting point — please confirm contact details, as processes can vary locally.`;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Who to notify"
        description="A directory of the organizations people often need to contact — how to reach them, what they'll ask for, and a few tips. Add any to your own list to track your progress."
      />
      <DirectoryBrowser
        institutions={institutions}
        tracked={tracked}
        notice={notice}
      />
    </PageContainer>
  );
}
