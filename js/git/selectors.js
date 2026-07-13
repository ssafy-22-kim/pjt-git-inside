import { makeObjectId, snapshotFromCommit } from './repository.js';

export function getHeadCommitId(repository) {
    return repository.refs.heads[repository.head] || null;
}

export function getHeadSnapshot(repository) {
    return snapshotFromCommit(repository, getHeadCommitId(repository));
}

export function getFileStates(repository) {
    const head = getHeadSnapshot(repository);
    const paths = new Set([
        ...Object.keys(repository.workingDirectory),
        ...Object.keys(repository.index),
        ...Object.keys(head)
    ]);

    return [...paths].map((path) => {
        const file = repository.workingDirectory[path];
        const workingBlob = file ? makeObjectId('blob', file.content) : null;
        const indexBlob = repository.index[path] || null;
        const headBlob = head[path] || null;
        return {
            path,
            workingBlob,
            indexBlob,
            headBlob,
            untracked: Boolean(file && !indexBlob && !headBlob),
            unstaged: Boolean(file && indexBlob && workingBlob !== indexBlob),
            staged: indexBlob !== headBlob
        };
    });
}

export function isClean(repository) {
    return getFileStates(repository).every((file) => !file.untracked && !file.unstaged && !file.staged);
}

export function getRepositoryCounts(repository) {
    return {
        blobs: Object.keys(repository.objects.blobs).length,
        trees: Object.keys(repository.objects.trees).length,
        commits: Object.keys(repository.objects.commits).length
    };
}
