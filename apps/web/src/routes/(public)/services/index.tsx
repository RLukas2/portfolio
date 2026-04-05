import { createFileRoute } from '@tanstack/react-router';
import { siteConfig } from '@xbrk/config';
import Services from '@/components/services/services';
import PageHeading from '@/components/shared/page-heading';
import { seo } from '@/lib/seo';

export const Route = createFileRoute('/(public)/services/')({
  component: ServicesPage,
  head: () => {
    const seoData = seo({
      title: `Services | ${siteConfig.title}`,
      description:
        'Professional development services from concept to deployment. Web development, consulting, and technical solutions tailored to your needs.',
      keywords: [...siteConfig.keywords, 'services', 'freelance', 'consulting', 'web development'].join(' '),
    });

    return {
      meta: seoData.meta,
      links: seoData.links,
    };
  },
});

function ServicesPage() {
  return (
    <div className="space-y-8">
      <PageHeading
        description="Professional development services tailored to your business needs. From web applications to technical consulting, I help bring your ideas to life."
        title="Services"
      />
      <Services />
    </div>
  );
}
