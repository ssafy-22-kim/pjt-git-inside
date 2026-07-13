# Implementation Guide

## 1. 문서 목적

이 문서는 Git Inside MVP를 Vanilla HTML, CSS, JavaScript로 구현할 때 지켜야 할 구조, 데이터 흐름, 파일별 책임, 구현 순서, 검증 기준을 정의한다.

구현자는 다음 기획 문서를 기준으로 작업한다.

- `project-brief.md`
- `learning-goals.md`
- `mvp-scope.md`
- `user-flow.md`
- `screen-spec.md`

이 문서는 새로운 기능을 제안하지 않는다. 이미 확정된 MVP 범위를 일관된 코드 구조로 구현하기 위한 지침만 제공한다.

---

## 2. 기술 제약

다음 기술만 사용한다.

- HTML
- CSS
- Vanilla JavaScript
- ES Module

다음 기술은 사용하지 않는다.

- React
- Vue
- Angular
- TypeScript
- jQuery
- CSS 프레임워크
- 외부 상태 관리 라이브러리
- 번들러
- 빌드 도구
- 서버
- 데이터베이스

빌드 과정 없이 정적 웹 서버에서 실행할 수 있어야 한다.

ES Module 제약으로 인해 `index.html` 파일을 `file://` 방식으로 직접 여는 실행은 지원 대상으로 보지 않는다. 로컬 개발 시에는 Python의 `http.server`, VS Code Live Server 등 간단한 정적 웹 서버를 사용한다.

---

## 3. 공식 디렉터리 구조

```text
git-inside/
│
├─ docs/
│  ├─ project-brief.md
│  ├─ learning-goals.md
│  ├─ mvp-scope.md
│  ├─ user-flow.md
│  ├─ screen-spec.md
│  ├─ notes.md
│  └─ implementation-guide.md
│
├─ assets/
│  ├─ images/
│  └─ icons/
│
├─ css/
│  ├─ reset.css
│  ├─ style.css
│  └─ simulator.css
│
├─ js/
│  ├─ main.js
│  │
│  ├─ core/
│  │  ├─ store.js
│  │  └─ constants.js
│  │
│  ├─ git/
│  │  ├─ repository.js
│  │  ├─ commands.js
│  │  └─ selectors.js
│  │
│  ├─ ui/
│  │  ├─ render.js
│  │  ├─ commandConsole.js
│  │  ├─ repositoryPanels.js
│  │  ├─ objectGraph.js
│  │  ├─ branchGraph.js
│  │  └─ explanationPanel.js
│  │
│  ├─ content/
│  │  ├─ concepts.js
│  │  ├─ commandDescriptions.js
│  │  └─ scenarios.js
│  │
│  └─ utils/
│     └─ dom.js
│
├─ index.html
└─ README.md
```

---

## 4. 구조 설계 원칙

### 4.1 단방향 데이터 흐름

모든 동작은 다음 흐름을 따른다.

```text
사용자 입력
→ UI 이벤트 핸들러
→ Git 명령 함수 실행
→ repository 상태 변경
→ 실행 결과 반환
→ app store 갱신
→ renderApp(store)
```

예상 형태:

```js
const result = executeAdd(store.repository, fileName);

store.lastResult = result;
store.message = result.message;

renderApp(store);
```

### 4.2 책임 분리

```text
core/       앱 전체 상태와 공통 상수
git/        교육용 Git 저장소 구조, 명령 동작, 상태 해석
ui/         사용자 입력과 DOM 출력
content/    교육 문장과 학습 시나리오
utils/      재사용 가능한 최소 DOM 보조 함수
```

### 4.3 금지되는 의존 관계

다음 구조를 만들지 않는다.

```text
commands.js → DOM 직접 조작
commands.js → renderApp 직접 호출
selectors.js → 저장소 상태 변경
ui 파일 → repository 내부 상태 직접 변경
개별 UI 파일 → 다른 UI 파일 직접 재렌더링
```

권장 구조:

```text
UI 이벤트
→ commands.js
→ repository 상태 변경
→ 결과 반환
→ renderApp(store)
```

---

## 5. 앱 상태와 저장소 상태의 구분

### 5.1 `store.js`

`store.js`는 저장소를 포함한 앱 전체 상태를 보관한다.

최소 상태 예시:

```js
export const store = {
  repository: null,

  currentScenarioId: null,
  currentStepId: null,

  selectedCommand: "",
  commandHistory: [],

  pendingPrediction: null,
  lastPrediction: null,
  lastResult: null,

  message: null,
  highlightedItems: []
};
```

`store.js`가 담당하는 항목:

- 현재 repository
- 현재 시나리오와 단계
- 입력 중인 명령
- 명령 실행 기록
- 사용자 예측
- 최근 명령 결과
- 안내 또는 오류 메시지
- 최근 변경 강조 정보

### 5.2 `repository.js`

`repository.js`는 `store.repository`에 들어갈 교육용 Git 저장소 구조를 생성한다.

최소 구조 예시:

```js
{
  initialized: false,

  workingDirectory: {
    "README.md": {
      content: "..."
    }
  },

  index: {},

  objects: {
    blobs: {},
    trees: {},
    commits: {}
  },

  refs: {
    heads: {}
  },

  head: null
}
```

초기화 이후 예시:

```js
{
  initialized: true,
  workingDirectory: {
    "README.md": {
      content: "..."
    }
  },
  index: {},
  objects: {
    blobs: {},
    trees: {},
    commits: {}
  },
  refs: {
    heads: {
      main: null
    }
  },
  head: "main"
}
```

### 5.3 상태 중복 금지

다음 값은 저장하지 않고 `selectors.js`에서 계산한다.

- untracked
- staged
- unstaged
- clean
- current commit
- current branch
- HEAD commit의 파일 스냅샷
- branch graph용 데이터
- object graph용 데이터

특히 파일 상태를 단일 문자열로 저장하지 않는다.

잘못된 예:

```js
{
  "README.md": {
    status: "staged"
  }
}
```

권장 결과 형식:

```js
{
  path: "README.md",
  untracked: false,
  staged: true,
  unstaged: true
}
```

하나의 파일은 staged와 unstaged를 동시에 가질 수 있다.

---

## 6. `constants.js`

다음과 같은 공통 값을 정의한다.

- 지원 명령어 이름
- 초기 branch 이름
- 객체 종류
- 메시지 종류
- 시나리오 ID
- 단계 ID
- 변경 영역 이름
- 허용 branch 이름 정규식

예시:

```js
export const DEFAULT_BRANCH = "main";

export const OBJECT_TYPES = {
  BLOB: "blob",
  TREE: "tree",
  COMMIT: "commit"
};

export const CHANGE_TARGETS = {
  WORKING_DIRECTORY: "workingDirectory",
  INDEX: "index",
  OBJECT_DATABASE: "objectDatabase",
  BRANCH: "branch",
  HEAD: "head"
};
```

교육 문장 전체를 `constants.js`에 넣지 않는다.

---

## 7. `repository.js`

### 7.1 책임

- 초기 저장소 상태 생성
- 저장소 전체 초기화
- 저장소 상태 복제에 필요한 보조 처리
- 객체 저장 공간과 refs 구조 제공

### 7.2 권장 함수

```js
createInitialRepository()
initializeRepository(repository)
resetRepository()
updateWorkingFile(repository, filePath, content)
```

### 7.3 Working Directory 파일 편집

파일 편집은 UI가 `repository.workingDirectory`를 직접 수정하지 않고 `repository.js`의 전용 함수를 통해 수행한다.

```text
repositoryPanels.js 이벤트
→ updateWorkingFile(repository, filePath, content)
→ store.lastResult 및 message 갱신
→ 현재 시나리오 단계 완료 조건 검사
→ renderApp(store)
```

`updateWorkingFile()`은 다음 책임만 가진다.

- 대상 파일 존재 여부 검사
- Working Directory의 파일 내용 갱신
- 변경 결과 반환
- Index, Object Database, branch, HEAD는 변경하지 않음

예상 반환 형식:

```js
{
  ok: true,
  action: "edit-file",
  message: "README.md의 Working Directory 내용을 수정했습니다.",
  changed: ["workingDirectory"],
  unchanged: ["index", "objectDatabase", "branch", "head"],
  details: {
    filePath: "README.md"
  }
}
```

### 7.4 금지 사항

- Git 명령어별 동작 구현
- DOM 조작
- 시나리오 진행 처리
- 사용자 메시지 렌더링
- `git status` 계산

---

## 8. `commands.js`

### 8.1 책임

지원 명령어의 실행 조건을 검사하고, 전달받은 repository 상태를 변경한 뒤 실행 결과를 반환한다.

지원 함수:

```js
executeInit(repository)
executeStatus(repository)
executeAdd(repository, filePath)
executeCommit(repository, message)
executeBranch(repository, branchName)
executeSwitch(repository, branchName)
```

### 8.2 공통 반환 형식

모든 명령 함수는 일관된 실행 결과를 반환한다.

예시:

```js
{
  ok: true,
  command: "git add README.md",
  message: "README.md를 Index에 추가했습니다.",

  changed: ["index", "objectDatabase"],
  unchanged: ["workingDirectory", "branch", "head"],

  createdObjects: ["blob-a13f"],
  reusedObjects: [],

  details: {
    filePath: "README.md",
    blobId: "blob-a13f"
  }
}
```

오류 예시:

```js
{
  ok: false,
  command: "git switch main",
  message: "commit되지 않은 변경사항이 있어 branch를 전환할 수 없습니다.",

  changed: [],
  unchanged: [
    "workingDirectory",
    "index",
    "objectDatabase",
    "branch",
    "head"
  ],

  errorCode: "DIRTY_WORKTREE"
}
```

### 8.3 오류 원칙

오류가 발생하면 repository를 전혀 변경하지 않는다.

필요한 경우 다음 순서를 사용한다.

```text
입력 검증
→ 실행 조건 검증
→ 모든 검증 통과
→ 상태 변경
```

상태를 일부 변경한 후 오류를 반환하는 구현은 금지한다.

### 8.4 `executeStatus()`

`executeStatus()`는 repository를 변경하지 않는다.

`selectors.js`의 결과를 조합해 사용자에게 보여줄 실행 결과만 반환한다.

---

## 9. 명령어별 구현 규칙

### 9.1 `git init`

- 초기화 전 repository에 `.git` 역할의 구조를 활성화한다.
- `head`를 `"main"`으로 설정한다.
- `refs.heads.main`은 첫 commit 전까지 `null`이다.
- Working Directory 파일은 그대로 유지한다.
- blob, tree, commit 객체를 만들지 않는다.
- 이미 초기화된 경우 상태를 바꾸지 않고 안내 결과를 반환한다.

### 9.2 `git add <file>`

- 저장소 초기화 여부를 먼저 검사한다.
- Working Directory에 파일이 존재하는지 검사한다.
- 현재 파일 내용에 대응하는 blob ID를 계산한다.
- 같은 내용의 blob이 있으면 재사용한다.
- 없으면 새 blob을 저장한다.
- Index에 파일 경로와 blob ID를 기록한다.
- tree와 commit은 만들지 않는다.
- branch와 HEAD는 변경하지 않는다.

### 9.3 `git commit -m "<message>"`

- 저장소 초기화 여부를 검사한다.
- 메시지가 비어 있는지 검사한다.
- Index와 HEAD commit의 tree 사이에 차이가 있는지 검사한다.
- Index를 기준으로 tree 객체를 구성한다.
- 첫 commit이면 parent는 `null`이다.
- 이후 commit이면 현재 HEAD commit을 parent로 기록한다.
- 현재 branch가 새 commit을 가리키도록 변경한다.
- HEAD는 현재 branch 이름을 계속 유지한다.
- Working Directory는 변경하지 않는다.
- Index는 commit된 상태를 그대로 유지한다.

### 9.4 `git branch <name>`

- 첫 commit 이전에는 생성하지 않는다.
- 현재 commit을 가리키는 새 branch 참조를 만든다.
- 중복 이름을 허용하지 않는다.
- 허용 문자만 검사한다.
- HEAD는 변경하지 않는다.
- Working Directory와 Index는 변경하지 않는다.
- 객체를 만들지 않는다.

### 9.5 `git switch <name>`

- 대상 branch 존재 여부를 검사한다.
- 현재 branch와 같은지 검사한다.
- Working Directory와 Index가 clean 상태인지 검사한다.
- HEAD를 대상 branch 이름으로 변경한다.
- 대상 commit의 tree를 기준으로 Working Directory와 Index를 복원한다.
- branch가 가리키는 commit은 변경하지 않는다.
- Object Database는 변경하지 않는다.

---

## 10. 객체 ID 규칙

### 10.1 목적

실제 Git 해시 전체를 재현하지 않되, 같은 내용이 같은 객체로 재사용되는 특성은 유지한다.

### 10.2 필수 조건

- 동일한 정규화 입력은 동일한 객체 ID를 가진다.
- 입력 내용이 다르면 다른 객체 ID를 가진다.
- 객체 종류가 다르면 ID 접두어가 다르다.
- 하나의 실행 중 ID가 바뀌지 않는다.

객체별 ID 생성 기준은 다음과 같이 고정한다.

```text
blob ID
- 파일 내용 기준

tree ID
- tree 항목의 경로, 객체 종류, 객체 ID 기준
- 모든 항목을 경로순으로 정렬한 뒤 ID를 생성

commit ID
- root tree ID
- parent commit ID 또는 null
- commit 메시지
```

같은 tree 상태가 항상 같은 ID를 얻도록 tree 항목 정렬 순서를 반드시 고정한다.

작성자와 시간은 MVP에서 단순화하므로 commit ID 입력에 포함하지 않는다. 이후 포함하기로 변경할 경우 문서와 구현을 함께 수정해야 한다.

예시:

```text
blob-a13f
tree-b204
commit-c801
```

### 10.3 권장 방법

`hash.js` 파일을 별도로 만들지 않고 초기 MVP에서는 `repository.js` 또는 `commands.js` 내부의 작은 보조 함수로 시작할 수 있다.

파일이 커지거나 해시 책임이 명확해지면 이후 분리한다.

교육용 ID임을 화면에 표시한다.

---

## 11. `selectors.js`

### 11.1 책임

repository 원본 상태를 변경하지 않고, UI와 명령 결과에 필요한 해석 값을 반환한다.

### 11.2 권장 함수

```js
getCurrentBranch(repository)
getCurrentCommitId(repository)
getCurrentCommit(repository)
getHeadSnapshot(repository)

getAllFilePaths(repository)
getFileStatus(repository, filePath)
getRepositoryStatus(repository)

isClean(repository)

getStagedFiles(repository)
getUnstagedFiles(repository)
getUntrackedFiles(repository)

getObjectList(repository)
getObjectGraphData(repository)
getBranchGraphData(repository)
```

### 11.3 파일 상태 계산

각 파일마다 다음 두 비교를 별도로 수행한다.

```text
Working Directory ↔ Index
Index ↔ HEAD commit의 tree
```

예상 결과:

```js
{
  path: "README.md",
  untracked: false,
  staged: true,
  unstaged: true,
  clean: false
}
```

### 11.4 순수 함수 원칙

`selectors.js`의 함수는 다음을 수행하면 안 된다.

- repository 수정
- store 수정
- DOM 수정
- 메시지 출력
- 시나리오 단계 이동

---

## 12. UI 이벤트 처리

### 12.1 이벤트 처리 위치

사용자 입력 이벤트는 각 UI 파일에서 연결한다.

예:

- 명령 실행: `commandConsole.js`
- 파일 편집: `repositoryPanels.js`
- 예측 제출: `explanationPanel.js`
- 객체 선택: `objectGraph.js`

### 12.2 상태 변경 책임

UI 이벤트 핸들러가 직접 변경할 수 있는 앱 상태:

- `store.selectedCommand`
- `store.pendingPrediction`
- `store.lastPrediction`
- `store.lastResult`
- `store.message`
- `store.currentScenarioId`
- `store.currentStepId`

Git 명령 함수와 `repository.js`의 전용 편집 함수만 변경해야 하는 상태:

- `store.repository` 내부의 Git 상태

파일 편집은 `updateWorkingFile()`을 통해서만 수행한다. UI가 `store.repository.workingDirectory`를 직접 수정해서는 안 된다.

---

## 13. `render.js`

### 13.1 책임

전체 UI 렌더링 순서를 관리하는 단일 진입점이다.

```js
export function renderApp(store) {
  renderScenarioProgress(store);
  renderCommandConsole(store);
  renderRepositoryPanels(store);
  renderObjectGraph(store);
  renderBranchGraph(store);
  renderExplanationPanel(store);
}
```

`renderScenarioProgress()`는 별도 파일을 추가하지 않고 `render.js` 내부의 보조 함수로 관리한다.

### 13.2 전체 렌더링 원칙

MVP에서는 상태 변경 후 전체 화면을 다시 렌더링한다.

```text
상태 변경
→ renderApp(store)
```

부분 렌더링, Event Bus, Observer 구조는 사용하지 않는다.

### 13.3 변경 강조

전체 렌더링 후에도 `store.lastResult.changed`와 `store.highlightedItems`를 이용해 변경된 패널과 항목에 강조 클래스를 적용한다.

전체 렌더링과 변경 강조는 동시에 사용할 수 있다.

---

## 14. UI 파일별 책임

### 14.1 `commandConsole.js`

- 명령 입력창 렌더링
- 실행 버튼 렌더링
- 추천 명령어 렌더링
- 명령 기록 렌더링
- 입력 이벤트 처리
- 명령 파싱 요청
- 예측 단계가 필요한 명령인지 판단하여 실행 보류

### 14.2 `repositoryPanels.js`

내부 렌더 함수를 분리한다.

```js
renderWorkingDirectory()
renderIndex()
renderHeadCommit()
renderGitDirectory()
```

담당 기능:

- Working Directory 표시
- 파일 내용 편집
- Index 표시
- HEAD commit 스냅샷 표시
- `.git` 구조 표시
- 상태 배지 표시

### 14.3 `objectGraph.js`

파일은 하나로 유지하되 내부 함수를 분리한다.

```js
renderObjectDatabase()
renderObjectDetails()
renderObjectGraph()
```

담당 기능:

- 객체 목록
- 객체 상세 정보
- blob, tree, commit 연결 관계
- 새 객체 및 재사용 객체 강조

### 14.4 `branchGraph.js`

- HEAD → branch → commit 관계 표시
- branch별 commit 위치 표시
- 부모 commit 관계 표시
- 현재 branch 강조
- branch 전환과 commit 생성 결과 강조

### 14.5 `explanationPanel.js`

- 실행 전 예측 UI
- 예측 결과 비교
- 변경된 요소와 유지된 요소
- 실행 이유 설명
- 오류 원인과 해결 방법
- 다음 단계 안내

Prediction Panel은 초기 MVP에서 별도 파일로 만들지 않는다.

---

## 15. 명령어 입력 파싱

### 15.1 지원 문법

```text
git init
git status
git add README.md
git commit -m "message"
git branch experiment
git switch experiment
```

### 15.2 파싱 원칙

실제 shell parser를 구현하지 않는다.

지원 문법을 명확한 정규식 또는 단순 토큰 분석으로만 처리한다.

### 15.3 반환 형식

```js
{
  valid: true,
  command: "add",
  args: {
    filePath: "README.md"
  }
}
```

오류 예시:

```js
{
  valid: false,
  message: "지원하지 않는 명령어 형식입니다."
}
```

---

## 16. 학습 시나리오 구현

### 16.1 `scenarios.js`

시나리오와 단계 정의는 코드 흐름과 분리한다.

예시 구조:

```js
export const scenarios = [
  {
    id: "first-commit",
    title: "첫 commit 만들기",
    steps: [
      {
        id: "init-repository",
        instruction: "git init을 실행하세요.",
        expectedAction: {
          type: "command",
          command: "init"
        }
      }
    ]
  }
];
```

### 16.2 시나리오 파일의 역할

- 단계 제목
- 사용자 안내
- 기대 명령 또는 행동
- 단계 완료 조건
- 관련 학습 목표
- 다음 단계 ID

### 16.3 금지 사항

`scenarios.js`에서 직접 다음을 수행하지 않는다.

- repository 수정
- DOM 조작
- 명령 함수 실행
- 상태 비교 로직 중복 구현


### 16.4 시나리오 진행 판정 책임

현재 행동이 단계 완료 조건을 만족하는지 검사하고 다음 단계로 이동시키는 책임은 `main.js`가 가진다.

공통 흐름:

```text
명령 실행 또는 파일 편집 완료
→ 실행 결과를 store에 기록
→ 현재 단계 완료 조건 검사
→ 조건 충족 시 currentStepId 갱신
→ 필요 시 다음 scenario로 이동
→ renderApp(store)
```

권장 함수 형태:

```js
handleActionResult(result)
evaluateCurrentStep(store)
advanceScenarioStep(store)
```

역할 기준:

```text
scenarios.js
- 단계 정의
- 기대 행동과 완료 조건 데이터

main.js
- 실제 행동 결과와 완료 조건 비교
- currentStepId와 currentScenarioId 갱신

ui/
- 현재 진행 상태 출력
```

오류 결과는 단계 완료로 인정하지 않는다. 사용자가 현재 단계와 무관한 유효한 명령을 실행한 경우에도 저장소 상태는 반영할 수 있지만, 단계 완료 조건을 만족하지 않으면 진행 단계는 유지한다.

---

## 17. 시나리오 3 고정 흐름

시나리오 3에서는 수정 파일을 `README.md`로 고정한다.

```text
git branch experiment
→ git switch experiment
→ README.md 수정
→ git add README.md
→ git commit -m "experiment update"
```

`app.js`를 선택지로 제공하지 않는다.

이유:

- 기존 시나리오에서 이미 존재하는 파일을 재사용할 수 있다.
- 별도 파일 생성 단계를 추가하지 않아도 된다.
- branch 간 스냅샷 차이를 단순하게 비교할 수 있다.
- 구현자 해석 차이를 줄일 수 있다.

---

## 18. 콘텐츠 파일

### 18.1 `concepts.js`

다음 개념 설명을 관리한다.

- Working Directory
- Index
- Object Database
- blob
- tree
- commit
- refs
- branch
- HEAD

### 18.2 `commandDescriptions.js`

명령어별 다음 내용을 관리한다.

- 명령 목적
- 변경되는 구성 요소
- 유지되는 구성 요소
- 객체 생성 또는 재사용
- 교육용 단순화 안내

### 18.3 원칙

교육 문장을 UI 파일이나 명령 함수에 길게 작성하지 않는다.

UI는 콘텐츠를 가져와 표시한다.

---

## 19. CSS 구현 원칙

### 19.1 파일 책임

```text
reset.css
- 브라우저 기본 스타일 초기화

style.css
- 공통 색상, 타이포그래피, 버튼, 배지, 공통 레이아웃

simulator.css
- 저장소 패널, 객체 그래프, branch 그래프, 예측 패널
```

### 19.2 상태 표현

색상만으로 상태를 구분하지 않는다.

예:

```text
Untracked
Modified
Staged
Committed
New
Reused
Changed
Error
```

상태 텍스트, 아이콘, 테두리 또는 배지를 함께 사용한다.

### 19.3 레이아웃

Repository State의 세 패널은 다음 기준을 따른다.

```text
공간 충분:
Working Directory / Index / HEAD Commit 3열

공간 부족:
세 패널 세로 배치
```

화면 전체를 반드시 좌우 2열로 고정하지 않는다.

핵심은 세 상태를 같은 시야에서 비교할 수 있는 것이다.

---

## 20. 오류 처리

### 20.1 필수 오류

- 초기화 전 명령 실행
- 존재하지 않는 파일 add
- 변경사항 없는 commit
- 빈 commit 메시지
- 첫 commit 전 branch 생성
- 중복 branch 이름
- 잘못된 branch 이름
- 존재하지 않는 branch로 switch
- 현재 branch로 switch
- dirty 상태에서 switch
- 지원하지 않는 명령어

### 20.2 오류 결과

오류 발생 시 다음을 보장한다.

- repository 변경 없음
- 현재 시나리오 단계 유지
- 예측 결과를 성공 결과처럼 처리하지 않음
- 오류 원인 표시
- 해결 방법 표시
- 상태가 유지되었음을 표시

---

## 21. 구현 순서

### 1단계: 정적 화면

- `index.html`
- 전체 레이아웃
- 주요 패널 placeholder
- CSS 기본 구조

### 2단계: 상태 기반 렌더링

- `store.js`
- `repository.js`
- `render.js`
- Working Directory, Index, HEAD Commit 렌더링

### 3단계: 기본 명령어

- `git init`
- `git status`
- `git add`
- `git commit`

### 4단계: 상태 해석

- `selectors.js`
- untracked 계산
- staged 계산
- unstaged 계산
- clean 계산

### 5단계: 객체 표시

- Object Database 목록
- blob, tree, commit 상세
- 객체 연결 그래프

### 6단계: branch 기능

- `git branch`
- `git switch`
- HEAD와 branch 그래프

### 7단계: 시나리오 연결

- 네 시나리오 정의
- 단계 완료 판정
- README.md 기반 연속 상태

### 8단계: 예측 기능

- 명령 실행 전 예측
- 실제 결과 비교
- 변경과 유지 설명

### 9단계: 오류와 검수

- 필수 오류 처리
- 오류 시 상태 불변 검증
- 실제 Git과 교육용 단순화 문구 검수

---

## 22. 구현 검증 시나리오

### 22.1 첫 commit

```text
git init
→ git status
→ git add README.md
→ git commit -m "first commit"
```

검증 항목:

- init 후 객체 없음
- add 후 blob 존재
- commit 후 tree와 commit 존재
- HEAD → main → 첫 commit

### 22.2 stage 이후 재수정

```text
README.md를 A로 수정
→ git add README.md
→ README.md를 B로 수정
→ git status
→ git commit -m "update README"
```

검증 항목:

- staged와 unstaged 동시 true
- commit에는 A 포함
- Working Directory에는 B 유지
- commit 후 modified but not staged

### 22.3 branch 생성과 전환

```text
clean 상태 만들기
→ git branch experiment
→ git switch experiment
→ README.md 수정
→ git add README.md
→ git commit -m "experiment update"
```

검증 항목:

- branch 생성만으로 HEAD 유지
- switch 후 HEAD 변경
- 새 commit 후 experiment만 이동
- main은 기존 commit 유지

### 22.4 main 복귀

```text
git switch main
```

검증 항목:

- HEAD가 main을 가리킴
- Working Directory와 Index가 main commit 상태로 변경
- experiment commit 유지
- Object Database 객체 유지

---

## 23. 완료 기준

다음 조건을 모두 만족해야 구현 완료로 판단한다.

1. 지원 명령어 여섯 개가 확정 범위 안에서 동작한다.
2. 명령 함수가 DOM을 직접 조작하지 않는다.
3. UI가 repository 내부 상태를 직접 수정하지 않는다.
4. `selectors.js`가 staged와 unstaged를 별도로 계산한다.
5. 오류 발생 시 repository가 변경되지 않는다.
6. 상태 변경 후 `renderApp(store)`가 호출된다.
7. Working Directory, Index, HEAD Commit을 비교할 수 있다.
8. blob, tree, commit의 생성 시점이 구분된다.
9. branch 생성과 branch 전환이 구분된다.
10. HEAD, branch, commit의 관계가 시각화된다.
11. 명령 실행 전 예측과 실행 후 비교가 동작한다.
12. 네 시나리오가 하나의 저장소 상태로 이어진다.
13. 시나리오 3은 README.md를 사용한다.
14. 실제 Git과 교육용 단순화가 화면에서 구분된다.
15. 지원하지 않는 기능이 암묵적으로 구현 범위에 추가되지 않는다.

---

## 24. 기능 분리 판단 기준

초기에는 현재 공식 구조를 유지한다.

다음 조건이 실제로 발생할 때만 파일 분리를 검토한다.

- `commands.js`가 너무 커져 명령별 상태 변화를 파악하기 어려움
- `repository.js`에서 객체 생성 책임이 지나치게 커짐
- `objectGraph.js`에서 목록, 상세, 그래프를 관리하기 어려움
- `explanationPanel.js`에서 예측과 설명 책임이 충돌함
- 공통 DOM 코드가 반복됨

파일 개수가 많아 보인다는 이유만으로 선제적으로 분리하지 않는다.

---

## 25. 구현자 최종 원칙

```text
상태는 한곳에서 관리한다.
명령은 Git 상태만 변경한다.
selector는 상태를 읽고 해석만 한다.
UI는 현재 상태를 출력한다.
명령 실행 후 전체 화면을 다시 그린다.
오류가 발생하면 아무 상태도 변경하지 않는다.
교육적 단순화는 실제 Git과 구분해서 표시한다.
```
