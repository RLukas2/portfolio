import { siteConfig } from '@xbrk/config';
import Link from '@/components/shared/link';

/**
 * Biography component displays personal introduction and professional background.
 *
 * This component presents the author's bio, technical skills, and professional philosophy.
 * It uses direct Tailwind classes for layout instead of Container component abstraction.
 *
 * Features:
 * - Personal introduction with name highlighting
 * - Technical skills organized by category (Languages, Frameworks, Databases, Tools)
 * - External links to technology documentation
 * - Professional philosophy and work approach
 * - Personal interests section
 *
 * @returns {React.ReactNode} The Biography component with personal and professional information
 */
const Biography = (): React.ReactNode => {
  return (
    <div className="flex flex-col gap-4">
      <p className="m-0! font-semibold text-xl">Hi there! Thanks for visiting my digital home on the internet.</p>
      <p className="m-0!">
        I'm <span className="font-bold text-primary">{siteConfig.author.name}</span>, a software engineer who genuinely
        enjoys building things that work and more importantly, things that matter to education, businesses, and users. I
        spend my time juggling both ends of the stack: frontend work and backend development.
      </p>
      <p className="m-0!">
        Over the years, I've learned how to architect systems that don't just technically work, but actually solve real
        problems. I've worked across the full spectrum, from crafting interactive user experiences to designing robust
        backend infrastructure that scales. Here's the toolkit I've built up:
      </p>
      <ul className="m-0! list-disc space-y-2 pl-6">
        <li>
          Languages:{' '}
          <Link href="https://www.typescriptlang.org/" variant="bold">
            TypeScript
          </Link>
          ,{' '}
          <Link href="https://www.javascript.com/" variant="bold">
            JavaScript
          </Link>
          ,{' '}
          <Link href="https://www.python.org/" variant="bold">
            Python
          </Link>
          ,{' '}
          <Link href="https://go.dev/" variant="bold">
            Go
          </Link>
          ,{' '}
          <Link href="https://en.cppreference.com/w/" variant="bold">
            C++
          </Link>
        </li>

        <li>
          Frontend Frameworks:{' '}
          <Link href="https://reactjs.org/" variant="bold">
            React
          </Link>
          ,{' '}
          <Link href="https://nextjs.org/" variant="bold">
            Next.js
          </Link>
        </li>

        <li>
          Backend Frameworks:{' '}
          <Link href="https://expressjs.com/" variant="bold">
            Express.js
          </Link>
          ,{' '}
          <Link href="https://fastapi.tiangolo.com/" variant="bold">
            FastAPI
          </Link>
          ,{' '}
          <Link href="https://gin-gonic.com/" variant="bold">
            Gin (Go)
          </Link>
          ,{' '}
          <Link href="https://pkg.go.dev/net/http" variant="bold">
            Go net/http
          </Link>
        </li>

        <li>
          Databases:{' '}
          <Link href="https://www.postgresql.org/" variant="bold">
            PostgreSQL
          </Link>
          ,{' '}
          <Link href="https://www.mongodb.com/" variant="bold">
            MongoDB
          </Link>
          ,{' '}
          <Link href="https://redis.io/" variant="bold">
            Redis
          </Link>
          ,{' '}
          <Link href="https://supabase.com/" variant="bold">
            Supabase
          </Link>
        </li>

        <li>
          Tools & Platforms:{' '}
          <Link href="https://www.docker.com/" variant="bold">
            Docker
          </Link>
          ,{' '}
          <Link href="https://www.postman.com/" variant="bold">
            Postman
          </Link>
          ,{' '}
          <Link href="https://git-scm.com/" variant="bold">
            Git
          </Link>
          ,{' '}
          <Link href="https://vercel.com/" variant="bold">
            Vercel
          </Link>
          ,{' '}
          <Link href="https://railway.app/" variant="bold">
            Railway
          </Link>
          ,{' '}
          <Link href="https://supabase.com/" variant="bold">
            Supabase
          </Link>
        </li>
      </ul>

      <p className="m-0!">
        What I really enjoy about my work is the collaborative side, understanding what an organization actually needs
        (beyond the technical requirements) and then engineering solutions suitable to those goals. It's not just about
        writing clean code; it's about writing code that creates tangible value.
      </p>

      <p className="m-0!">
        When I'm not coding, I'm usually unwinding with video games or music. Honestly, I think they're essential for
        maintaining sanity in this field. A healthy balance between shipping code and actually having a life? That's the
        real debugging skill. 🎮🎶
      </p>
    </div>
  );
};

export default Biography;
