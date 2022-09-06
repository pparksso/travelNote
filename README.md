# travel diary

### 목적 : nodejs crud 연습

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

- 남은 진행사항 :배포
- cloudinary 수정 시 이미지 변경 할 때 전 이미지 삭제해야됨, 탈퇴할 때 모든 사진 삭제해야됨
- 마지막페이지수, 첫페이지수, 화살표 링크 2개

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
