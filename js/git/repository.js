import { INITIAL_FILE_CONTENT } from '../core/constants.js';

export function createRepository() {
    return {
        initialized: false,
        workingDirectory: {
            'README.md': { content: INITIAL_FILE_CONTENT }
        },
        index: {},
        objects: { blobs: {}, trees: {}, commits: {} },
        refs: { heads: {} },
        head: 'main'
    };
}

export function cloneRepository(repository) {
    return structuredClone(repository);
}

export function updateWorkingFile(repository, path, content) {
    const next = cloneRepository(repository);
    if (!next.workingDirectory[path]) return repository;
    next.workingDirectory[path] = { content };
    return next;
}

export function makeObjectId(type, value) {
    const source = `${type}:${JSON.stringify(value)}`;
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) {
        hash ^= source.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return `${type}-${(hash >>> 0).toString(16).padStart(8, '0').slice(0, 6)}`;
}

export function snapshotFromCommit(repository, commitId) {
    if (!commitId) return {};
    const commit = repository.objects.commits[commitId];
    const tree = commit && repository.objects.trees[commit.treeId];
    if (!tree) return {};
    return Object.fromEntries(tree.entries.map((entry) => [entry.name, entry.id]));
}
