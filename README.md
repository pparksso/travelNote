# travel diary

---

### 목적

- 즐거웠던 여행의 순간을 기록하기 위한 웹페이지로 반응형으로 제작되었습니다.

### 사용 언어

- javascript

### 사용 기술

- nodejs

### 데이터베이스

- mongodb(mongoose), cloudinary

### 주요 기능

- 로그인, 회원가입
  1. 회원가입 시 아이디, 닉네임 중복확인
  2. 회원가입 시 비밀번호를 두번 입력받아 비밀번호 일치 확인
  3. 마이페이지에서 닉네임, 비밀번호 수정가능
  4. 비밀번호 암호화
  5. 회원 탈퇴
- 하트 구현
  1. 비회원일 때에는 팝업창에서 하트수만 확인 가능(메인 페이지에서는 하트를 숨기고, 팝업창의 하트는 누르면 경고창이 뜸)
  2. 로그인 후 메인, 팝업창에서 하트 누르기 가능
  3. 하트 누르면 하트수가 즉각 수정됨
- 글
  1. 내가 올린 글만 모아서 볼 수 있음(mytour)
  2. 글 수정, 삭제 가능
- 페이지네이션
  1. 한 페이지의 최대 페이지수는 5로 구현
  2. 페이지 수에 따라 이전, 다음 버튼 생성 구현

## 배포 : https://worldtraveldiary.herokuapp.com/

### 새롭게 알게된 기능

- express.routes
- 비밀번호 암호화 : bcrypt
- flash
- 페이지네이션
- mongoose
- async await try catch
- 모듈을 모아둔 js파일 안에서 두개의 요소를 같이 꺼낼 때는 중괄호를 사용해서 내보내고, 꺼내 쓸때도 중괄호 안 요소로 꺼내써야한다. 리액트하면서 배운게 생각나서 써먹음..
- 에러처리 미들웨어 더 알아보기(에러처리 미들웨어는 맨 마지막에 작성한다. 보내줄 수 있는 res가 없을 때까지 코드를 타고 내려가다 에러를 만나면 작동함)

### error

- ✅Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client -> 응답을 했는데 두번째 응답을 보내려 시도하면 서버가 충돌하여 에러가 남, if로 전송되는 응답에 return을 추가해 전송되면 코드를 종료시킴
- ✅db, passport 라우터 분리 어려움.. : 이해함
- ✅express-session이 왜 possport 모듈 안에 들어가면 에러가 나는지 이해 못함,일단 index.js에 session관련 코드들을 옮기면 정상적으로 작동함 : 세션은 브라우저에 저장되는 것이기 때문에 패스포트와 따로 작동된다. 패스포트가 세션을 사용하는 것 뿐!
- ✅js 파일만 수정하면 로그인이 자꾸 풀림.. 이유가..? : js파일을 저장하면 서버가 한번 끊어졌다 다시 연결되기 때문에 모든 요청이 사라진다
- ✅사진을 저장하는 db인 cloudinary모듈파일 안에 multer를 지정해서 같이 export하면 multer를 인식하지 못한다. 그리고 multer는 외부 db를 사용한다고 해도 storage를 지정해줘야한다.

### 진행

- cloudinary 수정 시 이미지 변경 할 때 전 이미지 삭제해야됨, 탈퇴할 때 모든 사진 삭제해야됨

### 리팩토링

- 콜백지옥에 빠진애들 async await 사용하여 구원하기
- 유저 리팩토링 중 오류발생으로 백업

```
  try {
    const id = req.body.id;
    const pw = req.body.pw;
    const nickname = req.body.nickname;
    const pwCheck = req.body.pwCheck;
    if (pw !== pwCheck) {
      res.json({ pwCheck: false, });
    }
    if (pw === pwCheck) {
      bcrypt.hash(pw, saltRounds, (err, hash) => {
        await countDb.findOne({ name: "user" },);
        await userDb.insertOne(
          {
            userNum: userNum,
            id: id,
            pw: hash,
            nickname: nickname,
            heart: [],
          },);
        await countDb.updateOne( { name: "user" },
          {$inc: { count: 1,}})
        res.json({ isjoin: true, });
      }
    }
  }
  catch(err) {
    console.log(err)
  }
```

### 페이지네이션

1. size = 한 페이지에 올라가는 게시물 수
2. pageGroupSize = 한 페이지에 보이는 페이지의 숫자
3. page = 요청 페이지(없으면 1)
4. skip = (page - 1) \* size
5. totalContents = 총 db 게시물 수
6. totalPage = 총 페이지 수/ Math.ceil(totalContents / pageGroupSize)
7. startPage = 현재 페이지 - (현재페이지-1)%한 페이지에 보이는 페이지 수
8. lastPage = startPage + (한 페이지에 보이는 페이지 수 - 1)
