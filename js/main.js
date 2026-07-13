import { CHANGING_COMMANDS } from './core/constants.js';
import { createStore } from './core/store.js';
import { executeCommand, parseCommand } from './git/commands.js';
import { updateWorkingFile } from './git/repository.js';
import { renderApp } from './ui/render.js';

const store = createStore();

function runCommand(command, prediction = []) {
    const state = store.getState();
    const outcome = executeCommand(state.repository, command);
    store.setState({
        ...state,
        repository: outcome.repository,
        commandDraft: command,
        commandHistory: [...state.commandHistory, outcome.result],
        pendingCommand: null,
        prediction: [],
        lastPrediction: prediction,
        lastResult: outcome.result,
        notice: outcome.result.message
    });
}

function requestCommand(command) {
    const parsed = parseCommand(command);
    if (!parsed.error && CHANGING_COMMANDS.has(parsed.name)) {
        store.update((state) => ({ ...state, commandDraft: command, pendingCommand: command, prediction: [], lastResult: null }));
        return;
    }
    runCommand(command);
}

function handleClick(event) {
    const target = event.target;
    if (target.closest('[data-reset]')) {
        if (window.confirm('학습 상태와 명령 기록을 모두 초기화할까요?')) store.reset();
        return;
    }
    if (target.closest('[data-open-help]')) {
        store.update((state) => ({ ...state, helpOpen: true }));
        return;
    }
    if (target.closest('[data-close-help]')) {
        store.update((state) => ({ ...state, helpOpen: false }));
        return;
    }
    const suggestion = target.closest('[data-suggestion]');
    if (suggestion) {
        store.update((state) => ({ ...state, commandDraft: suggestion.dataset.suggestion }));
        return;
    }
    const saveButton = target.closest('[data-save-file]');
    if (saveButton) {
        const path = saveButton.dataset.saveFile;
        const editor = document.querySelector(`[data-file-editor="${CSS.escape(path)}"]`);
        const state = store.getState();
        const repository = updateWorkingFile(state.repository, path, editor.value);
        store.setState({
            ...state,
            repository,
            notice: `${path}의 Working Directory 내용을 수정했습니다.`,
            lastPrediction: [],
            lastResult: {
                ok: true,
                command: '파일 편집',
                message: `${path}의 Working Directory 내용을 수정했습니다.`,
                changed: ['workingDirectory'],
                unchanged: ['index', 'objectDatabase', 'branch', 'head'],
                created: [], reused: []
            }
        });
        return;
    }
    if (target.closest('[data-confirm-command]')) {
        const state = store.getState();
        runCommand(state.pendingCommand, state.prediction);
        return;
    }
    if (target.closest('[data-cancel-command]')) {
        store.update((state) => ({ ...state, pendingCommand: null, prediction: [] }));
    }
}

function handleChange(event) {
    if (!event.target.matches('.prediction-card input')) return;
    const checked = [...document.querySelectorAll('.prediction-card input:checked')].map((input) => input.value);
    store.update((state) => ({ ...state, prediction: checked }));
}

function handleSubmit(event) {
    if (!event.target.matches('#command-form')) return;
    event.preventDefault();
    requestCommand(new FormData(event.target).get('command') || document.getElementById('command-input').value);
}

document.addEventListener('DOMContentLoaded', () => {
    store.subscribe(renderApp);
    document.addEventListener('click', handleClick);
    document.addEventListener('change', handleChange);
    document.addEventListener('submit', handleSubmit);
    renderApp(store.getState());
});
