import { getFileStates, getHeadCommitId, getHeadSnapshot } from '../git/selectors.js';
import { escapeHtml } from '../utils/dom.js';

function badgeFor(file) {
    const badges = [];
    if (file.untracked) badges.push('<span class="badge badge-untracked">Untracked</span>');
    if (file.staged) badges.push('<span class="badge badge-staged">Staged</span>');
    if (file.unstaged) badges.push('<span class="badge badge-modified">Modified</span>');
    if (!badges.length) badges.push('<span class="badge badge-committed">Clean</span>');
    return badges.join(' ');
}

export function renderRepositoryPanels(repository) {
    const fileStates = Object.fromEntries(getFileStates(repository).map((file) => [file.path, file]));
    const workingFiles = Object.entries(repository.workingDirectory).map(([path, file]) => `
        <article class="file-card">
            <div class="file-card__title"><code>${escapeHtml(path)}</code><span>${badgeFor(fileStates[path])}</span></div>
            <textarea class="editor-textarea" data-file-editor="${escapeHtml(path)}">${escapeHtml(file.content)}</textarea>
            <div class="file-actions"><button class="btn btn-secondary btn-small" data-save-file="${escapeHtml(path)}">수정 내용 저장</button></div>
        </article>
    `).join('');

    const indexFiles = Object.entries(repository.index).map(([path, blobId]) => `
        <article class="file-card file-card--index"><div class="file-card__title"><code>${escapeHtml(path)}</code><span class="badge badge-staged">Index</span></div><small>→ ${escapeHtml(blobId)}</small></article>
    `).join('') || '<p class="empty-state">아직 Index가 비어 있습니다.</p>';

    const headId = getHeadCommitId(repository);
    const headFiles = Object.entries(getHeadSnapshot(repository)).map(([path, blobId]) => `
        <article class="file-card file-card--commit"><div class="file-card__title"><code>${escapeHtml(path)}</code><span class="badge badge-committed">Committed</span></div><small>→ ${escapeHtml(blobId)}</small></article>
    `).join('') || '<p class="empty-state">아직 commit이 없습니다.</p>';

    return `
        <article class="panel"><h3>Working Directory</h3><p class="panel-help">지금 편집 중인 파일</p>${workingFiles}</article>
        <article class="panel"><h3>Index</h3><p class="panel-help">다음 commit에 들어갈 스냅샷</p>${indexFiles}</article>
        <article class="panel"><h3>HEAD Commit</h3><p class="panel-help">HEAD → ${escapeHtml(repository.head)} → ${escapeHtml(headId || '(unborn)')}</p>${headFiles}</article>
    `;
}
