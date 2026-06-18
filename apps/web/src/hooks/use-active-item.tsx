import { useEffect, useState } from 'react';

export default function useActiveItem(itemIds: (string | undefined)[]) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const ids = itemIds.filter((id): id is string => Boolean(id));
    let frameId: number | null = null;

    const updateActiveHeading = () => {
      const headings = ids
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => Boolean(element));

      if (!headings.length) {
        setActiveId('');
        return;
      }

      const offset = window.innerHeight * 0.2;
      let current = headings[0];

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= offset) {
          current = heading;
        } else {
          break;
        }
      }

      setActiveId(current.id);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActiveHeading();
      });
    };

    scheduleUpdate();
    const retryId = window.setTimeout(scheduleUpdate, 100);
    window.addEventListener('scroll', updateActiveHeading, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      window.clearTimeout(retryId);
      window.removeEventListener('scroll', updateActiveHeading);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, [itemIds]);

  return activeId;
}
