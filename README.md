# travel diary

### 목적 : nodejs crud 연습

### 새롭게 알게된 기능

- express.routes
- 비밀번호 암호화 : bcrypt

### error

- Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client -> 응답을 했는데 두번째 응답을 보내려 시도하면 서버가 충돌하여 에러가 남, if로 전송되는 응답에 return을 추가해 전송되면 코드를 종료시킴
