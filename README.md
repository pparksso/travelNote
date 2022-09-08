# travel diary Project

<center>[![Video Label](http://img.youtube.com/vi/yGO6OGt2Zyo/0.jpg)](https://youtu.be/yGO6OGt2Zyo)</center>

---

### 목적

- 즐거웠던 여행의 순간을 기록하기 위한 웹페이지로 반응형으로 제작되었습니다.

### 사용 언어

- javascript

### 서버

- nodejs

### 데이터베이스

- mongodb(mongoose), cloudinary

### 개발 인원

- 1인

### 개발 기간

- 14일

### 라우터 구조

| 메소드 | 주소                | 라우터     |              역할               |
| ------ | :------------------ | :--------- | :-----------------------------: |
| GET    | /                   | index.js   |            main page            |
| GET    | /500                | ''         |       서버에러 page 제공        |
| GET    | /?page              | ''         |             페이징              |
| POST   | /user/join          | user.js    |       db에 유저 정보 등록       |
| POST   | /user/login         | ''         |       Db에 유저 정보 확인       |
| POST   | /user/idcheck       | ''         |             Id 조회             |
| POST   | /user/nicknamecheck | ''         |           닉네임 조회           |
| POST   | /user/logout        | ''         |          Session 삭제           |
| GET    | /user/mytour        | ''         |           Mytour page           |
| GET    | /user/mypage        | ''         |        MyPage 파일 제공         |
| PUT    | /user/mypageupdate  | ''         |          내 정보 수정           |
| GET    | /user/signout       | ''         |            회원 탈퇴            |
| POST   | /create/sendimg     | create.js  |        이미지 파일 전송         |
| GET    | /create             | ''         |        글쓰기 page 제공         |
| POST   | /new                | ''         |      글쓰기 data db에 저장      |
| GET    | /update             | update.js  |         수정 page 제공          |
| POST   | /done               | ''         |       수정 data db로 전송       |
| POST   | /sendimg            | ''         |         수정이미지 전송         |
| POST   | /delete             | ''         |      삭제 정보 전송, 삭제       |
| POST   | /plus               | heart.js   |          하트 수 증가           |
| POST   | /minus              | ''         |          하트 수 감소           |
| GET    | /arr                | ''         | 유저의 클릭한 하트 글 번호 전송 |
| POST   | /add                | comment.js |            댓글 등록            |
| POST   | /delete             | ''         |         본인 댓글 삭제          |

### 디렉터리 구조

```
/config
   ├── /cloudinary.js
   └── /passport.js
/db
  ├── /comments.js
  ├── /contents.js
  ├── /count.js
  ├── /mongoose.js
  └── /user.js
/public
  └──/css
     ├── /layout.min.css
     ├── /lightpick.css
     ├── /main.min.css
     ├── /reset.css
     └── /sub.min.css
  └──/images
     ├── /layout
     └── /main
  └──/js
     └── /lightpick.js
  └──/scss
     ├── /layout.scss
     ├── /main.scss
     └── /sub.scss
/routes
   ├── /comment.js
   ├── /create.js
   ├── /heart.js
   ├── /index.js
   ├── /update.js
   └── /user.js
/views
  └── /include
     ├── /head.html
     ├── /header.html
     └── /footer.html
  └── /index.html
  └── /mytour.html
  └── /mypage.html
  └── /create.html
  └── /update.html
  └── /404.html
  └── /500.html
├── /.env
├── /.gitignore
├── / index.js
├── / package-lock.json
├── / package.json
├── / README.md
```

### 주요 기능

- 로그인, 회원가입
  1. 회원가입 시 아이디, 닉네임 중복확인
  2. 회원가입 시 비밀번호를 두번 입력받아 일치하는지 확인
  3. 마이페이지에서 닉네임, 비밀번호 수정가능
  4. 비밀번호 암호화
  5. 회원 탈퇴
- 하트 구현
  1. 비회원일 때에는 팝업창에서 하트수만 확인 가능(메인 페이지에서는 하트를 숨기고, 팝업창의 하트는 누르면 로그인 하라는 안내가 뜸)
  2. 로그인 후 메인, 팝업창에서 하트 누르기 가능
  3. 하트 누르면 하트수가 즉각 반영됨
- 댓글 기능
  1. 로그인 한 상태에서는 댓글입력창을 보이지 않고, 남겨진 댓글만 보이게 구현
  2. 로그인 한 후 댓글창 위에 댓글입력창 생성
  3. 본인이 남긴 댓글은 삭제 가능
- 글
  1. 내가 올린 글만 모아서 볼 수 있음(mytour)
  2. 글 수정, 삭제 가능
- 페이지네이션
  1. 한 페이지의 최대 페이지수는 5로 구현
  2. 페이지 수에 따라 이전, 다음 버튼 생성 구현

## 배포 : https://worldtraveldiary.herokuapp.com/
