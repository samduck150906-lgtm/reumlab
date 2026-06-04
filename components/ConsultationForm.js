'use client';

import { useState } from 'react';

const NOTIFY_EMAIL = 'ceo@eternalsix.com';

/**
 * Web3Forms 액세스 키. 정적 사이트(백엔드 없음)에서도 바로 동작하는 폼 백엔드입니다.
 * https://web3forms.com 에서 무료로 발급(월 250건) → Netlify 환경변수
 *   NEXT_PUBLIC_WEB3FORMS_KEY 에 넣으면 실제 폼 전송이 켜집니다.
 * 키가 없으면 메일 앱(mailto)으로 안전하게 폴백합니다.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

function pushDataLayer(obj) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(obj);
}

function buildMailtoConsultation(fd) {
  const name = fd.get('name') || '';
  const email = fd.get('email') || '';
  const phone = fd.get('phone') || '';
  const service = fd.get('service') || '';
  const budget = fd.get('budget') || '';
  const message = fd.get('message') || '';
  const subject = `[상담 신청] ${name}`.trim() || '[상담 신청]';
  const body = [
    '— 름랩 상담 신청 —',
    '',
    `이름/담당자: ${name}`,
    `회신 이메일: ${email}`,
    `연락처: ${phone}`,
    `문의 유형: ${service}`,
    `예산 범위: ${budget}`,
    '',
    '문의 내용:',
    message,
  ].join('\n');
  return `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ConsultationForm() {
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.reportValidity()) return;

    const fd = new FormData(form);

    // 허니팟: 봇이 채우면 조용히 성공 처리하고 전송하지 않음
    if (fd.get('botcheck')) {
      setStatus('success');
      return;
    }

    // 키가 없으면 메일 앱으로 폴백 (사이트가 깨지지 않도록)
    if (!WEB3FORMS_KEY) {
      window.location.href = buildMailtoConsultation(fd);
      setStatus('success');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: `[름랩 상담] ${fd.get('name') || ''}`.trim(),
        from_name: '름랩 상담폼',
        이름_담당자: fd.get('name') || '',
        회신_이메일: fd.get('email') || '',
        연락처: fd.get('phone') || '',
        문의_유형: fd.get('service') || '',
        예산_범위: fd.get('budget') || '',
        문의_내용: fd.get('message') || '',
        // 회신 편의를 위해 응답자 이메일을 reply-to로
        replyto: fd.get('email') || '',
      };

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        pushDataLayer({
          event: 'generate_lead',
          reum_action: 'consultation_submit',
          form_service: fd.get('service') || '',
        });
        setStatus('success');
        form.reset();
      } else {
        throw new Error(data.message || '전송에 실패했습니다.');
      }
    } catch (err) {
      setErrorMsg(
        '전송 중 문제가 발생했습니다. 잠시 후 다시 시도하시거나, 전화·이메일로 바로 연락 주세요.',
      );
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="apply-success show">
        <div className="success-icon">✓</div>
        <h2 className="success-title">상담 신청이 접수되었습니다</h2>
        <p className="success-desc">
          영업일 기준 <strong>24시간 내</strong>에 연락드리겠습니다. 급하시면 전화로 바로 연결해 주세요.
        </p>
        <p style={{ marginTop: 16 }}>
          <a href="/">홈으로</a>
        </p>
      </div>
    );
  }

  const submitting = status === 'submitting';

  return (
    <div
      id="formWrap"
      className="form-card apply-form"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '36px 32px',
        boxShadow: '0 8px 32px rgba(58,140,92,.06)',
        marginBottom: 0,
      }}
    >
      <form className="apply-form" onSubmit={handleSubmit} noValidate>
        {/* 허니팟 (사람에게는 숨김) */}
        <input
          type="checkbox"
          name="botcheck"
          tabIndex={-1}
          autoComplete="off"
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        <div className="field">
          <label htmlFor="name">이름 / 담당자 *</label>
          <input type="text" id="name" name="name" required placeholder="이름 또는 회사명" />
        </div>
        <div className="field">
          <label htmlFor="email">이메일 *</label>
          <input type="email" id="email" name="email" required placeholder="reply@example.com" />
        </div>
        <div className="field">
          <label htmlFor="phone">연락처</label>
          <input type="tel" id="phone" name="phone" placeholder="010-0000-0000" />
        </div>
        <div className="field">
          <label htmlFor="service">문의 유형</label>
          <select id="service" name="service" defaultValue="">
            <option value="">선택해 주세요</option>
            <option value="웹사이트 개발 (149만~)">웹사이트 개발 (149만~)</option>
            <option value="모바일 앱 개발 (499만~)">모바일 앱 개발 (499만~)</option>
            <option value="고도화 앱·웹 (799만~)">고도화 앱·웹 (799만~)</option>
            <option value="아직 모르겠음 / 상담 후 결정">아직 모르겠음 / 상담 후 결정</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="budget">예산 범위 (선택)</label>
          <select id="budget" name="budget" defaultValue="">
            <option value="">선택해 주세요</option>
            <option value="~150만원">~150만원</option>
            <option value="150~500만원">150~500만원</option>
            <option value="500~800만원">500~800만원</option>
            <option value="800만원 이상">800만원 이상</option>
            <option value="미정">미정</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="message">문의 내용 *</label>
          <textarea
            id="message"
            name="message"
            required
            placeholder="프로젝트 개요, 희망 일정, 참고 서비스 등을 간단히 적어 주세요."
          />
        </div>

        {status === 'error' ? (
          <p style={{ color: '#c0392b', fontSize: 14, marginBottom: 8 }} role="alert">
            {errorMsg}
          </p>
        ) : null}

        <div className="submit-wrap">
          <button type="submit" className="btn-submit" disabled={submitting} data-analytics="consultation_submit">
            {submitting ? '보내는 중…' : '상담 신청 보내기'}
          </button>
        </div>
        <p style={{ marginTop: 12, fontSize: 12, color: 'var(--text-dim)', textAlign: 'center' }}>
          제출 후 영업일 기준 24시간 내에 연락드립니다.
        </p>
      </form>
    </div>
  );
}
