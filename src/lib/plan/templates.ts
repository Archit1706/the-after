import type { CaseProfile, Person } from "@/lib/domain/schemas";
import type {
  DeadlineType,
  DocumentKind,
  TaskCategory,
  TaskPhase,
  TaskPriority,
} from "@/lib/domain/enums";

export interface TaskTemplate {
  key: string;
  title: string;
  rationale: string;
  steps: string[];
  category: TaskCategory;
  phase: TaskPhase;
  priority: TaskPriority;
  deadlineType?: DeadlineType;
  deadlineNote?: string;
  /** Days after the date of death by which this is typically handled. */
  dueInDays?: number;
  requiredDocuments?: DocumentKind[];
  institutionRefs?: string[];
  /** When present, the task is only included if this returns true. */
  applies?: (profile: CaseProfile, deceased: Person) => boolean;
}

const isHomeowner = (p: CaseProfile) => p.ownedHome === true;
const isRenter = (p: CaseProfile) => p.rented === true;
const hasVehicle = (p: CaseProfile) => p.ownedVehicle === true;
const isSpouse = (p: CaseProfile) =>
  p.relationship === "spouse" || p.relationship === "partner";

/**
 * A curated library of the tasks that commonly follow a death. The generator
 * filters these by the survivor's situation, so nobody sees tasks that don't
 * apply to them. Content is general guidance, not legal advice.
 */
export const TASK_TEMPLATES: TaskTemplate[] = [
  // ---- Right now --------------------------------------------------------
  {
    key: "care-of-dependents",
    title: "Make sure anyone in their care is safe",
    rationale:
      "Before anything administrative, the people (and animals) who depended on your loved one need to be looked after.",
    steps: [
      "Confirm any children, elderly relatives, or others in their care are safe and supervised.",
      "Arrange short-term care if needed, even informally with family or friends.",
    ],
    category: "immediate",
    phase: "now",
    priority: "high",
    applies: (p) => p.hasDependents === true || p.hasMinorChildren === true,
  },
  {
    key: "care-of-pets",
    title: "Arrange care for their pets",
    rationale:
      "Pets can be easily overlooked in the first days. A little planning keeps them safe and fed.",
    steps: [
      "Make sure pets have food, water, and a safe place today.",
      "Decide who will care for them in the coming weeks.",
    ],
    category: "immediate",
    phase: "now",
    priority: "high",
    applies: (p) => p.hasPets === true,
  },
  {
    key: "secure-home",
    title: "Secure their home and belongings",
    rationale:
      "An empty home is vulnerable. Securing it protects both property and important documents you'll need later.",
    steps: [
      "Lock up and collect any spare keys.",
      "Bring in mail and deliveries, or pause them, so the home doesn't look empty.",
      "Note where important papers, jewelry, and valuables are kept.",
    ],
    category: "immediate",
    phase: "now",
    priority: "medium",
    applies: (p) => p.rented === true || p.ownedHome === true,
  },
  {
    key: "locate-documents",
    title: "Gather their important documents",
    rationale:
      "Having key papers in one place now will save you many phone calls later.",
    steps: [
      "Look for the will, any trust documents, and life insurance policies.",
      "Collect their photo ID, birth and marriage certificates, and recent financial statements.",
      "Keep everything together in one safe folder — physical or digital.",
    ],
    category: "legal",
    phase: "now",
    priority: "high",
    requiredDocuments: ["will", "id", "insurance_policy"],
  },
  {
    key: "funeral-arrangements",
    title: "Arrange the funeral or memorial",
    rationale:
      "You don't have to decide everything at once — but a few early steps help you honor their wishes without overpaying.",
    steps: [
      "Check for any prepaid plan, written wishes, or religious preferences.",
      "Ask the funeral home for an itemized price list — you're entitled to one.",
      "Lean on family for decisions you'd rather not make alone.",
    ],
    category: "personal",
    phase: "now",
    priority: "high",
  },
  {
    key: "order-death-certificates",
    title: "Order certified copies of the death certificate",
    rationale:
      "This single document unlocks nearly everything else. Almost every bank, insurer, and agency will ask for an original.",
    steps: [
      "Ask the funeral home to order copies, or contact your local vital records office.",
      "Order 8–12 certified copies up front — getting more later is slower and costlier.",
      "Store them safely; you'll send them out over the coming weeks.",
    ],
    category: "legal",
    phase: "now",
    priority: "high",
    dueInDays: 10,
    requiredDocuments: ["death_certificate"],
    institutionRefs: ["vital-records"],
  },

  // ---- Soon -------------------------------------------------------------
  {
    key: "notify-social-security",
    title: "Notify the government benefits agency",
    rationale:
      "Reporting the death promptly avoids overpayments you'd have to return, and may unlock a survivor benefit.",
    steps: [
      "Confirm whether the funeral home has already reported the death.",
      "Contact the benefits agency (in the U.S., Social Security) to report it.",
      "Ask what survivor or lump-sum benefits you may be eligible for.",
    ],
    category: "benefits",
    phase: "soon",
    priority: "high",
    deadlineType: "recommended",
    deadlineNote: "As soon as possible to avoid returning payments",
    dueInDays: 14,
    requiredDocuments: ["death_certificate"],
    institutionRefs: ["social-security"],
  },
  {
    key: "notify-employer",
    title: "Notify their employer",
    rationale:
      "Employers handle final pay, benefits, and sometimes life insurance or a pension you may not know about.",
    steps: [
      "Contact their manager or HR to report the death.",
      "Ask about final wages, unused leave, and any group life insurance.",
      "Ask whether a retirement plan (like a 401(k)) names a beneficiary.",
    ],
    category: "financial",
    phase: "soon",
    priority: "medium",
    dueInDays: 21,
    applies: (p) => p.wasEmployed === true,
  },
  {
    key: "notify-banks",
    title: "Notify their banks and financial institutions",
    rationale:
      "Banks freeze sole accounts once notified, which protects the estate. Ask for their bereavement team — they do this every day.",
    steps: [
      "List their banks, credit unions, and investment accounts.",
      "Call each one's bereavement or estate line and ask what they need.",
      "Don't move money out of a sole account until you have legal authority.",
    ],
    category: "financial",
    phase: "soon",
    priority: "high",
    dueInDays: 30,
    requiredDocuments: ["death_certificate"],
    institutionRefs: ["bank-generic"],
  },
  {
    key: "life-insurance-claim",
    title: "File any life insurance claims",
    rationale:
      "Life insurance can provide funds you may need soon. Claims are usually straightforward once you have the certificate.",
    steps: [
      "Locate the policy documents or check with their employer.",
      "Contact each insurer to start a claim.",
      "Have the death certificate and policy number ready.",
    ],
    category: "financial",
    phase: "soon",
    priority: "medium",
    dueInDays: 30,
    requiredDocuments: ["death_certificate", "insurance_policy"],
    applies: (p) => p.hadLifeInsurance !== "no",
  },
  {
    key: "credit-bureaus",
    title: "Notify the credit bureaus to prevent fraud",
    rationale:
      "Sadly, the deceased are targeted by identity theft. Flagging their file closes that door.",
    steps: [
      "Send a copy of the death certificate to each major credit bureau.",
      "Request a 'deceased — do not issue credit' flag on the file.",
      "Request a copy of the credit report to see all open accounts.",
    ],
    category: "financial",
    phase: "soon",
    priority: "medium",
    dueInDays: 30,
    requiredDocuments: ["death_certificate"],
    institutionRefs: ["credit-bureaus"],
  },
  {
    key: "redirect-mail",
    title: "Redirect or hold their mail",
    rationale:
      "Mail reveals accounts you didn't know about — and stops sensitive letters piling up at an empty home.",
    steps: [
      "Set up mail forwarding to your address, or arrange a hold.",
      "Watch incoming mail for bills, statements, and subscriptions to handle.",
    ],
    category: "household",
    phase: "soon",
    priority: "low",
    dueInDays: 30,
    institutionRefs: ["postal-service"],
  },
  {
    key: "locate-will-attorney",
    title: "Review the will and consider an estate attorney",
    rationale:
      "The will names who has authority to act. For anything but the simplest estate, a short consult can save months of confusion.",
    steps: [
      "Find the original signed will, if there is one.",
      "Identify the named executor (that may be you).",
      "Consider a brief consult with an estate attorney if the estate is complex.",
    ],
    category: "legal",
    phase: "soon",
    priority: "high",
    dueInDays: 30,
    requiredDocuments: ["will"],
    applies: (p) => p.hasWill !== "no",
  },
  {
    key: "begin-probate",
    title: "Find out whether probate is needed",
    rationale:
      "Probate gives you legal authority over the estate. Many small estates skip it — it's worth checking before assuming.",
    steps: [
      "Check your local rules for small-estate thresholds and shortcuts.",
      "If needed, file to be appointed executor or administrator.",
      "Keep the appointment letters — institutions will ask for them.",
    ],
    category: "legal",
    phase: "soon",
    priority: "medium",
    deadlineType: "statutory",
    deadlineNote: "Timeframes vary by jurisdiction",
    dueInDays: 45,
    applies: (p) => p.userRole === "executor" || p.userRole === "next_of_kin",
  },
  {
    key: "health-insurance",
    title: "Cancel or update their health insurance",
    rationale:
      "Stopping premiums and updating any family coverage prevents wasted payments and gaps for dependents.",
    steps: [
      "Notify their health insurer of the death.",
      "If family members were on the plan, ask how to keep them covered.",
    ],
    category: "health",
    phase: "soon",
    priority: "medium",
    dueInDays: 30,
  },
  {
    key: "notify-pension",
    title: "Notify pension and retirement providers",
    rationale:
      "Pensions may owe a survivor benefit — or need to stop payments to avoid an overpayment you'd repay.",
    steps: [
      "Contact each pension or retirement plan provider.",
      "Ask about survivor benefits and any beneficiary on file.",
    ],
    category: "benefits",
    phase: "soon",
    priority: "medium",
    dueInDays: 45,
    applies: (p) => p.wasRetired === true || p.wasEmployed === true,
  },

  // ---- Later ------------------------------------------------------------
  {
    key: "cancel-subscriptions",
    title: "Cancel subscriptions and memberships",
    rationale:
      "Small recurring charges quietly continue. Canceling them is a task you can do a little at a time.",
    steps: [
      "Skim recent bank and card statements for anything monthly or yearly.",
      "Cancel streaming, software, memberships, and app subscriptions.",
      "Keep a note of what you've canceled in case a charge reappears.",
    ],
    category: "household",
    phase: "later",
    priority: "low",
  },
  {
    key: "utilities",
    title: "Transfer or close utilities",
    rationale:
      "Keep the home's essentials on until there's a plan for the property, then transfer or close them cleanly.",
    steps: [
      "List electricity, gas, water, internet, and phone accounts.",
      "Transfer needed services into the estate's or your name.",
      "Close what's no longer needed once the property is settled.",
    ],
    category: "household",
    phase: "later",
    priority: "low",
    applies: (p) => p.ownedHome === true || p.rented === true,
  },
  {
    key: "final-tax-return",
    title: "File their final tax return",
    rationale:
      "A final return is usually required for the year of death. It's often simpler than a normal year.",
    steps: [
      "Gather income documents for the year of death.",
      "File the final personal return by the usual deadline.",
      "Consider a tax professional if the estate earned income.",
    ],
    category: "financial",
    phase: "later",
    priority: "medium",
    deadlineType: "statutory",
    deadlineNote: "By the normal tax filing deadline for the year of death",
  },
  {
    key: "vehicle-title",
    title: "Transfer or sell their vehicle",
    rationale:
      "The title needs to move to a new owner or the estate before a vehicle can be sold or reinsured.",
    steps: [
      "Locate the title and any loan documents.",
      "Contact the motor vehicle agency about transferring ownership.",
      "Update or cancel the auto insurance.",
    ],
    category: "property",
    phase: "later",
    priority: "low",
    requiredDocuments: ["vehicle_title", "death_certificate"],
    applies: hasVehicle,
  },
  {
    key: "property-title",
    title: "Transfer their home or property",
    rationale:
      "Real estate transfers through the will or estate. Getting the title right protects everyone's interests.",
    steps: [
      "Find the deed and any mortgage documents.",
      "Work with the estate (and an attorney if needed) to transfer title.",
      "Keep paying the mortgage, insurance, and taxes in the meantime.",
    ],
    category: "property",
    phase: "later",
    priority: "medium",
    requiredDocuments: ["property_deed", "death_certificate"],
    applies: isHomeowner,
  },
  {
    key: "digital-accounts",
    title: "Handle their digital accounts",
    rationale:
      "There's no rush here. When you're ready, accounts can be memorialized, downloaded, or closed.",
    steps: [
      "List their main accounts: email, social media, cloud storage.",
      "Download any photos or messages you'd like to keep.",
      "Memorialize or close each account when you feel ready.",
    ],
    category: "digital",
    phase: "later",
    priority: "low",
    institutionRefs: ["google-legacy", "apple-legacy", "meta-legacy"],
  },
  {
    key: "notify-creditors",
    title: "Address outstanding debts",
    rationale:
      "Debts are generally paid from the estate, not by you personally. Notifying creditors keeps things orderly.",
    steps: [
      "List known debts: cards, loans, medical bills.",
      "Notify creditors of the death; ask them to pause collection.",
      "Pay valid debts from the estate — not from your own funds.",
    ],
    category: "financial",
    phase: "later",
    priority: "medium",
    applies: (p) => p.hadDebts === true,
  },
  {
    key: "guardianship",
    title: "Confirm care and benefits for their children",
    rationale:
      "For minor children, confirming guardianship and any survivor benefits gives them stability.",
    steps: [
      "Check the will for named guardians.",
      "Apply for any children's survivor benefits.",
      "Talk with their school about support during this time.",
    ],
    category: "benefits",
    phase: "soon",
    priority: "high",
    dueInDays: 30,
    applies: (p) => p.hasMinorChildren === true,
  },
  {
    key: "business-succession",
    title: "Address their business",
    rationale:
      "A business needs someone to steer it while the estate is settled, and to protect employees and customers.",
    steps: [
      "Identify who can make decisions in the short term.",
      "Secure accounts, payroll, and key relationships.",
      "Consult an attorney or accountant about succession.",
    ],
    category: "financial",
    phase: "soon",
    priority: "medium",
    dueInDays: 21,
    applies: (p) => p.ranBusiness === true,
  },
  {
    key: "veterans-benefits",
    title: "Claim veterans' benefits and honors",
    rationale:
      "Those who served may be entitled to burial benefits, a survivor pension, and military honors.",
    steps: [
      "Contact the veterans' affairs office about burial benefits.",
      "Ask about a survivor pension and any owed benefits.",
      "Request military honors for the service if desired.",
    ],
    category: "benefits",
    phase: "soon",
    priority: "medium",
    dueInDays: 30,
    applies: (p) => p.servedInMilitary === true,
  },
  {
    key: "update-your-documents",
    title: "Update your own plans when you're ready",
    rationale:
      "Losing a spouse or partner often changes your own will, beneficiaries, and emergency contacts. There's no rush — just don't let it be forgotten.",
    steps: [
      "Review your own will and beneficiary designations.",
      "Update emergency contacts and account beneficiaries.",
    ],
    category: "personal",
    phase: "later",
    priority: "low",
    applies: isSpouse,
  },
  {
    key: "cancel-id-documents",
    title: "Cancel their ID, license, and passport",
    rationale:
      "Canceling official IDs prevents misuse and closes out government records.",
    steps: [
      "Notify the motor vehicle agency to cancel their driver's license.",
      "Return or cancel their passport per your country's process.",
      "Cancel voter registration if applicable.",
    ],
    category: "legal",
    phase: "later",
    priority: "low",
    requiredDocuments: ["death_certificate"],
  },
  {
    key: "keepsakes",
    title: "Set aside keepsakes and personal effects",
    rationale:
      "Amid the paperwork, this is the part that's about love. There's no timeline — do it when it feels right.",
    steps: [
      "Set aside items with special meaning before clearing anything.",
      "Invite family to share what matters to them.",
      "Take photos of things you can't keep but want to remember.",
    ],
    category: "personal",
    phase: "later",
    priority: "low",
  },
];
