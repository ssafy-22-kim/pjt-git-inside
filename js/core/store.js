import { createRepository } from '../git/repository.js';

export function createInitialState() {
    return {
        repository: createRepository(),
        commandHistory: [],
        commandDraft: 'git status',
        pendingCommand: null,
        prediction: [],
        lastResult: null,
        notice: '현재 상태를 살펴보고 첫 명령을 실행해 보세요.',
        helpOpen: false
    };
}

export function createStore(initialState = createInitialState()) {
    let state = initialState;
    const listeners = new Set();

    return {
        getState: () => state,
        setState(nextState) {
            state = nextState;
            listeners.forEach((listener) => listener(state));
        },
        update(updater) {
            this.setState(updater(state));
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        reset() {
            this.setState(createInitialState());
        }
    };
}
