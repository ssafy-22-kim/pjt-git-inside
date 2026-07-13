export const INITIAL_FILE_CONTENT = `# Git Inside\n\nGit의 내부 동작을 직접 확인해 보세요.`;

export const PREDICTION_TARGETS = [
    ['workingDirectory', 'Working Directory'],
    ['index', 'Index'],
    ['objectDatabase', 'Object Database'],
    ['branch', '현재 Branch'],
    ['head', 'HEAD']
];

export const CHANGING_COMMANDS = new Set(['init', 'add', 'commit', 'branch', 'switch']);
