# travel diary

### 목적 : nodejs crud 연습

### 새롭게 알게된 기능

- express.routes
- 비밀번호 암호화 : bcrypt

### error

- Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client -> 응답을 했는데 두번째 응답을 보내려 시도하면 서버가 충돌하여 에러가 남, if로 전송되는 응답에 return을 추가해 전송되면 코드를 종료시킴
- db, passport 라우터 분리 어려움..
- mongodb 라우터분리 해결 못함... 리팩토링 시 다시 시도(async, await로 해야함 db를 불러오기 전에 exports된 db들이 먼저 실행되어서 null값만 나감)
- express-session이 왜 possport 모듈 안에 들어가면 에러가 나는지 이해 못함,일단 index.js에 session관련 코드들을 옮기면 정상적으로 작동함
