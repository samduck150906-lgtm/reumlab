/**
 * 통화 시뮬레이션 데이터·상태 계산 테스트.
 *
 *   node --import tsx --test scripts/ai-voice-demo.test.mts
 *
 * 여기서 지키려는 것은 "화면이 거짓말하지 않는가" 다.
 * 아직 나오지 않은 정보가 요약에 미리 보이거나, 예약이 확정되지 않았는데
 * 확정처럼 보이거나, 사람이 처리해야 할 건이 AI 완료로 집계되는 것을 막는다.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DEMO_SCENARIOS,
  DEFAULT_INDUSTRY,
  NOT_YET_LABEL,
  OUTCOME_STATUS,
  UNRESOLVED_LABEL,
  canShowReservationConfirmed,
  displayValue,
  getScenario,
  initialState,
  outcomeStatus,
  stateAfter,
  validateScenarios,
} from '../lib/ai-voice-demo';

test('시나리오 데이터 무결성 — ID·필드·enum·순서', () => {
  assert.deepEqual(validateScenarios(), [], '구조 문제가 있으면 목록으로 나온다');
});

test('업종 6종이 모두 있고 기본 선택은 B2B 다', () => {
  assert.equal(DEMO_SCENARIOS.length, 6);
  assert.deepEqual(
    DEMO_SCENARIOS.map((s) => s.id),
    ['b2b', 'academy', 'clinic', 'beauty', 'real-estate', 'support'],
  );
  assert.equal(DEFAULT_INDUSTRY, 'b2b');
  assert.equal(getScenario(DEFAULT_INDUSTRY).id, 'b2b');
});

test('전체 발화 수는 48개다 (부록 A 대본 전량)', () => {
  const total = DEMO_SCENARIOS.reduce((sum, s) => sum + s.turns.length, 0);
  assert.equal(total, 48);
});

test('모든 시나리오가 simulated:true 이며 가상임을 타입으로 못 박는다', () => {
  for (const s of DEMO_SCENARIOS) assert.equal(s.simulated, true, `${s.id}`);
});

test('초기 상태는 모든 항목이 "아직 확인 전" — 묻지 않은 값을 채우지 않는다', () => {
  for (const s of DEMO_SCENARIOS) {
    const st = initialState(s);
    assert.equal(st.filled, 0, `${s.id}: 시작부터 채워진 항목이 있다`);
    for (const f of s.fields) {
      assert.equal(st.values[f.key], null, `${s.id}.${f.key}`);
      assert.equal(displayValue(s, st, f.key), NOT_YET_LABEL, `${s.id}.${f.key} 표시 문구`);
    }
    assert.equal(st.customerConfirmed, false);
    assert.equal(st.toolSucceeded, false);
    assert.equal(st.needsHuman, false);
    assert.equal(st.finished, false);
  }
});

test('초기 상태에 "미정"이 나타나지 않는다 — 고객이 말하기 전에는 미정도 아니다', () => {
  for (const s of DEMO_SCENARIOS) {
    const st = initialState(s);
    for (const f of s.fields) {
      assert.notEqual(displayValue(s, st, f.key), '미정', `${s.id}.${f.key}`);
    }
  }
});

test('각 단계의 요약은 그 시점까지 나온 정보만 반영한다', () => {
  for (const s of DEMO_SCENARIOS) {
    for (let step = 0; step <= s.turns.length; step++) {
      const st = stateAfter(s, step);
      // step 이후의 발화가 넣는 값은 아직 없어야 한다
      for (let i = step; i < s.turns.length; i++) {
        for (const key of Object.keys(s.turns[i].updates ?? {})) {
          const setEarlier = s.turns
            .slice(0, step)
            .some((t) => Object.prototype.hasOwnProperty.call(t.updates ?? {}, key));
          if (!setEarlier) {
            assert.equal(st.values[key], null, `${s.id} step ${step}: ${key} 가 미리 채워졌다`);
          }
        }
      }
      // step 이전의 발화가 넣은 값은 반드시 있어야 한다
      for (let i = 0; i < step; i++) {
        for (const [key, v] of Object.entries(s.turns[i].updates ?? {})) {
          assert.ok(st.values[key], `${s.id} step ${step}: ${key} 가 빠졌다`);
          // 뒤에서 덮어쓰지 않았다면 값이 같아야 한다
          const overwritten = s.turns
            .slice(i + 1, step)
            .some((t) => Object.prototype.hasOwnProperty.call(t.updates ?? {}, key));
          if (!overwritten) assert.equal(st.values[key]?.value, v.value, `${s.id}.${key}`);
        }
      }
    }
  }
});

test('전체 결과 보기와 단계 진행이 같은 최종 상태에 도달한다', () => {
  for (const s of DEMO_SCENARIOS) {
    const jumped = stateAfter(s, s.turns.length);
    let stepped = initialState(s);
    for (let i = 1; i <= s.turns.length; i++) stepped = stateAfter(s, i);
    assert.deepEqual(stepped, jumped, `${s.id}`);
  }
});

test('업종을 바꾸면 이전 업종 값이 섞이지 않는다 (상태는 시나리오에서만 파생)', () => {
  const b2b = stateAfter(getScenario('b2b'), 12);
  const clinic = stateAfter(getScenario('clinic'), 0);
  assert.ok(b2b.filled > 0);
  assert.equal(clinic.filled, 0);
  // clinic 상태에 b2b 의 field key 가 존재하지 않는다
  for (const key of Object.keys(b2b.values)) {
    if (key === 'time') continue; // 이름이 겹치는 키는 각 시나리오가 따로 정의한다
    assert.equal(key in clinic.values, false, `clinic 에 b2b 의 ${key} 가 남았다`);
  }
});

test('범위를 벗어난 step 은 안전하게 잘린다', () => {
  const s = getScenario('academy');
  assert.deepEqual(stateAfter(s, -5), stateAfter(s, 0));
  assert.deepEqual(stateAfter(s, 999), stateAfter(s, s.turns.length));
});

test('예약 확정 예시는 고객 재확인 + 가상 성공 단계 이후에만 보인다', () => {
  const beauty = getScenario('beauty');
  const confirmIdx = beauty.turns.findIndex((t) => t.action === 'customer-confirmed');
  const toolIdx = beauty.turns.findIndex((t) => t.action === 'simulated-tool-success');
  assert.ok(confirmIdx >= 0 && toolIdx > confirmIdx, '순서 자체가 재확인 → 성공이어야 한다');

  // 성공 단계 직전까지는 확정 표시가 나오면 안 된다
  for (let step = 0; step <= toolIdx; step++) {
    assert.equal(
      canShowReservationConfirmed(beauty, stateAfter(beauty, step)),
      false,
      `step ${step} 에서 확정이 미리 보인다`,
    );
  }
  assert.equal(canShowReservationConfirmed(beauty, stateAfter(beauty, toolIdx + 1)), true);
});

test('AI 가 재확인을 요청한 뒤 고객이 답하기 전에는 대기 상태다', () => {
  const beauty = getScenario('beauty');
  const reqIdx = beauty.turns.findIndex((t) => t.action === 'confirm-request');
  assert.equal(stateAfter(beauty, reqIdx + 1).awaitingConfirmation, true);
  assert.equal(stateAfter(beauty, reqIdx + 2).awaitingConfirmation, false);
  assert.equal(stateAfter(beauty, reqIdx + 2).customerConfirmed, true);
});

test('사람 이관 시나리오의 최종 상태는 담당자 처리 필요다 — AI 완료로 합산하지 않는다', () => {
  const support = getScenario('support');
  const final = stateAfter(support, support.turns.length);
  assert.equal(final.needsHuman, true);
  assert.equal(outcomeStatus(support, final), OUTCOME_STATUS.human);
  assert.equal(support.outcome.type, 'handoff-example');
  assert.notEqual(outcomeStatus(support, final), OUTCOME_STATUS.intake);
});

test('끝까지 확인되지 않는 항목은 "미확인"으로 남는다', () => {
  const b2b = getScenario('b2b');
  const final = stateAfter(b2b, b2b.turns.length);
  assert.deepEqual([...b2b.unresolved], ['contact']);
  assert.equal(displayValue(b2b, final, 'contact'), UNRESOLVED_LABEL);
  // 미확인 항목이 남으면 '접수 예시'로 끝내지 않는다
  assert.equal(outcomeStatus(b2b, final), OUTCOME_STATUS.review);
});

test('진행 중에는 결과 상태가 "추가 확인 필요"다', () => {
  for (const s of DEMO_SCENARIOS) {
    const mid = stateAfter(s, Math.max(1, s.turns.length - 1));
    if (mid.needsHuman) continue; // 이관은 그 시점에 이미 확정된다
    assert.equal(outcomeStatus(s, mid), OUTCOME_STATUS.review, `${s.id}`);
  }
});

test('학원 시나리오는 학년·과목을 재질문하지 않는다', () => {
  const academy = getScenario('academy');
  // 학년·과목은 두 번째 발화에서 한 번에 확정된다
  const first = academy.turns[1];
  assert.ok(first.updates?.grade && first.updates?.subject);
  // 이후 AI 발화에 "학년이" / "무슨 과목" 같은 재질문이 없다
  const later = academy.turns.slice(2).filter((t) => t.speaker === 'ai');
  for (const t of later) {
    assert.ok(!/몇 학년|어떤 과목|무슨 과목/.test(t.text), `재질문이 있다: ${t.text}`);
  }
});

test('병원 시나리오는 증상·주민번호를 수집 항목으로 두지 않는다', () => {
  const clinic = getScenario('clinic');
  const keys = clinic.fields.map((f) => f.key).join(' ');
  const labels = clinic.fields.map((f) => f.label).join(' ');
  assert.ok(!/symptom|rrn|ssn/.test(keys));
  assert.ok(!/증상|주민|진단/.test(labels));
  // 진단·처방을 단정하는 대사가 없다
  for (const t of clinic.turns) {
    assert.ok(!/진단해|처방|복용하세요|드세요/.test(t.text), t.text);
  }
});

test('고객센터 시나리오는 환불 승인 여부를 판단하지 않는다', () => {
  const support = getScenario('support');
  const final = stateAfter(support, support.turns.length);
  // 환불 승인 상태는 끝까지 미확인이다
  assert.ok(support.unresolved.includes('refund'));
  assert.equal(displayValue(support, final, 'refund'), UNRESOLVED_LABEL);
  for (const t of support.turns) {
    assert.ok(!/환불 처리했|환불해 드렸|환불이 승인/.test(t.text), t.text);
  }
});

test('부동산 시나리오는 실제 매물이 있다고 답하지 않는다', () => {
  const estate = getScenario('real-estate');
  for (const t of estate.turns) {
    assert.ok(!/매물이 있습니다|매물을 찾았|추천해 드리겠/.test(t.text), t.text);
  }
});

test('가상 시스템 발화는 실제 호출처럼 읽히지 않는다', () => {
  for (const s of DEMO_SCENARIOS) {
    for (const t of s.turns.filter((x) => x.speaker === 'system')) {
      assert.ok(/가상/.test(t.text), `${t.id}: "가상" 표시가 없다`);
    }
  }
});

test('대본에 근거 없는 수치·보장 표현이 없다', () => {
  const BANNED = /(99\.9|100%|정확도 \d|보장합니다|즉시 연동|완벽|무조건)/;
  for (const s of DEMO_SCENARIOS) {
    for (const t of s.turns) assert.ok(!BANNED.test(t.text), `${t.id}: ${t.text}`);
    assert.ok(!BANNED.test(s.introduction), `${s.id} introduction`);
  }
});
