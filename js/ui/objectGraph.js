import { escapeHtml } from '../utils/dom.js';

export function renderObjectGraph(repository, lastResult) {
    const groups = [
        ['commit', repository.objects.commits],
        ['tree', repository.objects.trees],
        ['blob', repository.objects.blobs]
    ];
    const cards = groups.flatMap(([type, objects]) => Object.keys(objects).map((id) => {
        const marker = lastResult?.created?.includes(id) ? '<span class="badge badge-new">New</span>' : lastResult?.reused?.includes(id) ? '<span class="badge badge-reused">Reused</span>' : '';
        return `<div class="object-node object-node--${type}">${marker}<strong>${escapeHtml(id)}</strong><small>${type}</small></div>`;
    })).join('');
    return cards || '<p class="empty-state">git add를 실행하면 blob 객체가 여기에 생성됩니다.</p>';
}
