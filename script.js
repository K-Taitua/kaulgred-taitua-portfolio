document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(12px)";

    setTimeout(() => {
      card.style.transition = "0.45s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, index * 120);
  });
});
