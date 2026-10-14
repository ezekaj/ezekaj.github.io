import type { ReactNode } from 'react';
import { AboutCard, ContactCard, EducationCard, HeroCard, HowCard, LanguagesCard, ProjectCard, RepoCard, PROJECTS, REPOS } from './cards';

export interface SectionDef {
  id: string;
  navKey: string;
  bigKey: string;
  titleKey?: string;
  subKey?: string;
  cards: { key: string; node: ReactNode }[];
}

export function buildSections(onContact: () => void): SectionDef[] {
  return [
    {
      id: 'home',
      navKey: 'nav.home',
      bigKey: 'big.home',
      cards: [{ key: 'hero', node: <HeroCard onContact={onContact} /> }],
    },
    {
      id: 'about',
      navKey: 'nav.about',
      bigKey: 'big.about',
      cards: [
        { key: 'about', node: <AboutCard /> },
        { key: 'how', node: <HowCard /> },
      ],
    },
    {
      id: 'work',
      navKey: 'nav.work',
      bigKey: 'big.work',
      titleKey: 'work.title',
      subKey: 'work.sub',
      cards: PROJECTS.map((p, i) => ({ key: p.id, node: <ProjectCard project={p} index={i} /> })),
    },
    {
      id: 'open-source',
      navKey: 'nav.oss',
      bigKey: 'big.oss',
      titleKey: 'oss.title',
      subKey: 'oss.sub',
      cards: REPOS.map((r, i) => ({ key: r.name, node: <RepoCard repo={r} index={i} /> })),
    },
    {
      id: 'background',
      navKey: 'nav.background',
      bigKey: 'big.background',
      cards: [
        { key: 'edu', node: <EducationCard /> },
        { key: 'langs', node: <LanguagesCard /> },
      ],
    },
    {
      id: 'contact',
      navKey: 'nav.contact',
      bigKey: 'big.contact',
      cards: [{ key: 'contact', node: <ContactCard /> }],
    },
  ];
}
