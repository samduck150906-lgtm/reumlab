/**
 * Netlify Forms 검증 제출 시 실행 → 지정 이메일로 알림.
 * 우선순위: RESEND_API_KEY 있으면 Resend, 없으면 FormSubmit AJAX.
 */
const DEFAULT_NOTIFY_EMAIL = 'samduck150906@gmail.com';

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function flattenPayloadData(payload) {
  let data = payload && payload.data && typeof payload.data === 'object' ? { ...payload.data } : {};
  if (Object.keys(data).length === 0 && Array.isArray(payload?.human_fields)) {
    for (const f of payload.human_fields) {
      if (f && (f.title || f.name) != null && f.value !== undefined) {
        data[f.title || f.name] = f.value;
      }
    }
  }
  return data;
}

async function sendViaResend({ to, subject, html }, apiKey) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ReumLab 알림 <onboarding@resend.com>',
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error('submission-created: Resend 실패', res.status, t);
  }
  return res.ok;
}

async function sendViaFormSubmit({ to, subject, fields }) {
  const flat = {};
  for (const [k, v] of Object.entries(fields)) {
    flat[k] = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
  }
  const body = {
    _subject: subject,
    ...flat,
  };
  const url = `https://formsubmit.co/ajax/${encodeURIComponent(to)}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error('submission-created: FormSubmit 실패', res.status, t);
  }
  return res.ok;
}

exports.handler = async (event) => {
  // 이벤트 트리거 호출에서는 httpMethod가 없을 수 있음
  if (event.httpMethod && event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let submission;
  try {
    submission = JSON.parse(event.body || '{}');
  } catch (e) {
    console.error('submission-created: JSON 파싱 실패', e);
    return { statusCode: 400, body: 'Bad Request' };
  }

  const payload = submission.payload || submission;
  if (!payload || typeof payload !== 'object') {
    console.warn('submission-created: payload 없음');
    return { statusCode: 200, body: 'ok' };
  }
  const formName = payload.form_name || payload.formName || 'unknown';
  const data = flattenPayloadData(payload);
  const to = process.env.FORM_NOTIFICATION_EMAIL || DEFAULT_NOTIFY_EMAIL;
  const subject = `[${formName}] reumlab 신청 접수`;

  const rows = Object.entries(data)
    .map(([k, v]) => `<tr><th style="text-align:left;padding:6px 12px;border:1px solid #eee">${escapeHtml(k)}</th><td style="padding:6px 12px;border:1px solid #eee">${escapeHtml(String(v ?? ''))}</td></tr>`)
    .join('');
  const html = `<p>Netlify Forms에서 새 제출이 들어왔습니다.</p><table style="border-collapse:collapse">${rows}</table><p style="color:#666;font-size:12px">폼 이름: ${escapeHtml(formName)}</p>`;

  const resendKey = process.env.RESEND_API_KEY;
  try {
    if (resendKey) {
      await sendViaResend({ to, subject, html }, resendKey);
    } else {
      await sendViaFormSubmit({ to, subject, fields: data });
    }
  } catch (err) {
    console.error('submission-created: 전송 예외', err);
  }

  return { statusCode: 200, body: 'ok' };
};
