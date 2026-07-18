import "server-only";
import { getAi } from "@/lib/ai";
import { createLogger } from "@/lib/logger";
import type { LetterType } from "@/lib/domain/enums";
import type { Case, Task } from "@/lib/domain/schemas";

const log = createLogger("letters");

export interface LetterDraftInput {
  caseRecord: Case;
  task?: Task | null;
  type: LetterType;
  recipientName?: string;
}

export interface LetterDraft {
  title: string;
  recipient: string;
  subject: string;
  body: string;
}

// The stored relationship is who the deceased was to the survivor ("My
// parent" = the deceased is my parent). A letter describes the survivor's
// relationship to the deceased, which is the inverse.
const WRITER_RELATION: Record<string, string> = {
  spouse: "their spouse",
  partner: "their partner",
  parent: "their child",
  child: "their parent",
  sibling: "their sibling",
  grandparent: "their grandchild",
  grandchild: "their grandparent",
  friend: "their friend",
  relative: "a relative of theirs",
  chosen_family: "their family",
  other: "a close family member",
};

function relationshipPhrase(caseRecord: Case): string {
  const rel = caseRecord.profile.relationship;
  if (!rel) return "a close family member";
  return WRITER_RELATION[rel] ?? "a close family member";
}

function deceasedName(caseRecord: Case): string {
  return (
    caseRecord.deceased.fullName ||
    caseRecord.deceased.preferredName ||
    "my loved one"
  );
}

function purposeLine(task?: Task | null): string {
  if (!task) return "notify you of their passing and update your records";
  switch (task.category) {
    case "financial":
      return "notify you of their passing and understand what you need to settle or transfer their account";
    case "benefits":
      return "notify you of their passing and ask about any benefits, and to stop any payments that should end";
    case "household":
      return "notify you of their passing and arrange to close or transfer the account";
    case "digital":
      return "notify you of their passing and ask how to close or memorialize their account";
    default:
      return `notify you of their passing in connection with: ${task.title.toLowerCase()}`;
  }
}

function deterministicLetter(input: LetterDraftInput): LetterDraft {
  const { caseRecord, task, type, recipientName } = input;
  const name = deceasedName(caseRecord);
  const rel = relationshipPhrase(caseRecord);
  const dod = caseRecord.deceased.dateOfDeath
    ? ` on ${caseRecord.deceased.dateOfDeath}`
    : "";
  const recipient = recipientName || "To whom it may concern";
  const purpose = purposeLine(task);

  if (type === "phone_script") {
    return {
      title: task ? `Phone script — ${task.title}` : "Phone script",
      recipient,
      subject: task?.title ?? "Notifying an organization",
      body: [
        `Before you call: have a certified copy of the death certificate and any account or reference number nearby. When you get through, ask for the "bereavement" or "estate" team — they handle this every day and are usually kinder.`,
        ``,
        `— — —`,
        ``,
        `"Hello, my name is [your name]. I'm calling to report the death of ${name}, who passed away${dod}. I am ${rel}."`,
        ``,
        `"I'd like to ${purpose}. Could you tell me what you need from me?"`,
        ``,
        `Helpful things to ask:`,
        `• What documents do you need, and where should I send them?`,
        `• Can you confirm the next steps in writing or by email?`,
        `• Is there a direct number or a reference I can use to follow up?`,
        `• Is there anything I should stop or pause right away?`,
        ``,
        `Remember: it's completely okay to take your time, to ask them to slow down, or to say you'll call back. You're doing this well.`,
      ].join("\n"),
    };
  }

  return {
    title: task ? `Letter — ${task.title}` : "Notification letter",
    recipient,
    subject: `Notification of death — ${name}`,
    body: [
      `[Your name]`,
      `[Your address]`,
      `[Your phone or email]`,
      ``,
      `[Date]`,
      ``,
      `${recipient},`,
      ``,
      `I am writing to notify you of the death of ${name}, who passed away${dod}. I am ${rel}.`,
      ``,
      `Their account or reference number, if you have one on file, is: [account number].`,
      ``,
      `I would be grateful if you could tell me what you require in order to ${purpose}. I can provide a certified copy of the death certificate and any other documentation you need.`,
      ``,
      `Please could you confirm the next steps in writing. If it's easier to reach me, my details are at the top of this letter.`,
      ``,
      `Thank you for your understanding at this difficult time.`,
      ``,
      `Yours faithfully,`,
      `[Your name]`,
    ].join("\n"),
  };
}

/** Generate a letter or phone script, using GPT-5.6 when available. */
export async function draftLetter(
  input: LetterDraftInput
): Promise<LetterDraft> {
  const base = deterministicLetter(input);
  const ai = getAi();
  if (!ai.isLive) return base;

  const { caseRecord, task, type, recipientName } = input;
  const context = {
    deceasedName: deceasedName(caseRecord),
    relationship: relationshipPhrase(caseRecord),
    dateOfDeath: caseRecord.deceased.dateOfDeath,
    recipient: recipientName || "the organization",
    purpose: task?.title,
    jurisdiction: caseRecord.profile.jurisdiction,
  };

  const instruction =
    type === "phone_script"
      ? "Write a warm, practical phone script the survivor can read aloud when calling this organization. Include a short 'before you call' note, an opening line, the request, and a few smart questions to ask. Keep it calm and human."
      : "Write a complete, formal-but-warm notification letter the survivor can send. Use [bracketed placeholders] for personal details you can't know (their name, address, account number, date). Keep it concise and ready to use.";

  try {
    const body = await ai.generateText(
      [
        {
          role: "user",
          content: `${instruction}\n\nContext (JSON):\n${JSON.stringify(
            context
          )}`,
        },
      ],
      {
        system:
          "You help grieving people handle estate paperwork. Write clearly and kindly. Never invent specific facts (account numbers, dates) — use placeholders. Output only the letter or script text.",
        temperature: 0.6,
        maxOutputTokens: 700,
      }
    );
    const trimmed = body.trim();
    if (!trimmed) return base;
    return { ...base, body: trimmed };
  } catch (err) {
    log.warn("AI letter generation failed; using template", {
      message: err instanceof Error ? err.message : String(err),
    });
    return base;
  }
}
