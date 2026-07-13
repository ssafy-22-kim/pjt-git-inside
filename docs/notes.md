# Notes

## 1. 문서 목적

이 문서는 Git Inside 기획 과정에서 확정된 주요 결정과 변경 이력을 간단히 기록한다.

최종 기능과 구현 규칙은 각 공식 문서를 기준으로 하며, 이 문서는 검토 배경과 결정 사항을 추적하기 위한 보조 기록으로 사용한다.

---

## 2. 확정된 핵심 결정

### 프로젝트 범위

- Git 기본 명령어를 사용해 본 초보자를 대상으로 한다.
- Working Directory, Index, Object Database, branch, HEAD의 관계를 시각적으로 설명한다.
- 지원 명령어는 `git init`, `git status`, `git add`, `git commit`, `git branch`, `git switch`로 제한한다.
- remote, merge, rebase, reflog, packfile 등은 MVP에서 제외한다.
- 실제 Git 전체를 재현하지 않고 핵심 내부 동작을 교육용으로 단순화한다.

### 학습 흐름

- 하나의 저장소 상태를 네 개의 시나리오에서 연속적으로 사용한다.
- 학습 순환은 `상태 관찰 → 변화 예측 → 명령 실행 → 결과 비교 → 원인 설명`으로 고정한다.
- stage 이후 파일을 다시 수정하는 상태를 필수 시나리오에 포함한다.
- branch 생성과 branch 전환을 서로 다른 단계로 다룬다.
- 시나리오 3에서 수정할 파일은 `README.md`로 고정한다.

### 구현 구조

- Vanilla HTML, CSS, JavaScript와 ES Module만 사용한다.
- `core/`는 앱 전체 상태와 공통 상수를 담당한다.
- `git/`은 교육용 Git 저장소 구조, 명령 동작, 상태 해석을 담당한다.
- `ui/`는 사용자 입력과 DOM 렌더링을 담당한다.
- `content/`는 개념 설명과 학습 시나리오를 담당한다.
- `utils/`는 최소한의 공통 DOM 보조 기능만 담당한다.

### 상태 관리

- `store.js`는 repository를 포함한 앱 전체 상태를 보관한다.
- `repository.js`는 교육용 Git 저장소의 기본 구조를 생성하고 초기화한다.
- 파일 상태값은 repository에 중복 저장하지 않는다.
- untracked, staged, unstaged, clean 상태는 `selectors.js`에서 계산한다.
- 하나의 파일이 staged와 unstaged 상태를 동시에 가질 수 있도록 표현한다.

### 명령과 렌더링

- 명령어별 파일 분리는 보류하고 `commands.js`에 통합한다.
- `commands.js`는 Git 저장소 상태만 변경하고 DOM을 조작하지 않는다.
- `selectors.js`는 상태를 변경하지 않는 순수한 해석 함수로 구성한다.
- Event Bus는 사용하지 않는다.
- 상태 변경 후 `renderApp(store)`를 호출해 전체 화면을 다시 렌더링한다.
- 명령 실행 결과에 변경·유지·객체 생성·객체 재사용 정보를 포함한다.
- 오류 발생 시 repository와 현재 시나리오 단계는 변경하지 않는다.

### 화면 구성

- Working Directory, Index, HEAD Commit을 같은 시야에서 비교할 수 있도록 한다.
- Object Database와 객체 연결 그래프를 함께 제공한다.
- HEAD → branch → commit 관계를 별도 그래프로 표시한다.
- 변경된 요소뿐 아니라 유지된 요소도 실행 결과에 표시한다.
- 색상만으로 상태를 구분하지 않고 배지와 텍스트를 함께 사용한다.

---

## 3. 디렉터리 구조 변경 이력

### 초기안

- 명령어를 `git/commands/` 아래 개별 파일로 분리했다.
- `eventBus.js`, `objects.js`, `index.js`, `refs.js`, `hash.js`, `formatter.js` 등을 미리 포함했다.
- `feedback/`, `prompts/` 아래에 특정 AI 모델별 하위 디렉터리를 두었다.

### 변경 후

- 여섯 개 명령어를 `git/commands.js`로 통합했다.
- 저장소 원본 상태는 `repository.js`, 상태 해석은 `selectors.js`로 구분했다.
- Event Bus를 제거하고 전체 렌더링 방식을 채택했다.
- 비슷한 저장소 UI를 `repositoryPanels.js`로 통합했다.
- 실제 필요성이 확인되지 않은 보조 파일은 생성하지 않기로 했다.
- 특정 AI 모델명이 포함된 디렉터리를 제거했다.
- 검토 기록은 `docs/notes.md`, 구현 전달 내용은 `docs/implementation-guide.md`에서 통합 관리한다.

---

## 4. 현재 생성하지 않는 파일

다음 파일은 실제 필요성이 확인될 때만 추가한다.

```text
eventBus.js
hash.js
formatter.js
objects.js
refs.js
stagingIndex.js
```

파일이 커 보인다는 이유만으로 선제적으로 분리하지 않는다.

---

## 5. 교육용 단순화

- 기본 branch 이름은 `main`으로 고정한다.
- 첫 commit 전 branch 추가 생성을 허용하지 않는다.
- branch 전환은 clean 상태에서만 허용한다.
- 한 번에 파일 하나만 `git add`할 수 있다.
- 파일 삭제와 이름 변경은 지원하지 않는다.
- 한 단계 하위 디렉터리까지만 지원한다.
- commit은 최대 하나의 부모만 가진다.
- 객체 ID는 실제 전체 해시 대신 일관된 교육용 ID를 사용한다.
- 실제 Git과 다른 단순화는 화면에서 명시한다.

---

## 6. 문서 진행 상태

```text
project-brief.md           확정
learning-goals.md          확정
mvp-scope.md               확정
user-flow.md               확정
screen-spec.md             확정
implementation-guide.md    확정
notes.md                   작성 완료
```

---

## 7. 이후 변경 기록 원칙

새로운 결정이나 변경이 발생하면 다음 항목만 간단히 추가한다.

```text
날짜
검토 대상
기존 결정
변경 결정
변경 이유
영향받는 문서 또는 파일
```

기능 상세와 구현 규칙은 이 문서에 중복해서 작성하지 않고 해당 공식 문서를 수정한다.
