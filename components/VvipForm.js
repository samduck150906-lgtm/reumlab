'use client';

import { useState } from 'react';

export default function VvipForm({ actionPath }) {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    setSubmitting(true);
    try {
      const formData = new FormData(form);
      await fetch(actionPath || '/vvip/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });
      setSuccess(true);
    } catch {
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="apply-success show">
        <div className="success-icon">✓</div>
        <div className="success-title">접수되었습니다</div>
        <p className="success-desc">24시간 내에 연락드리겠습니다.</p>
      </div>
    );
  }

  return (
    <form
      className="apply-form"
      name="vvip-contact"
      method="POST"
      action="/vvip/"
      data-netlify="true"
      data-netlify-honeypot="bot"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="vvip-contact" />
      <p className="field full" style={{ position: 'absolute', left: -9999 }} aria-hidden="true">
        <label>비워두세요</label>
        <input name="bot" tabIndex={-1} autoComplete="off" />
      </p>
      <div className="form-row">
        <div className="field">
          <label htmlFor="vvip-name">이름 <span style={{ color: 'var(--green)' }}>*</span></label>
          <input type="text" id="vvip-name" name="name" required placeholder="홍길동" />
        </div>
        <div className="field">
          <label htmlFor="vvip-phone">연락처 <span style={{ color: 'var(--green)' }}>*</span></label>
          <input type="tel" id="vvip-phone" name="phone" required placeholder="010-0000-0000" />
        </div>
      </div>
      <div className="field full">
        <label htmlFor="vvip-email">이메일 <span style={{ color: 'var(--green)' }}>*</span></label>
        <input type="email" id="vvip-email" name="email" required placeholder="example@email.com" />
      </div>
      <div className="field full">
        <label htmlFor="vvip-tier">관심 옵션</label>
        <select id="vvip-tier" name="tier">
          <option value="">선택해 주세요</option>
          <option value="싱글 세션 (50만원)">싱글 세션 (50만원)</option>
          <option value="월간 리테이너 (150만원/월)">월간 리테이너 (150만원/월)</option>
          <option value="프로젝트 기반 (협의)">프로젝트 기반 (협의)</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="vvip-message">현재 사업·업무와 컨설팅 희망 내용 <span style={{ color: 'var(--green)' }}>*</span></label>
        <textarea id="vvip-message" name="message" required placeholder="예: 업종, 현재 고민, AI로 해결하고 싶은 부분, 희망 일정 등" />
      </div>
      <div className="submit-wrap">
        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? '전송 중…' : '신청 보내기'}
        </button>
      </div>
    </form>
  );
}
