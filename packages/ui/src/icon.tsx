import { FileIcon, TerminalIcon } from 'lucide-react';
import { createElement } from 'react';
import {
  type SimpleIcon,
  siFacebook,
  siGithub,
  siGoogle,
  siJavascript,
  siLinkedin,
  siMarkdown,
  siMdx,
  siReact,
  siTypescript,
  siX,
} from 'simple-icons';

// SECTION 1: App-level icon names used by config and shared UI data.
// Pass a SimpleIcon directly for one-off or data-driven technology icons.

const ICONS = {
  github: siGithub,
  x: siX,
  linkedin: siLinkedin,
  google: siGoogle,
  facebook: siFacebook,
} as const satisfies Record<string, SimpleIcon>;

export type IconName = keyof typeof ICONS;

function resolveIcon(icon: IconName | SimpleIcon): SimpleIcon {
  return typeof icon === 'string' ? ICONS[icon] : icon;
}

// SECTION 2: Public Icon component

interface IconProps {
  className?: string;
  icon: IconName | SimpleIcon;
}

const Icon = ({ icon, className }: IconProps) => {
  const resolved = resolveIcon(icon);

  return (
    <svg className={className} height="24" role="img" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <title>{resolved.title}</title>
      <path d={resolved.path} fill="currentColor" />
    </svg>
  );
};

export default Icon;

// SECTION 3: Code-block language icon resolution

interface IconType {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  language: string[];
}

const languageIcons: IconType[] = [
  {
    language: ['javascript', 'js', 'mjs', 'cjs'],
    icon: (props: React.SVGProps<SVGSVGElement>) => createElement(Icon, { icon: siJavascript, ...props }),
  },
  {
    language: ['typescript', 'ts', 'mts', 'cts'],
    icon: (props: React.SVGProps<SVGSVGElement>) => createElement(Icon, { icon: siTypescript, ...props }),
  },
  {
    language: ['jsx', 'tsx'],
    icon: (props: React.SVGProps<SVGSVGElement>) => createElement(Icon, { icon: siReact, ...props }),
  },
  {
    language: ['sh', 'bash', 'zsh'],
    icon: TerminalIcon,
  },
  {
    language: ['markdown', 'md'],
    icon: (props: React.SVGProps<SVGSVGElement>) => createElement(Icon, { icon: siMarkdown, ...props }),
  },
  {
    language: ['mdx'],
    icon: (props: React.SVGProps<SVGSVGElement>) => createElement(Icon, { icon: siMdx, ...props }),
  },
];

const languageToIcon = new Map<string, React.FC<React.SVGProps<SVGSVGElement>>>();

for (const entry of languageIcons) {
  for (const language of entry.language) {
    languageToIcon.set(language, entry.icon);
  }
}

export const getIconByLanguage = (language: string): React.FC<React.SVGProps<SVGSVGElement>> =>
  languageToIcon.get(language) ?? FileIcon;
