import { PREDICTION_TARGETS } from '../core/constants.js';
import { helpContent } from '../content/concepts.js';
import { escapeHtml } from '../utils/dom.js';

export function renderExplanationPanel(state) {
    if (state.helpOpen) return `<div class="help-panel">${helpContent}<button class="btn btn-secondary" data-close-help>닫기</button></div>`;
    if (state.pendingCommand) {
        const options = PREDICTION_TARGETS.map(([key, label]) => `<label class="prediction-card"><input type="checkbox" value="${key}" ${state.prediction.includes(key) ? 'checked' : ''}>${label}</label>`).join('');
        return `<div><span class="badge badge-new">실행 전 예측</span><h3><code>${escapeHtml(state.pendingCommand)}</code> 실행 후 무엇이 바뀔까요?</h3><div class="prediction-grid">${options}</div><div class="action-row"><button class="btn btn-primary" data-confirm-command>예측 제출하고 실행</button><button class="btn btn-secondary" data-cancel-command>취소</button></div></div>`;
    }
    const last = state.lastResult;
    if (!last) return `<div><h3>관찰 → 예측 → 실행 → 비교</h3><p>${escapeHtml(state.notice)}</p></div>`;
    const predicted = state.lastPrediction?.length ? state.lastPrediction.join(', ') : '없음';
    const actual = last.changed.length ? last.changed.join(', ') : '없음';
    return `<div class="result-panel ${last.ok ? 'is-success' : 'is-error'}"><span class="badge ${last.ok ? 'badge-staged' : 'badge-modified'}">${last.ok ? '실행 완료' : '오류'}</span><h3>${escapeHtml(last.message)}</h3><p><strong>예측:</strong> ${escapeHtml(predicted)}</p><p><strong>실제 변경:</strong> ${escapeHtml(actual)}</p><p><strong>유지:</strong> ${escapeHtml(last.unchanged.join(', '))}</p></div>`;
}
