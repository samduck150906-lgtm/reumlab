'use client';

import { useEffect, useState } from 'react';
import { EVENT, pageContext, pushEvent } from '@/lib/analytics';

/**
 * 무료 진단 신청 폼 — Netlify Forms 연동.
 *
 * 동작 방식
 *  - Resend·서버 없이 Netlify Forms로 접수합니다.
 *  - 정적 export(out/soho/index.html)에 form 마크업이 그대로 들어가므로
 *    Netlify가 배포 시 폼(name="soho-diagnosis")을 자동 인식합니다.
 *  - 제출은 fetch로 "/"에 application/x-www-form-urlencoded POST → 페이지 이동 없이
 *    인라인 완료 메시지를 보여줍니다. (honeypot: bot-field)
 *  - 접수 알림은 Netlify 대시보드 → Forms → 알림(이메일) 설정으로 받습니다.
 *    자세한 설정은 NETLIFY_FORMS.md 참고.
 */

const FORM_NAME = 'soho-diagnosis';

const PHONE_PREFIXES = ['010', '011', '016', '017', '018', '019'];

const DIAGNOSIS_ITEMS = [
  '네이버 플레이스',
  '당근 마케팅',
  '스마트스토어',
  '전체 상담 희망',
];

const DIAGNOSE_CHECKLIST = [
  '현재 노출 상태',
  '경쟁업체 대비 부족한 부분',
  '지금 당장 바꿔야 할 세팅',
  '광고비 낭비 요소',
  '문의·구매를 늘릴 수 있는 개선 방향',
];

/** 광고 유입 추적용 — 폼 제출에 함께 담아 어떤 캠페인에서 온 신청인지 남깁니다. */
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function SohoForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [prefix, setPrefix] = useState('010');
  const [mid, setMid] = useState('');
  const [last, setLast] = useState('');
  const [utm, setUtm] = useState<Record<string, string>>({});
  // 폼 최초 상호작용 1회만 기록 — 이 폼에는 form_start 측정이 아예 없었다.
  const [started, setStarted] = useState(false);

  function onFirstInteract() {
    if (started) return;
    setStarted(true);
    pushEvent(EVENT.formStart, { form_name: FORM_NAME, ...pageContext(window.location.pathname) });
  }

  const phone = [prefix, mid, last].filter(Boolean).join('-');

  // 광고로 유입될 때 URL의 utm_*·fbclid를 받아 세션에 보관 → 폼 제출에 함께 전송.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromUrl: Record<string, string> = {};
      UTM_KEYS.forEach((k) => {
        const v = params.get(k);
        if (v) fromUrl[k] = v;
      });
      if (Object.keys(fromUrl).length > 0) {
        sessionStorage.setItem('reum_utm', JSON.stringify(fromUrl));
        setUtm(fromUrl);
      } else {
        const saved = sessionStorage.getItem('reum_utm');
        if (saved) setUtm(JSON.parse(saved));
      }
    } catch {
      /* sessionStorage 차단 환경 등은 무시 */
    }
  }, []);

  const onlyDigits = (v: string) => v.replace(/[^0-9]/g, '');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    // 컨트롤된 전화번호 hidden(name="연락처") 값이 FormData에 포함됨.
    const body = new URLSearchParams(fd as unknown as Record<string, string>).toString();

    setStatus('submitting');
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      if (!res.ok) throw new Error(`http ${res.status}`);
      // ── 여기부터가 실제 문의 성공. 제출 클릭이 아니라 서버 성공 응답 이후다.
      setStatus('success');
      form.reset();
      setPrefix('010');
      setMid('');
      setLast('');
      if (typeof window !== 'undefined') {
        const ctx = pageContext(window.location.pathname);
        const w = window as any;
        // 메타 픽셀 전환 이벤트(웹사이트 전환 광고 최적화 기준).
        if (typeof w.fbq === 'function') w.fbq('track', 'Lead');
        // 기존 GTM 트리거 이름 — 바꾸면 운영 중인 전환이 끊기므로 유지한다.
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event: 'soho_diagnosis_submit', ...ctx });
        w.dataLayer.push({ event: 'form_submit_success', ...ctx });
        // GA4 권장 이름 추가 — key event 는 GA4/GTM 에서 하나만 고른다.
        pushEvent(EVENT.lead, {
          form_name: FORM_NAME,
          cta_type: 'form',
          source_page: window.location.pathname,
          ...ctx,
        });
      }
    } catch (err) {
      setStatus('error');
      const msg = err instanceof Error ? err.message : '';
      pushEvent(EVENT.formError, {
        form_name: FORM_NAME,
        error_type: msg.startsWith('http') ? 'server' : 'network',
        ...pageContext(window.location.pathname),
      });
    }
  }

  if (status === 'success') {
    return (
      <div className="sf-card sf-done" role="status" aria-live="polite">
        <div className="sf-done-ico" aria-hidden="true">✓</div>
        <h3>무료 상담 신청이 접수됐어요!</h3>
        <p>
          영업일 기준 1~2일 내에 입력해 주신 연락처로 상담 안내와 함께 연락드릴게요.
          <br />
          빠른 상담을 원하시면 전화(010-8111-9370)로도 편하게 문의 주세요.
        </p>
        <button type="button" className="sf-again" onClick={() => setStatus('idle')}>
          다른 업장도 신청하기
        </button>
      </div>
    );
  }

  return (
    <div className="sf-card">
      <ul className="sf-checklist" aria-label="무료로 진단해 드리는 항목">
        <li className="sf-checklist-h">상담 때 이런 것까지 함께 봐드려요</li>
        {DIAGNOSE_CHECKLIST.map((c) => (
          <li key={c} className="sf-checklist-item">
            <span className="sf-checklist-ck" aria-hidden="true">✓</span>
            {c}
          </li>
        ))}
      </ul>

      <form
        name={FORM_NAME}
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        onFocusCapture={onFirstInteract}
        className="sf-form"
        noValidate={false}
      >
        {/* Netlify 폼 인식·동작용 필수 hidden */}
        <input type="hidden" name="form-name" value={FORM_NAME} />
        {/* 광고 유입 추적 (utm_*·fbclid) — 어떤 캠페인에서 온 신청인지 기록 */}
        {UTM_KEYS.map((k) => (
          <input key={k} type="hidden" name={k} value={utm[k] || ''} />
        ))}
        {/* honeypot (사람에겐 숨김) */}
        <p className="sf-hp" aria-hidden="true">
          <label>
            이 칸은 비워두세요: <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        {/* 이름 */}
        <div className="sf-field">
          <label className="sf-label" htmlFor="sf-name">
            이름 <span className="sf-req">*</span>
          </label>
          <input
            id="sf-name"
            name="이름"
            type="text"
            className="sf-input"
            placeholder="이름"
            required
            autoComplete="name"
          />
        </div>

        {/* 연락처 */}
        <div className="sf-field">
          <label className="sf-label" htmlFor="sf-phone-prefix">
            연락처 <span className="sf-req">*</span>
          </label>
          <div className="sf-phone">
            <select
              id="sf-phone-prefix"
              className="sf-input sf-phone-prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              aria-label="연락처 앞자리"
            >
              {PHONE_PREFIXES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span className="sf-phone-dash" aria-hidden="true">-</span>
            <input
              type="tel"
              inputMode="numeric"
              className="sf-input"
              placeholder="연락처"
              value={mid}
              onChange={(e) => setMid(onlyDigits(e.target.value))}
              maxLength={4}
              required
              aria-label="연락처 가운데 자리"
            />
            <span className="sf-phone-dash" aria-hidden="true">-</span>
            <input
              type="tel"
              inputMode="numeric"
              className="sf-input"
              placeholder="연락처"
              value={last}
              onChange={(e) => setLast(onlyDigits(e.target.value))}
              maxLength={4}
              required
              aria-label="연락처 끝자리"
            />
          </div>
          {/* 결합된 연락처 — Netlify로 전송되는 실제 값 */}
          <input type="hidden" name="연락처" value={phone} />
        </div>

        {/* 무료 진단을 받고 싶은 항목 */}
        <div className="sf-field">
          <span className="sf-label">관심 있는 항목 (복수 선택 가능)</span>
          <div className="sf-checks">
            {DIAGNOSIS_ITEMS.map((item) => (
              <label key={item} className="sf-check">
                <input type="checkbox" name="진단항목" value={item} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 상호명 / 스토어명 */}
        <div className="sf-field">
          <label className="sf-label" htmlFor="sf-store">
            운영 중이신 상호명 or 스토어명
          </label>
          <textarea
            id="sf-store"
            name="상호명"
            className="sf-input sf-textarea"
            placeholder="운영 중이신 상호명 or 스토어명"
            rows={3}
          />
        </div>

        {/* 약관 동의 */}
        <div className="sf-agrees">
          <label className="sf-agree">
            <input type="checkbox" name="이용약관동의" value="동의" required />
            <span>
              이용약관 동의{' '}
              <a href="/terms/" target="_blank" rel="noopener noreferrer">
                [보기]
              </a>
            </span>
          </label>
          <label className="sf-agree">
            <input type="checkbox" name="개인정보동의" value="동의" required />
            <span>
              개인정보 수집·이용 동의{' '}
              <a href="/privacy/" target="_blank" rel="noopener noreferrer">
                [보기]
              </a>
            </span>
          </label>
        </div>

        {status === 'error' && (
          <p className="sf-msg sf-msg-error" role="alert">
            전송에 실패했어요. 잠시 후 다시 시도하시거나 010-8111-9370으로 연락 주세요.
          </p>
        )}

        <button
          type="submit"
          className="sf-submit"
          data-analytics="cta_soho_apply_submit"
          disabled={status === 'submitting'}
        >
          {status === 'submitting' ? '신청 중…' : '무료 상담 신청하기'}
        </button>
      </form>
    </div>
  );
}
