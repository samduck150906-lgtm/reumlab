'use client';

import { useEffect } from 'react';

export default function HomeEffects() {
  useEffect(() => {
    const nav = document.getElementById('nav');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const handleScroll = () => {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
      if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    const pricingTabs = document.querySelectorAll('.pricing-tab');
    pricingTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        if (!tabName) return;
        document.querySelectorAll('.pricing-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.pricing-content').forEach((c) => c.classList.remove('active'));
        const content = document.getElementById(`${tabName}-pricing`);
        if (content) content.classList.add('active');
      });
    });

    const rvObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) en.target.classList.add('vis');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.rv').forEach((el) => rvObs.observe(el));

    const counterObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const target = +el.getAttribute('data-target');
          if (!target) return;
          const duration = 1800;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const v = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(v * target);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
          };
          requestAnimationFrame(step);
          counterObs.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('.counter').forEach((el) => counterObs.observe(el));

    const hashLinks = document.querySelectorAll('a[href^="#"]');
    hashLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
}
