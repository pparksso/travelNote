const mainVisual = document.querySelector("#mainVisual");

const swiper = new Swiper(mainVisual, {
  speed: 2000,
  loop: true,
  autoplay: {
    delay: 5000,
  },
});
