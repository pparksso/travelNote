const fileNameBox = document.querySelector("#fileName");
const inputFile = document.querySelector("#image");

inputFile.addEventListener("change", () => {
  const fileName = inputFile.value;
  fileNameBox.value = fileName;
});
