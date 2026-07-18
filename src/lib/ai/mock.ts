import type { z } from "zod";
import { sleep } from "@/lib/utils";
import {
  AiError,
  type AiGenerateOptions,
  type AiMessage,
  type AiObjectOptions,
  type AiProvider,
} from "./types";

/**
 * Deterministic demo provider used when no OpenAI key is configured.
 *
 * The app's higher-level AI "skills" (intake, plan, letters) each carry their
 * own rich, rule-based fallback and branch on `provider.isLive`, so structured
 * generation never reaches this provider. Free-form companion chat does, and
 * gets genuinely useful, topic-aware guidance here.
 */

type Canned = { match: RegExp; reply: string };

const CANNED: Canned[] = [
  {
    match: /death certificate|certified cop|vital record/i,
    reply:
      "The death certificate is the key that unlocks almost everything else, so it's worth getting right early.\n\nMost families underestimate how many certified copies they'll need — banks, insurers, and government offices each usually want an original. A good rule of thumb is to order 8 to 12 certified copies up front; ordering more later is slower and often costs more.\n\nYou'll usually get them from the funeral home or your local vital records office. Would you like me to add \"order certified copies\" to your plan?",
  },
  {
    match: /\bbank|account|checking|savings|debit\b/i,
    reply:
      "For bank accounts, the right step depends on how the account was held.\n\nJoint accounts usually pass to the surviving owner and simply need to be updated. Accounts in your loved one's name alone are typically frozen once the bank is notified, and released through the estate — which is why notifying them is important, but so is not moving money out of a sole account before you have the legal authority to.\n\nWhen you call, ask for their \"bereavement\" or \"estate\" team; they handle this every day and are usually kinder than the main line. I can draft a notification letter or a phone script whenever you're ready.",
  },
  {
    match: /\bwill|probate|executor|estate|inherit/i,
    reply:
      "Probate is the legal process of settling the estate, and it feels bigger than it usually is.\n\nIf there's a will, it names an executor — the person with authority to act. If there isn't, the court appoints an administrator, usually the closest relative. Either way, you generally can't move major assets until you have that authority in writing (often called \"letters testamentary\" or \"grant of probate\").\n\nStart by locating the original will if there is one, and note that many estates are small enough to skip full probate. Would it help if I added the first probate steps to your plan?",
  },
  {
    match: /social security|benefit|pension|survivor|widow/i,
    reply:
      "Benefits are one place where acting sooner genuinely helps you.\n\nIn the U.S., the funeral home often reports the death to Social Security, but it's worth confirming — and you may be eligible for a survivor benefit or a small lump-sum payment. Any benefit payment received for the month of death or after usually has to be returned, so it's better to notify them than to wait.\n\nIf your loved one had a pension or workplace benefits, contact the plan administrator too. I can help you gather what you'll need before you call.",
  },
  {
    match: /subscription|netflix|spotify|utility|phone bill|recurring/i,
    reply:
      "Recurring charges are small individually but they add up, and canceling them is one of the more doable tasks on a hard day.\n\nA quick way to find them: skim the last two or three bank or card statements for anything monthly — streaming, cloud storage, gym, memberships, software. For utilities, don't cancel anything the home still needs (heat, power, water) until you know the plan for the property; just transfer them into the estate's or your name.\n\nWant me to start a list you can work through a few at a time?",
  },
  {
    match: /facebook|google|apple|instagram|digital|online account|email account/i,
    reply:
      "Digital accounts can wait — there's no rush, and it's okay to leave them for now.\n\nWhen you're ready: Facebook and Instagram can be \"memorialized\" or closed, Google has an Inactive Account Manager, and Apple supports a Legacy Contact. Each has its own process and usually asks for the death certificate. Some families find comfort in downloading photos and messages before closing anything.\n\nThere's no wrong pace here. I can note the main accounts so they're not forgotten whenever you feel up to it.",
  },
  {
    match: /funeral|burial|cremat|memorial|service/i,
    reply:
      "I'm so sorry — arranging a service is a lot to hold.\n\nA few things that ease the road: ask the funeral home for an itemized price list (you're entitled to one), and check whether your loved one left any wishes, a prepaid plan, or veterans' benefits that could help with costs. You don't have to decide everything at once, and it's completely okay to lean on family for the parts you can hand off.\n\nWould it help to keep a short list of decisions and who's handling each?",
  },
  {
    match: /overwhelm|don'?t know where|too much|can'?t cope|exhaust|tired|alone|scared|grief|miss (him|her|them)/i,
    reply:
      "That feeling makes complete sense. You've been handed an enormous amount, all at once, at the hardest possible time — anyone would feel underwater.\n\nHere's the only thing you need to do right now: nothing more than the next single step. Everything here saves, nothing is urgent that can't wait until tomorrow, and you can stop whenever you need to.\n\nIf it helps, tell me one thing that's weighing on you most, and we'll make it smaller together.",
  },
];

const DEFAULT_REPLY =
  "I'm here to help you through the practical side of this, one step at a time.\n\nTell me a little about what you're facing — a specific account, a letter you need to send, a deadline you're worried about — and I'll walk you through exactly what to do and, where it helps, draft it for you. And if you'd rather just get oriented, I can point you to the next most important thing on your plan.";

function lastUserMessage(messages: AiMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

export class MockProvider implements AiProvider {
  readonly name = "demo";
  readonly isLive = false;
  readonly model = "the-after-demo";

  async generateText(
    messages: AiMessage[],
    _options?: AiGenerateOptions
  ): Promise<string> {
    void _options;
    const query = lastUserMessage(messages);
    const hit = CANNED.find((c) => c.match.test(query));
    return hit ? hit.reply : DEFAULT_REPLY;
  }

  async *streamText(
    messages: AiMessage[],
    options?: AiGenerateOptions
  ): AsyncIterable<string> {
    const full = await this.generateText(messages, options);
    const tokens = full.match(/\S+\s*/g) ?? [full];
    for (const token of tokens) {
      if (options?.signal?.aborted) return;
      yield token;
      await sleep(18);
    }
  }

  async generateObject<T>(
    _messages: AiMessage[],
    _schema: z.ZodType<T>,
    _options?: AiObjectOptions
  ): Promise<T> {
    void _messages;
    void _schema;
    void _options;
    throw new AiError(
      "Structured generation is not available in demo mode. This skill should provide a deterministic fallback when provider.isLive is false."
    );
  }
}
