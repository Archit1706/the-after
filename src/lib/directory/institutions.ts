import type { Institution } from "@/lib/domain/schemas";

/**
 * A curated reference directory of organizations people commonly need to
 * notify after a death. Contact details are well-known public channels and
 * are US-oriented; guidance is general, not legal advice. Institution ids
 * match the `institutionRefs` used by the task templates.
 */
export const INSTITUTIONS: Institution[] = [
  {
    id: "social-security",
    name: "Social Security Administration",
    category: "government",
    region: "US",
    description:
      "Reports of death, survivor benefits, and stopping payments that should end.",
    contactMethods: [
      { type: "phone", value: "1-800-772-1213", label: "National line" },
      { type: "web", value: "https://www.ssa.gov", label: "ssa.gov" },
    ],
    requiredDocuments: ["death_certificate"],
    tips: [
      "The funeral home often reports the death — confirm they did.",
      "Ask about the one-time lump-sum death payment and monthly survivor benefits.",
      "Any payment for the month of death or later usually must be returned.",
    ],
  },
  {
    id: "vital-records",
    name: "Vital Records Office",
    category: "government",
    region: "US",
    description:
      "Where certified copies of the death certificate are issued (state or county).",
    contactMethods: [
      {
        type: "web",
        value: "https://www.cdc.gov/nchs/w2w/index.htm",
        label: "Find your state office",
      },
    ],
    requiredDocuments: [],
    tips: [
      "Order 8–12 certified copies up front — most institutions want an original.",
      "The funeral home can usually order these for you.",
    ],
  },
  {
    id: "irs",
    name: "Internal Revenue Service",
    category: "government",
    region: "US",
    description: "Final income tax return and estate tax questions.",
    contactMethods: [
      { type: "phone", value: "1-800-829-1040", label: "Individual line" },
      { type: "web", value: "https://www.irs.gov", label: "irs.gov" },
    ],
    requiredDocuments: ["death_certificate"],
    tips: [
      "A final return is usually due for the year of death by the normal deadline.",
      "Consider a tax professional if the estate earned income.",
    ],
  },
  {
    id: "credit-bureaus",
    name: "Credit Bureaus",
    category: "credit_bureau",
    region: "US",
    description:
      "Flag the file as deceased to prevent identity theft, and request a report of open accounts.",
    contactMethods: [
      { type: "phone", value: "1-888-397-3742", label: "Experian" },
      { type: "phone", value: "1-800-685-1111", label: "Equifax" },
      { type: "phone", value: "1-800-916-8800", label: "TransUnion" },
    ],
    requiredDocuments: ["death_certificate"],
    tips: [
      "Notifying one bureau often flags the others, but contacting all three is safest.",
      "Request the credit report to find accounts you didn't know about.",
    ],
  },
  {
    id: "postal-service",
    name: "Postal Service",
    category: "government",
    region: "US",
    description: "Forward or hold mail so nothing important is missed.",
    contactMethods: [
      { type: "web", value: "https://www.usps.com", label: "usps.com" },
    ],
    requiredDocuments: [],
    tips: [
      "Forwarding mail to yourself reveals accounts and bills you may not know about.",
    ],
  },
  {
    id: "medicare",
    name: "Medicare",
    category: "healthcare",
    region: "US",
    description: "Health coverage for those 65+ or with certain conditions.",
    contactMethods: [
      { type: "phone", value: "1-800-633-4227", label: "1-800-MEDICARE" },
      { type: "web", value: "https://www.medicare.gov", label: "medicare.gov" },
    ],
    requiredDocuments: ["death_certificate"],
    tips: ["Reporting to Social Security usually notifies Medicare too."],
  },
  {
    id: "va",
    name: "Veterans Affairs",
    category: "government",
    region: "US",
    description:
      "Burial benefits, survivor pensions, and military honors for those who served.",
    contactMethods: [
      { type: "phone", value: "1-800-827-1000", label: "VA benefits" },
      { type: "web", value: "https://www.va.gov", label: "va.gov" },
    ],
    requiredDocuments: ["death_certificate"],
    tips: [
      "Ask about burial allowance, a headstone or marker, and a burial flag.",
    ],
  },
  {
    id: "bank-generic",
    name: "Banks & Credit Unions",
    category: "bank",
    region: "US",
    description:
      "Notify each institution where they held accounts, loans, or safe deposit boxes.",
    contactMethods: [],
    requiredDocuments: ["death_certificate"],
    tips: [
      "Ask for the 'bereavement' or 'estate' team — they handle this daily.",
      "Joint accounts usually pass to the survivor; sole accounts are frozen and released via the estate.",
      "Don't move money from a sole account until you have legal authority.",
    ],
  },
  {
    id: "dmv",
    name: "Motor Vehicle Agency",
    category: "government",
    region: "US",
    description: "Cancel the driver's license and transfer vehicle titles.",
    contactMethods: [],
    requiredDocuments: ["death_certificate", "vehicle_title"],
    tips: [
      "Rules vary by state — search your state's DMV for 'deceased owner'.",
      "Canceling the license helps prevent identity theft.",
    ],
  },
  {
    id: "google-legacy",
    name: "Google",
    category: "digital",
    region: "US",
    description:
      "Close the account or request data via the Inactive Account Manager process.",
    contactMethods: [
      {
        type: "web",
        value: "https://support.google.com/accounts/answer/6357590",
        label: "Google account help",
      },
    ],
    requiredDocuments: ["death_certificate", "id"],
    tips: ["You can request data or account closure for a deceased person."],
  },
  {
    id: "apple-legacy",
    name: "Apple",
    category: "digital",
    region: "US",
    description: "Access or close an Apple ID via Digital Legacy or a request.",
    contactMethods: [
      {
        type: "web",
        value: "https://support.apple.com/en-us/102631",
        label: "Apple Digital Legacy",
      },
    ],
    requiredDocuments: ["death_certificate"],
    tips: [
      "A Legacy Contact (if set up) makes access much simpler.",
    ],
  },
  {
    id: "meta-legacy",
    name: "Facebook & Instagram",
    category: "digital",
    region: "US",
    description: "Memorialize or remove their social accounts.",
    contactMethods: [
      {
        type: "web",
        value: "https://www.facebook.com/help/1506822589577997",
        label: "Memorialization request",
      },
    ],
    requiredDocuments: ["death_certificate"],
    tips: [
      "Memorializing preserves the profile; removal deletes it. Consider saving photos first.",
    ],
  },
  {
    id: "employer",
    name: "Employer",
    category: "employer",
    region: "US",
    description: "Final pay, benefits, group life insurance, and retirement plans.",
    contactMethods: [],
    requiredDocuments: ["death_certificate"],
    tips: [
      "Ask HR about final wages, unused leave, and any 401(k) or life insurance beneficiary.",
    ],
  },
  {
    id: "insurer-generic",
    name: "Insurance Companies",
    category: "insurance",
    region: "US",
    description: "Life, home, auto, and health policies — claims and cancellations.",
    contactMethods: [],
    requiredDocuments: ["death_certificate", "insurance_policy"],
    tips: [
      "File life insurance claims to access funds you may need soon.",
      "Update or cancel home and auto policies once plans are settled.",
    ],
  },
  {
    id: "utilities-generic",
    name: "Utilities & Services",
    category: "utility",
    region: "US",
    description: "Electricity, gas, water, internet, phone, and similar accounts.",
    contactMethods: [],
    requiredDocuments: [],
    tips: [
      "Keep essentials running until there's a plan for the property.",
      "Transfer needed services into the estate's or your name.",
    ],
  },
  {
    id: "subscriptions-generic",
    name: "Subscriptions & Memberships",
    category: "subscription",
    region: "US",
    description: "Streaming, software, gyms, clubs, and recurring charges.",
    contactMethods: [],
    requiredDocuments: [],
    tips: [
      "Skim recent statements for anything recurring — they add up.",
      "You can do these a few at a time; there's no rush.",
    ],
  },
];

const INSTITUTION_MAP = new Map(INSTITUTIONS.map((i) => [i.id, i]));

export function getInstitution(id: string): Institution | undefined {
  return INSTITUTION_MAP.get(id);
}
