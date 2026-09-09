import Link from 'next/link';
import Image from 'next/image';
import PortalShell from './PortalShell';
import { QuickAdd, StatusSelect, DeleteButton } from './PortalActions';
import styles from './portal.module.css';
import { clientVisibleItems } from '../../lib/portal/store';
import { formatDate, formatDateTime, titleCase } from '../../lib/portal/format';

function PageHeader({ client, section, title, description, action }) {
  return (
    <div className={styles.topline}>
      <div>
        <p className={styles.eyebrow}>{client.name} / {section}</p>
        <h1 className={styles.pageTitle}>{title}</h1>
        {description ? <p className={styles.pageSubtitle}>{description}</p> : null}
      </div>
      {action || <span className={styles.statusPill}>{client.status}</span>}
    </div>
  );
}

function Overview({ client, session }) {
  const activity = clientVisibleItems(client.activity, session).slice().reverse().slice(0, 6);
  const openTasks = clientVisibleItems(client.tasks, session).filter((task) => task.status !== 'done');
  const waiting = openTasks.filter((task) => task.status === 'waiting').length;
  const confirmed = clientVisibleItems(client.requirements, session).filter((item) => item.status === 'confirmed').length;

  return (
    <>
      <PageHeader
        client={client}
        section="Overview"
        title={client.projectName}
        description={client.summary}
      />

      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}><div className={styles.metricLabel}>Employees impacted</div><div className={styles.metricValue}>{client.facts.employees}</div></div>
        <div className={styles.metricCard}><div className={styles.metricLabel}>Teams / customers</div><div className={styles.metricValue}>{client.facts.teams}</div></div>
        <div className={styles.metricCard}><div className={styles.metricLabel}>Open tasks</div><div className={styles.metricValue}>{openTasks.length}</div></div>
        <div className={styles.metricCard}><div className={styles.metricLabel}>Waiting</div><div className={styles.metricValue}>{waiting}</div></div>
      </div>

      <section className={styles.section}>
        <div className={styles.twoCol}>
          <div className={`${styles.noteCard} ${styles.noteCardStrong}`}>
            <p className={styles.eyebrow}>Current objective</p>
            <h3>{client.objective}</h3>
            <p>
              Core design rule: the platform should reduce dependence on paper, memory and disconnected operational knowledge.
            </p>
          </div>
          <div className={styles.noteCard}>
            <p className={styles.eyebrow}>Operating questions</p>
            <ol className={styles.numberList}>
              {client.principles.map((item) => <li key={item}>{item}</li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}><h2>Progress</h2><p>{confirmed} confirmed requirements</p></div>
        <div className={styles.progressCard}>
          <div className={styles.progressList}>
            {client.progress.map((item) => (
              <div className={styles.progressRow} key={item.label}>
                <strong>{item.label}</strong>
                <div className={styles.progressTrack}><div className={styles.progressFill} style={{ width: `${item.value}%` }} /></div>
                <span>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}><h2>Proposed end-to-end workflow</h2><p>Validate against a real order</p></div>
        <div className={styles.workflowCard}>
          <div className={styles.workflow}>
            {client.workflow.map((step, index) => (
              <span key={step} style={{ display: 'contents' }}>
                <span className={styles.workflowStep}>{step}</span>
                {index < client.workflow.length - 1 ? <span className={styles.workflowArrow}>→</span> : null}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.twoCol}>
          <div className={styles.card}>
            <div className={styles.sectionHeading}><h3>Next actions</h3></div>
            <ol className={styles.numberList}>{client.nextActions.map((item) => <li key={item}>{item}</li>)}</ol>
          </div>
          <div className={styles.card}>
            <div className={styles.sectionHeading}><h3>Recent activity</h3></div>
            <ul className={styles.activityList}>
              {activity.map((item) => (
                <li className={styles.activityItem} key={item.id}>
                  <span className={styles.activityDot} />
                  <span className={styles.activityText}>{item.text}</span>
                  <span className={styles.activityTime}>{formatDate(item.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function Discovery({ client, session }) {
  const meeting = client.originalMeeting;
  return (
    <>
      <PageHeader
        client={client}
        section="Discovery"
        title="From raw notes to system requirements"
        description="Keep the original source material, client statements, interpretation and unresolved questions separate so the build never relies on fuzzy memory."
      />

      <section className={styles.section}>
        <div className={styles.sectionHeading}><h2>Original meeting notes</h2><p>Source material</p></div>
        <div className={styles.twoCol}>
          {meeting.image ? (
            <div className={styles.imageCard}>
              <Image src={meeting.image} alt={`${client.name} original meeting notes`} width={1080} height={1440} sizes="(max-width: 780px) 100vw, 60vw" priority unoptimized />
            </div>
          ) : (
            <div className={styles.emptyState}>No source image attached yet.</div>
          )}
          <div className={styles.card}>
            <p className={styles.eyebrow}>Typed transcription</p>
            <ul className={styles.cleanList}>
              {meeting.transcription.map((item) => <li key={item}>— {item}</li>)}
            </ul>
            <p className={styles.smallNote}>Raw notes are not automatically treated as final requirements.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.threeCol}>
          <div className={styles.noteCard}>
            <p className={styles.eyebrow}>Explicitly stated / strongly established</p>
            <ul className={styles.checkList}>{meeting.confirmedStatements.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className={`${styles.noteCard} ${styles.noteCardStrong}`}>
            <p className={styles.eyebrow}>Core interpretation</p>
            <h3>{meeting.interpretation}</h3>
          </div>
          <div className={styles.noteCard}>
            <p className={styles.eyebrow}>Needs confirmation</p>
            <ul className={styles.cleanList}>{meeting.uncertainNotes.map((item) => <li key={item}>? {item}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}><h2>Deep-dive questions</h2><p>Use these in the next workflow session</p></div>
        <div className={styles.questionGrid}>
          {Object.entries(client.deepDiveQuestions).map(([group, questions]) => (
            <div className={styles.questionCard} key={group}>
              <h3>{group}</h3>
              <ul>{questions.map((question) => <li key={question}>{question}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      {session.role === 'owner' ? (
        <section className={styles.section}>
          <div className={styles.noteCard}>
            <p className={styles.eyebrow}>Internal build rule</p>
            <h3>Do not code the production system from the handwritten page alone.</h3>
            <p>Validate one real completed order from first contact through delivery, then convert that workflow into fields, states, permissions, transitions and edge cases.</p>
            <span className={styles.internalBadge}>Internal</span>
          </div>
        </section>
      ) : null}
    </>
  );
}

function Meetings({ client, session }) {
  const items = clientVisibleItems(client.meetings, session).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const action = session.role === 'owner' ? (
    <QuickAdd
      clientSlug={client.slug}
      collection="meetings"
      title="Add meeting"
      submitLabel="Save meeting"
      fields={[
        { name: 'title', label: 'Title', required: true, placeholder: 'Operational deep dive' },
        { name: 'date', label: 'Date', type: 'date', required: true },
        { name: 'attendees', label: 'Attendees', placeholder: 'Names or roles' },
        { name: 'visibility', label: 'Visibility', type: 'select', defaultValue: 'client', options: ['client', 'internal'] },
        { name: 'summary', label: 'Summary', type: 'textarea', full: true, placeholder: 'What was discussed?' },
        { name: 'decisions', label: 'Decisions', type: 'textarea', full: true, placeholder: 'What was decided?' },
        { name: 'followUp', label: 'Follow-up', type: 'textarea', full: true, placeholder: 'What happens next?' },
      ]}
    />
  ) : null;
  return (
    <>
      <PageHeader client={client} section="Meetings" title="Meeting history" description="A permanent record of what was discussed, decided and assigned." action={action} />
      <section className={styles.section}>
        <div className={styles.meetingList}>
          {items.map((meeting) => (
            <article className={styles.meetingItem} key={meeting.id}>
              <div className={styles.meetingHeader}>
                <div>
                  <h3>{meeting.title}</h3>
                  <div className={styles.metaRow}><span>{formatDate(meeting.date)}</span><span>{meeting.attendees || 'Attendees not recorded'}</span>{meeting.visibility === 'internal' ? <span className={styles.internalBadge}>Internal</span> : null}</div>
                </div>
                {session.role === 'owner' ? <DeleteButton clientSlug={client.slug} collection="meetings" id={meeting.id} /> : null}
              </div>
              {meeting.summary ? <p className={styles.bodyText}>{meeting.summary}</p> : null}
              {meeting.decisions ? <p className={styles.bodyText}><strong>Decisions:</strong> {meeting.decisions}</p> : null}
              {meeting.followUp ? <p className={styles.bodyText}><strong>Follow-up:</strong> {meeting.followUp}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Requirements({ client, session }) {
  const items = clientVisibleItems(client.requirements, session);
  const counts = ['confirmed', 'proposed', 'needs clarification', 'rejected'].map((status) => ({ status, count: items.filter((item) => item.status === status).length }));
  const action = session.role === 'owner' ? (
    <QuickAdd
      clientSlug={client.slug}
      collection="requirements"
      title="Add requirement"
      submitLabel="Save requirement"
      fields={[
        { name: 'title', label: 'Requirement', required: true, placeholder: 'Clear requirement name' },
        { name: 'priority', label: 'Priority', type: 'select', defaultValue: 'high', options: ['critical', 'high', 'medium', 'low'] },
        { name: 'status', label: 'Status', type: 'select', defaultValue: 'proposed', options: ['confirmed', 'proposed', 'needs clarification', 'rejected'] },
        { name: 'visibility', label: 'Visibility', type: 'select', defaultValue: 'client', options: ['client', 'internal'] },
        { name: 'source', label: 'Source', placeholder: 'Meeting, observation, proposal…' },
        { name: 'description', label: 'Description', type: 'textarea', full: true, required: true, placeholder: 'What must the system do?' },
      ]}
    />
  ) : null;

  return (
    <>
      <PageHeader client={client} section="Requirements" title="Requirements ledger" description="Track what is confirmed, what is only proposed, and what still needs clarification." action={action} />
      <div className={styles.metricsGrid}>
        {counts.map((item) => <div className={styles.metricCard} key={item.status}><div className={styles.metricLabel}>{item.status}</div><div className={styles.metricValue}>{item.count}</div></div>)}
      </div>
      <section className={styles.section}>
        <div className={styles.requirementList}>
          {items.map((req) => (
            <article className={styles.requirementItem} key={req.id}>
              <div className={styles.requirementHeader}>
                <div>
                  <div className={styles.requirementId}>{req.id}</div>
                  <h3>{req.title}</h3>
                </div>
                {session.role === 'owner' ? (
                  <StatusSelect clientSlug={client.slug} collection="requirements" id={req.id} value={req.status} options={['confirmed', 'proposed', 'needs clarification', 'rejected']} />
                ) : <span className={styles.badge}>{titleCase(req.status)}</span>}
              </div>
              <p className={styles.bodyText}>{req.description}</p>
              <div className={styles.tagRow}>
                <span className={`${styles.badge} ${req.priority === 'critical' ? styles.priorityCritical : req.priority === 'high' ? styles.priorityHigh : styles.priorityMedium}`}>{titleCase(req.priority)}</span>
                <span className={styles.badge}>{req.source}</span>
                {req.visibility === 'internal' ? <span className={styles.internalBadge}>Internal</span> : null}
                {session.role === 'owner' ? <DeleteButton clientSlug={client.slug} collection="requirements" id={req.id} /> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Mvp({ client }) {
  return (
    <>
      <PageHeader client={client} section="MVP" title="MVP boundary" description="Keep the first release focused on operational visibility and the critical order workflow. Anything beyond this list should trigger a scope decision." />
      <section className={styles.section}>
        <div className={styles.mvpGrid}>
          <div className={styles.mvpIncluded}><h3>Build in MVP</h3><ul className={styles.checkList}>{client.mvp.included.map((item) => <li key={item}>{item}</li>)}</ul></div>
          <div className={styles.mvpDeferred}><h3>Deferred / later phase</h3><ul className={styles.cleanList}>{client.mvp.deferred.map((item) => <li key={item}>— {item}</li>)}</ul></div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeading}><h2>Preliminary delivery plan</h2><p>Subject to workflow validation</p></div>
        <div className={styles.timeline}>
          {client.mvp.timeline.map((item) => <div className={styles.timelineRow} key={item.phase}><strong>{item.phase}</strong><span>{item.duration}</span></div>)}
        </div>
        <p className={styles.pageSubtitle}>{client.mvp.target}</p>
      </section>
      <section className={styles.section}>
        <div className={styles.workflowCard}>
          <p className={styles.eyebrow}>Primary workflow</p>
          <div className={styles.workflow}>
            {client.workflow.map((step, index) => <span key={step} style={{ display: 'contents' }}><span className={styles.workflowStep}>{step}</span>{index < client.workflow.length - 1 ? <span className={styles.workflowArrow}>→</span> : null}</span>)}
          </div>
        </div>
      </section>
    </>
  );
}

function Tasks({ client, session }) {
  const tasks = clientVisibleItems(client.tasks, session);
  const statuses = [
    ['todo', 'To do'],
    ['in-progress', 'In progress'],
    ['waiting', 'Waiting'],
    ['done', 'Done'],
  ];
  const action = session.role === 'owner' ? (
    <QuickAdd
      clientSlug={client.slug}
      collection="tasks"
      title="Add task"
      submitLabel="Save task"
      fields={[
        { name: 'title', label: 'Task', required: true, placeholder: 'What needs to happen?' },
        { name: 'status', label: 'Status', type: 'select', defaultValue: 'todo', options: statuses.map(([value, label]) => ({ value, label })) },
        { name: 'type', label: 'Type', placeholder: 'Discovery, Design, Development…' },
        { name: 'owner', label: 'Owner', placeholder: 'Person or organization' },
        { name: 'due', label: 'Due', type: 'date' },
        { name: 'visibility', label: 'Visibility', type: 'select', defaultValue: 'client', options: ['client', 'internal'] },
      ]}
    />
  ) : null;

  return (
    <>
      <PageHeader client={client} section="Tasks" title="Work queue" description="Separate what you need to do from what is waiting on the client." action={action} />
      <section className={styles.section}>
        <div className={styles.taskBoard}>
          {statuses.map(([status, label]) => {
            const list = tasks.filter((task) => task.status === status);
            return (
              <div className={styles.taskColumn} key={status}>
                <div className={styles.taskColumnTitle}><span>{label}</span><span className={styles.taskColumnCount}>{list.length}</span></div>
                <div className={styles.taskColumnList}>
                  {list.map((task) => (
                    <article className={styles.taskCard} key={task.id}>
                      <div className={styles.taskHeader}><h3>{task.title}</h3>{task.visibility === 'internal' ? <span className={styles.internalBadge}>Internal</span> : null}</div>
                      <p>{task.type || 'Task'} · {task.owner || 'Unassigned'}{task.due ? ` · ${formatDate(task.due)}` : ''}</p>
                      {session.role === 'owner' ? (
                        <div className={styles.tagRow}>
                          <StatusSelect clientSlug={client.slug} collection="tasks" id={task.id} value={task.status} options={statuses.map(([value]) => value)} />
                          <DeleteButton clientSlug={client.slug} collection="tasks" id={task.id} />
                        </div>
                      ) : null}
                    </article>
                  ))}
                  {!list.length ? <div className={styles.emptyState}>Nothing here.</div> : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

function Documents({ client, session }) {
  const items = clientVisibleItems(client.documents, session);
  const action = session.role === 'owner' ? (
    <QuickAdd
      clientSlug={client.slug}
      collection="documents"
      title="Add document"
      submitLabel="Save document"
      fields={[
        { name: 'title', label: 'Title', required: true, placeholder: 'Document name' },
        { name: 'category', label: 'Category', placeholder: 'Discovery, Contract, Design…' },
        { name: 'url', label: 'URL', required: true, placeholder: 'https://… or /client/…' },
        { name: 'visibility', label: 'Visibility', type: 'select', defaultValue: 'client', options: ['client', 'internal'] },
        { name: 'note', label: 'Note', type: 'textarea', full: true, placeholder: 'What is this file and why does it matter?' },
      ]}
    />
  ) : null;
  return (
    <>
      <PageHeader client={client} section="Documents" title="Documents & source files" description="Keep links, source notes, proposals, contracts, designs and deliverables attached to the client record." action={action} />
      <section className={styles.section}>
        <div className={styles.documentList}>
          {items.map((doc) => (
            <article className={styles.documentItem} key={doc.id}>
              <div className={styles.documentHeader}>
                <div><h3>{doc.title}</h3><div className={styles.metaRow}><span>{doc.category || 'Document'}</span>{doc.visibility === 'internal' ? <span className={styles.internalBadge}>Internal</span> : null}</div></div>
                {session.role === 'owner' ? <DeleteButton clientSlug={client.slug} collection="documents" id={doc.id} /> : null}
              </div>
              {doc.note ? <p className={styles.bodyText}>{doc.note}</p> : null}
              <a className={styles.documentLink} href={doc.url} target="_blank" rel="noreferrer">Open document ↗</a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

function Activity({ client, session }) {
  const items = clientVisibleItems(client.activity, session).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const action = session.role === 'owner' ? (
    <QuickAdd
      clientSlug={client.slug}
      collection="activity"
      title="Log activity"
      submitLabel="Add activity"
      fields={[
        { name: 'text', label: 'Activity', required: true, full: true, placeholder: 'What happened?' },
        { name: 'type', label: 'Type', placeholder: 'meeting, decision, delivery…' },
        { name: 'visibility', label: 'Visibility', type: 'select', defaultValue: 'client', options: ['client', 'internal'] },
      ]}
    />
  ) : null;
  return (
    <>
      <PageHeader client={client} section="Activity" title="Project memory" description="A chronological record of meaningful work, decisions and delivery events." action={action} />
      <section className={styles.section}>
        <div className={styles.card}>
          <ul className={styles.activityList}>
            {items.map((item) => (
              <li className={styles.activityItem} key={item.id}>
                <span className={styles.activityDot} />
                <span className={styles.activityText}>{item.text}{item.visibility === 'internal' ? <> <span className={styles.internalBadge}>Internal</span></> : null}</span>
                <span className={styles.activityTime}>{formatDateTime(item.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function Financials({ client, session }) {
  if (session.role !== 'owner') return null;
  return (
    <>
      <PageHeader client={client} section="Financials" title="Commercial working notes" description="Internal pricing and commercial planning. This section is never shown to client-role accounts." />
      <section className={styles.section}>
        <div className={styles.financialHero}>
          <span>Working MVP value range</span>
          <strong>{client.financials.workingRange}</strong>
          <p>{client.financials.estimateStatus}</p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.twoCol}>
          <div className={styles.card}><p className={styles.eyebrow}>Maintenance working range</p><h3>{client.financials.maintenanceRange}</h3></div>
          <div className={styles.card}><p className={styles.eyebrow}>Commercial notes</p><ul className={styles.cleanList}>{client.financials.notes.map((note) => <li key={note}>— {note}</li>)}</ul></div>
        </div>
      </section>
    </>
  );
}

export default function ClientWorkspace({ client, session, basePath, section = 'overview' }) {
  const allowed = new Set(['overview', 'discovery', 'meetings', 'requirements', 'mvp', 'tasks', 'documents', 'activity', 'financials']);
  const current = allowed.has(section) ? section : 'overview';

  let content;
  if (current === 'discovery') content = <Discovery client={client} session={session} />;
  else if (current === 'meetings') content = <Meetings client={client} session={session} />;
  else if (current === 'requirements') content = <Requirements client={client} session={session} />;
  else if (current === 'mvp') content = <Mvp client={client} session={session} />;
  else if (current === 'tasks') content = <Tasks client={client} session={session} />;
  else if (current === 'documents') content = <Documents client={client} session={session} />;
  else if (current === 'activity') content = <Activity client={client} session={session} />;
  else if (current === 'financials') content = <Financials client={client} session={session} />;
  else content = <Overview client={client} session={session} />;

  return (
    <PortalShell session={session} basePath={basePath} client={client} activeSection={current}>
      <div className={styles.page}>{content}</div>
    </PortalShell>
  );
}
