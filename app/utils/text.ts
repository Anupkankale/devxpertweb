const escapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }

/** Escape HTML, then turn `**text**` into `<b>text</b>`. */
export function inlineBold(text: string): string {
  return text
    .replace(/[&<>"']/g, c => escapes[c]!)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
}
