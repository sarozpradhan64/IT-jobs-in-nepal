import "@/styles/rich-text.css";

interface RichTextProps {
  text: string;
  className?: string;
}

/**
 * Renders scraped job content (plain text or escaped HTML) as structured HTML.
 * Styles are in src/styles/rich-text.css.
 */
export function RichText({ text, className = "" }: RichTextProps) {
  const html = toHtml(text);
  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ── Converter ─────────────────────────────────────────────────────────────────

const HEADING_RE = /^[A-Z][A-Z\s\/&]{4,}:?$/;
const BULLET_RE  = /^[\-\*\•]\s+(.+)/;

function toHtml(raw: string): string {
  // 1. Decode HTML entities
  const decoded = raw
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");

  // 2. If it still contains HTML tags, sanitise and return directly
  if (/<[a-z][\s\S]*?>/i.test(decoded)) {
    return sanitizeHtml(decoded);
  }

  // 3. Plain text → HTML blocks
  const lines = decoded.split("\n").map((l) => l.trim());
  const parts: string[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = () => {
    if (!bulletBuffer.length) return;
    parts.push(`<ul>${bulletBuffer.map((b) => `<li>${escape(b)}</li>`).join("")}</ul>`);
    bulletBuffer = [];
  };

  for (const line of lines) {
    if (!line) { flushBullets(); continue; }

    const bulletMatch = line.match(BULLET_RE);
    if (bulletMatch) { bulletBuffer.push(bulletMatch[1]); continue; }

    flushBullets();

    if (HEADING_RE.test(line))
      parts.push(`<span class="section-label">${escape(line.replace(/:$/, ""))}</span>`);
    else
      parts.push(`<p>${escape(line)}</p>`);
  }

  flushBullets();
  return parts.join("");
}

/** Strip dangerous attributes/tags while keeping structure. */
function sanitizeHtml(html: string): string {
  return html
    // Remove script / style / iframe entirely
    .replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, "")
    // Strip all attributes except href on <a>
    .replace(/<a\s[^>]*href="([^"]*)"[^>]*>/gi, '<a href="$1">')
    .replace(/<(?!\/?(a|p|ul|ol|li|strong|b|em|i|br|hr|h[1-6]|code)\b)[^>]+>/gi, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
