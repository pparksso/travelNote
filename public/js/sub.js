const fileNameBox = document.querySelector("#fileName");
const inputFile = document.querySelector("#image");
const mytourUpdateBtn = document.querySelector("#mytourUpdate");
mytourUpdateBtn.addEventListener("click", () => {
  location.href = "/create";
});

inputFile.addEventListener("change", () => {
  const img = document.querySelector("#image");
  const fileName = inputFile.value;
  fileNameBox.value = fileName;
  const sendImgData = new FormData();
  sendImgData.append("image", img.value);
  axios({
    method: "POST",
    url: "/create/sendimg",
    contentType: false,
    processData: false,
    data: sendImgData,
    enctype: "multipart/form-data",
  }).then((res) => {
    console.log(res.data.cloudinaryImgSrc);
  });
});
