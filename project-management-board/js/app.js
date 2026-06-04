const boardElement = document.getElementById("board");
const boardNameElement = document.getElementById("boardName");
const editBoardNameButton = document.getElementById("editBoardName");

const defaultBoard = {
  name: "My Project Board",
  columns: [
    {
      id: "backlog",
      title: "Backlog",
      cards: [
        { id: crypto.randomUUID(), text: "Plan project goals" },
        { id: crypto.randomUUID(), text: "Collect project assets" },
        { id: crypto.randomUUID(), text: "Create task list" }
      ]
    },
    {
      id: "todo",
      title: "To Do",
      cards: [
        { id: crypto.randomUUID(), text: "Build page structure" },
        { id: crypto.randomUUID(), text: "Style board layout" }
      ]
    },
    {
      id: "progress",
      title: "In Progress",
      cards: [
        { id: crypto.randomUUID(), text: "Add drag and drop" },
        { id: crypto.randomUUID(), text: "Save board data" }
      ]
    },
    {
      id: "review",
      title: "Review",
      cards: [
        { id: crypto.randomUUID(), text: "Test board features" }
      ]
    },
    {
      id: "done",
      title: "Done",
      cards: [
        { id: crypto.randomUUID(), text: "Create project files" },
        { id: crypto.randomUUID(), text: "Link HTML, CSS and JavaScript" },
        { id: crypto.randomUUID(), text: "Set up project folder" }
      ]
    }
  ]
};

let boardData = loadBoard();

function saveBoard() {
  localStorage.setItem("taskManagementBoard", JSON.stringify(boardData));
}

function loadBoard() {
  const savedBoard = localStorage.getItem("taskManagementBoard");

  if (savedBoard) {
    return JSON.parse(savedBoard);
  }

  return defaultBoard;
}

function renderBoard() {
  boardElement.innerHTML = "";
  boardNameElement.textContent = boardData.name;

  boardData.columns.forEach((column) => {
    const columnElement = document.createElement("section");
    columnElement.className = "column";
    columnElement.dataset.columnId = column.id;

    columnElement.innerHTML = `
      <div class="column-header">
        <h2>${column.title} <span class="count">(${column.cards.length})</span></h2>

        <div class="column-actions">
          <button class="edit-btn column-edit">✎</button>
        </div>
      </div>

      <div class="cards"></div>

      <button class="add-card">+ Add Card</button>
    `;

    const cardsElement = columnElement.querySelector(".cards");

    column.cards.forEach((card) => {
      cardsElement.appendChild(createCardElement(card, column.id));
    });

    boardElement.appendChild(columnElement);
  });

  addEventListeners();
}

function createCardElement(card, columnId) {
  const cardElement = document.createElement("article");
  cardElement.className = "card";
  cardElement.draggable = true;
  cardElement.dataset.cardId = card.id;
  cardElement.dataset.columnId = columnId;

  cardElement.innerHTML = `
    <div class="card-top">
      <p>${card.text}</p>

      <div class="card-actions">
        <button class="edit-btn card-edit">✎</button>
        <button class="delete-btn card-delete">🗑</button>
      </div>
    </div>
  `;

  return cardElement;
}

function addEventListeners() {
  document.querySelectorAll(".add-card").forEach((button) => {
    button.addEventListener("click", addCard);
  });

  document.querySelectorAll(".card-edit").forEach((button) => {
    button.addEventListener("click", editCard);
  });

  document.querySelectorAll(".card-delete").forEach((button) => {
    button.addEventListener("click", deleteCard);
  });

  document.querySelectorAll(".column-edit").forEach((button) => {
    button.addEventListener("click", editColumn);
  });

  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
  });

  document.querySelectorAll(".cards").forEach((cardList) => {
    cardList.addEventListener("dragover", dragOver);
    cardList.addEventListener("drop", dropCard);
  });
}

editBoardNameButton.addEventListener("click", () => {
  const newName = prompt("Enter board name:", boardData.name);

  if (!newName || newName.trim() === "") return;

  boardData.name = newName.trim();
  saveBoard();
  renderBoard();
});

function addCard(event) {
  const columnElement = event.target.closest(".column");
  const columnId = columnElement.dataset.columnId;

  const cardText = prompt("Enter card title:");

  if (!cardText || cardText.trim() === "") return;

  const column = boardData.columns.find((column) => column.id === columnId);

  column.cards.push({
    id: crypto.randomUUID(),
    text: cardText.trim()
  });

  saveBoard();
  renderBoard();
}

function editCard(event) {
  const cardElement = event.target.closest(".card");
  const columnId = cardElement.dataset.columnId;
  const cardId = cardElement.dataset.cardId;

  const column = boardData.columns.find((column) => column.id === columnId);
  const card = column.cards.find((card) => card.id === cardId);

  const newText = prompt("Edit card title:", card.text);

  if (!newText || newText.trim() === "") return;

  card.text = newText.trim();

  saveBoard();
  renderBoard();
}

function deleteCard(event) {
  const cardElement = event.target.closest(".card");
  const columnId = cardElement.dataset.columnId;
  const cardId = cardElement.dataset.cardId;

  const column = boardData.columns.find((column) => column.id === columnId);

  column.cards = column.cards.filter((card) => card.id !== cardId);

  saveBoard();
  renderBoard();
}

function editColumn(event) {
  const columnElement = event.target.closest(".column");
  const columnId = columnElement.dataset.columnId;

  const column = boardData.columns.find((column) => column.id === columnId);

  const newTitle = prompt("Edit column name:", column.title);

  if (!newTitle || newTitle.trim() === "") return;

  column.title = newTitle.trim();

  saveBoard();
  renderBoard();
}

let draggedCardId = null;
let draggedFromColumnId = null;

function dragStart(event) {
  draggedCardId = event.target.dataset.cardId;
  draggedFromColumnId = event.target.dataset.columnId;

  event.target.classList.add("dragging");
}

function dragEnd(event) {
  event.target.classList.remove("dragging");
}

function dragOver(event) {
  event.preventDefault();
}

function dropCard(event) {
  event.preventDefault();

  const targetColumnElement = event.target.closest(".column");
  const targetColumnId = targetColumnElement.dataset.columnId;

  if (!draggedCardId || !draggedFromColumnId) return;

  const fromColumn = boardData.columns.find((column) => column.id === draggedFromColumnId);
  const toColumn = boardData.columns.find((column) => column.id === targetColumnId);

  const card = fromColumn.cards.find((card) => card.id === draggedCardId);

  fromColumn.cards = fromColumn.cards.filter((card) => card.id !== draggedCardId);
  toColumn.cards.push(card);

  draggedCardId = null;
  draggedFromColumnId = null;

  saveBoard();
  renderBoard();
}

renderBoard();
