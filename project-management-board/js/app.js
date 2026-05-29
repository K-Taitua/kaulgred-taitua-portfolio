const cards = document.querySelectorAll(".card");
const lists = document.querySelectorAll(".cards");

cards.forEach(card => {
  card.addEventListener("dragstart", () => {
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
  });
});

lists.forEach(list => {
  list.addEventListener("dragover", event => {
    event.preventDefault();

    const draggingCard = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(list, event.clientY);

    if (!draggingCard) return;

    if (afterElement == null) {
      list.appendChild(draggingCard);
    } else {
      list.insertBefore(draggingCard, afterElement);
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".card:not(.dragging)")
  ];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return {
        offset: offset,
        element: child
      };
    }

    return closest;
  }, {
    offset: Number.NEGATIVE_INFINITY
  }).element;
}
