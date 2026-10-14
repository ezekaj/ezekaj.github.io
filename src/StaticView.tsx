import type { SectionDef } from './sections';
import { useI18n } from './i18n';

export default function StaticView({ sections }: { sections: SectionDef[] }) {
  const { t } = useI18n();
  return (
    <div className="static">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className={`static-section static-${section.id}`} aria-label={t(section.navKey)}>
          {section.id !== 'home' && (
            <div className="static-head">
              <p className="static-kicker" aria-hidden="true">
                {t(section.bigKey)}
              </p>
              {section.subKey && <p className="static-sub">{t(section.subKey)}</p>}
            </div>
          )}
          <div className={`static-grid${section.cards.length === 1 ? ' single' : ''}`}>
            {section.cards.map((card) => (
              <div key={card.key} className="static-cell">
                {card.node}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
