import { cloneRepository, makeObjectId, snapshotFromCommit } from './repository.js';
import { getHeadCommitId, getHeadSnapshot, isClean } from './selectors.js';

const result = (ok, command, message, changed = [], created = [], reused = []) => ({
    ok, command, message, changed, created, reused,
    unchanged: ['workingDirectory', 'index', 'objectDatabase', 'branch', 'head'].filter((key) => !changed.includes(key))
});

export function parseCommand(input) {
    const text = input.trim();
    if (!text.startsWith('git ')) return { error: '명령은 git으로 시작해야 합니다.' };
    const tokens = text.match(/"[^"]*"|'[^']*'|\S+/g) || [];
    const name = tokens[1];
    if (!name) return { error: '실행할 Git 명령을 입력하세요.' };
    return { text, name, args: tokens.slice(2).map((token) => token.replace(/^['"]|['"]$/g, '')) };
}

export function executeCommand(repository, input) {
    const parsed = parseCommand(input);
    if (parsed.error) return { repository, result: result(false, input, parsed.error) };
    const { text, name, args } = parsed;
    const next = cloneRepository(repository);

    if (!['init', 'status', 'add', 'commit', 'branch', 'switch'].includes(name)) {
        return { repository, result: result(false, text, `지원하지 않는 명령입니다: git ${name}`) };
    }
    if (name !== 'init' && !repository.initialized) {
        return { repository, result: result(false, text, '아직 Git 저장소가 아닙니다. git init을 먼저 실행하세요.') };
    }

    if (name === 'init') {
        if (repository.initialized) return { repository, result: result(true, text, '이미 초기화된 Git 저장소입니다.') };
        next.initialized = true;
        return { repository: next, result: result(true, text, '.git 저장소를 초기화했습니다.', ['head']) };
    }

    if (name === 'status') {
        const clean = isClean(repository);
        return { repository, result: result(true, text, clean ? '변경 사항이 없습니다. Working tree clean.' : 'Working Directory, Index, HEAD 사이에 변경 사항이 있습니다.') };
    }

    if (name === 'add') {
        const path = args[0];
        if (!path || args.length !== 1) return { repository, result: result(false, text, '사용법: git add <file>') };
        const file = repository.workingDirectory[path];
        if (!file) return { repository, result: result(false, text, `파일을 찾을 수 없습니다: ${path}`) };
        const blobId = makeObjectId('blob', file.content);
        const reused = Boolean(next.objects.blobs[blobId]);
        next.objects.blobs[blobId] ||= { content: file.content };
        next.index[path] = blobId;
        return {
            repository: next,
            result: result(true, text, `${path}의 현재 내용을 Index에 기록했습니다.`, ['index', 'objectDatabase'], reused ? [] : [blobId], reused ? [blobId] : [])
        };
    }

    if (name === 'commit') {
        const messageIndex = args.indexOf('-m');
        const message = messageIndex >= 0 ? args[messageIndex + 1] : '';
        if (!message) return { repository, result: result(false, text, '사용법: git commit -m "메시지"') };
        const headId = getHeadCommitId(repository);
        const headSnapshot = getHeadSnapshot(repository);
        if (JSON.stringify(repository.index) === JSON.stringify(headSnapshot)) {
            return { repository, result: result(false, text, 'commit할 staged 변경 사항이 없습니다.') };
        }
        const entries = Object.entries(next.index).sort(([a], [b]) => a.localeCompare(b)).map(([name, id]) => ({ name, type: 'blob', id }));
        const treeId = makeObjectId('tree', entries);
        const treeReused = Boolean(next.objects.trees[treeId]);
        next.objects.trees[treeId] ||= { entries };
        const commitValue = { treeId, parent: headId, message };
        const commitId = makeObjectId('commit', commitValue);
        next.objects.commits[commitId] = commitValue;
        next.refs.heads[next.head] = commitId;
        return {
            repository: next,
            result: result(true, text, `${next.head}에 새 commit을 만들었습니다.`, ['objectDatabase', 'branch'], [commitId, ...(treeReused ? [] : [treeId])], treeReused ? [treeId] : [])
        };
    }

    if (name === 'branch') {
        const branchName = args[0];
        if (!branchName || args.length !== 1) return { repository, result: result(false, text, '사용법: git branch <name>') };
        if (!/^[a-z0-9-]+$/.test(branchName)) return { repository, result: result(false, text, 'branch 이름은 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.') };
        const headId = getHeadCommitId(repository);
        if (!headId) return { repository, result: result(false, text, '첫 commit을 만든 뒤 branch를 생성하세요.') };
        if (repository.refs.heads[branchName]) return { repository, result: result(false, text, `이미 존재하는 branch입니다: ${branchName}`) };
        next.refs.heads[branchName] = headId;
        return { repository: next, result: result(true, text, `${branchName} branch를 현재 commit에 생성했습니다.`, ['branch']) };
    }

    const branchName = args[0];
    if (!branchName || args.length !== 1) return { repository, result: result(false, text, '사용법: git switch <name>') };
    if (!repository.refs.heads[branchName]) return { repository, result: result(false, text, `존재하지 않는 branch입니다: ${branchName}`) };
    if (repository.head === branchName) return { repository, result: result(false, text, `이미 ${branchName} branch에 있습니다.`) };
    if (!isClean(repository)) return { repository, result: result(false, text, '변경 사항이 있어 전환할 수 없습니다. 먼저 add와 commit을 완료하세요.') };
    const targetCommit = repository.refs.heads[branchName];
    const snapshot = snapshotFromCommit(repository, targetCommit);
    next.head = branchName;
    next.index = { ...snapshot };
    next.workingDirectory = Object.fromEntries(Object.entries(snapshot).map(([path, blobId]) => [path, { content: next.objects.blobs[blobId].content }]));
    return { repository: next, result: result(true, text, `${branchName} branch로 전환했습니다.`, ['workingDirectory', 'index', 'head']) };
}
