import { useState, type FormEvent, type ReactNode } from 'react';
import { LINKS, PROJECTS, REPOS, STACK, type Project, type Repo } from './content';
import { useI18n } from './i18n';

const ext = { target: '_blank', rel: 'noopener noreferrer' } as const;

function Card({ id, tag, accent, wide, children }: { id: string; tag: string; accent?: 'red' | 'cyan' | 'green' | 'amber'; wide?: boolean; children: ReactNode }) {
  return (
    <article className={`card${wide ? ' card-wide' : ''}`}>
      <header className="card-header">
        <span className="card-id">{id}</span>
        <span className="card-tag">{tag}</span>
        <span className={`card-dot dot-${accent ?? 'red'}`} aria-hidden="true" />
      </header>
      {children}
    </article>
  );
}

export function HeroCard({ onContact }: { onContact: () => void }) {
  const { t } = useI18n();
  return (
    <Card id="00" tag={t('hero.kicker')} wide>
      <h1 className="hero-name">{t('hero.name')}</h1>
      <p className="hero-role">{t('hero.role')}</p>
      <p className="card-body">{t('hero.lede')}</p>
      <div className="actions">
        <a className="btn btn-primary" href={LINKS.company} {...ext}>
          {t('hero.company')}
        </a>
        <a className="btn" href={LINKS.cv} {...ext}>
          {t('hero.cv')}
        </a>
        <button type="button" className="btn" onClick={onContact}>
          {t('hero.contact')}
        </button>
      </div>
    </Card>
  );
}

export function AboutCard() {
  const { t } = useI18n();
  return (
    <Card id="01" tag={t('about.title')} accent="cyan">
      <h2>{t('about.heading')}</h2>
      <div className="card-body">
        <p>{t('about.p1')}</p>
        <p>
          {t('about.p2')}{' '}
          <a href={LINKS.company} {...ext}>
            zedigital.tech
          </a>
        </p>
      </div>
    </Card>
  );
}

export function HowCard() {
  const { t } = useI18n();
  return (
    <Card id="02" tag={t('how.title')} accent="cyan">
      <h2>{t('how.title')}</h2>
      <ol className="card-body steps">
        <li>{t('how.1')}</li>
        <li>{t('how.2')}</li>
        <li>{t('how.3')}</li>
      </ol>
    </Card>
  );
}

const STATUS_ACCENT: Record<Project['status'], 'green' | 'cyan' | 'amber'> = {
  live: 'green',
  'in-use': 'green',
  'read-only': 'cyan',
  pilot: 'cyan',
  'on-hold': 'amber',
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { t, pick } = useI18n();
  const accent = STATUS_ACCENT[project.status];
  return (
    <Card id={`P${String(index + 1).padStart(2, '0')}`} tag={t('work.title')} accent={accent}>
      <h2>{pick(project.name)}</h2>
      <p className={`status status-${accent}`}>{t(`status.${project.status}`)}</p>
      <p className="card-body">{pick(project.summary)}</p>
      <ul className="tags" aria-label="Stack">
        {project.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
      <footer className="card-footer">
        {project.link ? (
          <a href={project.link.href} {...ext}>
            {pick(project.link.label)} &#8599;
          </a>
        ) : (
          <span>{project.id === 'gb10' ? t('work.inhouse') : t('work.private')}</span>
        )}
      </footer>
    </Card>
  );
}

export function RepoCard({ repo, index }: { repo: Repo; index: number }) {
  const { t, pick } = useI18n();
  const href = `${LINKS.github}/${repo.name}`;
  return (
    <Card id={`R${String(index + 1).padStart(2, '0')}`} tag={repo.lang} accent="cyan">
      <h2 className="mono-title">{repo.name}</h2>
      <p className="card-body">{pick(repo.summary)}</p>
      <footer className="card-footer">
        <a href={href} {...ext} aria-label={`${t('oss.view')}: ${repo.name}`}>
          github.com/ezekaj/{repo.name} &#8599;
        </a>
      </footer>
    </Card>
  );
}

export function EducationCard() {
  const { t } = useI18n();
  return (
    <Card id="B1" tag={t('bg.edu')} accent="amber">
      <h2>{t('bg.edu')}</h2>
      <ul className="card-body plain">
        <li>{t('bg.42')}</li>
        <li>{t('bg.umt')}</li>
      </ul>
    </Card>
  );
}

export function LanguagesCard() {
  const { t } = useI18n();
  return (
    <Card id="B2" tag={t('bg.lang')} accent="amber">
      <h2>{t('bg.lang')}</h2>
      <p className="card-body">{t('bg.langs')}</p>
      <h3 className="sub">{t('bg.stack')}</h3>
      <ul className="tags">
        {STACK.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </Card>
  );
}

export function ContactCard() {
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const compose = () => {
    const parts = [message.trim()];
    if (name.trim()) parts.push(`\n${t('contact.from')}: ${name.trim()}`);
    return parts.join('\n').trim();
  };

  const sendEmail = (e?: FormEvent) => {
    e?.preventDefault();
    const subject = encodeURIComponent(t('contact.subject'));
    const body = encodeURIComponent(compose());
    window.location.href = `mailto:${LINKS.email}?subject=${subject}&body=${body}`;
  };

  const sendWhatsApp = () => {
    const text = encodeURIComponent(compose());
    window.open(`https://wa.me/${LINKS.whatsappNumber}${text ? `?text=${text}` : ''}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card id="C1" tag={t('contact.title')} accent="green" wide>
      <h2>{t('contact.title')}</h2>
      <p className="card-body">{t('contact.lede')}</p>
      <form className="contact-form" onSubmit={sendEmail}>
        <label>
          <span>{t('contact.name')}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} autoComplete="name" />
        </label>
        <label>
          <span>{t('contact.message')}</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={3} placeholder={t('contact.placeholder')} />
        </label>
        <div className="actions">
          <button type="submit" className="btn btn-primary">
            {t('contact.email')}
          </button>
          <button type="button" className="btn btn-green" onClick={sendWhatsApp}>
            {t('contact.whatsapp')}
          </button>
        </div>
        <p className="note">{t('contact.note')}</p>
      </form>
      <footer className="card-footer contact-direct">
        <span>{t('contact.direct')}:</span>
        <a href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
        <a href={LINKS.linkedin} {...ext}>
          LinkedIn
        </a>
        <a href={LINKS.github} {...ext}>
          GitHub
        </a>
      </footer>
    </Card>
  );
}

export { PROJECTS, REPOS };
