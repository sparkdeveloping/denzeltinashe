import Link from 'next/link';
import PortalShell from '../../components/portal/PortalShell';
import { AddClientForm } from '../../components/portal/PortalActions';
import styles from '../../components/portal/portal.module.css';
import { portalBasePath, requirePortalSession } from '../../lib/portal/auth';
import { getPortalData } from '../../lib/portal/store';

export default async function ClientsDashboard() {
  const session = await requirePortalSession();
  const basePath = await portalBasePath();
  const data = await getPortalData();

  if (session.role === 'client') {
    const client = data.clients.find(
      (item) => item.slug === session.clientSlug || item.shortCode === session.clientSlug
    );
    if (client) {
      const href = `${basePath}/${client.shortCode || client.slug}` || `/${client.shortCode || client.slug}`;
      return (
        <PortalShell session={session} basePath={basePath}>
          <div className={styles.page}>
            <div className={styles.emptyState}>
              <Link href={href}>Open {client.name} workspace →</Link>
            </div>
          </div>
        </PortalShell>
      );
    }
  }

  const active = data.clients.filter((client) => !/complete|delivered|archived/i.test(client.status));
  const openTasks = data.clients.reduce(
    (total, client) => total + (client.tasks || []).filter((task) => !['done', 'complete'].includes(task.status)).length,
    0
  );
  const waiting = data.clients.reduce(
    (total, client) => total + (client.tasks || []).filter((task) => task.status === 'waiting').length,
    0
  );

  return (
    <PortalShell session={session} basePath={basePath}>
      <div className={styles.page}>
        <div className={styles.topline}>
          <div>
            <p className={styles.eyebrow}>Denzel Tinashe / client operations</p>
            <h1 className={styles.pageTitle}>Work dashboard</h1>
            <p className={styles.pageSubtitle}>
              One place for client discovery, requirements, decisions, tasks, delivery and commercial tracking.
            </p>
          </div>
          {session.role === 'owner' ? <AddClientForm /> : null}
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}><div className={styles.metricLabel}>Clients</div><div className={styles.metricValue}>{data.clients.length}</div></div>
          <div className={styles.metricCard}><div className={styles.metricLabel}>Active</div><div className={styles.metricValue}>{active.length}</div></div>
          <div className={styles.metricCard}><div className={styles.metricLabel}>Open tasks</div><div className={styles.metricValue}>{openTasks}</div></div>
          <div className={styles.metricCard}><div className={styles.metricLabel}>Waiting on client</div><div className={styles.metricValue}>{waiting}</div></div>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <h2>Clients</h2>
            <p>{data.clients.length} workspace{data.clients.length === 1 ? '' : 's'}</p>
          </div>
          <div className={styles.clientGrid}>
            {data.clients.map((client) => {
              const route = client.shortCode || client.slug;
              return (
                <Link key={client.id} className={styles.clientCard} href={`${basePath}/${route}`}>
                  <div className={styles.clientCardTop}>
                    <span className={styles.statusPill}>{client.status}</span>
                    <span className={styles.clientArrow}>↗</span>
                  </div>
                  <h2>{client.name}</h2>
                  <strong>{client.projectName}</strong>
                  <p>{client.summary}</p>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </PortalShell>
  );
}
