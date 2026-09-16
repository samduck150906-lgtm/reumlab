'use client';

import { useEffect, useRef, useState } from 'react';
import { EVENT, leadSourceOf, pageContext, pageTypeOf, serviceOf, pushEvent } from '@/lib/analytics';
// import 가 하나도 없는 모듈이다 — lib/ai-search-architecture.ts 를 직접 부르면
// lib/seo.ts(수백 KB)가 이 클라이언트 번들에 통째로 딸려 들어간다.
import {
  ACCESS_CHOICES,
  CARE_CHOICES,
  IMPROVE_MAX,
  PACKAGE_CHOICES,
  PACKAGE_TIER,
  PLATFORM_CHOICES,
  SITE_URL_MAX,
  normalizeSiteUrl,
  type PackageChoice,
} from '@/lib/ai-search-form';
// 같은 이유(클라이언트 번들 보호)로 voice 전용 상수도 import 0 모듈에서 가져온다.
import {
  INTEGRATION_MAX,
  PACKAGE_BY_SLUG,
  VOICE_CALL_VOLUME_CHOICES,
  VOICE_DATA_ATTR,
  VOICE_FIELD_NAMES,
  VOICE_HANDLING_CHOICES,
  VOICE_INDUSTRY_CHOICES,
  VOICE_PACKAGE_CHOICES,
  VOICE_PACKAGE_TIER,
  VOICE_TASK_HINT,
  VOICE_TASK_MAX,
  type VoiceCallVolumeChoice,
  type VoiceIndustryChoice,
  type VoicePackageChoice,
} from '@/lib/ai-voice-form';

/**
 * /l/[slug] 하단 CTA용 상담 폼 — 홈(index.html)과 동일한 Netlify `main-apply` 폼.
 * - 필드·폼 이름을 홈과 동일하게 유지해 접수 내역·이메일 알림이 한곳에 모입니다.
 * - 제출은 감지용 정적 스켈레톤 "/__forms.html"에 x-www-form-urlencoded POST → 페이지 이동 없이 완료 메시지.
 * - 추적: inquiry_form_start / inquiry_form_submit(+ form_submit_success, fbq Lead).
 * - /l/ 페이지는 Tailwind 기반이라 홈 af-* 대신 Tailwind로 스타일링합니다.
 */

const FORM_NAME = 'main-apply';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

const SERVICE_TYPES = [
  'GEO 홈페이지 제작',
  '웹 MVP / 홈페이지',
  '모바일 앱 (Flutter)',
  '운영관리 ERP·SaaS',
  'AI 기능·업무 자동화',
  '데이터·SEO 시스템',
  '기타 / 잘 모르겠음',
];
const BUDGETS = ['100만 원 이하', '100만 ~ 300만 원', '300만 ~ 500만 원', '500만 ~ 1,000만 원', '1,000만 원 이상', '아직 미정'];
const TIMELINES = ['최대한 빠르게', '1개월 내', '1 ~ 3개월', '3개월 이상', '미정'];

/**
 * timeout 은 error 와 구분한다 — 응답을 못 받았을 뿐 접수 여부는 알 수 없다.
 * 두 경우의 안내 문구가 달라야 중복 접수를 막을 수 있다(§10.4).
 */
type Status = 'idle' | 'submitting' | 'success' | 'error' | 'timeout';

type Variant = 'default' | 'geo-website' | 'ai-voice' | 'ai-search-architecture';

/**
 * 변형별 문구·숨은 값. 변형이 셋을 넘어가면서 삼항 연산자를 이어 붙이는 방식이
 * 읽기 어려워져 표로 분리했다. 키가 없으면 기존 기본값을 그대로 쓴다.
 */
const LANDING_PATH: Partial<Record<Variant, string>> = {
  'geo-website': '/geo-website/',
  'ai-voice': '/ai-voice-development/',
  'ai-search-architecture': '/ai-search-optimization/',
};
const INQUIRY_SERVICE: Partial<Record<Variant, string>> = {
  'geo-website': 'GEO 홈페이지 제작',
  'ai-voice': 'AI 전화상담 직원 구축',
  'ai-search-architecture': 'AI Search Architecture (기존 홈페이지 검색 구조 개선)',
};
const FEATURES_LABEL: Partial<Record<Variant, string>> = {
  'geo-website': '필요한 내용',
  'ai-voice': 'AI가 맡았으면 하는 전화 업무',
  'ai-search-architecture': '개선하고 싶은 점',
};
const FEATURES_PLACEHOLDER: Partial<Record<Variant, string>> = {
  'geo-website': '예: 회사 소개, 서비스 설명, 사례·FAQ, 문의 폼, 기존 URL 보존',
  'ai-voice': '예: 영업시간·위치 문의, 예약 접수·변경, 견적 문의, 담당자 연결 요청',
  'ai-search-architecture': '예: 서비스 설명이 흩어져 있음, 검색으로 안 나옴, 문의가 적음',
};

/** 홈페이지 주소를 아직 못 정한 경우에 저장할 값 — 자유 입력이 아니라 고정 문구다 */
const SITE_URL_UNKNOWN = '아직 없음 / 주소 확인 필요';

const inputCls =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-800 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20';
const labelCls = 'mb-1.5 block text-sm font-semibold text-slate-700';

export default function LandingInquiryForm({
  landingSlug,
  defaultServiceType,
  variant = 'default',
  submitLabel = '프로젝트 검토 요청하기',
}: {
  landingSlug: string;
  defaultServiceType?: string;
  variant?: Variant;
  submitLabel?: string;
}) {
  const isAiSearch = variant === 'ai-search-architecture';
  const isAiVoice = variant === 'ai-voice';
  const [status, setStatus] = useState<Status>('idle');
  const [utm, setUtm] = useState<Record<string, string>>({});
  const startedRef = useRef(false);
  const submittingRef = useRef(false);
  const leadSentRef = useRef(false);
  /**
   * /ai-search-optimization/ 전용 상태.
   *  · pkg — 가격 카드 CTA 를 누르면 여기로 동기화된다. 기본값 '미정'이라
   *    아무것도 누르지 않은 방문자가 특정 패키지를 신청한 상태가 되지 않는다.
   *  · siteUrlUnknown — 주소를 아직 못 정한 경우 필수 해제.
   *  · siteUrlError — 주소 형식 오류를 입력 칸 바로 아래에 보여 준다.
   * 이 값들은 dataLayer·localStorage 어디에도 저장하지 않는다(주소는 개인 식별 가능).
   */
  const [pkg, setPkg] = useState<PackageChoice>('미정');
  /**
   * /ai-voice-development/ 전용 상태.
   * 세 값 모두 기본 '미정'이다 — 아무것도 누르지 않은 방문자가 특정 업종·상품을
   * 신청한 상태가 되지 않는다. 페이지의 CTA 를 "명시적으로" 눌렀을 때만 바뀐다.
   */
  const [voiceIndustry, setVoiceIndustry] = useState<VoiceIndustryChoice>('미정');
  const [voiceVolume, setVoiceVolume] = useState<VoiceCallVolumeChoice>('미정');
  const [voicePkg, setVoicePkg] = useState<VoicePackageChoice>('미정');
  const [siteUrlUnknown, setSiteUrlUnknown] = useState(false);
  const [siteUrlError, setSiteUrlError] = useState('');
  const siteUrlRef = useRef<HTMLInputElement>(null);
  /**
   * 유입 맥락 — "어떤 SEO 페이지가 실제 문의를 만드는가"에 답하기 위한 값들.
   * 접수 내역(Netlify)에 함께 저장되므로, GA4 를 열지 않아도 문의 한 건이
   * 어느 페이지·어느 유형에서 왔는지 바로 읽을 수 있다.
   * 개인정보는 담지 않는다 — 경로와 분류, 외부 유입 도메인까지만 싣는다.
   */
  const [ctx, setCtx] = useState({
    path: '', pageType: '', service: '', referrer: '', firstLanding: '', leadSource: '',
  });

  useEffect(() => {
    let resolvedUtm: Record<string, string> = {};
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl: Record<string, string> = {};
      UTM_KEYS.forEach((k) => {
        const v = params.get(k);
        if (v) fromUrl[k] = v;
      });
      if (Object.keys(fromUrl).length > 0) {
        sessionStorage.setItem('reum_utm', JSON.stringify(fromUrl));
        resolvedUtm = fromUrl;
        setUtm(fromUrl);
      } else {
        const saved = sessionStorage.getItem('reum_utm');
        if (saved) {
          resolvedUtm = JSON.parse(saved);
          setUtm(resolvedUtm);
        }
      }
    } catch {
      /* sessionStorage 차단 환경 무시 */
    }

    try {
      const path = window.location.pathname;
      // 리퍼러는 도메인까지만 남긴다. 전체 URL 은 검색어·개인 식별 정보를 품을 수 있다.
      let ref = '';
      if (document.referrer) {
        const r = new URL(document.referrer);
        ref = r.hostname === window.location.hostname ? window.location.hostname : r.hostname;
      }
      const firstLanding = sessionStorage.getItem('reum_first_landing') || path;
      const firstReferrer = sessionStorage.getItem('reum_first_referrer') ?? ref;
      sessionStorage.setItem('reum_first_landing', firstLanding);
      sessionStorage.setItem('reum_first_referrer', firstReferrer);
      setCtx({
        path,
        pageType: pageTypeOf(path),
        service: serviceOf(path),
        referrer: firstReferrer || '(직접 유입)',
        firstLanding,
        leadSource: leadSourceOf(firstReferrer, resolvedUtm.utm_source || ''),
      });
    } catch {
      /* URL 파싱 실패 시 맥락 없이 진행 — 폼 제출이 우선이다 */
    }
  }, []);

  /**
   * 가격 카드 CTA(`<a href="#inquiry" data-aisa-package="GROWTH">`) → 폼의 관심 패키지 동기화.
   *
   * 링크는 서버 렌더된 평범한 앵커다. JS 가 꺼져 있으면 그냥 #inquiry 로 이동하고
   * 방문자가 직접 고르면 된다(선택이 강제되지 않는다). 여기서는 클릭을 가로채지 않고
   * 값만 맞추므로 앵커 이동·새 탭·가운데 클릭 동작이 그대로 유지된다.
   */
  useEffect(() => {
    if (!isAiSearch) return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('[data-aisa-package]');
      const value = el?.getAttribute('data-aisa-package');
      if (!value) return;
      const match = PACKAGE_CHOICES.find((c) => c === value);
      if (match) setPkg(match);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [isAiSearch]);

  /**
   * /ai-voice-development/ 의 CTA → 폼 값 동기화.
   *
   * 무엇을 동기화하나 (전부 작은 enum 하나씩이다)
   *  · data-voice-package="business"  → 관심 구축 범위
   *  · data-voice-industry="학원"      → 업종
   *  · data-voice-volume="10~30건"     → 하루 전화량
   *
   * 지키는 것
   *  · 데모 탭을 바꾸는 것만으로는 아무것도 반영하지 않는다. 명시적으로 이 CTA 를
   *    눌렀을 때만 바뀐다(§10.2).
   *  · 링크는 평범한 앵커라 JS 가 없으면 그냥 #voice-inquiry 로 이동한다.
   *  · 계산기의 상세 입력값은 넘어오지 않는다 — 전화량 "범주" 문자열 하나뿐이다.
   *  · 리스너는 ai-voice 변형에서만 붙이고 cleanup 한다.
   */
  useEffect(() => {
    if (!isAiVoice) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const pkgEl = target.closest(`[${VOICE_DATA_ATTR.package}]`);
      const pkgSlug = pkgEl?.getAttribute(VOICE_DATA_ATTR.package);
      if (pkgSlug && PACKAGE_BY_SLUG[pkgSlug]) setVoicePkg(PACKAGE_BY_SLUG[pkgSlug]);

      const indEl = target.closest(`[${VOICE_DATA_ATTR.industry}]`);
      const indValue = indEl?.getAttribute(VOICE_DATA_ATTR.industry);
      const indMatch = VOICE_INDUSTRY_CHOICES.find((c) => c === indValue);
      if (indMatch) setVoiceIndustry(indMatch);

      const volEl = target.closest(`[${VOICE_DATA_ATTR.callVolume}]`);
      const volValue = volEl?.getAttribute(VOICE_DATA_ATTR.callVolume);
      const volMatch = VOICE_CALL_VOLUME_CHOICES.find((c) => c === volValue);
      if (volMatch) setVoiceVolume(volMatch);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [isAiVoice]);

  /**
   * 홈페이지 주소 검사 — 오타 교정과 위험한 스킴 차단까지만 한다.
   * 이 주소를 서버가 대신 읽어 주는 기능은 만들지 않는다(임의 URL fetch = SSRF 공격면).
   */
  function validateSiteUrl(input: HTMLInputElement): boolean {
    if (siteUrlUnknown) {
      setSiteUrlError('');
      return true;
    }
    const result = normalizeSiteUrl(input.value);
    if (!result.ok) {
      setSiteUrlError(result.reason || '주소를 확인해 주세요.');
      return false;
    }
    if (result.value) input.value = result.value;
    setSiteUrlError('');
    return true;
  }

  function pushDL(obj: Record<string, unknown>) {
    try {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push(obj);
    } catch {
      /* noop */
    }
  }

  function onFirstInteract() {
    if (startedRef.current) return;
    startedRef.current = true;
    // 폼 1회당 한 번만 — 모든 input focus 마다 반복되면 안 된다.
    pushEvent(EVENT.formStart, {
      form_name: FORM_NAME,
      source_page: ctx.firstLanding || window.location.pathname,
      lead_source: ctx.leadSource,
      ...pageContext(window.location.pathname),
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const form = e.currentTarget;

    // 주소 형식 오류는 네트워크를 타기 전에 잡고 해당 입력으로 포커스를 옮긴다.
    if (isAiSearch && siteUrlRef.current && !validateSiteUrl(siteUrlRef.current)) {
      submittingRef.current = false;
      siteUrlRef.current.focus();
      pushEvent(EVENT.formError, {
        form_name: FORM_NAME,
        error_type: 'validation',
        ...pageContext(window.location.pathname),
      });
      return;
    }

    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
    setStatus('submitting');
    // 20초 넘게 응답이 없으면 끊는다. 다만 "접수가 안 됐다"고 단정하지 않는다 —
    // 서버가 이미 저장했는데 응답만 늦었을 수 있어서, 아래 오류 문구를 따로 쓴다.
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), 20000) : null;
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: controller?.signal,
      });
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error(`http ${res.status}`);
      // ── 여기부터가 실제 문의 성공. 제출 버튼 클릭이 아니라 서버 성공 응답 이후다.
      setStatus('success');
      form.reset();
      const eventCtx = pageContext(window.location.pathname);
      const w = window as any;
      if (typeof w.fbq === 'function') w.fbq('track', 'Lead');
      if (!leadSentRef.current) {
        leadSentRef.current = true;
        // 기존 GTM 트리거가 쓰는 이름 — 바꾸면 운영 중인 전환이 끊기므로 유지한다.
        pushDL({ event: 'inquiry_form_submit', ...eventCtx, lead_source: ctx.leadSource });
        pushDL({ event: 'main_apply_submit', ...eventCtx, lead_source: ctx.leadSource });
        pushDL({ event: 'form_submit_success', ...eventCtx, lead_source: ctx.leadSource });
        // GA4 권장 이름 추가. 어느 것을 key event 로 쓸지는 GA4/GTM 에서 하나만 고른다.
        pushEvent(EVENT.lead, {
          form_name: FORM_NAME,
          cta_type: 'form',
          source_page: ctx.firstLanding || window.location.pathname,
          lead_source: ctx.leadSource,
          // 비식별 enum 만 싣는다 — 한글 라벨·주소·상담 원문은 넘어가지 않는다.
          ...(isAiSearch ? { package_tier: PACKAGE_TIER[pkg] } : {}),
          ...(isAiVoice ? { package_tier: VOICE_PACKAGE_TIER[voicePkg] } : {}),
          ...eventCtx,
        });
      }
    } catch (err) {
      if (timer) clearTimeout(timer);
      const aborted = err instanceof DOMException && err.name === 'AbortError';
      setStatus(aborted ? 'timeout' : 'error');
      // 진단용 — 사용자 입력값이나 서버 메시지 원문은 싣지 않고 분류만 보낸다.
      const msg = err instanceof Error ? err.message : '';
      pushEvent(EVENT.formError, {
        form_name: FORM_NAME,
        error_type: aborted ? 'network' : msg.startsWith('http') ? 'server' : 'network',
        ...pageContext(window.location.pathname),
      });
    } finally {
      submittingRef.current = false;
    }
  }

  if (status === 'success') {
    return (
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-card-hover" role="status" aria-live="polite">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl font-bold text-accent">✓</div>
        <h3 className="mt-4 font-display text-xl font-bold text-navy-900">
          {isAiVoice ? '도입 검토 요청이 접수되었습니다' : '검토 요청이 접수됐어요!'}
        </h3>
        {/*
          ai-voice 는 회신 시간·자동 견적을 약속하지 않는 문구를 쓴다.
          다른 변형의 문구는 기존 운영 문구 그대로 둔다(문구를 일괄 변경하지 않는다).
        */}
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {isAiVoice ? (
            <>
              담당자가 내용을 확인한 뒤 남겨주신 연락처로 안내드리겠습니다.
              <br />
              급하시면 010-8111-9370으로 전화 주세요.
            </>
          ) : (
            <>
              영업일 기준 1~2일 내에 남겨 주신 연락처로 가능한 범위와 예상 비용을 안내드릴게요.
              <br />
              급하시면 010-8111-9370으로 전화 주세요.
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <form
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      onFocusCapture={onFirstInteract}
      aria-busy={status === 'submitting'}
      className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-left shadow-card-hover sm:p-8"
    >
      {/*
        JS 가 꺼져 있으면 이 폼은 브라우저 기본 POST 로 넘어간다. 그 경로가 실제
        접수까지 이어지는지는 운영 환경에서 확인해야 한다(이 저장소에서 검증 불가).
        확인 전까지 "반응 없는 폼"을 남기지 않도록 검증된 직접 연락 경로를 함께 둔다.
      */}
      <noscript>
        <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          자바스크립트가 꺼져 있어 전송 결과를 화면에서 확인해 드릴 수 없습니다. 아래로 바로 연락 주셔도 됩니다 —
          전화 <a className="font-semibold underline" href="tel:01081119370">010-8111-9370</a> · 이메일{' '}
          <a className="font-semibold underline" href="mailto:ceo@eternalsix.com">ceo@eternalsix.com</a>
        </p>
      </noscript>
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <input type="hidden" name="유입_랜딩" value={LANDING_PATH[variant] ?? `l/${landingSlug}`} />
      <input type="hidden" name="문의서비스" value={INQUIRY_SERVICE[variant] ?? (defaultServiceType || '')} />
      <input type="hidden" name="유입_경로" value={ctx.path} />
      <input type="hidden" name="페이지_유형" value={ctx.pageType} />
      <input type="hidden" name="관심_서비스축" value={ctx.service} />
      <input type="hidden" name="유입_출처" value={ctx.referrer} />
      <input type="hidden" name="최초_유입_페이지" value={ctx.firstLanding} />
      <input type="hidden" name="유입_채널" value={ctx.leadSource} />
      {UTM_KEYS.map((k) => (
        <input key={k} type="hidden" name={k} value={utm[k] || ''} />
      ))}
      <p className="netlify-honeypot" aria-hidden="true">
        <label>
          이 칸은 비워두세요 <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="lf-name">
            이름 또는 업체명 <span className="text-accent">*</span>
          </label>
          <input id="lf-name" name="이름" type="text" className={inputCls} placeholder="예: 홍길동 / 름랩" required autoComplete="name" />
        </div>
        <div>
          <label className={labelCls} htmlFor="lf-phone">
            연락처 <span className="text-accent">*</span>
          </label>
          <input id="lf-phone" name="휴대폰번호" type="tel" inputMode="numeric" className={inputCls} placeholder="010-1234-5678" required autoComplete="tel" />
        </div>
        <div>
          <label className={labelCls} htmlFor="lf-email">이메일</label>
          <input id="lf-email" name="이메일" type="email" className={inputCls} placeholder="name@example.com" autoComplete="email" />
        </div>
        <div>
          <label className={labelCls} htmlFor="lf-type">서비스 유형</label>
          <select id="lf-type" name="서비스유형" className={inputCls} defaultValue={defaultServiceType && SERVICE_TYPES.includes(defaultServiceType) ? defaultServiceType : ''}>
            <option value="">선택해 주세요</option>
            {SERVICE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {variant === 'geo-website' ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="lf-current-site">현재 홈페이지 주소 <span className="font-normal text-slate-500">(선택)</span></label>
            <input id="lf-current-site" name="현재홈페이지주소" type="url" inputMode="url" className={inputCls} placeholder="https://example.com" autoComplete="url" />
          </div>
          <div>
            <label className={labelCls} htmlFor="lf-request-type">의뢰 유형</label>
            <select id="lf-request-type" name="의뢰유형" className={inputCls} defaultValue="상담 후 결정">
              <option value="신규 제작">신규 제작</option>
              <option value="기존 사이트 개선">기존 사이트 개선</option>
              <option value="상담 후 결정">상담 후 결정</option>
            </select>
          </div>
        </div>
      ) : null}

      {isAiVoice ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="lf-voice-industry">업종</label>
            {/* 페이지의 "이 업종으로 도입 상담" CTA 로도 바뀌지만 직접 고르는 것이 항상 가능하다 */}
            <select
              id="lf-voice-industry"
              name={VOICE_FIELD_NAMES.industry}
              className={inputCls}
              value={voiceIndustry}
              onChange={(e) => setVoiceIndustry(e.currentTarget.value as VoiceIndustryChoice)}
            >
              {VOICE_INDUSTRY_CHOICES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="lf-voice-volume">하루 전화량</label>
            <select
              id="lf-voice-volume"
              name={VOICE_FIELD_NAMES.callVolume}
              className={inputCls}
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(e.currentTarget.value as VoiceCallVolumeChoice)}
            >
              {VOICE_CALL_VOLUME_CHOICES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="lf-call-handling">지금 전화 응대 방식</label>
            {/* 기본값을 '선택 안 함'으로 둔다 — 답하지 않은 사람의 응대 방식을 지어내지 않는다 */}
            <select id="lf-call-handling" name="현재응대방식" className={inputCls} defaultValue="선택 안 함">
              {VOICE_HANDLING_CHOICES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="lf-voice-package">관심 구축 범위</label>
            {/* 기본 '미정' — 특정 상품이 미리 신청된 상태로 시작하지 않는다 */}
            <select
              id="lf-voice-package"
              name={VOICE_FIELD_NAMES.package}
              className={inputCls}
              value={voicePkg}
              onChange={(e) => setVoicePkg(e.currentTarget.value as VoicePackageChoice)}
            >
              {VOICE_PACKAGE_CHOICES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="lf-integrations">연동이 필요한 시스템 <span className="font-normal text-slate-500">(선택)</span></label>
            <input
              id="lf-integrations"
              name="연동대상시스템"
              type="text"
              className={inputCls}
              maxLength={INTEGRATION_MAX}
              placeholder="예: 자체 CRM, ERP, 예약 시스템 / 아직 없음 / 모름"
              aria-describedby="lf-integrations-hint"
            />
            <p id="lf-integrations-hint" className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
              아직 없거나 이름을 모르셔도 괜찮습니다. “아직 없음” 또는 “모름”이라고 적어 주세요.
            </p>
          </div>
        </div>
      ) : null}

      {isAiSearch ? (
        <>
          <div className="mt-4">
            <label className={labelCls} htmlFor="lf-site-url">
              현재 홈페이지 주소 {siteUrlUnknown ? <span className="font-normal text-slate-500">(확인 후 알려주세요)</span> : <span className="text-accent">*</span>}
            </label>
            <input
              id="lf-site-url"
              ref={siteUrlRef}
              name="현재홈페이지주소"
              type={siteUrlUnknown ? 'text' : 'url'}
              inputMode="url"
              className={inputCls}
              placeholder="example.com"
              autoComplete="url"
              maxLength={SITE_URL_MAX}
              required={!siteUrlUnknown}
              disabled={siteUrlUnknown}
              aria-invalid={siteUrlError ? true : undefined}
              aria-describedby={siteUrlError ? 'lf-site-url-error' : 'lf-site-url-hint'}
              onBlur={(e) => validateSiteUrl(e.currentTarget)}
            />
            {siteUrlError ? (
              <p id="lf-site-url-error" className="mt-1.5 text-[13px] font-semibold text-red-600" role="alert">
                {siteUrlError}
              </p>
            ) : (
              <p id="lf-site-url-hint" className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                주소는 상담 자료로만 확인합니다. 이 페이지에서 자동 진단이 실행되지 않습니다.
              </p>
            )}
            <label className="mt-2 flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600">
              <input
                type="checkbox"
                name="홈페이지주소상태"
                value={SITE_URL_UNKNOWN}
                checked={siteUrlUnknown}
                onChange={(e) => {
                  setSiteUrlUnknown(e.currentTarget.checked);
                  setSiteUrlError('');
                }}
                className="mt-0.5 h-4 w-4 flex-none accent-accent"
              />
              <span>아직 주소를 확정하지 못했습니다 (아래에 상황을 적어 주세요)</span>
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="lf-platform">홈페이지 환경</label>
              <select id="lf-platform" name="홈페이지환경" className={inputCls} defaultValue="잘 모르겠음">
                {PLATFORM_CHOICES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="lf-access">수정 권한</label>
              <select id="lf-access" name="수정권한" className={inputCls} defaultValue="잘 모르겠음">
                {ACCESS_CHOICES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="lf-package">관심 패키지</label>
              {/* 가격 카드 CTA 로도 바뀌지만, 여기서 직접 고르는 것이 항상 가능하다 */}
              <select
                id="lf-package"
                name="관심패키지"
                className={inputCls}
                value={pkg}
                onChange={(e) => setPkg(e.currentTarget.value as PackageChoice)}
              >
                {PACKAGE_CHOICES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls} htmlFor="lf-care">지속 관리 관심 <span className="font-normal text-slate-500">(선택)</span></label>
              {/* 기본값 '없음' — 원치 않는 구독이 선택된 상태로 시작하지 않는다 */}
              <select id="lf-care" name="지속관리관심" className={inputCls} defaultValue="없음">
                {CARE_CHOICES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : null}

      <div className="mt-4">
        <label className={labelCls} htmlFor="lf-features">{FEATURES_LABEL[variant] ?? '핵심 기능 (꼭 필요한 것 위주로)'}</label>
        <textarea
          id="lf-features"
          name="핵심기능"
          rows={3}
          className={inputCls}
          maxLength={isAiSearch ? IMPROVE_MAX : isAiVoice ? VOICE_TASK_MAX : undefined}
          placeholder={FEATURES_PLACEHOLDER[variant] ?? '예: 회원가입, 예약, 결제, 관리자에서 예약 확인'}
          aria-describedby={isAiVoice ? 'lf-features-hint' : undefined}
        />
        {isAiVoice ? (
          <p id="lf-features-hint" className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
            {VOICE_TASK_HINT}
          </p>
        ) : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor="lf-budget">예상 예산</label>
          <select id="lf-budget" name="예상예산" className={inputCls} defaultValue="">
            <option value="">선택해 주세요</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="lf-timeline">원하는 일정</label>
          <select id="lf-timeline" name="희망일정" className={inputCls} defaultValue="">
            <option value="">선택해 주세요</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className={labelCls} htmlFor="lf-ref">참고 서비스 (링크·설명)</label>
        <input id="lf-ref" name="참고서비스" type="text" className={inputCls} placeholder="예: example.com 의 예약 흐름이 좋아요" />
      </div>

      <label className="mt-4 flex items-start gap-2.5 text-[13px] leading-relaxed text-slate-600">
        <input type="checkbox" name="개인정보동의" value="동의" required className="mt-0.5 h-4 w-4 flex-none accent-accent" />
        <span>
          (필수){' '}
          <a href="/privacy/" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent-deep underline">
            개인정보 수집·이용
          </a>
          에 동의합니다. 전달한 내용은 견적 검토 목적으로만 사용합니다.
        </span>
      </label>

      {status === 'error' && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600" role="alert">
          전송에 실패했어요. 입력하신 내용은 그대로 두었으니 잠시 후 다시 시도하거나 010-8111-9370으로 연락 주세요.
        </p>
      )}

      {/*
        타임아웃은 "접수가 안 됐다"고 단정하지 않는다 — 저장은 됐는데 응답만 늦었을 수 있다.
        그래서 재시도 전에 중복 접수 가능성을 먼저 알린다.
      */}
      {status === 'timeout' && (
        <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900" role="alert">
          <b className="font-semibold">응답이 오지 않아 접수 여부를 확인하지 못했습니다.</b> 이미 접수되었을 수 있으니
          다시 보내시면 같은 문의가 두 건으로 남을 수 있습니다. 확인이 필요하시면 010-8111-9370으로 연락 주세요.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        // 흰 글자 대비: accent #3d7cff 는 3.80:1 로 WCAG AA(4.5:1) 미달이라
        // 같은 팔레트의 accent-deep #2563eb(5.17:1)을 기본으로 쓴다. hover 는 밝은 쪽.
        className="mt-5 w-full rounded-xl bg-accent-deep px-7 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-darker disabled:opacity-70"
      >
        {status === 'submitting' ? '요청 중…' : submitLabel}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        문의만으로 계약이 진행되지 않습니다 · 범위와 비용을 확인한 뒤 결정할 수 있습니다
      </p>
    </form>
  );
}
