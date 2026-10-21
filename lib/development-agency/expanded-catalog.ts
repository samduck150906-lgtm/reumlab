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
import { page as manuscript34 } from '@/content/development-agency/expanded/industry-211-420/ind-227-management';
import { page as manuscript35 } from '@/content/development-agency/expanded/industry-211-420/ind-227-platform';
import { page as manuscript36 } from '@/content/development-agency/expanded/industry-211-420/ind-228-app';
import { page as manuscript37 } from '@/content/development-agency/expanded/industry-211-420/ind-228-booking';
import { page as manuscript38 } from '@/content/development-agency/expanded/industry-211-420/ind-228-management';
import { page as manuscript39 } from '@/content/development-agency/expanded/industry-211-420/ind-228-platform';
import { page as manuscript40 } from '@/content/development-agency/expanded/industry-211-420/ind-229-booking';
import { page as manuscript41 } from '@/content/development-agency/expanded/industry-211-420/ind-229-platform';
import { page as manuscript42 } from '@/content/development-agency/expanded/industry-211-420/ind-230-app';
import { page as manuscript43 } from '@/content/development-agency/expanded/industry-211-420/ind-230-booking';
import { page as manuscript44 } from '@/content/development-agency/expanded/industry-211-420/ind-230-management';
import { page as manuscript45 } from '@/content/development-agency/expanded/industry-211-420/ind-230-platform';
import { page as manuscript46 } from '@/content/development-agency/expanded/industry-211-420/ind-231-app';
import { page as manuscript47 } from '@/content/development-agency/expanded/industry-211-420/ind-231-booking';
import { page as manuscript48 } from '@/content/development-agency/expanded/industry-211-420/ind-231-management';
import { page as manuscript49 } from '@/content/development-agency/expanded/industry-211-420/ind-231-platform';
import { page as manuscript50 } from '@/content/development-agency/expanded/industry-211-420/ind-232-platform';
import { page as manuscript51 } from '@/content/development-agency/expanded/industry-211-420/ind-232-website';
import { page as manuscript52 } from '@/content/development-agency/expanded/industry-211-420/ind-233-platform';
import { page as manuscript53 } from '@/content/development-agency/expanded/industry-211-420/ind-233-website';
import { page as manuscript54 } from '@/content/development-agency/expanded/industry-211-420/ind-234-platform';
import { page as manuscript55 } from '@/content/development-agency/expanded/industry-211-420/ind-234-website';
import { page as manuscript56 } from '@/content/development-agency/expanded/industry-211-420/ind-235-platform';
import { page as manuscript57 } from '@/content/development-agency/expanded/industry-211-420/ind-235-website';
import { page as manuscript58 } from '@/content/development-agency/expanded/industry-211-420/ind-236-app';
import { page as manuscript59 } from '@/content/development-agency/expanded/industry-211-420/ind-236-booking';
import { page as manuscript60 } from '@/content/development-agency/expanded/industry-211-420/ind-236-management';
import { page as manuscript61 } from '@/content/development-agency/expanded/industry-211-420/ind-236-website';
import { page as manuscript62 } from '@/content/development-agency/expanded/industry-211-420/ind-237-app';
import { page as manuscript63 } from '@/content/development-agency/expanded/industry-211-420/ind-237-booking';
import { page as manuscript64 } from '@/content/development-agency/expanded/industry-211-420/ind-237-management';
import { page as manuscript65 } from '@/content/development-agency/expanded/industry-211-420/ind-237-website';
import { page as manuscript66 } from '@/content/development-agency/expanded/industry-211-420/ind-238-app';
import { page as manuscript67 } from '@/content/development-agency/expanded/industry-211-420/ind-238-booking';
import { page as manuscript68 } from '@/content/development-agency/expanded/industry-211-420/ind-238-management';
import { page as manuscript69 } from '@/content/development-agency/expanded/industry-211-420/ind-238-platform';
import { page as manuscript70 } from '@/content/development-agency/expanded/industry-211-420/ind-238-website';
import { page as manuscript71 } from '@/content/development-agency/expanded/industry-211-420/ind-239-app';
import { page as manuscript72 } from '@/content/development-agency/expanded/industry-211-420/ind-239-booking';
import { page as manuscript73 } from '@/content/development-agency/expanded/industry-211-420/ind-239-management';
import { page as manuscript74 } from '@/content/development-agency/expanded/industry-211-420/ind-239-platform';
import { page as manuscript75 } from '@/content/development-agency/expanded/industry-211-420/ind-239-website';
import { page as manuscript76 } from '@/content/development-agency/expanded/industry-211-420/ind-240-app';
import { page as manuscript77 } from '@/content/development-agency/expanded/industry-211-420/ind-240-booking';
import { page as manuscript78 } from '@/content/development-agency/expanded/industry-211-420/ind-240-management';
import { page as manuscript79 } from '@/content/development-agency/expanded/industry-211-420/ind-240-platform';
import { page as manuscript80 } from '@/content/development-agency/expanded/industry-211-420/ind-240-website';
import { page as manuscript81 } from '@/content/development-agency/expanded/industry-211-420/ind-241-app';
import { page as manuscript82 } from '@/content/development-agency/expanded/industry-211-420/ind-241-booking';
import { page as manuscript83 } from '@/content/development-agency/expanded/industry-211-420/ind-241-management';
import { page as manuscript84 } from '@/content/development-agency/expanded/industry-211-420/ind-241-website';
import { page as manuscript85 } from '@/content/development-agency/expanded/industry-211-420/ind-242-app';
import { page as manuscript86 } from '@/content/development-agency/expanded/industry-211-420/ind-242-booking';
import { page as manuscript87 } from '@/content/development-agency/expanded/industry-211-420/ind-242-management';
import { page as manuscript88 } from '@/content/development-agency/expanded/industry-211-420/ind-242-website';
import { page as manuscript89 } from '@/content/development-agency/expanded/industry-211-420/ind-243-app';
import { page as manuscript90 } from '@/content/development-agency/expanded/industry-211-420/ind-243-booking';
import { page as manuscript91 } from '@/content/development-agency/expanded/industry-211-420/ind-243-management';
import { page as manuscript92 } from '@/content/development-agency/expanded/industry-211-420/ind-243-platform';
import { page as manuscript93 } from '@/content/development-agency/expanded/industry-211-420/ind-243-website';
import { page as manuscript94 } from '@/content/development-agency/expanded/industry-211-420/ind-244-app';
import { page as manuscript95 } from '@/content/development-agency/expanded/industry-211-420/ind-244-booking';
import { page as manuscript96 } from '@/content/development-agency/expanded/industry-211-420/ind-244-management';
import { page as manuscript97 } from '@/content/development-agency/expanded/industry-211-420/ind-244-platform';
import { page as manuscript98 } from '@/content/development-agency/expanded/industry-211-420/ind-244-website';
import { page as manuscript99 } from '@/content/development-agency/expanded/industry-211-420/ind-245-ai';
import { page as manuscript100 } from '@/content/development-agency/expanded/industry-211-420/ind-245-platform';
import { page as manuscript101 } from '@/content/development-agency/expanded/industry-211-420/ind-246-ai';
import { page as manuscript102 } from '@/content/development-agency/expanded/industry-211-420/ind-246-platform';
import { page as manuscript103 } from '@/content/development-agency/expanded/industry-211-420/ind-247-ai';
import { page as manuscript104 } from '@/content/development-agency/expanded/industry-211-420/ind-247-platform';
import { page as manuscript105 } from '@/content/development-agency/expanded/industry-211-420/ind-248-ai';
import { page as manuscript106 } from '@/content/development-agency/expanded/industry-211-420/ind-248-app';
import { page as manuscript107 } from '@/content/development-agency/expanded/industry-211-420/ind-248-ecommerce';
import { page as manuscript108 } from '@/content/development-agency/expanded/industry-211-420/ind-248-management';
import { page as manuscript109 } from '@/content/development-agency/expanded/industry-211-420/ind-248-platform';
import { page as manuscript110 } from '@/content/development-agency/expanded/industry-211-420/ind-249-ai';
import { page as manuscript111 } from '@/content/development-agency/expanded/industry-211-420/ind-249-app';
import { page as manuscript112 } from '@/content/development-agency/expanded/industry-211-420/ind-249-ecommerce';
import { page as manuscript113 } from '@/content/development-agency/expanded/industry-211-420/ind-249-management';
import { page as manuscript114 } from '@/content/development-agency/expanded/industry-211-420/ind-249-platform';
import { page as manuscript115 } from '@/content/development-agency/expanded/industry-211-420/ind-250-ai';
import { page as manuscript116 } from '@/content/development-agency/expanded/industry-211-420/ind-250-platform';
import { page as manuscript117 } from '@/content/development-agency/expanded/industry-211-420/ind-251-ai';
import { page as manuscript118 } from '@/content/development-agency/expanded/industry-211-420/ind-251-app';
import { page as manuscript119 } from '@/content/development-agency/expanded/industry-211-420/ind-251-ecommerce';
import { page as manuscript120 } from '@/content/development-agency/expanded/industry-211-420/ind-251-management';
import { page as manuscript121 } from '@/content/development-agency/expanded/industry-211-420/ind-251-platform';
import { page as manuscript122 } from '@/content/development-agency/expanded/industry-211-420/ind-252-ai';
import { page as manuscript123 } from '@/content/development-agency/expanded/industry-211-420/ind-252-ecommerce';
import { page as manuscript124 } from '@/content/development-agency/expanded/industry-211-420/ind-252-platform';
import { page as manuscript125 } from '@/content/development-agency/expanded/industry-211-420/ind-253-ai';
import { page as manuscript126 } from '@/content/development-agency/expanded/industry-211-420/ind-253-app';
import { page as manuscript127 } from '@/content/development-agency/expanded/industry-211-420/ind-253-ecommerce';
import { page as manuscript128 } from '@/content/development-agency/expanded/industry-211-420/ind-253-management';
import { page as manuscript129 } from '@/content/development-agency/expanded/industry-211-420/ind-253-platform';
import { page as manuscript130 } from '@/content/development-agency/expanded/industry-211-420/ind-254-ai';
import { page as manuscript131 } from '@/content/development-agency/expanded/industry-211-420/ind-254-platform';
import { page as manuscript132 } from '@/content/development-agency/expanded/industry-211-420/ind-255-ai';
import { page as manuscript133 } from '@/content/development-agency/expanded/industry-211-420/ind-255-platform';
import { page as manuscript134 } from '@/content/development-agency/expanded/industry-211-420/ind-256-ai';
import { page as manuscript135 } from '@/content/development-agency/expanded/industry-211-420/ind-256-app';
import { page as manuscript136 } from '@/content/development-agency/expanded/industry-211-420/ind-256-ecommerce';
import { page as manuscript137 } from '@/content/development-agency/expanded/industry-211-420/ind-256-management';
import { page as manuscript138 } from '@/content/development-agency/expanded/industry-211-420/ind-256-platform';
import { page as manuscript139 } from '@/content/development-agency/expanded/industry-211-420/ind-257-ai';
import { page as manuscript140 } from '@/content/development-agency/expanded/industry-211-420/ind-257-app';
import { page as manuscript141 } from '@/content/development-agency/expanded/industry-211-420/ind-257-ecommerce';
import { page as manuscript142 } from '@/content/development-agency/expanded/industry-211-420/ind-257-management';
import { page as manuscript143 } from '@/content/development-agency/expanded/industry-211-420/ind-257-platform';
import { page as manuscript144 } from '@/content/development-agency/expanded/industry-211-420/ind-258-ai';
import { page as manuscript145 } from '@/content/development-agency/expanded/industry-211-420/ind-258-app';
import { page as manuscript146 } from '@/content/development-agency/expanded/industry-211-420/ind-258-ecommerce';
import { page as manuscript147 } from '@/content/development-agency/expanded/industry-211-420/ind-258-management';
import { page as manuscript148 } from '@/content/development-agency/expanded/industry-211-420/ind-258-platform';
import { page as manuscript149 } from '@/content/development-agency/expanded/industry-211-420/ind-259-ai';
import { page as manuscript150 } from '@/content/development-agency/expanded/industry-211-420/ind-259-app';
import { page as manuscript151 } from '@/content/development-agency/expanded/industry-211-420/ind-259-ecommerce';
import { page as manuscript152 } from '@/content/development-agency/expanded/industry-211-420/ind-259-management';
import { page as manuscript153 } from '@/content/development-agency/expanded/industry-211-420/ind-259-platform';
import { page as manuscript154 } from '@/content/development-agency/expanded/industry-211-420/ind-260-ai';
import { page as manuscript155 } from '@/content/development-agency/expanded/industry-211-420/ind-261-ai';
import { page as manuscript156 } from '@/content/development-agency/expanded/industry-211-420/ind-261-app';
import { page as manuscript157 } from '@/content/development-agency/expanded/industry-211-420/ind-261-ecommerce';
import { page as manuscript158 } from '@/content/development-agency/expanded/industry-211-420/ind-261-management';
import { page as manuscript159 } from '@/content/development-agency/expanded/industry-211-420/ind-261-platform';
import { page as manuscript160 } from '@/content/development-agency/expanded/industry-211-420/ind-262-ai';
import { page as manuscript161 } from '@/content/development-agency/expanded/industry-211-420/ind-262-ecommerce';
import { page as manuscript162 } from '@/content/development-agency/expanded/industry-211-420/ind-262-platform';
import { page as manuscript163 } from '@/content/development-agency/expanded/industry-211-420/ind-263-ai';
import { page as manuscript164 } from '@/content/development-agency/expanded/industry-211-420/ind-263-platform';
import { page as manuscript165 } from '@/content/development-agency/expanded/industry-211-420/ind-263-website';
import { page as manuscript166 } from '@/content/development-agency/expanded/industry-211-420/ind-264-ai';
import { page as manuscript167 } from '@/content/development-agency/expanded/industry-211-420/ind-264-app';
import { page as manuscript168 } from '@/content/development-agency/expanded/industry-211-420/ind-264-ecommerce';
import { page as manuscript169 } from '@/content/development-agency/expanded/industry-211-420/ind-264-management';
import { page as manuscript170 } from '@/content/development-agency/expanded/industry-211-420/ind-264-platform';
import { page as manuscript171 } from '@/content/development-agency/expanded/industry-211-420/ind-264-website';
import { page as manuscript172 } from '@/content/development-agency/expanded/industry-421-631/ind-421-ai';
import { page as manuscript173 } from '@/content/development-agency/expanded/industry-421-631/ind-421-booking';
import { page as manuscript174 } from '@/content/development-agency/expanded/industry-421-631/ind-421-management';
import { page as manuscript175 } from '@/content/development-agency/expanded/industry-421-631/ind-421-portal';
import { page as manuscript176 } from '@/content/development-agency/expanded/industry-421-631/ind-421-website';
import { page as manuscript177 } from '@/content/development-agency/expanded/industry-421-631/ind-425-app';
import { page as manuscript178 } from '@/content/development-agency/expanded/industry-421-631/ind-425-booking';
import { page as manuscript179 } from '@/content/development-agency/expanded/industry-421-631/ind-425-field';
import { page as manuscript180 } from '@/content/development-agency/expanded/industry-421-631/ind-425-management';
import { page as manuscript181 } from '@/content/development-agency/expanded/industry-421-631/ind-426-field';
import { page as manuscript182 } from '@/content/development-agency/expanded/industry-421-631/ind-427-field';
import { page as manuscript183 } from '@/content/development-agency/expanded/industry-421-631/ind-428-app';
import { page as manuscript184 } from '@/content/development-agency/expanded/industry-421-631/ind-428-booking';
import { page as manuscript185 } from '@/content/development-agency/expanded/industry-421-631/ind-428-field';
import { page as manuscript186 } from '@/content/development-agency/expanded/industry-421-631/ind-428-management';
import { page as manuscript187 } from '@/content/development-agency/expanded/industry-421-631/ind-429-app';
import { page as manuscript188 } from '@/content/development-agency/expanded/industry-421-631/ind-429-booking';
import { page as manuscript189 } from '@/content/development-agency/expanded/industry-421-631/ind-429-field';
import { page as manuscript190 } from '@/content/development-agency/expanded/industry-421-631/ind-429-management';
import { page as manuscript191 } from '@/content/development-agency/expanded/industry-421-631/ind-430-app';
import { page as manuscript192 } from '@/content/development-agency/expanded/industry-421-631/ind-430-booking';
import { page as manuscript193 } from '@/content/development-agency/expanded/industry-421-631/ind-430-field';
import { page as manuscript194 } from '@/content/development-agency/expanded/industry-421-631/ind-430-management';
import { page as manuscript195 } from '@/content/development-agency/expanded/industry-421-631/ind-431-app';
import { page as manuscript196 } from '@/content/development-agency/expanded/industry-421-631/ind-431-booking';
import { page as manuscript197 } from '@/content/development-agency/expanded/industry-421-631/ind-431-field';
import { page as manuscript198 } from '@/content/development-agency/expanded/industry-421-631/ind-431-management';
import { page as manuscript199 } from '@/content/development-agency/expanded/industry-421-631/ind-432-booking';
import { page as manuscript200 } from '@/content/development-agency/expanded/industry-421-631/ind-432-field';
import { page as manuscript201 } from '@/content/development-agency/expanded/industry-421-631/ind-433-app';
import { page as manuscript202 } from '@/content/development-agency/expanded/industry-421-631/ind-433-booking';
import { page as manuscript203 } from '@/content/development-agency/expanded/industry-421-631/ind-433-field';
import { page as manuscript204 } from '@/content/development-agency/expanded/industry-421-631/ind-433-management';
import { page as manuscript205 } from '@/content/development-agency/expanded/industry-421-631/ind-434-app';
import { page as manuscript206 } from '@/content/development-agency/expanded/industry-421-631/ind-434-booking';
import { page as manuscript207 } from '@/content/development-agency/expanded/industry-421-631/ind-434-field';
import { page as manuscript208 } from '@/content/development-agency/expanded/industry-421-631/ind-434-management';
import { page as manuscript209 } from '@/content/development-agency/expanded/industry-421-631/ind-435-app';
import { page as manuscript210 } from '@/content/development-agency/expanded/industry-421-631/ind-435-booking';
import { page as manuscript211 } from '@/content/development-agency/expanded/industry-421-631/ind-435-field';
import { page as manuscript212 } from '@/content/development-agency/expanded/industry-421-631/ind-435-management';
import { page as manuscript213 } from '@/content/development-agency/expanded/industry-421-631/ind-436-booking';
import { page as manuscript214 } from '@/content/development-agency/expanded/industry-421-631/ind-437-booking';
import { page as manuscript215 } from '@/content/development-agency/expanded/industry-421-631/ind-438-booking';
import { page as manuscript216 } from '@/content/development-agency/expanded/industry-421-631/ind-439-app';
import { page as manuscript217 } from '@/content/development-agency/expanded/industry-421-631/ind-439-booking';
import { page as manuscript218 } from '@/content/development-agency/expanded/industry-421-631/ind-439-field';
import { page as manuscript219 } from '@/content/development-agency/expanded/industry-421-631/ind-439-management';
import { page as manuscript220 } from '@/content/development-agency/expanded/industry-421-631/ind-440-app';
import { page as manuscript221 } from '@/content/development-agency/expanded/industry-421-631/ind-440-booking';
import { page as manuscript222 } from '@/content/development-agency/expanded/industry-421-631/ind-440-field';
import { page as manuscript223 } from '@/content/development-agency/expanded/industry-421-631/ind-440-management';
import { page as manuscript224 } from '@/content/development-agency/expanded/industry-421-631/ind-441-booking';
import { page as manuscript225 } from '@/content/development-agency/expanded/industry-421-631/ind-441-field';
import { page as manuscript226 } from '@/content/development-agency/expanded/industry-421-631/ind-442-app';
import { page as manuscript227 } from '@/content/development-agency/expanded/industry-421-631/ind-442-booking';
import { page as manuscript228 } from '@/content/development-agency/expanded/industry-421-631/ind-442-field';
import { page as manuscript229 } from '@/content/development-agency/expanded/industry-421-631/ind-442-management';
import { page as manuscript230 } from '@/content/development-agency/expanded/industry-421-631/ind-442-website';
import { page as manuscript231 } from '@/content/development-agency/expanded/industry-421-631/ind-443-app';
import { page as manuscript232 } from '@/content/development-agency/expanded/industry-421-631/ind-443-booking';
import { page as manuscript233 } from '@/content/development-agency/expanded/industry-421-631/ind-443-field';
import { page as manuscript234 } from '@/content/development-agency/expanded/industry-421-631/ind-443-management';
import { page as manuscript235 } from '@/content/development-agency/expanded/industry-421-631/ind-443-website';
import { page as manuscript236 } from '@/content/development-agency/expanded/industry-421-631/ind-444-app';
import { page as manuscript237 } from '@/content/development-agency/expanded/industry-421-631/ind-444-booking';
import { page as manuscript238 } from '@/content/development-agency/expanded/industry-421-631/ind-444-field';
import { page as manuscript239 } from '@/content/development-agency/expanded/industry-421-631/ind-444-management';
import { page as manuscript240 } from '@/content/development-agency/expanded/industry-421-631/ind-444-website';
import { page as manuscript241 } from '@/content/development-agency/expanded/industry-421-631/ind-445-booking';
import { page as manuscript242 } from '@/content/development-agency/expanded/industry-421-631/ind-445-website';
import { page as manuscript243 } from '@/content/development-agency/expanded/industry-421-631/ind-446-app';
import { page as manuscript244 } from '@/content/development-agency/expanded/industry-421-631/ind-446-booking';
import { page as manuscript245 } from '@/content/development-agency/expanded/industry-421-631/ind-446-field';
import { page as manuscript246 } from '@/content/development-agency/expanded/industry-421-631/ind-446-management';
import { page as manuscript247 } from '@/content/development-agency/expanded/industry-421-631/ind-446-website';
import { page as manuscript248 } from '@/content/development-agency/expanded/industry-421-631/ind-447-booking';
import { page as manuscript249 } from '@/content/development-agency/expanded/industry-421-631/ind-447-website';
import { page as manuscript250 } from '@/content/development-agency/expanded/industry-421-631/ind-448-booking';
import { page as manuscript251 } from '@/content/development-agency/expanded/industry-421-631/ind-448-website';
import { page as manuscript252 } from '@/content/development-agency/expanded/industry-421-631/ind-449-booking';
import { page as manuscript253 } from '@/content/development-agency/expanded/industry-421-631/ind-449-website';
import { page as manuscript254 } from '@/content/development-agency/expanded/industry-421-631/ind-450-app';
import { page as manuscript255 } from '@/content/development-agency/expanded/industry-421-631/ind-450-booking';
import { page as manuscript256 } from '@/content/development-agency/expanded/industry-421-631/ind-450-field';
import { page as manuscript257 } from '@/content/development-agency/expanded/industry-421-631/ind-450-management';
import { page as manuscript258 } from '@/content/development-agency/expanded/industry-421-631/ind-450-website';
import { page as manuscript259 } from '@/content/development-agency/expanded/industry-421-631/ind-451-booking';
import { page as manuscript260 } from '@/content/development-agency/expanded/industry-421-631/ind-451-website';
import { page as manuscript261 } from '@/content/development-agency/expanded/industry-421-631/ind-452-app';
import { page as manuscript262 } from '@/content/development-agency/expanded/industry-421-631/ind-452-booking';
import { page as manuscript263 } from '@/content/development-agency/expanded/industry-421-631/ind-452-field';
import { page as manuscript264 } from '@/content/development-agency/expanded/industry-421-631/ind-452-management';
import { page as manuscript265 } from '@/content/development-agency/expanded/industry-421-631/ind-452-website';
import { page as manuscript266 } from '@/content/development-agency/expanded/industry-421-631/ind-453-booking';
import { page as manuscript267 } from '@/content/development-agency/expanded/industry-421-631/ind-453-website';
import { page as manuscript268 } from '@/content/development-agency/expanded/industry-421-631/ind-454-app';
import { page as manuscript269 } from '@/content/development-agency/expanded/industry-421-631/ind-454-booking';
import { page as manuscript270 } from '@/content/development-agency/expanded/industry-421-631/ind-454-field';
import { page as manuscript271 } from '@/content/development-agency/expanded/industry-421-631/ind-454-management';
import { page as manuscript272 } from '@/content/development-agency/expanded/industry-421-631/ind-454-website';
import { page as manuscript273 } from '@/content/development-agency/expanded/industry-421-631/ind-455-website';
import { page as manuscript274 } from '@/content/development-agency/expanded/industry-421-631/ind-456-booking';
import { page as manuscript275 } from '@/content/development-agency/expanded/industry-421-631/ind-456-ecommerce';
import { page as manuscript276 } from '@/content/development-agency/expanded/industry-421-631/ind-457-app';
import { page as manuscript277 } from '@/content/development-agency/expanded/industry-421-631/ind-457-booking';
import { page as manuscript278 } from '@/content/development-agency/expanded/industry-421-631/ind-457-ecommerce';
import { page as manuscript279 } from '@/content/development-agency/expanded/industry-421-631/ind-457-management';
import { page as manuscript280 } from '@/content/development-agency/expanded/industry-421-631/ind-458-app';
import { page as manuscript281 } from '@/content/development-agency/expanded/industry-421-631/ind-458-booking';
import { page as manuscript282 } from '@/content/development-agency/expanded/industry-421-631/ind-458-ecommerce';
import { page as manuscript283 } from '@/content/development-agency/expanded/industry-421-631/ind-458-management';
import { page as manuscript284 } from '@/content/development-agency/expanded/industry-421-631/ind-458-website';
import { page as manuscript285 } from '@/content/development-agency/expanded/industry-421-631/ind-459-ecommerce';
import { page as manuscript286 } from '@/content/development-agency/expanded/industry-421-631/ind-460-booking';
import { page as manuscript287 } from '@/content/development-agency/expanded/industry-421-631/ind-460-ecommerce';
import { page as manuscript288 } from '@/content/development-agency/expanded/industry-421-631/ind-461-booking';
import { page as manuscript289 } from '@/content/development-agency/expanded/industry-421-631/ind-461-ecommerce';
import { page as manuscript290 } from '@/content/development-agency/expanded/industry-421-631/ind-462-ecommerce';
import { page as manuscript291 } from '@/content/development-agency/expanded/industry-421-631/ind-463-booking';
import { page as manuscript292 } from '@/content/development-agency/expanded/industry-421-631/ind-463-ecommerce';
import { page as manuscript293 } from '@/content/development-agency/expanded/industry-421-631/ind-464-booking';
import { page as manuscript294 } from '@/content/development-agency/expanded/industry-421-631/ind-464-ecommerce';
import { page as manuscript295 } from '@/content/development-agency/expanded/industry-421-631/ind-465-app';
import { page as manuscript296 } from '@/content/development-agency/expanded/industry-421-631/ind-465-booking';
import { page as manuscript297 } from '@/content/development-agency/expanded/industry-421-631/ind-465-ecommerce';
import { page as manuscript298 } from '@/content/development-agency/expanded/industry-421-631/ind-465-management';
import { page as manuscript299 } from '@/content/development-agency/expanded/industry-421-631/ind-466-app';
import { page as manuscript300 } from '@/content/development-agency/expanded/industry-421-631/ind-466-booking';
import { page as manuscript301 } from '@/content/development-agency/expanded/industry-421-631/ind-466-ecommerce';
import { page as manuscript302 } from '@/content/development-agency/expanded/industry-421-631/ind-466-management';
import { page as manuscript303 } from '@/content/development-agency/expanded/industry-421-631/ind-467-app';
import { page as manuscript304 } from '@/content/development-agency/expanded/industry-421-631/ind-467-booking';
import { page as manuscript305 } from '@/content/development-agency/expanded/industry-421-631/ind-467-ecommerce';
import { page as manuscript306 } from '@/content/development-agency/expanded/industry-421-631/ind-467-management';
import { page as manuscript307 } from '@/content/development-agency/expanded/industry-421-631/ind-526-ai';
import { page as manuscript308 } from '@/content/development-agency/expanded/industry-421-631/ind-616-ai';
import { page as manuscript309 } from '@/content/development-agency/expanded/industry-421-631/ind-616-field';
import { page as manuscript310 } from '@/content/development-agency/expanded/industry-421-631/ind-616-management';
import { page as manuscript311 } from '@/content/development-agency/expanded/industry-421-631/ind-616-portal';
import { page as manuscript312 } from '@/content/development-agency/expanded/industry-421-631/ind-616-website';
import { page as manuscript313 } from '@/content/development-agency/expanded/industry-421-631/ind-617-ai';
import { page as manuscript314 } from '@/content/development-agency/expanded/industry-421-631/ind-617-field';
import { page as manuscript315 } from '@/content/development-agency/expanded/industry-421-631/ind-617-management';
import { page as manuscript316 } from '@/content/development-agency/expanded/industry-421-631/ind-617-portal';
import { page as manuscript317 } from '@/content/development-agency/expanded/industry-421-631/ind-617-website';
import { page as manuscript318 } from '@/content/development-agency/expanded/industry-421-631/ind-618-ai';
import { page as manuscript319 } from '@/content/development-agency/expanded/industry-421-631/ind-618-field';
import { page as manuscript320 } from '@/content/development-agency/expanded/industry-421-631/ind-618-management';
import { page as manuscript321 } from '@/content/development-agency/expanded/industry-421-631/ind-618-portal';
import { page as manuscript322 } from '@/content/development-agency/expanded/industry-421-631/ind-618-website';
import { page as manuscript323 } from '@/content/development-agency/expanded/industry-421-631/ind-619-ai';
import { page as manuscript324 } from '@/content/development-agency/expanded/industry-421-631/ind-619-field';
import { page as manuscript325 } from '@/content/development-agency/expanded/industry-421-631/ind-619-management';
import { page as manuscript326 } from '@/content/development-agency/expanded/industry-421-631/ind-619-portal';
import { page as manuscript327 } from '@/content/development-agency/expanded/industry-421-631/ind-619-website';
import { page as manuscript328 } from '@/content/development-agency/expanded/industry-421-631/ind-620-ai';
import { page as manuscript329 } from '@/content/development-agency/expanded/industry-421-631/ind-620-field';
import { page as manuscript330 } from '@/content/development-agency/expanded/industry-421-631/ind-620-management';
import { page as manuscript331 } from '@/content/development-agency/expanded/industry-421-631/ind-620-portal';
import { page as manuscript332 } from '@/content/development-agency/expanded/industry-421-631/ind-620-website';

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
  manuscript62,
  manuscript63,
  manuscript64,
  manuscript65,
  manuscript66,
  manuscript67,
  manuscript68,
  manuscript69,
  manuscript70,
  manuscript71,
  manuscript72,
  manuscript73,
  manuscript74,
  manuscript75,
  manuscript76,
  manuscript77,
  manuscript78,
  manuscript79,
  manuscript80,
  manuscript81,
  manuscript82,
  manuscript83,
  manuscript84,
  manuscript85,
  manuscript86,
  manuscript87,
  manuscript88,
  manuscript89,
  manuscript90,
  manuscript91,
  manuscript92,
  manuscript93,
  manuscript94,
  manuscript95,
  manuscript96,
  manuscript97,
  manuscript98,
  manuscript99,
  manuscript100,
  manuscript101,
  manuscript102,
  manuscript103,
  manuscript104,
  manuscript105,
  manuscript106,
  manuscript107,
  manuscript108,
  manuscript109,
  manuscript110,
  manuscript111,
  manuscript112,
  manuscript113,
  manuscript114,
  manuscript115,
  manuscript116,
  manuscript117,
  manuscript118,
  manuscript119,
  manuscript120,
  manuscript121,
  manuscript122,
  manuscript123,
  manuscript124,
  manuscript125,
  manuscript126,
  manuscript127,
  manuscript128,
  manuscript129,
  manuscript130,
  manuscript131,
  manuscript132,
  manuscript133,
  manuscript134,
  manuscript135,
  manuscript136,
  manuscript137,
  manuscript138,
  manuscript139,
  manuscript140,
  manuscript141,
  manuscript142,
  manuscript143,
  manuscript144,
  manuscript145,
  manuscript146,
  manuscript147,
  manuscript148,
  manuscript149,
  manuscript150,
  manuscript151,
  manuscript152,
  manuscript153,
  manuscript154,
  manuscript155,
  manuscript156,
  manuscript157,
  manuscript158,
  manuscript159,
  manuscript160,
  manuscript161,
  manuscript162,
  manuscript163,
  manuscript164,
  manuscript165,
  manuscript166,
  manuscript167,
  manuscript168,
  manuscript169,
  manuscript170,
  manuscript171,
  manuscript172,
  manuscript173,
  manuscript174,
  manuscript175,
  manuscript176,
  manuscript177,
  manuscript178,
  manuscript179,
  manuscript180,
  manuscript181,
  manuscript182,
  manuscript183,
  manuscript184,
  manuscript185,
  manuscript186,
  manuscript187,
  manuscript188,
  manuscript189,
  manuscript190,
  manuscript191,
  manuscript192,
  manuscript193,
  manuscript194,
  manuscript195,
  manuscript196,
  manuscript197,
  manuscript198,
  manuscript199,
  manuscript200,
  manuscript201,
  manuscript202,
  manuscript203,
  manuscript204,
  manuscript205,
  manuscript206,
  manuscript207,
  manuscript208,
  manuscript209,
  manuscript210,
  manuscript211,
  manuscript212,
  manuscript213,
  manuscript214,
  manuscript215,
  manuscript216,
  manuscript217,
  manuscript218,
  manuscript219,
  manuscript220,
  manuscript221,
  manuscript222,
  manuscript223,
  manuscript224,
  manuscript225,
  manuscript226,
  manuscript227,
  manuscript228,
  manuscript229,
  manuscript230,
  manuscript231,
  manuscript232,
  manuscript233,
  manuscript234,
  manuscript235,
  manuscript236,
  manuscript237,
  manuscript238,
  manuscript239,
  manuscript240,
  manuscript241,
  manuscript242,
  manuscript243,
  manuscript244,
  manuscript245,
  manuscript246,
  manuscript247,
  manuscript248,
  manuscript249,
  manuscript250,
  manuscript251,
  manuscript252,
  manuscript253,
  manuscript254,
  manuscript255,
  manuscript256,
  manuscript257,
  manuscript258,
  manuscript259,
  manuscript260,
  manuscript261,
  manuscript262,
  manuscript263,
  manuscript264,
  manuscript265,
  manuscript266,
  manuscript267,
  manuscript268,
  manuscript269,
  manuscript270,
  manuscript271,
  manuscript272,
  manuscript273,
  manuscript274,
  manuscript275,
  manuscript276,
  manuscript277,
  manuscript278,
  manuscript279,
  manuscript280,
  manuscript281,
  manuscript282,
  manuscript283,
  manuscript284,
  manuscript285,
  manuscript286,
  manuscript287,
  manuscript288,
  manuscript289,
  manuscript290,
  manuscript291,
  manuscript292,
  manuscript293,
  manuscript294,
  manuscript295,
  manuscript296,
  manuscript297,
  manuscript298,
  manuscript299,
  manuscript300,
  manuscript301,
  manuscript302,
  manuscript303,
  manuscript304,
  manuscript305,
  manuscript306,
  manuscript307,
  manuscript308,
  manuscript309,
  manuscript310,
  manuscript311,
  manuscript312,
  manuscript313,
  manuscript314,
  manuscript315,
  manuscript316,
  manuscript317,
  manuscript318,
  manuscript319,
  manuscript320,
  manuscript321,
  manuscript322,
  manuscript323,
  manuscript324,
  manuscript325,
  manuscript326,
  manuscript327,
  manuscript328,
  manuscript329,
  manuscript330,
  manuscript331,
  manuscript332,
];
