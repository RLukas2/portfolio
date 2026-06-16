import { useSuspenseQuery } from '@tanstack/react-query';
import { m } from 'framer-motion';
import { containerVariantsFast, itemVariantsDown } from '@/lib/constants/framer-motion-variants';
import { queryKeys } from '@/lib/query-keys';
import { $getAllPublicServices } from '@/lib/server';
import EmptyState from '../shared/empty-state';
import ServiceCard from './service-card';

export default function Services() {
  const { data: services } = useSuspenseQuery({
    queryKey: queryKeys.service.listPublic(),
    queryFn: () => $getAllPublicServices(),
  });

  return (
    <section className="w-full">
      <div className="mb-6 flex flex-col items-center px-1 text-center sm:mb-10">
        <m.span
          animate={{ opacity: 1 }}
          className="fade-in mb-3 animate-in fill-mode-both font-medium text-primary text-sm uppercase tracking-widest delay-100 duration-500"
          initial={false}
          transition={{ delay: 0.1 }}
        >
          What I Offer
        </m.span>
        <m.h2
          animate={{ opacity: 1, y: 0 }}
          className="fade-in slide-in-from-bottom-4 animate-in fill-mode-both font-heading text-4xl tracking-tight delay-200 duration-500 sm:text-5xl"
          initial={false}
          transition={{ delay: 0.2 }}
        >
          Services That Drive Results
        </m.h2>
        <m.p
          animate={{ opacity: 1, y: 0 }}
          className="fade-in slide-in-from-bottom-4 mt-3 max-w-2xl animate-in fill-mode-both text-muted-foreground delay-300 duration-500"
          initial={false}
          transition={{ delay: 0.3 }}
        >
          From concept to deployment, I provide end-to-end development services tailored to your business needs.
        </m.p>
      </div>

      {services.length > 0 ? (
        <m.div
          animate="visible"
          className="flex flex-col gap-4 sm:gap-8"
          initial={false}
          variants={containerVariantsFast}
          viewport={{ once: true }}
          whileInView="visible"
        >
          {services.map((service) => (
            <m.div key={service.slug} variants={itemVariantsDown}>
              <ServiceCard service={service} />
            </m.div>
          ))}
        </m.div>
      ) : (
        <EmptyState message="Services are currently being crafted with care – check back soon!" />
      )}
    </section>
  );
}
