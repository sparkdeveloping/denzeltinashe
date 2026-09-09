import Link from 'next/link';
import styles from './portal.module.css';

const sectionLinks = [
  ['overview', 'Overview'],
  ['discovery', 'Discovery'],
  ['meetings', 'Meetings'],
  ['requirements', 'Requirements'],
  ['mvp', 'MVP'],
  ['tasks', 'Tasks'],
  ['documents', 'Documents'],
  ['activity', 'Activity'],
];

export default function PortalShell({
  children,
  session,
  basePath,
  client,
  activeSection = 'overview',
}) {
  const clientPath = client ? `${basePath}/${client.shortCode || client.slug}` : null;
  const links = client
    ? [
        ...sectionLinks,
        ...(session.role === 'owner' ? [['financials', 'Financials']] : []),
      ]
    : [];

  return (
    <div className={styles.portalRoot}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <Link href={basePath || '/'} className={styles.brandMark} aria-label="Client portal home">
            <span>DT</span>
            <i />
          </Link>
          <div>
            <div className={styles.brandTitle}>Clients</div>
            <div className={styles.brandSubtitle}>Work operating system</div>
          </div>
        </div>

        <nav className={styles.primaryNav}>
          <Link
            className={!client ? styles.navItemActive : styles.navItem}
            href={basePath || '/'}
          >
            <span className={styles.navIcon}>⌂</span>
            Dashboard
          </Link>
        </nav>

        {client ? (
          <>
            <div className={styles.clientMiniCard}>
              <div className={styles.clientMonogram}>{client.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <strong>{client.name}</strong>
                <span>{client.projectName}</span>
              </div>
            </div>
            <div className={styles.navLabel}>Workspace</div>
            <nav className={styles.sectionNav}>
              {links.map(([key, label]) => {
                const href = key === 'overview' ? clientPath : `${clientPath}/${key}`;
                return (
                  <Link
                    key={key}
                    href={href}
                    className={activeSection === key ? styles.navItemActive : styles.navItem}
                  >
                    <span className={styles.navDot} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </>
        ) : null}

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{(session.name || session.email).slice(0, 1).toUpperCase()}</div>
            <div className={styles.userInfo}>
              <strong>{session.name || session.email}</strong>
              <span>{session.role === 'owner' ? 'Owner' : 'Client access'}</span>
            </div>
          </div>
          <form action="/api/portal/logout" method="post">
            <button type="submit" className={styles.logoutButton}>Sign out</button>
          </form>
        </div>
      </aside>
      <main className={styles.mainPanel}>{children}</main>
    </div>
  );
}
