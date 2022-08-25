const header = document.querySelector("#header");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  if (scrollTop > 0) {
    header.classList.add("down");
  } else {
    header.classList.remove("down");
  }
});
