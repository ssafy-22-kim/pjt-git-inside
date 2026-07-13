# Screen Specification

## 1. 문서 목적

이 문서는 Git Inside의 화면 구성, 패널별 역할, 표시 데이터, 상호작용, 상태 변화 표현 방식을 정의한다.

새로운 기능을 추가하지 않고 다음 문서에서 확정된 기능을 화면에 배치하는 것을 목적으로 한다.

* `project-brief.md`
* `learning-goals.md`
* `mvp-scope.md`
* `user-flow.md`

---

## 2. 화면 구성 원칙

Git Inside는 단일 페이지 기반의 학습 시뮬레이터로 구성한다.

사용자는 화면 이동을 반복하기보다 한 화면에서 다음 정보를 동시에 비교할 수 있어야 한다.

* 현재 학습 단계
* 실행할 Git 명령어
* Working Directory
* Index
* HEAD commit
* Object Database
* branch와 HEAD 관계
* 명령 실행 결과와 설명

핵심 원칙은 다음과 같다.

```text
현재 상태를 한눈에 관찰
→ 변화 예측
→ 명령 실행
→ 변경된 위치 확인
→ 설명 확인
```

---

## 3. 전체 화면 레이아웃

기본 데스크톱 화면은 다음 영역으로 구성한다.

```text
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
├──────────────────────────────────────────────────────────────┤
│ Scenario Progress                                            │
├───────────────────────────────┬──────────────────────────────┤
│ Repository State             │ Git Internal View            │
│                               │                              │
│ Working Directory             │ Object Database              │
│ Index                         │ Object Graph                 │
│ HEAD Commit                   │ Branch / HEAD Graph          │
├───────────────────────────────┴──────────────────────────────┤
│ Command Console                                              │
├──────────────────────────────────────────────────────────────┤
│ Prediction / Result / Explanation Panel                      │
└──────────────────────────────────────────────────────────────┘
```

화면은 크게 다음 여섯 영역으로 나눈다.

1. Header
2. Scenario Progress
3. Repository State
4. Git Internal View
5. Command Console
6. Prediction and Explanation Panel

---

## 4. Header

### 4.1 표시 내용

Header에는 다음 요소를 배치한다.

* 프로젝트 이름: Git Inside
* 짧은 설명
* 학습 초기화 버튼
* 실제 Git과 교육용 단순화 안내 버튼

짧은 설명 예시:

> Git 명령어 실행 전후의 저장소 내부 변화를 관찰해 보세요.

### 4.2 학습 초기화 버튼

초기화 버튼을 누르면 전체 학습 시나리오와 저장소 상태를 처음으로 되돌린다.

초기화 전 확인 메시지를 표시한다.

```text
현재 학습 진행 상황과 저장소 상태가 모두 초기화됩니다.
계속하시겠습니까?
```

초기화는 `git init` 명령과 다르다.

* 학습 초기화: 애플리케이션 전체 진행 상태 초기화
* `git init`: 교육용 Git 저장소 초기화

두 동작을 화면에서 명확히 구분한다.

---

## 5. Scenario Progress

### 5.1 표시 내용

현재 진행 중인 시나리오와 단계를 표시한다.

예:

```text
시나리오 2 / 4
Stage 이후 다시 수정하기

현재 단계
README.md를 다시 수정해 Working Directory와 Index를 다르게 만드세요.
```

### 5.2 진행 단계 표시

시나리오 진행 상태는 다음과 같이 표시한다.

```text
1. 첫 commit              완료
2. Stage 이후 다시 수정   진행 중
3. Branch 생성과 전환     대기
4. 기존 branch로 복귀     대기
```

완료되지 않은 시나리오를 임의로 실행하는 기능은 MVP에서 제공하지 않는다.

### 5.3 단계 완료 조건

현재 단계에서 요구한 행동을 정확히 수행하면 다음 단계로 이동한다.

잘못된 명령을 실행하거나 오류가 발생하면 현재 단계를 유지한다.

---

## 6. Repository State 영역

Repository State 영역은 다음 세 패널로 구성한다.

```text
Working Directory
Index
HEAD Commit
```

세 패널은 가급적 나란히 배치하여 같은 파일의 내용을 비교할 수 있도록 한다.

---

## 7. Working Directory 패널

### 7.1 역할

사용자가 현재 편집하고 있는 파일 상태를 보여준다.

### 7.2 표시 데이터

각 파일에 대해 다음 정보를 표시한다.

* 파일 경로
* 현재 내용 요약
* 추적 여부
* Index와 다른지 여부
* 파일 선택 버튼

예:

```text
README.md

내용:
Git Inside 실습 파일

상태:
modified
```

### 7.3 파일 편집

파일을 선택하면 간단한 텍스트 편집 영역을 제공한다.

지원 동작:

* 파일 내용 수정
* 수정 내용 저장
* 저장 취소

파일 수정은 Working Directory만 변경한다.

다음 요소는 파일 수정만으로 변경되지 않는다.

* Index
* Object Database
* branch
* HEAD

### 7.4 시각적 상태

* untracked 파일: `Untracked` 배지
* Index와 다른 파일: `Modified` 배지
* Index와 같은 파일: `Matched` 또는 별도 배지 없음
* 최근 변경된 파일: 강조 테두리 또는 짧은 강조 효과

---

## 8. Index 패널

### 8.1 역할

다음 commit에 포함될 파일 경로와 blob 객체의 연결을 보여준다.

### 8.2 표시 데이터

각 파일에 대해 다음 정보를 표시한다.

* 파일 경로
* 연결된 blob ID
* Index에 기록된 내용 요약
* HEAD commit과 다른지 여부

예:

```text
README.md
blob-a13f

Index 내용:
Git Inside 소개
```

### 8.3 빈 상태

`git init` 직후 Index가 비어 있다면 다음 안내를 표시한다.

```text
Index가 비어 있습니다.

git add <file>을 실행하면
다음 commit에 포함할 파일 상태가 이곳에 기록됩니다.
```

### 8.4 시각적 상태

* 방금 갱신된 항목: 강조 효과
* HEAD commit과 다른 항목: `Staged` 배지
* HEAD commit과 같은 항목: `Committed` 또는 별도 배지 없음

---

## 9. HEAD Commit 패널

### 9.1 역할

현재 branch가 가리키는 commit의 파일 스냅샷을 보여준다.

### 9.2 표시 데이터

* 현재 commit ID
* commit 메시지
* 부모 commit ID
* root tree ID
* commit에 포함된 파일 경로
* 각 파일이 연결된 blob ID
* 저장된 파일 내용 요약

### 9.3 첫 commit 이전

첫 commit이 없는 경우 다음처럼 표시한다.

```text
현재 commit이 없습니다.

HEAD는 main branch를 가리키고 있지만,
main이 가리키는 commit은 아직 없습니다.
```

### 9.4 비교 표현

Working Directory, Index, HEAD Commit 패널에서 같은 파일은 동일한 행 위치 또는 동일한 순서로 표시하는 것을 우선한다.

예:

```text
Working Directory       Index                  HEAD Commit
README.md: 내용 B       README.md: 내용 A      README.md: 이전 내용
```

이를 통해 staged 변경과 unstaged 변경을 동시에 비교할 수 있어야 한다.

---

## 10. `.git` 구조 표시

Repository State 또는 Git Internal View 내부에 `.git` 디렉터리 구조를 단순화하여 표시한다.

```text
.git/
├─ HEAD
├─ index
├─ objects/
│  ├─ blobs
│  ├─ trees
│  └─ commits
└─ refs/
   └─ heads/
      ├─ main
      └─ experiment
```

### 10.1 표시 규칙

* 실제 파일 시스템 전체를 재현하지 않는다.
* 현재 학습 범위에 필요한 구조만 표시한다.
* 각 항목을 선택하면 역할 설명을 보여줄 수 있다.
* 실제 Git 구조와 교육용 표현이 다를 경우 안내 문구를 표시한다.

---

## 11. Object Database 패널

### 11.1 역할

생성된 blob, tree, commit 객체 목록을 보여준다.

### 11.2 분류

객체는 종류별로 구분한다.

```text
Blob Objects
Tree Objects
Commit Objects
```

### 11.3 객체 카드

각 객체 카드에 다음 정보를 표시한다.

* 객체 종류
* 교육용 객체 ID
* 생성 시점 또는 생성 명령
* 재사용 여부
* 주요 내용 요약

예:

```text
BLOB
blob-a13f

내용:
Git Inside 소개

생성:
git add README.md
```

### 11.4 객체 상세 정보

객체를 선택하면 다음 정보를 표시한다.

#### blob

* 파일 내용
* 객체 ID
* 이 blob을 가리키는 Index 경로
* 이 blob을 가리키는 tree 항목

#### tree

* tree ID
* 포함된 파일 및 디렉터리 이름
* 연결된 blob 또는 하위 tree ID

#### commit

* commit ID
* commit 메시지
* root tree ID
* 부모 commit ID
* 이 commit을 가리키는 branch

### 11.5 객체 재사용 표시

동일한 객체가 재사용된 경우 새 카드를 생성하지 않는다.

실행 결과에는 다음처럼 표시한다.

```text
새 blob 생성 없음
기존 blob-a13f 재사용
```

재사용된 객체 카드는 잠시 강조할 수 있다.

---

## 12. Object Graph

### 12.1 역할

blob, tree, commit 사이의 연결 관계를 시각적으로 보여준다.

### 12.2 기본 표현

```text
commit-c801
    │
    ▼
tree-b204
    │
    ├─ README.md ──→ blob-a13f
    └─ docs ───────→ tree-d310
                         │
                         └─ guide.md ──→ blob-e720
```

### 12.3 상호작용

* 객체 선택 시 연결된 객체 강조
* commit 선택 시 root tree 경로 강조
* tree 선택 시 하위 객체 강조
* blob 선택 시 연결된 파일명 표시

### 12.4 제한

MVP에서는 그래프 노드를 직접 이동하거나 편집하는 기능은 제공하지 않는다.

그래프는 읽기 전용 시각화다.

---

## 13. Branch and HEAD Graph

### 13.1 역할

HEAD, branch, commit 사이의 참조 관계를 보여준다.

### 13.2 기본 표현

첫 commit 이후:

```text
HEAD
  │
  ▼
main
  │
  ▼
commit A
```

branch 생성 이후:

```text
HEAD
  │
  ▼
main ──────────┐
               ▼
            commit A
               ▲
               │
experiment ────┘
```

experiment에서 commit 생성 이후:

```text
main ─────────────→ commit C
                       │
                       ▼
HEAD → experiment ─→ commit D
```

실제 표현에서는 부모 방향을 일관되게 표시한다.

권장 예:

```text
commit D → parent → commit C
```

### 13.3 표시 규칙

* HEAD: 별도 색상 또는 아이콘
* 현재 branch: 강조 테두리
* 현재 commit: 강조 노드
* 다른 branch: 일반 참조 표시
* 부모 commit: 연결선으로 표시
* 새 commit 생성 시 현재 branch 이동을 애니메이션 또는 강조로 표현

### 13.4 branch 전환 표현

`git switch` 실행 후 다음 변화가 보이도록 한다.

* HEAD 연결선이 대상 branch로 이동
* 대상 branch 강조
* Working Directory와 Index 패널 갱신
* branch 자체가 가리키는 commit은 이동하지 않음

---

## 14. Command Console

### 14.1 역할

사용자가 지원 명령어를 실행하는 입력 영역이다.

### 14.2 구성

* 명령어 입력창
* 실행 버튼
* 현재 단계 추천 명령어
* 최근 명령어 기록
* 성공 또는 오류 메시지

### 14.3 지원 입력

```text
git init
git status
git add README.md
git commit -m "first commit"
git branch experiment
git switch experiment
```

### 14.4 입력 제한

* 지원하지 않는 명령은 실행하지 않는다.
* 명령어 문법 오류를 안내한다.
* 자유 입력은 허용하되 MVP 문법만 해석한다.
* 현재 단계의 추천 명령을 버튼으로 입력할 수 있다.

### 14.5 명령어 기록

최근 실행 명령과 결과를 순서대로 표시한다.

예:

```text
$ git init
저장소를 초기화했습니다.

$ git status
README.md는 untracked 상태입니다.
```

전체 터미널을 구현하는 것이 아니라 학습 흐름 확인을 위한 간단한 기록만 제공한다.

---

## 15. Prediction Panel

### 15.1 표시 시점

상태를 변경하는 핵심 명령을 실행하려 할 때 표시한다.

적용 대상:

* `git init`
* `git add`
* `git commit`
* `git branch`
* `git switch`

`git status`는 상태를 변경하지 않으므로 예측 단계를 생략하거나 결과 예측 문제만 선택적으로 제공한다.

### 15.2 예측 항목

```text
[ ] Working Directory
[ ] Index
[ ] Object Database
[ ] 현재 branch
[ ] HEAD
```

필요한 경우 세부 항목을 추가한다.

```text
Object Database
( ) 새 객체 생성
( ) 기존 객체 재사용
( ) 변경 없음
```

### 15.3 예측 제출

사용자는 최소 하나 이상의 선택 또는 `변경 없음`을 선택한 후 제출한다.

예측 제출 후 명령을 실행한다.

### 15.4 결과 비교

명령 실행 후 각 항목을 다음으로 구분한다.

* 정확히 예측함
* 잘못 선택함
* 선택하지 않았지만 실제로 변경됨
* 조건에 따라 달라지는 항목을 적절히 판단함

점수 경쟁보다 이유 설명을 우선한다.

---

## 16. Explanation Panel

### 16.1 역할

현재 명령의 실행 결과와 학습 설명을 제공한다.

### 16.2 기본 구조

```text
실행 명령
git add README.md

변경됨
- Index
- Object Database에 새 blob 생성

유지됨
- Working Directory
- 현재 branch
- HEAD

이유
git add는 현재 파일 내용을 blob 객체로 저장하고,
Index가 해당 blob을 가리키도록 갱신합니다.

다음 단계
git commit을 실행해 Index 상태를 commit으로 만들어 보세요.
```

### 16.3 표시 항목

* 실행 명령
* 실행 성공 또는 실패
* 변경된 구성 요소
* 유지된 구성 요소
* 생성된 객체
* 재사용된 객체
* 참조 이동
* 변화 원인
* 실제 Git과 교육용 단순화 안내
* 다음 행동

---

## 17. 오류 화면 표현

### 17.1 오류 표시 위치

오류는 다음 두 위치에 표시한다.

* Command Console의 실행 결과
* Explanation Panel의 상세 설명

### 17.2 오류 메시지 구성

```text
무엇이 실패했는가
왜 실행할 수 없는가
현재 상태에서 어떻게 해결하는가
저장소 상태가 유지됐는가
```

예:

```text
branch를 전환할 수 없습니다.

이유:
Working Directory와 Index에 commit되지 않은 변경사항이 있습니다.

해결:
변경사항을 git add와 git commit으로 저장한 뒤 다시 시도하세요.

저장소 상태는 변경되지 않았습니다.
```

### 17.3 시각적 표현

* 오류 영역 강조
* 관련 패널 강조
* 성공 상태와 다른 아이콘 사용
* 저장소 상태가 변경되지 않았다는 안내 표시

---

## 18. 변경 상태 시각화

### 18.1 변경된 요소

명령 실행 직후 변경된 패널 또는 항목을 잠시 강조한다.

예:

* 테두리 강조
* 배경 강조
* `Changed` 배지
* 짧은 점멸 효과

### 18.2 유지된 요소

유지된 요소를 숨기지 않는다.

Explanation Panel에서 명시적으로 표시한다.

```text
유지됨
- Working Directory
- HEAD
```

### 18.3 생성된 객체

새 객체는 `New` 배지를 표시한다.

### 18.4 재사용된 객체

재사용된 객체는 `Reused` 배지를 표시한다.

### 18.5 참조 이동

branch 또는 HEAD의 대상이 변경되면 기존 위치와 새 위치를 비교할 수 있도록 한다.

과도한 애니메이션보다 연결 관계의 명확성을 우선한다.

---

## 19. 주요 상태별 화면

### 19.1 저장소 초기화 전

```text
Working Directory
- README.md 존재

Index
- 비활성 또는 없음

Object Database
- 비활성 또는 없음

HEAD / branch
- 없음

안내
git init을 실행하세요.
```

### 19.2 `git init` 이후

```text
Working Directory
- README.md

Index
- 비어 있음

Object Database
- 객체 없음

HEAD
- main을 가리킴

main
- commit 없음
```

### 19.3 `git add` 이후

```text
Working Directory
- README.md 현재 내용

Index
- README.md → blob ID

Object Database
- blob 존재

HEAD commit
- 아직 없음 또는 이전 commit 유지
```

### 19.4 첫 commit 이후

```text
Working Directory = Index = HEAD commit

Object Database
- blob
- tree
- commit

HEAD → main → 현재 commit
```

### 19.5 staged와 unstaged 동시 상태

```text
Working Directory
- 내용 B

Index
- 내용 A

HEAD commit
- 이전 내용

상태
- staged
- modified but not staged
```

### 19.6 branch 분기 이후

```text
main → commit C
experiment → commit D
HEAD → experiment
```

---

## 20. 반응형 배치

### 20.1 데스크톱

두 개의 주요 열을 사용한다.

```text
왼쪽:
Repository State

오른쪽:
Object Database
Object Graph
Branch Graph
```

Command Console과 Explanation Panel은 화면 하단에 넓게 배치한다.

### 20.2 태블릿

Repository State와 Git Internal View를 세로로 배치할 수 있다.

각 패널은 접거나 펼칠 수 있도록 구성할 수 있으나, MVP에서는 단순 세로 배치만으로도 충분하다.

### 20.3 모바일

모바일 전용 최적화는 MVP 완료 조건이 아니다.

다만 화면이 좁을 경우 다음 순서로 세로 배치한다.

```text
Scenario Progress
→ Command Console
→ Prediction Panel
→ Working Directory
→ Index
→ HEAD Commit
→ Object Database
→ Object Graph
→ Branch Graph
→ Explanation Panel
```

가로 스크롤에 의존하지 않는 것을 우선한다.

---

## 21. 접근성 및 가독성

다음 원칙을 적용한다.

* 색상만으로 상태를 구분하지 않는다.
* 상태 배지와 텍스트를 함께 사용한다.
* 버튼과 입력 요소에 명확한 라벨을 제공한다.
* 키보드만으로 주요 기능을 사용할 수 있도록 한다.
* 코드와 명령어에는 고정폭 글꼴을 사용한다.
* 객체 ID와 파일 경로를 명확히 구분한다.
* 애니메이션은 짧고 학습을 방해하지 않도록 한다.

---

## 22. UI 파일 대응

화면 구조는 현재 디렉터리의 UI 파일과 다음처럼 대응한다.

```text
ui/render.js
- 전체 렌더링 순서 관리

ui/commandConsole.js
- 명령어 입력
- 실행 버튼
- 명령 기록

ui/repositoryPanels.js
- Working Directory
- Index
- HEAD Commit
- .git 구조

ui/objectGraph.js
- Object Database
- 객체 상세
- 객체 연결 그래프

ui/branchGraph.js
- HEAD
- branch
- commit 참조 그래프

ui/explanationPanel.js
- 예측 UI
- 실행 결과
- 오류
- 변화 설명
- 다음 단계 안내
```

Prediction Panel은 MVP 규모에서는 별도 파일로 분리하지 않고 `explanationPanel.js`에서 관리한다.

파일이 지나치게 커질 경우 이후 분리를 검토한다.

---

## 23. 화면 구현 우선순위

### 1단계

* 전체 레이아웃
* Scenario Progress
* Command Console
* Working Directory
* Index
* HEAD Commit
* Explanation Panel

### 2단계

* Object Database
* Branch and HEAD Graph
* 상태 배지
* 오류 표시

### 3단계

* Prediction Panel
* 예측 결과 비교
* 객체 상세 보기
* 변경 강조 효과

### 4단계

* Object Graph 연결 표현
* 반응형 배치
* 접근성 개선
* 전체 시나리오 통합 검토

---

## 24. 화면 명세 완료 기준

다음 조건을 만족하면 화면 명세가 완료된 것으로 판단한다.

1. 사용자가 현재 시나리오와 단계를 확인할 수 있다.
2. Working Directory, Index, HEAD Commit을 동시에 비교할 수 있다.
3. 명령어를 입력하고 실행 결과를 확인할 수 있다.
4. 명령 실행 전에 변화 영역을 예측할 수 있다.
5. 변경된 요소와 유지된 요소가 구분된다.
6. blob, tree, commit 객체를 확인할 수 있다.
7. 객체 사이의 연결을 확인할 수 있다.
8. HEAD, branch, commit의 관계를 확인할 수 있다.
9. 오류 발생 이유와 해결 방법을 확인할 수 있다.
10. 실제 Git과 교육용 단순화가 구분된다.
11. 네 개의 학습 시나리오를 화면에서 순서대로 진행할 수 있다.
12. 새로운 기능을 추가하지 않고 기존 MVP 범위를 모두 표현한다.
