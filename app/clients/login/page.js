import { redirect } from 'next/navigation';
import LoginForm from '../../../components/portal/LoginForm';
import styles from '../../../components/portal/portal.module.css';
import { getPortalSession, portalBasePath } from '../../../lib/portal/auth';

export default async function PortalLoginPage() {
  const session = await getPortalSession();
  const basePath = await portalBasePath();
  if (session) redirect(basePath || '/');

  return (
    <div className={styles.loginScreen}>
      <section className={styles.loginVisual}>
        <div>
          <div className={styles.brandMark}><span>DT</span><i /></div>
        </div>
        <div>
          <p className={styles.eyebrow}>Private client workspace</p>
          <h1>Work.<br />Tracked.</h1>
          <p>
            Projects, discovery, decisions, requirements, tasks and delivery history in one place.
          </p>
        </div>
      </section>
      <section className={styles.loginPanel}>
        <div className={styles.loginCard}>
          <p className={styles.eyebrow}>clients.denzeltinashe.com</p>
          <h2>Sign in</h2>
          <p>Use the credentials provided for your workspace.</p>
          <LoginForm />
          {process.env.NODE_ENV !== 'production' && !process.env.PORTAL_USERS_JSON ? (
            <p className={styles.smallNote}>
              Development login: admin@local.dev / portal-dev-only
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
