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
import { page as manuscript23 } from '@/content/development-agency/expanded/industry-211-420/ind-224-platform';
import { page as manuscript24 } from '@/content/development-agency/expanded/industry-211-420/ind-225-app';
import { page as manuscript25 } from '@/content/development-agency/expanded/industry-211-420/ind-225-booking';
import { page as manuscript26 } from '@/content/development-agency/expanded/industry-211-420/ind-225-management';
import { page as manuscript27 } from '@/content/development-agency/expanded/industry-211-420/ind-225-platform';
import { page as manuscript28 } from '@/content/development-agency/expanded/industry-211-420/ind-226-app';
import { page as manuscript29 } from '@/content/development-agency/expanded/industry-211-420/ind-226-booking';
import { page as manuscript30 } from '@/content/development-agency/expanded/industry-211-420/ind-226-management';
import { page as manuscript31 } from '@/content/development-agency/expanded/industry-211-420/ind-226-platform';
import { page as manuscript32 } from '@/content/development-agency/expanded/industry-211-420/ind-227-app';
import { page as manuscript33 } from '@/content/development-agency/expanded/industry-211-420/ind-227-booking';
import { page as manuscript34 } from '@/content/development-agency/expanded/industry-421-631/ind-421-ai';
import { page as manuscript35 } from '@/content/development-agency/expanded/industry-421-631/ind-421-booking';
import { page as manuscript36 } from '@/content/development-agency/expanded/industry-421-631/ind-421-management';
import { page as manuscript37 } from '@/content/development-agency/expanded/industry-421-631/ind-421-portal';
import { page as manuscript38 } from '@/content/development-agency/expanded/industry-421-631/ind-421-website';
import { page as manuscript39 } from '@/content/development-agency/expanded/industry-421-631/ind-425-app';
import { page as manuscript40 } from '@/content/development-agency/expanded/industry-421-631/ind-425-booking';
import { page as manuscript41 } from '@/content/development-agency/expanded/industry-421-631/ind-425-field';
import { page as manuscript42 } from '@/content/development-agency/expanded/industry-421-631/ind-425-management';
import { page as manuscript43 } from '@/content/development-agency/expanded/industry-421-631/ind-426-field';
import { page as manuscript44 } from '@/content/development-agency/expanded/industry-421-631/ind-427-field';
import { page as manuscript45 } from '@/content/development-agency/expanded/industry-421-631/ind-428-app';
import { page as manuscript46 } from '@/content/development-agency/expanded/industry-421-631/ind-428-booking';
import { page as manuscript47 } from '@/content/development-agency/expanded/industry-421-631/ind-428-field';
import { page as manuscript48 } from '@/content/development-agency/expanded/industry-421-631/ind-428-management';
import { page as manuscript49 } from '@/content/development-agency/expanded/industry-421-631/ind-429-app';
import { page as manuscript50 } from '@/content/development-agency/expanded/industry-421-631/ind-429-booking';
import { page as manuscript51 } from '@/content/development-agency/expanded/industry-421-631/ind-429-field';
import { page as manuscript52 } from '@/content/development-agency/expanded/industry-421-631/ind-429-management';
import { page as manuscript53 } from '@/content/development-agency/expanded/industry-421-631/ind-430-app';
import { page as manuscript54 } from '@/content/development-agency/expanded/industry-421-631/ind-430-booking';
import { page as manuscript55 } from '@/content/development-agency/expanded/industry-421-631/ind-430-field';
import { page as manuscript56 } from '@/content/development-agency/expanded/industry-421-631/ind-430-management';
import { page as manuscript57 } from '@/content/development-agency/expanded/industry-421-631/ind-431-app';
import { page as manuscript58 } from '@/content/development-agency/expanded/industry-421-631/ind-431-booking';
import { page as manuscript59 } from '@/content/development-agency/expanded/industry-421-631/ind-431-field';
import { page as manuscript60 } from '@/content/development-agency/expanded/industry-421-631/ind-431-management';
import { page as manuscript61 } from '@/content/development-agency/expanded/industry-421-631/ind-526-ai';

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
  manuscript33,
  manuscript34,
  manuscript35,
  manuscript36,
  manuscript37,
  manuscript38,
  manuscript39,
  manuscript40,
  manuscript41,
  manuscript42,
  manuscript43,
  manuscript44,
  manuscript45,
  manuscript46,
  manuscript47,
  manuscript48,
  manuscript49,
  manuscript50,
  manuscript51,
  manuscript52,
  manuscript53,
  manuscript54,
  manuscript55,
  manuscript56,
  manuscript57,
  manuscript58,
  manuscript59,
  manuscript60,
  manuscript61,
];
