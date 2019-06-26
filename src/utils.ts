export const ABILITY_REGEX = /({s:[^}]*})/g;

export function StripHtml(html: string) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
 }