# MVP Scope

## 1. 문서 목적

이 문서는 Git Inside의 첫 번째 구현 버전에서 지원할 기능, 단순화할 동작, 제외할 범위를 정의한다.

MVP의 목적은 실제 Git 전체를 재현하는 것이 아니다. 기본 Git 명령어를 실행했을 때 Working Directory, Index, Object Database, branch, HEAD가 어떻게 변화하는지 학습자가 관찰하고 예측할 수 있도록 하는 것이 목적이다.

---

## 2. MVP 핵심 기능

사용자는 다음 작업을 수행할 수 있어야 한다.

1. Git 저장소를 초기화한다.
2. 제공된 텍스트 파일의 내용을 수정한다.
3. 파일을 Index에 추가한다.
4. 현재 파일 상태를 확인한다.
5. Index를 기준으로 commit을 생성한다.
6. branch를 생성한다.
7. branch를 전환한다.
8. 명령 실행 전후의 상태 변화를 비교한다.
9. 생성된 blob, tree, commit 객체를 확인한다.
10. 명령 실행 전에 변경 결과를 예측한다.

---

## 3. 지원 명령어

MVP에서는 다음 명령어만 지원한다.

```bash
git init
git status
git add <file>
git commit -m "<message>"
git branch <name>
git switch <name>
```

실제 Git의 모든 옵션과 문법은 지원하지 않는다.

명령어는 화면에 제공되는 버튼 또는 제한된 명령어 입력창을 통해 실행한다.

---

## 4. 명령어별 지원 범위

### 4.1 `git init`

#### 지원 동작

`git init`을 실행하면 교육용 Git 저장소를 초기화한다.

초기 상태는 다음과 같다.

```text
Working Directory
- 기존 학습용 파일 유지

Index
- 비어 있음

Object Database
- 비어 있음

HEAD
- main branch를 가리킴

main branch
- 첫 commit 전이므로 가리키는 commit 없음
```

#### 강조할 내용

* `.git` 디렉터리 구조가 생성된다.
* HEAD는 `main` branch를 가리킨다.
* 첫 commit 전에는 `main`이 가리키는 commit이 없다.
* `git init`만으로 blob, tree, commit 객체가 생성되지는 않는다.
* Working Directory의 기존 파일은 변경되지 않는다.

#### 제한

이미 초기화된 저장소에서 다시 실행하면 저장소 상태를 변경하지 않고 안내 메시지만 표시한다.

---

### 4.2 `git status`

#### 지원 동작

다음 상태를 비교하여 결과를 계산한다.

```text
Working Directory ↔ Index
Index ↔ HEAD commit의 tree
```

표시하는 상태는 다음과 같다.

* untracked
* modified but not staged
* staged
* staged와 unstaged가 동시에 존재하는 상태
* clean

#### 상태 기준

* untracked: Working Directory에는 있지만 Index에는 없는 파일
* modified but not staged: Working Directory와 Index의 내용이 다른 파일
* staged: Index와 HEAD commit의 내용이 다른 파일
* clean: 두 비교에서 모두 차이가 없는 상태

#### 제한

다음 상태는 지원하지 않는다.

* ignored
* deleted
* renamed
* conflict
* `.gitignore`

---

### 4.3 `git add <file>`

#### 지원 동작

1. Working Directory에서 대상 파일의 현재 내용을 확인한다.
2. 해당 내용에 대응하는 blob 객체가 있는지 확인한다.
3. blob 객체가 없으면 생성한다.
4. 동일한 blob 객체가 있으면 재사용한다.
5. Index가 파일 경로와 blob 객체를 연결하도록 갱신한다.
6. 변경된 요소와 유지된 요소를 실행 결과로 반환한다.

#### 강조할 내용

* 파일이 다른 폴더로 이동하는 것이 아니다.
* Working Directory의 내용은 변경되지 않는다.
* Index는 갱신된다.
* Object Database에는 blob 객체가 추가될 수 있다.
* tree와 commit 객체는 생성되지 않는다.
* branch와 HEAD는 이동하지 않는다.

#### 제한

* 한 번에 파일 하나만 추가한다.
* `git add .`는 지원하지 않는다.
* 존재하지 않는 파일은 추가할 수 없다.
* 파일 삭제를 stage하는 기능은 지원하지 않는다.
* 옵션 문법은 지원하지 않는다.

---

### 4.4 `git commit -m "<message>"`

#### 실행 조건

다음 조건을 모두 만족해야 한다.

* 저장소가 초기화되어 있어야 한다.
* Index와 HEAD commit 사이에 차이가 있어야 한다.
* commit 메시지가 비어 있지 않아야 한다.

#### 지원 동작

1. Index의 상태를 기준으로 tree 객체를 구성한다.
2. 필요한 tree 객체를 생성하거나 재사용한다.
3. root tree, 부모 commit, commit 메시지를 포함하는 commit 객체를 생성한다.
4. 현재 branch가 새로운 commit을 가리키도록 변경한다.
5. HEAD는 계속 현재 branch를 가리킨다.
6. Working Directory의 내용은 변경하지 않는다.
7. Index는 commit에 포함된 상태를 유지한다.

#### 첫 commit

첫 commit에는 부모 commit이 없다.

```text
commit
├─ root tree
├─ parent 없음
└─ message
```

#### 이후 commit

두 번째 commit부터는 이전 commit을 부모로 가리킨다.

```text
새 commit
├─ root tree
├─ parent → 이전 commit
└─ message
```

#### 강조할 내용

* commit은 Working Directory가 아니라 Index를 기준으로 생성된다.
* stage하지 않은 변경사항은 commit에 포함되지 않는다.
* 새로운 commit이 만들어지면 현재 branch가 이동한다.
* HEAD는 계속 현재 branch를 가리킨다.
* 이전 commit 객체는 삭제되거나 이동하지 않는다.

#### 제한

* 빈 commit은 지원하지 않는다.
* amend는 지원하지 않는다.
* merge commit은 지원하지 않는다.
* 작성자와 시간 정보는 고정값 또는 단순화된 값을 사용한다.
* commit은 최대 하나의 부모만 가진다.

---

### 4.5 `git branch <name>`

#### 실행 조건

* 저장소가 초기화되어 있어야 한다.
* 최소 하나의 commit이 존재해야 한다.
* 같은 이름의 branch가 없어야 한다.
* branch 이름이 허용된 형식이어야 한다.

#### 지원 동작

현재 commit을 가리키는 새로운 branch를 생성한다.

```text
HEAD ───────→ main
main ───────→ commit A
experiment ─→ commit A
```

#### 강조할 내용

* 새로운 파일 복사본을 만들지 않는다.
* 새로운 commit을 만들지 않는다.
* 새로운 작업 디렉터리를 만들지 않는다.
* branch 생성만으로 HEAD는 이동하지 않는다.
* 현재 branch도 변경되지 않는다.

#### 첫 commit 이전 처리

첫 commit 이전에는 branch 생성을 허용하지 않는다.

```text
아직 branch가 가리킬 commit이 없습니다.
먼저 첫 commit을 생성해 주세요.
```

실제 Git의 unborn branch 관련 세부 동작은 MVP에서 다루지 않는다.

#### branch 이름 제한

다음 문자만 허용한다.

* 영문 소문자
* 숫자
* 하이픈

허용 예시:

```text
experiment
feature-1
test
```

---

### 4.6 `git switch <name>`

#### 실행 조건

* 대상 branch가 존재해야 한다.
* 대상 branch가 현재 branch와 달라야 한다.
* Working Directory와 Index가 clean 상태여야 한다.

clean 상태의 기준은 다음과 같다.

```text
Working Directory = Index
Index = HEAD commit
```

#### 지원 동작

1. HEAD가 대상 branch를 가리키도록 변경한다.
2. Working Directory를 대상 branch의 commit 상태로 변경한다.
3. Index를 대상 branch의 commit 상태로 변경한다.
4. branch가 가리키는 commit 자체는 변경하지 않는다.
5. 기존 commit과 객체는 유지한다.

#### 강조할 내용

```text
git branch experiment
→ branch만 생성
→ HEAD는 기존 branch 유지

git switch experiment
→ HEAD가 experiment를 가리킴
→ Working Directory와 Index가 experiment 기준으로 변경
```

#### 제한

* clean 상태에서만 전환할 수 있다.
* `git switch -c`는 지원하지 않는다.
* commit ID로 전환할 수 없다.
* detached HEAD는 지원하지 않는다.
* 변경사항을 유지하면서 전환하는 실제 Git의 복잡한 판단은 구현하지 않는다.

---

## 5. 지원 파일 범위

### 지원 대상

* 일반 텍스트 파일
* Markdown 파일
* JavaScript 파일
* 한 단계 하위 디렉터리의 텍스트 파일

초기 예시는 다음과 같다.

```text
README.md
app.js
docs/guide.md
```

`docs/guide.md`는 하위 tree 객체를 설명하기 위한 학습용 파일이다.

### 지원 동작

* 제공된 파일의 내용 편집
* 수정 내용 저장
* 수정 취소
* `git add`
* commit 포함 여부 확인
* branch 전환에 따른 파일 상태 변경

### 제외 동작

* 새로운 파일 생성
* 파일 삭제
* 파일 이름 변경
* 디렉터리 이름 변경
* 빈 디렉터리 생성
* 바이너리 파일
* 심볼릭 링크
* 파일 권한 변경
* 여러 단계의 깊은 디렉터리

---

## 6. 저장소 상태 범위

교육용 저장소는 최소한 다음 상태를 표현한다.

```text
repository
├─ initialized
├─ workingDirectory
├─ index
├─ objects
│  ├─ blobs
│  ├─ trees
│  └─ commits
├─ refs
│  └─ heads
└─ head
```

### Working Directory

파일 경로와 현재 편집 내용을 저장한다.

### Index

다음 commit에 포함할 파일 경로와 blob 객체의 연결을 저장한다.

### Object Database

생성된 blob, tree, commit 객체를 저장한다.

### refs/heads

branch 이름과 해당 branch가 가리키는 commit을 저장한다.

### HEAD

현재 작업 중인 branch 이름을 가리킨다.

---

## 7. 객체 ID 단순화

실제 Git은 객체 내용에 기반한 해시 값을 사용한다.

MVP에서는 실제 SHA-1 또는 SHA-256 전체 계산 과정을 구현하지 않아도 된다.

화면에는 다음과 같은 교육용 ID를 사용할 수 있다.

```text
blob-a13f
tree-b204
commit-c801
```

다음 원칙은 유지해야 한다.

* 동일한 내용은 동일한 객체 ID를 가진다.
* 내용이 달라지면 다른 객체 ID를 가진다.
* 하나의 실행 과정에서 ID는 일관되게 유지한다.
* blob, tree, commit의 종류를 구분할 수 있어야 한다.

화면에는 다음 안내를 표시한다.

> 객체 ID는 학습을 위해 단순화한 값이며 실제 Git의 전체 해시 값과 다릅니다.

---

## 8. 필수 화면 기능

### 8.1 명령어 콘솔

표시 내용:

* 실행 가능한 명령어
* 명령어 입력 영역
* 최근 실행 명령
* 성공 또는 오류 메시지

### 8.2 저장소 상태 패널

다음 상태를 동시에 비교할 수 있어야 한다.

* Working Directory
* Index
* HEAD commit
* `.git` 내부 구조

### 8.3 Object Database 패널

다음 객체를 구분하여 표시한다.

* blob
* tree
* commit

객체를 선택하면 다음 정보를 확인할 수 있어야 한다.

* 객체 종류
* 객체 ID
* 객체가 저장하는 정보
* 다른 객체와의 연결
* 생성 또는 재사용 여부

### 8.4 branch 및 HEAD 그래프

다음 관계를 시각적으로 표현한다.

```text
HEAD
→ 현재 branch
→ 현재 commit
→ 부모 commit
```

### 8.5 설명 패널

명령 실행 후 다음 내용을 표시한다.

* 변경된 구성 요소
* 유지된 구성 요소
* 생성된 객체
* 재사용된 객체
* 변화가 발생한 이유

### 8.6 실행 전 예측

핵심 명령어 실행 전에 사용자가 변경될 영역을 선택할 수 있어야 한다.

예시:

```text
git add 실행 후 변경될 항목을 선택하세요.

[ ] Working Directory
[ ] Index
[ ] Object Database
[ ] 현재 branch
[ ] HEAD
```

실행 후 사용자의 예측과 실제 결과를 비교한다.

---

## 9. 필수 학습 시나리오

### 시나리오 1. 첫 commit

```text
git init
→ README.md 작성
→ git status
→ git add README.md
→ git commit
```

학습 내용:

* 저장소 초기 상태
* untracked 파일
* blob 생성
* Index 갱신
* 첫 tree와 commit 생성
* main branch의 첫 이동

### 시나리오 2. stage 이후 다시 수정

```text
README.md에 내용 A 작성
→ git add README.md
→ README.md를 내용 B로 수정
→ git status
→ git commit
```

학습 내용:

* Working Directory와 Index의 내용이 다를 수 있음
* staged와 unstaged 변경이 동시에 존재할 수 있음
* commit에는 Index의 내용 A가 포함됨
* commit 이후 Working Directory에는 내용 B가 남음

### 시나리오 3. branch 생성과 전환

```text
git branch experiment
→ git switch experiment
→ 파일 수정
→ git add
→ git commit
```

학습 내용:

* branch 생성과 전환의 차이
* HEAD의 변경
* 현재 branch만 새 commit으로 이동
* main branch는 기존 commit 유지

### 시나리오 4. 기존 branch로 복귀

```text
git switch main
```

학습 내용:

* HEAD가 main을 가리킴
* Working Directory와 Index가 main commit 상태로 변경됨
* experiment branch의 commit은 삭제되지 않음
* branch마다 서로 다른 commit을 가리킬 수 있음

---

## 10. 필수 오류 처리

다음 오류는 반드시 처리한다.

* 초기화 전에 Git 명령어 실행
* 존재하지 않는 파일에 `git add` 실행
* 변경사항 없이 commit 실행
* 빈 commit 메시지
* 첫 commit 이전 branch 생성
* 중복 branch 이름
* 허용되지 않은 branch 이름
* 존재하지 않는 branch로 전환
* 현재 branch로 다시 전환
* clean하지 않은 상태에서 branch 전환
* 지원하지 않는 명령어 입력

오류 발생 시 저장소 상태는 변경하지 않는다.

오류 메시지는 실제 Git 메시지를 그대로 복제하기보다 초보자가 원인을 이해할 수 있는 문장으로 작성한다.

---

## 11. 교육적 단순화

MVP에서는 다음 내용을 단순화한다.

* 실제 Git 명령어 파서 전체를 구현하지 않는다.
* 실제 Index 바이너리 구조를 구현하지 않는다.
* 실제 객체 압축 방식을 구현하지 않는다.
* 실제 SHA 전체 계산을 구현하지 않는다.
* 작성자와 시간 정보를 단순화한다.
* branch 전환은 clean 상태에서만 허용한다.
* commit의 부모는 최대 하나만 지원한다.
* 파일 삭제와 이름 변경은 다루지 않는다.
* 실제 Git의 모든 오류와 예외를 재현하지 않는다.

단순화된 동작은 실제 Git 동작과 구분하여 설명한다.

---

## 12. MVP 제외 범위

다음 기능은 첫 번째 구현에서 제외한다.

* GitHub
* remote
* `clone`
* `push`
* `pull`
* `fetch`
* merge
* merge conflict
* rebase
* cherry-pick
* stash
* tag
* reflog
* detached HEAD
* reset
* restore
* checkout
* 파일 삭제
* 파일 이름 변경
* `.gitignore`
* Git Hooks
* submodule
* packfile
* 객체 압축
* 실제 Index 파일 분석
* 서버
* 데이터베이스
* 사용자 계정
* 네트워크 기능

---

## 13. MVP 완료 조건

다음 조건을 모두 만족하면 MVP를 완료한 것으로 판단한다.

1. 여섯 개 명령어를 제한된 범위에서 실행할 수 있다.
2. 명령 실행 후 저장소 상태가 일관되게 변경된다.
3. Working Directory, Index, Object Database를 동시에 비교할 수 있다.
4. blob, tree, commit의 관계를 확인할 수 있다.
5. branch와 HEAD의 관계를 그래프로 확인할 수 있다.
6. `git add`와 `git commit`의 객체 생성 시점이 구분된다.
7. stage 이후 다시 수정하는 시나리오가 동작한다.
8. branch 생성과 전환의 차이가 표현된다.
9. `git status` 결과가 상태 비교에 따라 계산된다.
10. 사용자가 실행 전에 결과를 예측할 수 있다.
11. 오류 발생 시 저장소 상태가 변경되지 않는다.
12. 실제 Git과 교육용 단순화를 구분한다.

---

## 14. 기능 추가 기준

새 기능은 다음 조건을 모두 만족할 때만 MVP에 추가한다.

1. 필수 학습 목표 달성에 필요한가?
2. 현재 지원 명령어의 이해를 직접 돕는가?
3. Git 전체 재구현으로 범위를 확대하지 않는가?
4. 화면과 상태 구조를 지나치게 복잡하게 만들지 않는가?
5. 기존 시나리오로 설명할 수 없는 필수 개념인가?

조건을 만족하지 않는 기능은 MVP 이후 확장 기능으로 보류한다.
