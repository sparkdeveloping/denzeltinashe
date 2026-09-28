import { featuredProjects } from '@/data/portfolio';

export default function sitemap() {
  const base = 'https://www.denzeltinashe.com';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/start`, lastModified: new Date(), changeFrequency: 'monthly', priority: .8 },
    ...featuredProjects.map((project) => ({ url: `${base}/work/${project.slug}`, lastModified: new Date(), changeFrequency: 'monthly', priority: .85 })),
  ];
}
