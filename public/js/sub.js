const fileNameBox = document.querySelector("#fileName");
const inputFile = document.querySelector("#image");

inputFile.addEventListener("change", () => {
  const fileName = inputFile.value;
  fileNameBox.value = fileName;
  const sendImgData = new FormData();
  sendImgData.append("image");
  axios({
    method: "POST",
    url: "/create/sendimg",
    contentType: false,
    processData: false,
    data: sendImgData,
    enctype: "multipart/form-data",
  }).then((res) => {
    console.log(res.data);
  });
});
