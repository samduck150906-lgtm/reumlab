import { createHash } from 'node:crypto';

export const EXECUTION_STATUSES = new Set([
  'ANSWER_CAPTURED',
  'NO_AI_FEATURE',
  'INCOMPLETE_CAPTURE',
  'AUTH_REQUIRED',
  'RATE_LIMITED',
  'NETWORK_ERROR',
  'UNSUPPORTED',
  'NOT_RUN',
]);

export const REVIEWED_STATUSES = new Set(['REVIEWED', 'VERIFIED']);

const REUMLAB_ALIASES = new Set([
  '름랩',
  'reumlab',
  'reum lab',
  'reumlab.com',
  'www.reumlab.com',
]);

export function sha256(value) {
  return createHash('sha256').update(String(value), 'utf8').digest('hex');
}
export function promptHash(text) {
  return sha256(String(text).normalize('NFC').trim());
}

export function parseBoolean(value) {
  if (typeof value === 'boolean') return value;
  if (value === 1 || value === '1') return true;
  if (value === 0 || value === '0') return false;
  const normalized = String(value ?? '').trim().toLowerCase();
  if (['true', 'yes', 'y'].includes(normalized)) return true;
  if (['false', 'no', 'n'].includes(normalized)) return false;
  return null;
}

export function parseList(value) {
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean);
  const text = String(value ?? '').trim();
  if (!text) return [];
  if (text.startsWith('[')) {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) throw new Error(`배열이 필요합니다: ${text}`);
    return parsed.map(String).map((v) => v.trim()).filter(Boolean);
  }
  return text.split('|').map((v) => v.trim()).filter(Boolean);
}

export function normalizeEntity(value) {
  const original = String(value ?? '').trim();
  const key = original.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ');
  if (REUMLAB_ALIASES.has(key)) return 'REUMLAB';
  return original.replace(/\s+/g, ' ');
}

export function uniqueEntities(values) {
  const result = [];
  const seen = new Set();
  for (const value of parseList(values)) {
    const normalized = normalizeEntity(value);
    const key = normalized.toLowerCase();
    if (!normalized || seen.has(key)) continue;
    seen.add(key);
    result.push(normalized);
  }
  return result;
}

export function isOfficialSiteUrl(value) {
  try {
    const host = new URL(String(value)).hostname.toLowerCase().replace(/\.$/, '');
    return host === 'reumlab.com' || host === 'www.reumlab.com';
  } catch {
    return false;
  }
}

export function officialCitationUrls(record) {
  return parseList(record.citation_urls).filter(isOfficialSiteUrl);
}

export function hasRawEvidence(record) {
  return Boolean(String(record.raw_response_path ?? '').trim() && String(record.raw_response_hash ?? '').trim());
}

export function isValidMeasuredAnswer(record) {
  return record.execution_status === 'ANSWER_CAPTURED'
    && !parseBoolean(record.is_synthetic)
    && hasRawEvidence(record)
    && REVIEWED_STATUSES.has(record.review_status);
}

export function formatRate(numerator, denominator) {
  if (!denominator) return 'N/A';
  return `${numerator}/${denominator} (${((numerator / denominator) * 100).toFixed(1)}%)`;
}

export function normalizeRecord(input, manifest) {
  const record = { ...input };
  const prompt = manifest.prompts.find((item) => item.id === record.prompt_id);
  if (prompt) {
    record.prompt_text = String(record.prompt_text || prompt.text).normalize('NFC').trim();
    record.prompt_hash = promptHash(record.prompt_text);
  }
  record.dataset_version = record.dataset_version || manifest.dataset_version;
  record.repeat_index = Number(record.repeat_index || 1);
  record.search_enabled = parseBoolean(record.search_enabled);
  record.ai_feature_shown = parseBoolean(record.ai_feature_shown);
  record.brand_mentioned_in_body = parseBoolean(record.brand_mentioned_in_body);
  record.brand_recommended = parseBoolean(record.brand_recommended);
  record.unranked_recommendation = parseBoolean(record.unranked_recommendation);
  record.official_site_cited = parseBoolean(record.official_site_cited);
  record.citation_supports_claim = parseBoolean(record.citation_supports_claim);
  record.is_synthetic = parseBoolean(record.is_synthetic) === true;
  record.explicit_recommendation_rank = String(record.explicit_recommendation_rank ?? '').trim()
    ? Number(record.explicit_recommendation_rank)
    : null;
  record.source_links = parseList(record.source_links);
  record.citation_urls = parseList(record.citation_urls);
  record.competitor_entities = uniqueEntities(record.competitor_entities);
  if (record.official_site_cited == null) {
    record.official_site_cited = officialCitationUrls(record).length > 0;
  }
  return record;
}

export function validateRecord(record, manifest) {
  const errors = [];
  const prompt = manifest.prompts.find((item) => item.id === record.prompt_id);
  if (!prompt) errors.push(`알 수 없는 prompt_id: ${record.prompt_id || '(empty)'}`);
  if (record.dataset_version !== manifest.dataset_version) {
    errors.push(`dataset_version 불일치: ${record.dataset_version || '(empty)'}`);
  }
  if (!EXECUTION_STATUSES.has(record.execution_status)) {
    errors.push(`올바르지 않은 execution_status: ${record.execution_status || '(empty)'}`);
  }
  if (!record.surface) errors.push('surface가 필요합니다.');
  if (!record.timestamp) errors.push('timestamp가 필요합니다.');
  if (!Number.isInteger(record.repeat_index) || record.repeat_index < 1) {
    errors.push('repeat_index는 1 이상의 정수여야 합니다.');
  }
  if (record.execution_status === 'ANSWER_CAPTURED') {
    if (!hasRawEvidence(record)) errors.push('ANSWER_CAPTURED는 raw_response_path와 raw_response_hash가 필요합니다.');
    if (!REVIEWED_STATUSES.has(record.review_status)) {
      errors.push('ANSWER_CAPTURED를 집계하려면 review_status가 REVIEWED 또는 VERIFIED여야 합니다.');
    }
  }
  if (record.explicit_recommendation_rank != null
    && (!Number.isInteger(record.explicit_recommendation_rank) || record.explicit_recommendation_rank < 1)) {
    errors.push('explicit_recommendation_rank는 1 이상의 정수이거나 null이어야 합니다.');
  }
  if (record.official_site_cited && officialCitationUrls(record).length === 0) {
    errors.push('official_site_cited=true이면 reumlab.com 또는 www.reumlab.com의 실제 citation URL이 필요합니다.');
  }
  return errors;
}

export function aggregate(records, manifest) {
  const real = records.filter((record) => !parseBoolean(record.is_synthetic));
  const nonBrand = real.filter((record) => /^Q\d{2}$/.test(record.prompt_id));
  const valid = nonBrand.filter(isValidMeasuredAnswer);
  const attempted = nonBrand.filter((record) => record.execution_status !== 'NOT_RUN');
  const unresolvedStatuses = new Set(['INCOMPLETE_CAPTURE', 'AUTH_REQUIRED', 'RATE_LIMITED', 'NETWORK_ERROR', 'UNSUPPORTED']);
  const unresolved = nonBrand.filter((record) => unresolvedStatuses.has(record.execution_status)
    || (record.execution_status === 'ANSWER_CAPTURED' && !isValidMeasuredAnswer(record)));
  const mentioned = valid.filter((record) => record.brand_mentioned_in_body === true);
  const recommended = valid.filter((record) => record.brand_recommended === true);
  const cited = valid.filter((record) => officialCitationUrls(record).length > 0 && record.official_site_cited === true);
  const both = valid.filter((record) => record.brand_recommended === true
    && officialCitationUrls(record).length > 0 && record.official_site_cited === true);
  const rankable = valid.filter((record) => Number.isInteger(record.explicit_recommendation_rank));
  const unranked = recommended.filter((record) => record.unranked_recommendation === true
    || record.explicit_recommendation_rank == null);

  const bySurface = {};
  for (const surface of manifest.surfaces) {
    const surfaceRecords = nonBrand.filter((record) => record.surface === surface.id);
    const surfaceValid = surfaceRecords.filter(isValidMeasuredAnswer);
    bySurface[surface.id] = {
      attempted: surfaceRecords.filter((record) => record.execution_status !== 'NOT_RUN').length,
      valid: surfaceValid.length,
      no_ai_feature: surfaceRecords.filter((record) => record.execution_status === 'NO_AI_FEATURE').length,
      mentioned: surfaceValid.filter((record) => record.brand_mentioned_in_body === true).length,
      recommended: surfaceValid.filter((record) => record.brand_recommended === true).length,
      cited: surfaceValid.filter((record) => record.official_site_cited === true && officialCitationUrls(record).length > 0).length,
    };
  }

  const entityAppearances = new Map();
  for (const record of valid) {
    const entities = uniqueEntities([
      ...(record.brand_recommended ? ['REUMLAB'] : []),
      ...parseList(record.competitor_entities),
    ]);
    for (const entity of entities) entityAppearances.set(entity, (entityAppearances.get(entity) || 0) + 1);
  }
  const totalEntityAppearances = [...entityAppearances.values()].reduce((sum, value) => sum + value, 0);

  return {
    planned: manifest.prompts.filter((prompt) => prompt.group !== 'brand_control').length
      * manifest.surfaces.length * manifest.repeats,
    attempted: attempted.length,
    valid: valid.length,
    unresolved: unresolved.length,
    mentioned: mentioned.length,
    recommended: recommended.length,
    cited: cited.length,
    both: both.length,
    rankable: rankable.length,
    top3: rankable.filter((record) => record.explicit_recommendation_rank <= 3).length,
    top5: rankable.filter((record) => record.explicit_recommendation_rank <= 5).length,
    unranked: unranked.length,
    bySurface,
    recommendationShare: {
      reumlab: entityAppearances.get('REUMLAB') || 0,
      total: totalEntityAppearances,
      entities: Object.fromEntries([...entityAppearances.entries()].sort((a, b) => b[1] - a[1])),
    },
  };
}
