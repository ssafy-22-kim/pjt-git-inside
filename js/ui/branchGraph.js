import { escapeHtml } from '../utils/dom.js';

export function renderBranchGraph(repository) {
    const branches = Object.entries(repository.refs.heads);
    if (!branches.length) return `<div class="branch-line"><span class="head-node">HEAD</span><span>→</span><span class="branch-node">${escapeHtml(repository.head)}</span><span>→ 아직 commit 없음</span></div>`;
    return branches.map(([name, commitId]) => `
        <div class="branch-line ${name === repository.head ? 'is-current' : ''}">
            ${name === repository.head ? '<span class="head-node">HEAD</span><span>→</span>' : '<span class="head-spacer"></span>'}
            <span class="branch-node">${escapeHtml(name)}</span><span>→</span><span class="commit-node">${escapeHtml(commitId)}</span>
        </div>
    `).join('');
}
