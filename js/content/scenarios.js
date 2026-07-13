export const scenarios = [
    { id: 'first-commit', title: '첫 commit 만들기', hint: 'git init → git add README.md → git commit -m "first commit"' },
    { id: 'stage-and-modify', title: 'Stage 이후 다시 수정하기', hint: '파일을 수정하고 add한 뒤 다시 수정해 두 상태를 비교하세요.' },
    { id: 'branch', title: 'Branch 생성과 전환', hint: 'git branch experiment → git switch experiment' },
    { id: 'return-main', title: '기존 branch로 돌아가기', hint: 'experiment에서 commit한 뒤 git switch main을 실행하세요.' }
];

export function getScenarioIndex(repository) {
    const commits = Object.keys(repository.objects.commits).length;
    const branches = Object.keys(repository.refs.heads);
    if (!repository.initialized || commits === 0) return 0;
    if (!branches.includes('experiment')) return 1;
    if (repository.head === 'experiment') return 2;
    return 3;
}
