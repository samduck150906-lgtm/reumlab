// Completed source manifests only; integrated source, HTML and release QA remain required.
// Updated by work/register-completed-agency-pages.py, never by the keyword queue.
import type { AgencyPage } from './types';
import { expandedIndustry001210Pages } from '@/content/development-agency/expanded/industry-001-210/pages';
import { page as manuscript1 } from '@/content/development-agency/expanded/industry-211-420/ind-211-app';
import { page as manuscript2 } from '@/content/development-agency/expanded/industry-211-420/ind-211-booking';
import { page as manuscript3 } from '@/content/development-agency/expanded/industry-211-420/ind-211-ecommerce';
import { page as manuscript4 } from '@/content/development-agency/expanded/industry-211-420/ind-211-management';
import { page as manuscript5 } from '@/content/development-agency/expanded/industry-211-420/ind-211-order';
import { page as manuscript6 } from '@/content/development-agency/expanded/industry-211-420/ind-211-website';
import { page as manuscript7 } from '@/content/development-agency/expanded/industry-211-420/ind-212-platform';
import { page as manuscript8 } from '@/content/development-agency/expanded/industry-211-420/ind-213-platform';
import { page as manuscript9 } from '@/content/development-agency/expanded/industry-211-420/ind-214-booking';
import { page as manuscript10 } from '@/content/development-agency/expanded/industry-211-420/ind-214-platform';
import { page as manuscript11 } from '@/content/development-agency/expanded/industry-211-420/ind-215-platform';
import { page as manuscript12 } from '@/content/development-agency/expanded/industry-211-420/ind-216-platform';
import { page as manuscript13 } from '@/content/development-agency/expanded/industry-211-420/ind-217-platform';
import { page as manuscript14 } from '@/content/development-agency/expanded/industry-211-420/ind-218-platform';
import { page as manuscript15 } from '@/content/development-agency/expanded/industry-211-420/ind-219-platform';
import { page as manuscript16 } from '@/content/development-agency/expanded/industry-211-420/ind-220-platform';
import { page as manuscript17 } from '@/content/development-agency/expanded/industry-211-420/ind-221-platform';
import { page as manuscript18 } from '@/content/development-agency/expanded/industry-211-420/ind-222-platform';
import { page as manuscript19 } from '@/content/development-agency/expanded/industry-211-420/ind-223-app';
import { page as manuscript20 } from '@/content/development-agency/expanded/industry-211-420/ind-223-booking';
import { page as manuscript21 } from '@/content/development-agency/expanded/industry-211-420/ind-223-management';
import { page as manuscript22 } from '@/content/development-agency/expanded/industry-211-420/ind-223-platform';
import { page as manuscript23 } from '@/content/development-agency/expanded/industry-421-631/ind-421-ai';
import { page as manuscript24 } from '@/content/development-agency/expanded/industry-421-631/ind-421-booking';
import { page as manuscript25 } from '@/content/development-agency/expanded/industry-421-631/ind-421-management';
import { page as manuscript26 } from '@/content/development-agency/expanded/industry-421-631/ind-421-portal';
import { page as manuscript27 } from '@/content/development-agency/expanded/industry-421-631/ind-421-website';
import { page as manuscript28 } from '@/content/development-agency/expanded/industry-421-631/ind-425-app';
import { page as manuscript29 } from '@/content/development-agency/expanded/industry-421-631/ind-425-booking';
import { page as manuscript30 } from '@/content/development-agency/expanded/industry-421-631/ind-425-field';
import { page as manuscript31 } from '@/content/development-agency/expanded/industry-421-631/ind-425-management';
import { page as manuscript32 } from '@/content/development-agency/expanded/industry-421-631/ind-526-ai';

export const expandedAgencyPages: readonly AgencyPage[] = [
  ...expandedIndustry001210Pages,
  manuscript1,
  manuscript2,
  manuscript3,
  manuscript4,
  manuscript5,
  manuscript6,
  manuscript7,
  manuscript8,
  manuscript9,
  manuscript10,
  manuscript11,
  manuscript12,
  manuscript13,
  manuscript14,
  manuscript15,
  manuscript16,
  manuscript17,
  manuscript18,
  manuscript19,
  manuscript20,
  manuscript21,
  manuscript22,
  manuscript23,
  manuscript24,
  manuscript25,
  manuscript26,
  manuscript27,
  manuscript28,
  manuscript29,
  manuscript30,
  manuscript31,
  manuscript32,
];
