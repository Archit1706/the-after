import type { Institution } from "@/lib/domain/schemas";

/**
 * A curated reference directory of organizations people commonly need to
 * notify after a death.
 *
 * The directory is region-aware. `UNIVERSAL_INSTITUTIONS` apply everywhere
 * (banks, employers, insurers, utilities, subscriptions, global digital
 * accounts). `REGION_INSTITUTIONS` holds the country-specific government and
 * benefit bodies for each supported country. `getDirectoryForCountry()` merges
 * the right region with the universal set based on the case's jurisdiction.
 *
 * Contact details are well-known public channels; guidance is general, not
 * legal advice, and processes vary locally — always verify anything important.
 * Institution ids are stable and match the `institutionRefs` used by the task
 * templates, so existing links keep resolving via `getInstitution()`.
 */

// --- Universal: applies in every country ------------------------------------
const UNIVERSAL_INSTITUTIONS: Institution[] = [
  {
    id: "bank-generic",
    name: "Banks & Financial Institutions",
    category: "bank",
    region: "global",
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
    id: "employer",
    name: "Employer",
    category: "employer",
    region: "global",
    description: "Final pay, benefits, group life insurance, and retirement plans.",
    contactMethods: [],
    requiredDocuments: ["death_certificate"],
    tips: [
      "Ask HR about final wages, unused leave, and any workplace pension or life insurance beneficiary.",
    ],
  },
  {
    id: "insurer-generic",
    name: "Insurance Companies",
    category: "insurance",
    region: "global",
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
    region: "global",
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
    region: "global",
    description: "Streaming, software, gyms, clubs, and recurring charges.",
    contactMethods: [],
    requiredDocuments: [],
    tips: [
      "Skim recent statements for anything recurring — they add up.",
      "You can do these a few at a time; there's no rush.",
    ],
  },
  {
    id: "google-legacy",
    name: "Google",
    category: "digital",
    region: "global",
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
    region: "global",
    description: "Access or close an Apple ID via Digital Legacy or a request.",
    contactMethods: [
      {
        type: "web",
        value: "https://support.apple.com/en-us/102631",
        label: "Apple Digital Legacy",
      },
    ],
    requiredDocuments: ["death_certificate"],
    tips: ["A Legacy Contact (if set up) makes access much simpler."],
  },
  {
    id: "meta-legacy",
    name: "Facebook & Instagram",
    category: "digital",
    region: "global",
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
];

// --- Region-specific government & benefit bodies ----------------------------
const REGION_INSTITUTIONS: Record<string, Institution[]> = {
  US: [
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
  ],

  GB: [
    {
      id: "gb-tell-us-once",
      name: "Tell Us Once",
      category: "government",
      region: "GB",
      description:
        "A government service that reports a death to most departments (HMRC, DWP, DVLA, Passport Office, local council) in one step.",
      contactMethods: [
        { type: "web", value: "https://www.gov.uk/after-a-death", label: "gov.uk/after-a-death" },
      ],
      requiredDocuments: [],
      tips: [
        "Register the death first — the registrar gives you a Tell Us Once reference.",
        "It saves contacting each government department separately.",
      ],
    },
    {
      id: "gb-register-death",
      name: "Register a Death (GRO)",
      category: "government",
      region: "GB",
      description: "Register the death and order certified copies of the certificate.",
      contactMethods: [
        { type: "web", value: "https://www.gov.uk/register-a-death", label: "gov.uk/register-a-death" },
      ],
      requiredDocuments: [],
      tips: [
        "In England, Wales & NI a death is usually registered within 5 days.",
        "Order several certified copies — many organisations want an original.",
      ],
    },
    {
      id: "gb-hmrc",
      name: "HM Revenue & Customs (HMRC)",
      category: "government",
      region: "GB",
      description: "Income tax and, if the estate is liable, Inheritance Tax.",
      contactMethods: [
        { type: "web", value: "https://www.gov.uk/government/organisations/hm-revenue-customs", label: "HMRC on gov.uk" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: [
        "Tell Us Once can notify HMRC for you.",
        "Check whether Inheritance Tax applies to the estate.",
      ],
    },
    {
      id: "gb-dwp",
      name: "Department for Work and Pensions (DWP)",
      category: "government",
      region: "GB",
      description: "State Pension, benefits, and Bereavement Support Payment.",
      contactMethods: [
        { type: "web", value: "https://www.gov.uk/government/organisations/department-for-work-pensions", label: "DWP on gov.uk" },
      ],
      requiredDocuments: [],
      tips: [
        "Ask about Bereavement Support Payment if you were their spouse or civil partner.",
      ],
    },
    {
      id: "gb-dvla",
      name: "DVLA",
      category: "government",
      region: "GB",
      description: "Cancel a driving licence and update vehicle records.",
      contactMethods: [
        { type: "web", value: "https://www.gov.uk/government/organisations/driver-and-vehicle-licensing-agency", label: "DVLA on gov.uk" },
      ],
      requiredDocuments: [],
      tips: ["Tell Us Once can notify DVLA too."],
    },
    {
      id: "gb-death-notification-service",
      name: "Death Notification Service",
      category: "credit_bureau",
      region: "GB",
      description:
        "A free service to notify multiple banks, building societies, and credit reference agencies at once.",
      contactMethods: [
        { type: "web", value: "https://www.deathnotificationservice.co.uk", label: "deathnotificationservice.co.uk" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Notifies participating institutions and the main credit agencies together."],
    },
  ],

  CA: [
    {
      id: "ca-service-canada",
      name: "Service Canada",
      category: "government",
      region: "CA",
      description:
        "Report the death and apply for the CPP death benefit, survivor's pension, and Old Age Security.",
      contactMethods: [
        { type: "web", value: "https://www.canada.ca", label: "canada.ca" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Ask about the CPP death benefit and survivor's pension."],
    },
    {
      id: "ca-cra",
      name: "Canada Revenue Agency (CRA)",
      category: "government",
      region: "CA",
      description: "Final income tax return and the deceased's tax matters.",
      contactMethods: [
        { type: "web", value: "https://www.canada.ca/en/revenue-agency.html", label: "CRA on canada.ca" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["A final return is generally required for the year of death."],
    },
    {
      id: "ca-vital-statistics",
      name: "Provincial Vital Statistics",
      category: "government",
      region: "CA",
      description:
        "Register the death and order the death certificate (issued by the province or territory).",
      contactMethods: [],
      requiredDocuments: [],
      tips: [
        "Search your province or territory's Vital Statistics office.",
        "Order several certified copies for banks, insurers, and probate.",
      ],
    },
    {
      id: "ca-drivers",
      name: "Provincial Driver & Vehicle Licensing",
      category: "government",
      region: "CA",
      description: "Cancel the driver's licence and transfer vehicle registration.",
      contactMethods: [],
      requiredDocuments: ["death_certificate"],
      tips: ["Rules vary by province — search your provincial service office for 'deceased'."],
    },
  ],

  AU: [
    {
      id: "au-services-australia",
      name: "Services Australia (Centrelink)",
      category: "government",
      region: "AU",
      description: "Report the death and ask about any bereavement payment or pension.",
      contactMethods: [
        { type: "web", value: "https://www.servicesaustralia.gov.au/death-someone-you-know", label: "servicesaustralia.gov.au" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Ask about the Bereavement Payment if they received a pension or benefit."],
    },
    {
      id: "au-ato",
      name: "Australian Taxation Office (ATO)",
      category: "government",
      region: "AU",
      description: "Final tax return and the deceased estate's tax.",
      contactMethods: [
        { type: "web", value: "https://www.ato.gov.au", label: "ato.gov.au" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["You may need to lodge a date-of-death tax return."],
    },
    {
      id: "au-bdm",
      name: "State Births, Deaths & Marriages",
      category: "government",
      region: "AU",
      description: "Register the death and order the certificate (varies by state/territory).",
      contactMethods: [],
      requiredDocuments: [],
      tips: ["The funeral director usually registers the death and can order certificates."],
    },
    {
      id: "au-death-notification",
      name: "Australian Death Notification Service",
      category: "government",
      region: "AU",
      description:
        "A free government service that notifies multiple organisations (banks, telcos, utilities) at once.",
      contactMethods: [
        { type: "web", value: "https://www.adns.gov.au", label: "adns.gov.au" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Contacts participating organisations on your behalf from one request."],
    },
  ],

  IN: [
    {
      id: "in-death-registration",
      name: "Registrar of Births & Deaths",
      category: "government",
      region: "IN",
      description:
        "Register the death with the local municipal body and obtain the death certificate.",
      contactMethods: [
        { type: "web", value: "https://crsorgi.gov.in", label: "crsorgi.gov.in" },
      ],
      requiredDocuments: [],
      tips: [
        "Register within 21 days where possible.",
        "The certificate is needed for almost everything else.",
      ],
    },
    {
      id: "in-income-tax",
      name: "Income Tax Department",
      category: "government",
      region: "IN",
      description: "File the deceased's final income tax return as the legal heir.",
      contactMethods: [
        { type: "web", value: "https://www.incometax.gov.in", label: "incometax.gov.in" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Register as 'legal heir' on the portal to file on their behalf."],
    },
    {
      id: "in-epfo",
      name: "EPFO (Provident Fund)",
      category: "government",
      region: "IN",
      description: "Provident fund, pension (EPS), and EDLI insurance for the nominee.",
      contactMethods: [
        { type: "web", value: "https://www.epfindia.gov.in", label: "epfindia.gov.in" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Nominees can claim PF, pension, and EDLI insurance."],
    },
    {
      id: "in-rto",
      name: "Regional Transport Office (RTO)",
      category: "government",
      region: "IN",
      description: "Transfer of vehicle ownership and driving licence records.",
      contactMethods: [
        { type: "web", value: "https://parivahan.gov.in", label: "parivahan.gov.in" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Vehicle transfer to a legal heir is handled via the RTO / Parivahan portal."],
    },
  ],

  IE: [
    {
      id: "ie-gro",
      name: "General Register Office (GRO)",
      category: "government",
      region: "IE",
      description: "Register the death and obtain death certificates.",
      contactMethods: [
        { type: "web", value: "https://www.gov.ie/en/service/general-register-office", label: "gov.ie" },
      ],
      requiredDocuments: [],
      tips: ["Certificates are needed for probate and most institutions."],
    },
    {
      id: "ie-revenue",
      name: "Revenue",
      category: "government",
      region: "IE",
      description: "The deceased's tax and any Capital Acquisitions Tax.",
      contactMethods: [
        { type: "web", value: "https://www.revenue.ie", label: "revenue.ie" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: [],
    },
    {
      id: "ie-social-protection",
      name: "Department of Social Protection",
      category: "government",
      region: "IE",
      description: "Pensions and bereavement supports.",
      contactMethods: [
        { type: "web", value: "https://www.gov.ie/en/organisation/department-of-social-protection", label: "gov.ie" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Ask about the Widowed or Surviving Civil Partner supports."],
    },
  ],

  NZ: [
    {
      id: "nz-bdm",
      name: "Births, Deaths & Marriages",
      category: "government",
      region: "NZ",
      description: "Register the death and order certificates.",
      contactMethods: [
        { type: "web", value: "https://www.govt.nz/browse/family-and-whanau/deaths", label: "govt.nz" },
      ],
      requiredDocuments: [],
      tips: ["The funeral director usually registers the death for you."],
    },
    {
      id: "nz-ird",
      name: "Inland Revenue (IRD)",
      category: "government",
      region: "NZ",
      description: "The deceased's tax matters.",
      contactMethods: [
        { type: "web", value: "https://www.ird.govt.nz", label: "ird.govt.nz" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: [],
    },
    {
      id: "nz-work-and-income",
      name: "Work and Income",
      category: "government",
      region: "NZ",
      description: "Benefit and pension changes, and bereavement support.",
      contactMethods: [
        { type: "web", value: "https://www.workandincome.govt.nz", label: "workandincome.govt.nz" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Ask about the Funeral Grant and bereavement support."],
    },
  ],

  DE: [
    {
      id: "de-standesamt",
      name: "Standesamt (Registry Office)",
      category: "government",
      region: "DE",
      description: "Register the death and obtain the death certificate (Sterbeurkunde).",
      contactMethods: [],
      requiredDocuments: [],
      tips: [
        "Order several copies of the Sterbeurkunde — banks, insurers, and pensions each want one.",
        "The registry office is at the place of death (local Standesamt).",
      ],
    },
    {
      id: "de-finanzamt",
      name: "Finanzamt (Tax Office)",
      category: "government",
      region: "DE",
      description: "The deceased's income tax and any inheritance tax (Erbschaftsteuer).",
      contactMethods: [],
      requiredDocuments: ["death_certificate"],
      tips: ["Inheritance tax may apply depending on the amount and relationship."],
    },
    {
      id: "de-rentenversicherung",
      name: "Deutsche Rentenversicherung",
      category: "government",
      region: "DE",
      description: "Pension and survivor's pension (Witwen-/Witwerrente).",
      contactMethods: [
        { type: "web", value: "https://www.deutsche-rentenversicherung.de", label: "deutsche-rentenversicherung.de" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Report the death promptly to stop and adjust pension payments."],
    },
  ],

  FR: [
    {
      id: "fr-mairie",
      name: "Mairie (Town Hall)",
      category: "government",
      region: "FR",
      description: "Declare the death and obtain the acte de décès.",
      contactMethods: [
        { type: "web", value: "https://www.service-public.fr", label: "service-public.fr" },
      ],
      requiredDocuments: [],
      tips: ["The death is usually declared within 24 hours (excluding weekends and holidays)."],
    },
    {
      id: "fr-impots",
      name: "Impôts (DGFiP)",
      category: "government",
      region: "FR",
      description: "The deceased's income tax and the succession.",
      contactMethods: [
        { type: "web", value: "https://www.impots.gouv.fr", label: "impots.gouv.fr" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: [],
    },
    {
      id: "fr-assurance-retraite",
      name: "Assurance retraite (CNAV)",
      category: "government",
      region: "FR",
      description: "Pension and survivor's pension (pension de réversion).",
      contactMethods: [
        { type: "web", value: "https://www.lassuranceretraite.fr", label: "lassuranceretraite.fr" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Ask about the pension de réversion for a surviving spouse."],
    },
    {
      id: "fr-cpam",
      name: "Assurance Maladie (CPAM)",
      category: "healthcare",
      region: "FR",
      description: "Health insurance and any capital décès.",
      contactMethods: [
        { type: "web", value: "https://www.ameli.fr", label: "ameli.fr" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: [],
    },
  ],

  ZA: [
    {
      id: "za-home-affairs",
      name: "Department of Home Affairs",
      category: "government",
      region: "ZA",
      description: "Register the death and obtain the death certificate.",
      contactMethods: [
        { type: "web", value: "https://www.dha.gov.za", label: "dha.gov.za" },
      ],
      requiredDocuments: [],
      tips: ["The certificate is needed to report the estate and for most institutions."],
    },
    {
      id: "za-master-high-court",
      name: "Master of the High Court",
      category: "government",
      region: "ZA",
      description: "Report the deceased estate and administer it.",
      contactMethods: [
        { type: "web", value: "https://www.justice.gov.za/master", label: "justice.gov.za" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["Estates generally must be reported to the Master of the High Court."],
    },
    {
      id: "za-sars",
      name: "SARS",
      category: "government",
      region: "ZA",
      description: "The deceased's tax affairs.",
      contactMethods: [
        { type: "web", value: "https://www.sars.gov.za", label: "sars.gov.za" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: [],
    },
  ],

  SG: [
    {
      id: "sg-mylegacy",
      name: "My Legacy / Registry of Deaths",
      category: "government",
      region: "SG",
      description: "Register the death and access after-death e-services.",
      contactMethods: [
        { type: "web", value: "https://www.mylegacy.life.gov.sg", label: "mylegacy.life.gov.sg" },
      ],
      requiredDocuments: [],
      tips: ["The My Legacy portal guides you through what to do after a death."],
    },
    {
      id: "sg-iras",
      name: "IRAS",
      category: "government",
      region: "SG",
      description: "The deceased's income tax.",
      contactMethods: [
        { type: "web", value: "https://www.iras.gov.sg", label: "iras.gov.sg" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: [],
    },
    {
      id: "sg-cpf",
      name: "CPF Board",
      category: "government",
      region: "SG",
      description: "Central Provident Fund savings and nominations.",
      contactMethods: [
        { type: "web", value: "https://www.cpf.gov.sg", label: "cpf.gov.sg" },
      ],
      requiredDocuments: ["death_certificate"],
      tips: ["CPF savings are distributed by nomination, or by intestacy law if none."],
    },
  ],
};

// --- Country label + free-text normalization --------------------------------
const COUNTRY_LABELS: Record<string, string> = {
  US: "the United States",
  GB: "the United Kingdom",
  CA: "Canada",
  AU: "Australia",
  IN: "India",
  IE: "Ireland",
  NZ: "New Zealand",
  DE: "Germany",
  FR: "France",
  ZA: "South Africa",
  SG: "Singapore",
};

// Common ways people type each country, lowercased.
const COUNTRY_ALIASES: Record<string, string> = {
  us: "US", usa: "US", "united states": "US",
  "united states of america": "US", america: "US",
  uk: "GB", gb: "GB", "united kingdom": "GB", britain: "GB",
  "great britain": "GB", england: "GB", scotland: "GB", wales: "GB",
  "northern ireland": "GB",
  ca: "CA", canada: "CA",
  au: "AU", australia: "AU",
  in: "IN", india: "IN", bharat: "IN",
  ie: "IE", ireland: "IE", eire: "IE", "republic of ireland": "IE",
  nz: "NZ", "new zealand": "NZ", aotearoa: "NZ",
  de: "DE", germany: "DE", deutschland: "DE",
  fr: "FR", france: "FR",
  za: "ZA", "south africa": "ZA",
  sg: "SG", singapore: "SG",
};

/** Map free-text country input to a supported region code, if we recognise it. */
export function normalizeCountry(input?: string | null): string | undefined {
  const key = input
    ?.trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
  if (!key) return undefined;
  if (COUNTRY_ALIASES[key]) return COUNTRY_ALIASES[key];
  // Loose contains-match for inputs like "living in australia".
  for (const alias in COUNTRY_ALIASES) {
    if (alias.length >= 4 && key.includes(alias)) return COUNTRY_ALIASES[alias];
  }
  return undefined;
}

export const SUPPORTED_COUNTRIES = Object.keys(REGION_INSTITUTIONS);

// Flat list of every institution (all regions + universal), for id lookup and
// backward compatibility.
export const INSTITUTIONS: Institution[] = [
  ...Object.values(REGION_INSTITUTIONS).flat(),
  ...UNIVERSAL_INSTITUTIONS,
];

const INSTITUTION_MAP = new Map(INSTITUTIONS.map((i) => [i.id, i]));

export function getInstitution(id: string): Institution | undefined {
  return INSTITUTION_MAP.get(id);
}

export interface CaseDirectory {
  institutions: Institution[];
  countryCode: string;
  countryLabel: string;
  /** True when we have a region-specific list for the case's country. */
  matched: boolean;
}

/**
 * Build the directory for a case's jurisdiction: the matching region's bodies
 * (or the US default when no country is given) followed by the universal set.
 * When a country is given but unsupported, we show the universal set only and
 * flag `matched: false` so the UI can explain the gap.
 */
export function getDirectoryForCountry(input?: string | null): CaseDirectory {
  const trimmed = input?.trim();

  // No country given → keep the default US-oriented experience.
  if (!trimmed) {
    return {
      institutions: [...REGION_INSTITUTIONS.US, ...UNIVERSAL_INSTITUTIONS],
      countryCode: "US",
      countryLabel: COUNTRY_LABELS.US,
      matched: true,
    };
  }

  const code = normalizeCountry(trimmed);
  if (code && REGION_INSTITUTIONS[code]) {
    return {
      institutions: [...REGION_INSTITUTIONS[code], ...UNIVERSAL_INSTITUTIONS],
      countryCode: code,
      countryLabel: COUNTRY_LABELS[code],
      matched: true,
    };
  }

  // Recognisable text but unsupported region → universal orgs only.
  return {
    institutions: [...UNIVERSAL_INSTITUTIONS],
    countryCode: "",
    countryLabel: trimmed,
    matched: false,
  };
}
