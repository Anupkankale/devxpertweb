const escapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' }

const escape = (text: string) => text.replace(/[&<>"']/g, c => escapes[c]!)

/** Escape HTML, then turn `**text**` into `<b>text</b>`. */
export function inlineBold(text: string): string {
  return escape(text).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
}

/**
 * Escape HTML, then render a small Markdown subset: `**bold**` and
 * `[label](https://…)` links (external links open in a new tab).
 */
export function inlineMarkdown(text: string): string {
  return inlineBold(text).replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>',
  )
}
