import { scenarios, getScenarioIndex } from '../content/scenarios.js';
import { getRepositoryCounts } from '../git/selectors.js';
import { byId, escapeHtml } from '../utils/dom.js';
import { renderRepositoryPanels } from './repositoryPanels.js';
import { renderObjectGraph } from './objectGraph.js';
import { renderBranchGraph } from './branchGraph.js';
import { renderCommandConsole } from './commandConsole.js';
import { renderExplanationPanel } from './explanationPanel.js';

function renderHeader(state) {
    const repository = state.repository;
    const status = repository.initialized ? `HEAD → ${repository.head}` : '저장소 초기화 전';
    const isDark = document.documentElement.dataset.theme === 'dark';
    const themeLabel = isDark ? '라이트 모드' : '다크 모드';
    const themeIcon = isDark ? '☀️' : '🌙';
    byId('header-panel').innerHTML = `
        <div><p class="eyebrow">INTERACTIVE LEARNING LAB</p><h1>Git Inside</h1><p>명령 한 줄이 Git 내부를 어떻게 바꾸는지 직접 확인하세요.</p></div>
        <div class="header-actions"><span class="status-pill">${escapeHtml(status)}</span><button class="btn btn-secondary theme-toggle" data-theme-toggle aria-pressed="${isDark}">${themeIcon} ${themeLabel}</button><button class="btn btn-secondary" data-open-help>도움말</button><button class="btn btn-primary" data-reset>처음부터</button></div>
    `;
}

function renderProgress(repository) {
    const current = getScenarioIndex(repository);
    byId('progress-panel').innerHTML = `
        <div class="progress-copy"><strong>시나리오 ${current + 1} / ${scenarios.length}</strong><h2>${escapeHtml(scenarios[current].title)}</h2><p>${escapeHtml(scenarios[current].hint)}</p></div>
        <ol class="progress-steps">${scenarios.map((scenario, index) => `<li class="${index === current ? 'is-current' : index < current ? 'is-done' : ''}"><span>${index + 1}</span>${escapeHtml(scenario.title)}</li>`).join('')}</ol>
    `;
}

function renderStats(repository) {
    const counts = getRepositoryCounts(repository);
    byId('repository-summary').innerHTML = `
        <span><strong>${Object.keys(repository.workingDirectory).length}</strong> working file</span>
        <span><strong>${Object.keys(repository.index).length}</strong> indexed</span>
        <span><strong>${counts.blobs}</strong> blob</span>
        <span><strong>${counts.trees}</strong> tree</span>
        <span><strong>${counts.commits}</strong> commit</span>
    `;
}

export function renderApp(state) {
    renderHeader(state);
    renderProgress(state.repository);
    renderStats(state.repository);
    byId('repository-panels').innerHTML = renderRepositoryPanels(state.repository);
    byId('branch-graph').innerHTML = renderBranchGraph(state.repository);
    byId('object-graph').innerHTML = renderObjectGraph(state.repository, state.lastResult);
    byId('console-panel').innerHTML = renderCommandConsole(state);
    byId('explanation-panel').innerHTML = renderExplanationPanel(state);
}
