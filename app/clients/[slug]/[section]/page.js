import { notFound, redirect } from 'next/navigation';
import ClientWorkspace from '../../../../components/portal/ClientWorkspace';
import { portalBasePath, requirePortalSession } from '../../../../lib/portal/auth';
import { canAccessClient, findClient } from '../../../../lib/portal/store';

export default async function ClientSectionPage({ params }) {
  const { slug, section } = await params;
  const session = await requirePortalSession();
  const basePath = await portalBasePath();
  const { client } = await findClient(slug);
  if (!client) notFound();
  if (!canAccessClient(session, client)) redirect(basePath || '/');
  if (section === 'financials' && session.role !== 'owner') redirect(`${basePath}/${client.shortCode || client.slug}`);
  return <ClientWorkspace client={client} session={session} basePath={basePath} section={section} />;
}
