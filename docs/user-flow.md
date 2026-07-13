# User Flow

## 1. 문서 목적

이 문서는 Git Inside에서 학습자가 어떤 순서로 행동하고, 명령 실행 전에 무엇을 예측하며, 실행 후 어떤 피드백을 받는지를 정의한다.

사용자 흐름은 단순한 Git 명령어 체험이 아니라 다음 학습 순환을 반복하도록 설계한다.

```text
현재 상태 관찰
→ 다음 명령 확인
→ 변화 예측
→ 명령 실행
→ 실제 변화 확인
→ 예측과 결과 비교
→ 변화 원인 이해
```

새로운 기능을 추가하기보다 `mvp-scope.md`에서 확정한 네 개의 학습 시나리오를 자연스러운 순서로 제공하는 것을 목표로 한다.

---

## 2. 전체 학습 흐름

사용자는 다음 순서로 프로젝트를 체험한다.

```text
프로젝트 소개
→ 저장소 구성 요소 안내
→ 시나리오 1: 첫 commit
→ 시나리오 2: stage 이후 다시 수정
→ 시나리오 3: branch 생성과 전환
→ 시나리오 4: 기존 branch로 복귀
→ 전체 흐름 정리
```

각 시나리오는 이전 시나리오에서 생성된 저장소 상태를 이어서 사용한다.

```text
시나리오 1의 결과
→ 시나리오 2의 시작 상태

시나리오 2의 결과
→ 시나리오 3의 시작 상태

시나리오 3의 결과
→ 시나리오 4의 시작 상태
```

이를 통해 사용자는 명령어를 개별적으로 배우는 것이 아니라 하나의 저장소가 변화하는 과정을 연속적으로 관찰한다.

---

## 3. 기본 화면 진입 흐름

### 3.1 프로젝트 소개 확인

사용자가 처음 페이지에 진입하면 다음 내용을 확인한다.

* 프로젝트 이름
* 프로젝트의 학습 목적
* 대상 학습자
* 지원하는 Git 명령어
* 실제 Git과 교육용 시뮬레이터의 차이
* 학습 시작 버튼

핵심 안내 문장은 다음과 같다.

> Git 명령어를 실행할 때 저장소 내부에서 무엇이 변경되고 무엇이 유지되는지 확인해 보세요.

### 3.2 학습 시작

사용자가 학습 시작 버튼을 누르면 초기 시뮬레이터 화면으로 이동한다.

초기 화면에는 다음 구성 요소가 표시된다.

* 명령어 콘솔
* Working Directory
* Index
* HEAD commit 상태
* `.git` 내부 구조
* Object Database
* branch 및 HEAD 그래프
* 설명 패널
* 현재 시나리오와 진행 단계

초기 저장소 상태는 아직 `git init`을 실행하지 않은 상태다.

---

## 4. 공통 명령 실행 흐름

모든 핵심 명령은 다음 흐름을 따른다.

### 4.1 현재 상태 관찰

사용자는 명령 실행 전에 다음 정보를 확인한다.

* Working Directory의 파일
* Index에 기록된 파일
* 현재 HEAD commit 상태
* 생성된 Git 객체
* 현재 branch
* HEAD가 가리키는 branch
* 현재 `git status` 결과

이번 단계에서 변경될 가능성이 있는 구성 요소는 강조 표시할 수 있다.

단, 실제 정답을 명령 실행 전에 직접 노출하지 않는다.

---

### 4.2 다음 행동 안내

설명 패널에서 현재 단계의 목표를 안내한다.

예:

```text
README.md가 아직 Git의 추적 대상이 아닙니다.
다음으로 git add README.md를 실행해 보세요.
```

사용자는 안내된 명령을 콘솔에 입력하거나 제공된 명령 버튼을 선택한다.

---

### 4.3 실행 결과 예측

상태를 변경하는 핵심 명령을 실행하기 전에 예측 단계를 제공한다.

예측 대상은 다음과 같다.

* Working Directory
* Index
* Object Database
* 현재 branch
* HEAD

예:

```text
git add README.md 실행 후 변경될 항목을 선택하세요.

[ ] Working Directory
[ ] Index
[ ] Object Database
[ ] 현재 branch
[ ] HEAD
```

Object Database처럼 결과가 상황에 따라 달라질 수 있는 항목은 다음처럼 표현한다.

```text
[ ] 새 객체가 추가될 수 있음
[ ] 기존 객체가 재사용될 수 있음
```

사용자가 예측을 제출하면 명령 실행이 가능해진다.

---

### 4.4 명령 실행

명령이 실행되면 다음 순서로 처리한다.

```text
명령어 유효성 검사
→ 실행 조건 검사
→ 저장소 상태 변경
→ 실행 결과 생성
→ 앱 상태 갱신
→ 전체 화면 다시 렌더링
```

오류가 발생하면 저장소 상태를 변경하지 않는다.

---

### 4.5 실제 변화 확인

명령 실행 직후 화면에서 다음 내용을 강조한다.

* 변경된 구성 요소
* 유지된 구성 요소
* 새로 생성된 객체
* 재사용된 객체
* 이동한 branch 참조
* 유지된 HEAD 관계

변경된 영역은 잠시 강조하여 사용자가 변화 위치를 찾을 수 있도록 한다.

---

### 4.6 예측 결과 비교

사용자의 예측과 실제 결과를 비교한다.

예:

```text
예측 결과

정답:
- Index 변경
- 새 blob 생성

사용자 선택:
- Index 변경
- Working Directory 변경

결과:
- Index 예측 성공
- Working Directory는 변경되지 않음
- 새 blob 생성을 놓침
```

단순히 정답과 오답만 보여주지 않고, 각 구성 요소가 변경되거나 유지된 이유를 함께 설명한다.

---

### 4.7 변화 원인 확인

설명 패널에 다음 내용을 표시한다.

```text
변경됨
- Index
- Object Database

유지됨
- Working Directory
- 현재 branch
- HEAD

이유
git add는 현재 파일 내용을 blob 객체로 저장하고,
Index가 해당 blob을 가리키도록 갱신합니다.
아직 commit은 생성되지 않았으므로 branch와 HEAD는 이동하지 않습니다.
```

사용자가 설명을 확인한 뒤 다음 단계로 이동한다.

---

## 5. 시나리오 1: 첫 commit 만들기

### 5.1 시작 상태

```text
저장소 초기화 전
Working Directory에 README.md 존재
Index 없음
Object Database 없음
branch 없음
HEAD 없음
```

README.md는 학습용 기본 내용을 가진 상태로 제공한다.

---

### 5.2 `git status` 실행 시도

사용자가 초기화 전에 `git status`를 실행하면 오류 메시지를 표시한다.

```text
아직 Git 저장소가 아닙니다.
먼저 git init을 실행해 저장소를 초기화하세요.
```

학습 목적:

* Git 명령어가 동작하려면 저장소 초기화가 필요함을 이해한다.
* 오류 발생 시 저장소 상태가 변경되지 않는다는 것을 확인한다.

---

### 5.3 `git init`

사용자는 `git init` 실행 결과를 예측한다.

예측 대상:

* Working Directory
* Index
* Object Database
* branch 구조
* HEAD

실행 후 확인할 내용:

```text
변경됨
- .git 구조 생성
- 비어 있는 Index 생성
- Object Database 공간 생성
- HEAD가 main을 가리킴

유지됨
- README.md의 내용

생성되지 않음
- blob
- tree
- commit
```

학습 목표:

* `git init`이 commit이나 파일 객체를 생성하지 않는다는 점
* 첫 commit 전에는 main이 가리킬 commit이 없다는 점

---

### 5.4 `git status`

사용자는 `git status`를 실행한다.

표시 결과:

```text
README.md
- untracked
```

비교 설명:

```text
Working Directory에는 README.md가 존재함
Index에는 README.md가 존재하지 않음
따라서 untracked 상태
```

학습 목표:

* 상태가 별도 문자열로 저장되는 것이 아니라 비교 결과로 계산된다는 점

---

### 5.5 `git add README.md`

사용자는 실행 전 변경 영역을 예측한다.

실행 후 확인할 내용:

```text
변경됨
- Index
- Object Database에 README.md 내용의 blob 추가

유지됨
- Working Directory
- main
- HEAD

생성되지 않음
- tree
- commit
```

`git status` 결과:

```text
README.md
- staged
```

학습 목표:

* `git add`가 파일을 이동시키지 않는다는 점
* blob 생성과 Index 갱신이 발생한다는 점

---

### 5.6 `git commit -m "first commit"`

사용자는 실행 전 다음을 예측한다.

* tree 객체 생성
* commit 객체 생성
* main branch 이동
* HEAD 관계 유지
* Working Directory 유지
* Index 유지

실행 후 그래프:

```text
HEAD
→ main
→ commit A
→ root tree
→ README.md blob
```

학습 목표:

* commit은 Index를 기준으로 생성됨
* 첫 commit은 부모 commit이 없음
* main branch가 새 commit을 가리킴
* HEAD는 계속 main을 가리킴

---

### 5.7 시나리오 1 완료 피드백

사용자는 다음 내용을 확인한다.

```text
완료한 흐름

Working Directory의 파일
→ git add
→ blob 생성
→ Index 갱신
→ git commit
→ tree와 commit 생성
→ main branch 이동
```

이후 시나리오 2로 이동한다.

---

## 6. 시나리오 2: stage 이후 다시 수정하기

### 6.1 시작 상태

시나리오 1의 첫 commit이 존재한다.

```text
Working Directory = Index = HEAD commit
git status: clean
```

---

### 6.2 README.md를 내용 A로 수정

사용자는 화면의 파일 편집 기능으로 README.md를 수정한다.

변경 결과:

```text
Working Directory ≠ Index
Index = HEAD commit
```

`git status` 결과:

```text
README.md
- modified but not staged
```

---

### 6.3 `git add README.md`

내용 A를 Index에 기록한다.

실행 결과:

```text
Working Directory = Index
Index ≠ HEAD commit
```

`git status` 결과:

```text
README.md
- staged
```

---

### 6.4 README.md를 내용 B로 다시 수정

commit 전에 Working Directory만 다시 변경한다.

현재 비교:

```text
Working Directory의 내용: B
Index의 내용: A
HEAD commit의 내용: 이전 내용
```

`git status` 결과:

```text
README.md
- staged
- modified but not staged
```

학습 목표:

* 하나의 파일이 staged와 unstaged 변경을 동시에 가질 수 있음
* 상태를 단일 문자열 하나로 표현할 수 없음

---

### 6.5 `git commit -m "update README"`

사용자는 commit에 내용 A와 B 중 무엇이 포함될지 예측한다.

선택:

```text
( ) Working Directory의 내용 B
( ) Index의 내용 A
```

실행 결과:

```text
commit에 포함된 내용
- A

Working Directory에 남은 내용
- B
```

commit 이후 상태:

```text
Working Directory ≠ Index
Index = 새 HEAD commit
```

`git status` 결과:

```text
README.md
- modified but not staged
```

학습 목표:

* commit은 Index를 기준으로 생성됨
* stage하지 않은 내용 B는 commit에 포함되지 않음
* commit 이후에도 Working Directory의 변경은 남음

---

### 6.6 clean 상태 만들기

다음 branch 시나리오로 이동하려면 clean 상태가 필요하다.

사용자는 README.md의 현재 내용 B를 `git add`한 뒤 commit한다.

```text
git add README.md
→ git commit -m "finish README update"
```

완료 상태:

```text
Working Directory = Index = HEAD commit
git status: clean
```

이후 시나리오 3으로 이동한다.

---

## 7. 시나리오 3: branch 생성과 전환

### 7.1 `git branch experiment`

사용자는 branch 생성 후 무엇이 변경될지 예측한다.

실행 결과:

```text
변경됨
- experiment branch 생성

유지됨
- main이 가리키는 commit
- HEAD가 가리키는 branch
- Working Directory
- Index
- Object Database
```

그래프:

```text
HEAD
→ main
→ commit C

experiment
→ commit C
```

학습 목표:

* branch 생성은 commit이나 파일 복사를 만들지 않음
* branch 생성만으로 HEAD는 이동하지 않음

---

### 7.2 `git switch experiment`

사용자는 branch 생성과 branch 전환의 차이를 예측한다.

실행 결과:

```text
변경됨
- HEAD가 experiment를 가리킴
- 현재 branch가 experiment로 변경됨

현재 시점에서 유지됨
- Working Directory
- Index

이유
main과 experiment가 아직 같은 commit을 가리키고 있음
```

그래프:

```text
main
→ commit C

HEAD
→ experiment
→ commit C
```

학습 목표:

* HEAD의 대상 branch가 변경됨
* 같은 commit을 가리키는 branch 사이의 전환에서는 파일 내용이 달라지지 않을 수 있음

---

### 7.3 experiment에서 파일 수정

사용자는 experiment branch에서 `README.md`를 수정한다.

```text
README.md 수정
→ git add README.md
→ git commit -m "experiment update"
```

실행 후 그래프:

```text
main
→ commit C

HEAD
→ experiment
→ commit D
→ parent: commit C
```

학습 목표:

* 새로운 commit이 생성되면 현재 branch인 experiment만 이동함
* main은 기존 commit C를 계속 가리킴
* HEAD는 계속 experiment를 가리킴

---

### 7.4 시나리오 3 완료 피드백

다음 차이를 정리한다.

```text
git branch experiment
→ 새 branch 참조 생성

git switch experiment
→ HEAD가 experiment를 가리킴

git commit
→ 현재 branch인 experiment가 새 commit으로 이동
```

이후 시나리오 4로 이동한다.

---

## 8. 시나리오 4: 기존 branch로 돌아가기

### 8.1 전환 전 상태 확인

```text
main
→ commit C

HEAD
→ experiment
→ commit D
```

Working Directory와 Index는 experiment의 commit D 상태와 일치하여 clean 상태다.

---

### 8.2 `git switch main`

사용자는 실행 후 다음 변화를 예측한다.

* HEAD
* Working Directory
* Index
* main branch
* experiment branch
* commit 객체

실행 결과:

```text
변경됨
- HEAD가 main을 가리킴
- Working Directory가 commit C 상태로 변경
- Index가 commit C 상태로 변경

유지됨
- main은 commit C를 가리킴
- experiment는 commit D를 가리킴
- commit C와 commit D
- 기존 Object Database
```

그래프:

```text
HEAD
→ main
→ commit C

experiment
→ commit D
→ parent: commit C
```

학습 목표:

* branch 전환은 branch가 가리키는 commit을 이동시키지 않음
* HEAD와 현재 작업 기준이 변경됨
* 다른 branch의 commit은 삭제되지 않음

---

### 8.3 시나리오 4 완료 피드백

사용자는 다음 내용을 확인한다.

```text
branch는 commit을 가리키는 참조다.
HEAD는 현재 사용할 branch를 가리킨다.
branch를 전환하면 Working Directory와 Index가 대상 commit에 맞춰진다.
기존 branch와 commit 객체는 그대로 유지된다.
```

---

## 9. 오류 발생 흐름

명령의 실행 조건을 만족하지 않으면 다음 흐름을 따른다.

```text
사용자 명령 입력
→ 실행 조건 검사 실패
→ 오류 이유 표시
→ 해결 방법 안내
→ 저장소 상태 유지
→ 현재 단계 유지
```

예:

```text
명령:
git switch main

오류:
아직 commit하지 않은 변경사항이 있어 branch를 전환할 수 없습니다.

해결:
현재 변경사항을 add와 commit하여 clean 상태로 만든 뒤 다시 시도하세요.
```

오류 발생 시 다음 항목은 변경되지 않아야 한다.

* Working Directory
* Index
* Object Database
* branch
* HEAD
* 현재 시나리오 단계

사용자가 오류를 해결한 뒤 같은 단계를 다시 시도할 수 있어야 한다.

---

## 10. 학습 완료 흐름

네 개의 시나리오를 완료하면 전체 저장소 변화 과정을 요약한다.

```text
git init
→ 저장소 구조 생성

git add
→ blob 생성 또는 재사용
→ Index 갱신

git commit
→ tree와 commit 생성
→ 현재 branch 이동

git branch
→ 현재 commit을 가리키는 새 참조 생성

git switch
→ HEAD 변경
→ Working Directory와 Index 변경

git status
→ Working Directory, Index, HEAD commit 비교
```

마지막에는 다음 핵심 관계를 표시한다.

```text
Working Directory
↕ 비교
Index
↕ 비교
HEAD commit의 tree

HEAD
→ 현재 branch
→ 현재 commit
→ root tree
→ blob
```

학습 완료 여부는 다음 질문을 통해 확인한다.

1. `git add` 후 변경되는 구성 요소는 무엇인가?
2. `git commit`은 어느 상태를 기준으로 생성되는가?
3. blob과 tree의 차이는 무엇인가?
4. branch는 무엇을 가리키는가?
5. HEAD는 무엇을 가리키는가?
6. `git branch`와 `git switch`는 어떻게 다른가?
7. staged와 unstaged 변경이 동시에 존재할 수 있는 이유는 무엇인가?

---

## 11. 사용자 흐름 설계 원칙

### 11.1 상태를 먼저 보여준다

명령어 설명부터 제시하기보다 현재 저장소 상태를 먼저 관찰하게 한다.

### 11.2 실행 전에 예측하게 한다

정답을 먼저 알려주지 않고, 사용자가 변경될 요소를 선택하도록 한다.

### 11.3 실행 후 변화 위치를 강조한다

전체 화면을 다시 그리더라도 변경된 구성 요소를 시각적으로 구분한다.

### 11.4 변경과 유지를 함께 설명한다

변경된 요소뿐 아니라 변경되지 않은 요소도 명시한다.

```text
git add 실행 후

변경:
- Index
- Object Database에 blob이 추가될 수 있음

유지:
- Working Directory
- branch
- HEAD
```

### 11.5 오류를 학습 기회로 사용한다

오류 메시지는 실패 사실만 알리지 않고, 현재 상태에서 명령을 실행할 수 없는 이유를 설명한다.

### 11.6 실제 Git과 단순화를 구분한다

clean 상태에서만 `git switch`를 허용하는 등 교육용 제한은 실제 Git의 전체 규칙처럼 표현하지 않는다.

### 11.7 하나의 저장소 상태를 이어서 사용한다

각 시나리오를 별개의 예제로 초기화하지 않고, 앞선 행동의 결과가 다음 시나리오에 영향을 주도록 한다.

---

## 12. 사용자 흐름 완료 기준

다음 조건을 만족하면 사용자 흐름 설계가 완료된 것으로 판단한다.

1. 모든 지원 명령어가 최소 한 번 이상 사용된다.
2. 각 명령의 실행 전 예측과 실행 후 비교가 존재한다.
3. 네 개의 필수 시나리오가 하나의 저장소 상태로 연결된다.
4. `git add`와 `git commit`의 객체 생성 시점이 구분된다.
5. stage 이후 다시 수정하는 상태를 직접 경험한다.
6. branch 생성과 branch 전환을 별개의 단계로 경험한다.
7. branch 전환 전 clean 상태 조건을 확인한다.
8. 오류 발생 시 저장소 상태가 변경되지 않는다.
9. 변경된 요소와 유지된 요소를 모두 설명한다.
10. 마지막에 전체 저장소 관계를 다시 정리한다.
