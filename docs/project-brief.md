# Git Inside

## 1. 프로젝트 개요

Git Inside는 Git 기본 명령어를 학습한 초보자를 대상으로, 명령어를 실행할 때 `.git` 디렉터리와 저장소 내부 상태에서 어떤 변화가 발생하는지를 시각적으로 보여주는 교육용 웹 프로젝트다.

사용자는 `git add`, `git commit`, `git branch`, `git switch` 등의 명령어를 실행하고, 그 결과 Working Directory, Index, Object Database, branch, HEAD가 어떻게 변화하는지 확인할 수 있다.

---

## 2. 프로젝트 배경

기존 Git 입문 교육은 주로 다음과 같은 명령어의 사용 방법에 집중한다.

* `git init`
* `git add`
* `git commit`
* `git branch`
* `git switch`

학습자는 명령어를 따라 실행할 수 있지만, 각 명령이 저장소 내부에서 어떤 작업을 수행하는지는 이해하지 못하는 경우가 많다.

특히 다음 개념은 명령어 사용법만으로 이해하기 어렵다.

* Working Directory와 Index의 차이
* `git add`가 파일을 단순히 이동시키는 명령이 아니라는 점
* blob, tree, commit 객체의 관계
* commit이 Working Directory가 아니라 Index를 기준으로 생성된다는 점
* branch가 commit 목록이 아니라 특정 commit을 가리키는 참조라는 점
* HEAD와 현재 branch의 관계

---

## 3. 해결하려는 문제

Git 초보자는 저장소 내부 상태를 직접 확인하기 어렵기 때문에 Git을 명령어와 절차를 암기해서 사용하는 도구로 받아들이기 쉽다.

그 결과 staged와 unstaged 상태를 혼동하거나, branch와 commit의 관계를 잘못 이해하고, 예상하지 못한 결과가 발생했을 때 원인을 추론하기 어려워진다.

이 프로젝트는 명령어 실행 전후의 내부 상태를 동시에 보여줌으로써 다음 질문에 답할 수 있도록 한다.

> Git 명령어를 실행했을 때 무엇이 변경되고, 무엇이 그대로 유지되는가?

---

## 4. 대상 학습자

* Git 기본 명령어를 한 번 이상 사용해 본 학습자
* `git add`, `git commit`, `git branch`의 기본 사용법은 알지만 내부 원리는 모르는 학습자
* GitHub 사용법보다 Git 자체의 저장 구조와 동작 원리를 이해하고 싶은 초보 개발자

완전한 Git 입문자보다는 기본 명령어 실습을 마친 학습자를 주요 대상으로 한다.

---

## 5. 핵심 경험

사용자는 화면에서 Git 명령어를 실행하고, 저장소 내부 상태가 변화하는 과정을 단계별로 확인한다.

기본 학습 흐름은 다음과 같다.

```text
저장소 초기화
→ 파일 생성 및 수정
→ git add
→ blob 객체 생성과 Index 변화 확인
→ git commit
→ tree와 commit 객체 생성 확인
→ 현재 branch 포인터 이동 확인
→ HEAD와 현재 branch의 관계 확인
```

각 단계에서는 다음 정보를 함께 제공한다.

* 실행한 명령어
* 변경된 영역
* 변경되지 않은 영역
* 생성되거나 재사용된 Git 객체
* 현재 HEAD와 branch의 위치
* 해당 변화가 발생한 이유

사용자는 명령어의 실행 결과만 보는 것이 아니라, 하나의 명령이 저장소의 어느 부분에 영향을 주는지를 비교하며 학습한다.

---

## 6. 기존 Git 교육과의 차이

일반적인 Git 교육은 명령어의 입력 방법과 터미널에 표시되는 결과에 집중한다.

```text
명령어 입력
→ 성공 또는 상태 메시지 확인
```

Git Inside는 명령어 실행 결과뿐 아니라 저장소 내부의 상태 변화를 함께 보여준다.

```text
명령어 입력
→ 저장소 상태 변화
→ Index 변화
→ 객체 생성 또는 재사용
→ branch와 HEAD 관계 변화
→ 변화 원인 설명
```

따라서 이 프로젝트의 목적은 Git 명령어 사용법을 다시 가르치는 것이 아니다.

이미 배운 명령어와 Working Directory, Index, Object Database, refs 사이의 관계를 연결하여 Git이 동작하는 원리를 이해시키는 것이 목적이다.

---

## 7. 핵심 학습 범위

### 명령어

* `git init`
* `git status`
* `git add`
* `git commit`
* `git branch`
* `git switch`

### 저장소 요소

* Working Directory
* Index 또는 Staging Area
* Object Database
* blob
* tree
* commit
* refs
* branch
* HEAD

### 핵심 관계와 비교

* Working Directory와 Index
* Index와 HEAD commit의 tree
* 파일 내용과 blob 객체
* 파일명 및 디렉터리 구조와 tree 객체
* commit 객체와 root tree
* commit 객체와 부모 commit
* branch와 commit
* HEAD와 현재 branch

---

## 8. 초기 제외 범위

초기 MVP에서는 다음 내용을 다루지 않는다.

* GitHub 및 원격 저장소
* `push`, `pull`, `fetch`
* merge와 merge conflict
* rebase
* reflog
* cherry-pick
* stash
* Git Hooks
* packfile
* detached HEAD
* 파일 이름 변경 및 삭제
* 바이너리 파일
* 실제 Git 전체 기능과 예외 상황의 재현

이 프로젝트는 Git을 완전히 구현하는 것이 아니라, 핵심 내부 동작을 교육하기 위한 단순화된 시뮬레이터를 목표로 한다.

실제 Git 동작과 교육을 위해 단순화한 동작은 화면 설명과 기획 문서에서 구분한다.

---

## 9. 구현 환경

프로젝트는 다음 기술로 구현한다.

* HTML
* CSS
* Vanilla JavaScript
* ES Module

다음 기술은 사용하지 않는다.

* React
* Vue
* Angular
* TypeScript
* CSS 프레임워크
* 외부 상태 관리 라이브러리
* 빌드 도구

구현 기술보다 Git 상태 변화와 학습 흐름을 명확히 전달하는 것을 우선한다.

---

## 10. 프로젝트 성공 기준

사용자가 프로젝트를 체험한 뒤 다음 내용을 자신의 말로 설명할 수 있으면 성공으로 판단한다.

1. Working Directory는 사용자가 현재 편집하고 있는 파일 상태다.
2. Index는 다음 commit에 포함할 파일 상태를 기록한다.
3. `git add`는 현재 파일 내용을 blob 객체로 저장하고 Index를 갱신한다.
4. `git commit`은 Working Directory가 아니라 Index를 기준으로 tree와 commit 객체를 만든다.
5. blob 객체는 파일 내용만 저장하며 파일명은 포함하지 않는다.
6. tree 객체는 파일명 또는 디렉터리명과 blob 또는 tree 객체를 연결한다.
7. commit 객체는 하나의 root tree와 이전 commit 등의 정보를 가리킨다.
8. branch는 commit 목록이나 별도 작업 공간이 아니라 특정 commit을 가리키는 참조다.
9. 이 프로젝트에서 HEAD는 현재 작업 중인 branch를 가리킨다.
10. 새로운 commit이 생성되면 HEAD가 가리키는 현재 branch가 새 commit으로 이동한다.
11. `git status`는 Working Directory와 Index, Index와 HEAD commit 사이의 차이를 바탕으로 상태를 보여준다.

---

## 11. 프로젝트 핵심 문장

> Git 명령어를 실행할 때 Working Directory, Index, Object Database, branch와 HEAD 중 무엇이 변경되고 무엇이 유지되는지를 시각적으로 보여주는 초보자용 학습 웹 프로젝트다.
