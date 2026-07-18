/**
 * Tolerant extraction of a JSON value from a model's text output.
 * Handles code fences and leading/trailing prose by locating the first
 * balanced JSON object or array.
 */
export function extractJson(text: string): unknown {
  const trimmed = text.trim();

  // Strip a ```json ... ``` (or plain ```) fence if present.
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;

  // Fast path: the whole thing is valid JSON.
  try {
    return JSON.parse(candidate);
  } catch {
    // Fall through to balanced-scan.
  }

  const start = candidate.search(/[[{]/);
  if (start === -1) {
    throw new Error("No JSON object or array found in model output.");
  }

  const open = candidate[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < candidate.length; i++) {
    const ch = candidate[i];

    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }

    if (ch === '"') inString = true;
    else if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        const slice = candidate.slice(start, i + 1);
        return JSON.parse(slice);
      }
    }
  }

  throw new Error("Could not find a balanced JSON value in model output.");
}
