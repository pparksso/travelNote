# travel diary

### 목적 : nodejs crud 연습

### 새롭게 알게된 기능

- express.routes
- 비밀번호 암호화 : bcrypt
- flash

### error

- ✅Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client -> 응답을 했는데 두번째 응답을 보내려 시도하면 서버가 충돌하여 에러가 남, if로 전송되는 응답에 return을 추가해 전송되면 코드를 종료시킴
- ✅db, passport 라우터 분리 어려움.. : 이해함
- mongodb 라우터분리 해결 못함... 리팩토링 시 다시 시도(async, await로 해야함 db를 불러오기 전에 exports된 db들이 먼저 실행되어서 null값만 나감)
- ✅express-session이 왜 possport 모듈 안에 들어가면 에러가 나는지 이해 못함,일단 index.js에 session관련 코드들을 옮기면 정상적으로 작동함 : 세션은 브라우저에 저장되는 것이기 때문에 패스포트와 따로 작동된다. 패스포트가 세션을 사용하는 것 뿐!
- ✅js 파일만 수정하면 로그인이 자꾸 풀림.. 이유가..? : js파일을 저장하면 서버가 한번 끊어졌다 다시 연결되기 때문에 모든 요청이 사라진다
- ✅사진을 저장하는 db인 cloudinary모듈파일 안에 multer를 지정해서 같이 export하면 multer를 인식하지 못한다. 그리고 multer는 외부 db를 사용한다고 해도 storage를 지정해줘야한다.

### 진행

- 남은 진행사항 : 페이지네이션, 에러페이지, 반응형, 팝업창 높이 수정
- cloudinary 수정 시 이미지 변경 할 때 전 이미지 삭제해야됨, 탈퇴할 때 모든 사진 삭제해야됨

### 로직

- 로그인 후 메인,팝업의 하트 상태

  1. userInfo의 heart배열을 가져와 그 안의 값과 글의 no가 같은 글은 꽉 찬 하트의 클래스리스트를 on하고 빈 하트의 클래스리스트를 제거한다.
  2. 다른 글은 꽉 찬 하트의 클래스리스트를 제거하고, 빈 하트의 클래스리스트를 추가한다.
  3. 팝업창의 하트수도 같이 뿌려주고, 팝업창의 하트상태를 userInfo의 heart배열 정보로 조정한다.

- 메인창에서 "빈 하트"를 눌렀을 때
  1.  버튼의 data속성(글 no)을 서버로 넘긴다.
  2.  서버에서 그 글의 하트수 +1을 하고, 누른 유저의 heart배열에 글 no를 추가한다.
  3.  res.json으로 변한 하트수를 클라이언트로 넘겨준다.
  4.  넘겨받으면 일단 빈 하트의 클래스리스트를 없애고, 꽉찬 하트의 클래스리스트를 추가한다.
  5.  그 글의 넘버를 가진 팝업창의 하트수를 res.json으로 받은 하트수로 업데이트하고, 팝업창의 빈하트의 클래스리스트를 제거하고, 꽉찬 하트의 클래스리스트를 추가한다.

### 리팩토링

- 콜백지옥에 빠진애들 async await 사용하여 구원하기
