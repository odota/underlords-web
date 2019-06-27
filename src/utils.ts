export function StripHtml(html: string) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
 }

 export function GetHeroImage( dotaName: string ) {
    return `${process.env.PUBLIC_URL}/images/portraits/${dotaName}_png.png`;
 }