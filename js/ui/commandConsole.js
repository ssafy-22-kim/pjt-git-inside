import { commandSuggestions } from '../content/commandDescriptions.js';
import { escapeHtml } from '../utils/dom.js';

export function renderCommandConsole(state) {
    const history = state.commandHistory.slice(-5).map((item) => `
        <div class="history-entry ${item.ok ? 'is-success' : 'is-error'}"><code>$ ${escapeHtml(item.command)}</code><span>${escapeHtml(item.message)}</span></div>
    `).join('') || '<p class="console-empty">명령 실행 기록이 여기에 표시됩니다.</p>';
    const suggestions = commandSuggestions.map((command) => `<button type="button" class="suggestion" data-suggestion="${escapeHtml(command)}">${escapeHtml(command)}</button>`).join('');
    return `
        <div class="console-label">COMMAND TERMINAL</div>
        <div class="command-history">${history}</div>
        <form class="console-input-row" id="command-form">
            <span class="console-prompt">$</span>
            <input id="command-input" name="command" class="console-input" autocomplete="off" value="${escapeHtml(state.commandDraft)}" aria-label="Git 명령 입력">
            <button class="btn btn-primary" type="submit">실행</button>
        </form>
        <div class="suggestions">${suggestions}</div>
    `;
}
