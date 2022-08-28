const myTourBtn = document.querySelector("#myTourBtn");
const contentsList = document.querySelector("#contents .container ul");
const loginBtn = document.querySelector("#loginBtn");
const loginPage = document.querySelector("#loginCover");
const loginCloseBtn = document.querySelector("#loginCloseBtn");
const loginPageInLoginBtn = document.querySelector("#loginCover .loginBtn");
const loginId = document.querySelector("#loginId");
const loginPw = document.querySelector("#loginPw");
const joinBtn = document.querySelector("#joinBtn");
const joinCloseBtn = document.querySelector("#joinCloseBtn");
const joinPage = document.querySelector("#joinCover");
const joinPageInJoinBtn = document.querySelector("#joinCover .joinBtn");
const joinId = document.querySelector("#joinId");
const joinPw = document.querySelector("#joinPw");
const joinNickname = document.querySelector("#joinNickname");
const joinPwCheck = document.querySelector("#joinPwCheck");
const joinIdOk = document.querySelector("#joinCover .idOk");
const joinIdNo = document.querySelector("#joinCover .idNo");
const joinNicknameOk = document.querySelector("#joinCover .nickNameOk");
const joinNicknameNo = document.querySelector("#joinCover .nickNameNo");
const joinPwNotSame = document.querySelector("#joinCover .pwNotSame");
const contents = document.querySelectorAll("#contents ul li");
const contentsPopup = document.querySelector("#contentsPopup");
const popupClostBtn = document.querySelector("#popupCloseBtn");

//로그인 팝업
loginCloseBtn.addEventListener("click", () => {
  loginPage.classList.remove("on");
});

//회원가입 팝업
joinCloseBtn.addEventListener("click", () => {
  joinPage.classList.remove("on");
  joinIdOk.classList.remove("on");
  joinIdNo.classList.remove("on");
  joinNicknameOk.classList.remove("on");
  joinNicknameNo.classList.remove("on");
  joinPwNotSame.classList.remove("on");
  joinId.value = "";
  joinPw.value = "";
  joinNickname.value = "";
  joinPwCheck.value = "";
});

//회원가입을 위한 데이터 전송
joinPageInJoinBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const id = joinId.value;
  const pw = joinPw.value;
  const nickname = joinNickname.value;
  const pwCheck = joinPwCheck.value;
  if (id === "") {
    alert("ID를 입력해주세요");
  }
  if (pw === "") {
    alert("비밀번호를 입력해주세요");
  }
  if (nickname === "") {
    alert("닉네임을 입력해주세요");
  }
  if (pwCheck === "") {
    alert("비밀번호를 체크해주세요");
  }
  if (id.length > 5 && nickname.length > 1 && pw.length > 7) {
    axios({
      url: "/user/join",
      method: "POST",
      data: {
        id: id,
        pw: pw,
        nickname: nickname,
        pwCheck: pwCheck,
      },
    })
      .then((res) => {
        if (!res.data.pwCheck) {
          joinPwNotSame.classList.add("on");
        }
        if (res.data.isjoin) {
          location.href = "/";
          joinPage.classList.remove("on");
          confirm("회원가입을 축하드립니다.");
        }
      })
      .catch((err) => {
        alert("회원가입에 실패하였습니다. 다시 한번 시도해주세요");
      });
  } else {
    if (id.length <= 5) {
      alert("ID는 6자 이상입니다.");
    }
    if (nickname.length <= 1) {
      alert("닉네임은 2글자 이상입니다.");
    }
    if (pw.length <= 7) {
      alert("비밀번호는 8자 이상입니다.");
    }
  }
});
joinId.addEventListener("focusout", () => {
  const id = joinId.value;
  if (id.length > 5) {
    axios({
      method: "POST",
      url: "/user/idcheck",
      data: {
        id: id,
      },
    })
      .then((res) => {
        if (res.data.idCheck) {
          joinIdNo.classList.remove("on");
          joinIdOk.classList.add("on");
        } else {
          joinIdOk.classList.remove("on");
          joinIdNo.classList.add("on");
        }
      })
      .catch((err) => {
        alert("ID체크에 실패했습니다. 다시 한 번 시도해주세요");
      });
  }
  if (id === "" || id.length <= 5) {
    joinIdOk.classList.remove("on");
    joinIdNo.classList.remove("on");
  }
});
joinNickname.addEventListener("focusout", () => {
  const nickname = joinNickname.value;
  if (nickname.length > 1) {
    axios({
      method: "POST",
      url: "/user/nicknamecheck",
      data: {
        nickname: nickname,
      },
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.isNicknameCheck) {
          joinNicknameNo.classList.remove("on");
          joinNicknameOk.classList.add("on");
        } else {
          joinNicknameOk.classList.remove("on");
          joinNicknameNo.classList.add("on");
        }
      })
      .catch((err) => {
        alert("닉네임 체크에 실패했습니다. 다시 한 번 시도해주세요");
      });
  }
  if (nickname === "" || nickname.length <= 1) {
    joinNicknameOk.classList.remove("on");
    joinNicknameNo.classList.remove("on");
  }
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

//마이투어 버튼
// myTourBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   axios({
//     url: "/user",
//   }).then((res) => {
//     console.log(res);
//     const data = res.data;
//     let tempHtml = "";
//     if (!res.data) {
//       tempHtml = ` <!-- <li>
//       <div class="contentsBox mytourBox" id="mytourUpdate">
//         <span class="material-icons"> add </span>
//       </div>
//     </li> -->`;
//     }
//     contentsList.innerHTML = tempHtml;
//   });
// });
