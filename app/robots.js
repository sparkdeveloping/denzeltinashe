export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/clients/', '/api/portal/', '/gabby'] },
    ],
    sitemap: 'https://www.denzeltinashe.com/sitemap.xml',
    host: 'https://www.denzeltinashe.com',
  };
}
