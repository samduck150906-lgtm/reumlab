'use client';

import { useState } from 'react';

const NOTIFY_EMAIL = 'ceo@eternalsix.com';

function buildMailtoConsultation(fd) {
  const name = fd.get('name') || '';
  const email = fd.get('email') || '';
  const phone = fd.get('phone') || '';
  const service = fd.get('service') || '';
  const message = fd.get('message') || '';
  const subject = `[상담 신청] ${name}`.trim() || '[상담 신청]';
  const body = [
    '— 름랩 상담 신청 —',
    '',
    `이름/담당자: ${name}`,
    `회신 이메일: ${email}`,
    `연락처: ${phone}`,
    `문의 유형: ${service}`,
    '',
    '문의 내용:',
    message,
  ].join('\n');
  return `mailto:${NOTIFY_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function ConsultationForm() {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.reportValidity()) return;
    setSubmitting(true);
    try {
      const fd = new FormData(form);
      window.location.href = buildMailtoConsultation(fd);
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="apply-success show">
        <div className="success-icon">✓</div>
        <h2 className="success-title">메일 작성 화면을 열었습니다</h2>
        <p className="success-desc">
          기본 메일 앱에서 <strong>보내기</strong>를 눌러 {NOTIFY_EMAIL}으로 전송을 완료해 주세요.
        </p>
        <p style={{ marginTop: 16 }}>
          <a href="/">홈으로</a>
        </p>
      </div>
    );
  }

  return (
    <div id="formWrap" className="form-card apply-form" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '36px 32px', boxShadow: '0 8px 32px rgba(58,140,92,.06)', marginBottom: 0 }}>
      <form className="apply-form" onSubmit={handleSubmit}>
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
            <option value="웹 개발">웹 개발</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="message">문의 내용 *</label>
          <textarea id="message" name="message" required placeholder="프로젝트 개요, 희망 일정, 예산 범위 등을 간단히 적어 주세요." />
        </div>
        <div className="submit-wrap">
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? '열리는 중…' : '보내기 (메일 앱)'}
          </button>
        </div>
      </form>
    </div>
  );
}
