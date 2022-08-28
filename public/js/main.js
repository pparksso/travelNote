const loginBtn = document.querySelector("#loginBtn");
const loginPage = document.querySelector("#loginCover");
const loginCloseBtn = document.querySelector("#loginCloseBtn");
const loginPageInLoginBtn = document.querySelector("#loginPage .loginBtn");
const loginPageInJoinBtn = document.querySelector("#loginCover .joinBtn");
const joinBtn = document.querySelector("#joinBtn");
const joinCloseBtn = document.querySelector("#joinCloseBtn");
const joinPage = document.querySelector("#joinCover");
const joinPageInJoinBtn = document.querySelector("#joinCover .joinBtn");
const joinId = document.querySelector("#joinId");
const joinPw = document.querySelector("#joinPw");
const joinNickname = document.querySelector("#joinNickname");
const contents = document.querySelectorAll("#contents ul li");
const contentsPopup = document.querySelector("#contentsPopup");
const popupClostBtn = document.querySelector("#popupCloseBtn");

//로그인 팝업
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loginPage.classList.add("on");
});
loginCloseBtn.addEventListener("click", () => {
  loginPage.classList.remove("on");
});
joinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  joinPage.classList.add("on");
});

//회원가입 팝업
joinCloseBtn.addEventListener("click", () => {
  joinPage.classList.remove("on");
});

//회원가입을 위한 데이터 전송
joinPageInJoinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const id = joinId.value;
  const pw = joinPw.value;
  const nickname = joinNickname.value;
  axios({
    url: "/user/join",
    method: "POST",
    data: {
      id: id,
      pw: pw,
      nickname: nickname,
    },
  }).then((res) => {
    console.log(res);
    if (res.data.isjoin) {
      location.href = "/";
      joinPage.classList.remove("on");
      confirm("회원가입을 축하드립니다.");
    }
  });
});

//콘텐츠 팝업
contents.forEach((item) => {
  item.addEventListener("click", () => {
    contentsPopup.classList.add("on");
  });
});
popupClostBtn.addEventListener("click", () => {
  contentsPopup.classList.remove("on");
});
