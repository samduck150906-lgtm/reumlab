'use client';

import { useState } from 'react';

export default function ConsultationForm({ site }) {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    setSubmitting(true);
    try {
      const formData = new FormData(form);
      const response = await fetch('/consultation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
      });
      if (response.ok) setSuccess(true);
      else setSuccess(true);
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
        <h2 className="success-title">접수되었습니다</h2>
        <p className="success-desc">빠른 시일 내에 연락드리겠습니다.</p>
        <p style={{ marginTop: 16 }}>
          <a href="/">홈으로</a>
        </p>
      </div>
    );
  }

  return (
    <div id="formWrap" className="form-card apply-form" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '36px 32px', boxShadow: '0 8px 32px rgba(58,140,92,.06)', marginBottom: 0 }}>
      <form
        name="consultation"
        className="apply-form"
        method="POST"
        action="/consultation/"
        data-netlify="true"
        netlify-honeypot="bot"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value="consultation" />
        <p className="hidden" style={{ position: 'absolute', left: -9999 }}>
          <label>비어 두세요: <input name="bot" /></label>
        </p>

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
          <select id="service" name="service">
            <option value="">선택해 주세요</option>
            <option value="앱 개발">앱 개발</option>
            <option value="웹/랜딩 제작">웹/랜딩 제작</option>
            <option value="창업 프로덕션">창업 프로덕션</option>
            <option value="부트캠프">부트캠프</option>
            <option value="VVIP 컨설팅">VVIP 컨설팅</option>
            <option value="기타">기타</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="message">문의 내용 *</label>
          <textarea id="message" name="message" required placeholder="프로젝트 개요, 희망 일정, 예산 범위 등을 간단히 적어 주세요." />
        </div>
        <div className="submit-wrap">
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? '전송 중…' : '보내기'}
          </button>
        </div>
      </form>
    </div>
  );
}
