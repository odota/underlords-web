export function StripHtml(html: string) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
 }