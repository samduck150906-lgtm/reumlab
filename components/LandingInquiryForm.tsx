'use client';

import { useEffect, useRef, useState } from 'react';
import { EVENT, leadSourceOf, pageContext, pageTypeOf, serviceOf, pushEvent } from '@/lib/analytics';

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

type Status = 'idle' | 'submitting' | 'success' | 'error';

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
  variant?: 'default' | 'geo-website';
  submitLabel?: string;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [utm, setUtm] = useState<Record<string, string>>({});
  const startedRef = useRef(false);
  const submittingRef = useRef(false);
  const leadSentRef = useRef(false);
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
    const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
    setStatus('submitting');
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
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
          ...eventCtx,
        });
      }
    } catch (err) {
      setStatus('error');
      // 진단용 — 사용자 입력값이나 서버 메시지 원문은 싣지 않고 분류만 보낸다.
      const msg = err instanceof Error ? err.message : '';
      pushEvent(EVENT.formError, {
        form_name: FORM_NAME,
        error_type: msg.startsWith('http') ? 'server' : 'network',
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
        <h3 className="mt-4 font-display text-xl font-bold text-navy-900">검토 요청이 접수됐어요!</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          영업일 기준 1~2일 내에 남겨 주신 연락처로 가능한 범위와 예상 비용을 안내드릴게요.
          <br />
          급하시면 010-8111-9370으로 전화 주세요.
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
      className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-left shadow-card-hover sm:p-8"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <input type="hidden" name="유입_랜딩" value={variant === 'geo-website' ? '/geo-website/' : `l/${landingSlug}`} />
      <input type="hidden" name="문의서비스" value={variant === 'geo-website' ? 'GEO 홈페이지 제작' : defaultServiceType || ''} />
      <input type="hidden" name="유입_경로" value={ctx.path} />
      <input type="hidden" name="페이지_유형" value={ctx.pageType} />
      <input type="hidden" name="관심_서비스축" value={ctx.service} />
      <input type="hidden" name="유입_출처" value={ctx.referrer} />
      <input type="hidden" name="최초_유입_페이지" value={ctx.firstLanding} />
      <input type="hidden" name="유입_채널" value={ctx.leadSource} />
      {UTM_KEYS.map((k) => (
        <input key={k} type="hidden" name={k} value={utm[k] || ''} />
      ))}
      <p className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
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

      <div className="mt-4">
        <label className={labelCls} htmlFor="lf-features">{variant === 'geo-website' ? '필요한 내용' : '핵심 기능 (꼭 필요한 것 위주로)'}</label>
        <textarea
          id="lf-features"
          name="핵심기능"
          rows={3}
          className={inputCls}
          placeholder={variant === 'geo-website' ? '예: 회사 소개, 서비스 설명, 사례·FAQ, 문의 폼, 기존 URL 보존' : '예: 회원가입, 예약, 결제, 관리자에서 예약 확인'}
        />
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
          전송에 실패했어요. 잠시 후 다시 시도하거나 010-8111-9370으로 연락 주세요.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-5 w-full rounded-xl bg-accent px-7 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-accent-deep disabled:opacity-70"
      >
        {status === 'submitting' ? '요청 중…' : submitLabel}
      </button>
      <p className="mt-3 text-center text-xs text-slate-500">
        문의만으로 계약이 진행되지 않습니다 · 범위와 비용을 확인한 뒤 결정할 수 있습니다
      </p>
    </form>
  );
}
