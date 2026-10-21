"use client";

import { useEffect } from 'react';

/** Keep the mobile hero and its links clear of the shared contact control. */
export default function AgencyContactVisibility({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    const hero = document.getElementById('agency-hero');
    if (!hero) return;
    const body = document.body;
    const attribute = 'data-agency-hero-clear';
    let active = true;
    const update = (visible: boolean) => {
      if (active) body.setAttribute(attribute, visible ? 'false' : 'true');
    };
    const rect = hero.getBoundingClientRect();
    update(rect.bottom > 72 && rect.top < window.innerHeight);
    if (typeof IntersectionObserver === 'undefined') {
      body.setAttribute(attribute, 'true');
      return () => { active = false; body.removeAttribute(attribute); };
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) update(entry.isIntersecting);
    }, { rootMargin: '-72px 0px 0px 0px', threshold: 0 });
    observer.observe(hero);
    return () => {
      active = false;
      observer.disconnect();
      body.removeAttribute(attribute);
    };
  }, [pageKey]);
  return null;
}
