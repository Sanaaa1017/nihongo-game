function showImage(index) {
  // 根據 index 顯示對應的展開圖片
  document.getElementById(`full-screen-${index}`).style.display = "flex";
}

function hideImage(index) {
  // 根據 index 隱藏對應的展開圖片
  document.getElementById(`full-screen-${index}`).style.display = "none";
}

AnimalAnimation();

function AnimalAnimation() {
  const leftAnimal = document.querySelector(".animal.left");
  const rightAnimal = document.querySelector(".animal.right");

  // 左右動畫
  gsap.to(leftAnimal, {
    x: -100,
    duration: 3,
    repeat: -1, // 無限次重複
    yoyo: true, // 動畫來回播放
    ease: "power1.inOut",
  });

  gsap.to(rightAnimal, {
    x: 100,
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  // 上下動畫
  gsap.to([leftAnimal, rightAnimal], {
    y: 20,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}
