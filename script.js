const user = JSON.parse(atob(Cookies.get("user") ?? "") ?? "{}");
/** @type {any[]} */
const registeredAccounts = JSON.parse(
  localStorage.getItem("registeredAccounts") ?? "[]"
);

if (
  !user ||
  !registeredAccounts.some(
    (v) => v.email === user.email && v.password === user.password
  )
)
  location.href = "login.html";

/** @type {HTMLSpanElement} */
const _email = document.getElementById("email");
_email.innerText = user.email;

/** @type {HTMLButtonElement} */
const _logout = document.getElementById("logout");

function onLogoutClick() {
  Cookies.remove("user");
  location.href = "login.html";
}

/** @type {HTMLInputElement} */
const _title = document.getElementById("title");
/** @type {HTMLInputElement} */
const _note = document.getElementById("note");

document.querySelector("form").onsubmit = onSubmitNewNote;
function onSubmitNewNote(ev) {
  ev.preventDefault();

  /** @type {any[]} */
  const notes = JSON.parse(localStorage.getItem("notes") ?? "[]");

  let id;
  do {
    id = generateId();
  } while (notes.some((n) => !id || n.id === id));

  let payload = {
    id: generateId(),
    title: _title.value || `Untitled #${notes.length}`,
    body: _note.value,
    createdAt: Date.now(),
    owner: user.email,
  };

  notes.push(payload);
  localStorage.setItem("notes", JSON.stringify(notes));
  _title.value = "";
  _note.value = "";

  loadNotes();
}

function deleteNote(id) {
  console.log("del");
  /** @type {any[]} */
  const notes = JSON.parse(localStorage.getItem("notes") ?? "[]");

  const index = notes.findIndex((n) => n.id === id);
  if (index === -1) return;
  notes.splice(index, 1);

  if (notes.length) localStorage.setItem("notes", JSON.stringify(notes));
  else localStorage.removeItem("notes");
  loadNotes();
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Oct",
  "Nov",
  "Des",
];

/** @type {HTMLDivElement} */
const _notesContainer = document.getElementsByClassName("note-container")[0];

function loadNotes() {
  const createNoteElement = (notes) => {
    const date = new Date(notes.updatedAt ?? notes.createdAt);
    const [day, month, year] = [
      date.getDate(),
      months[date.getMonth()],
      date.getFullYear(),
    ];

    return `
      <div class="note-card">
       <div class="note-header">
          <div class="text">
           <h3>${notes.title}</h3>
           <p>${month} ${day}, ${year}</p>
          </div>
          <div class="actions">
            <a href="edit.html?id=${notes.id}" class="edit">
             <i class="hgi hgi-stroke hgi-edit-02"></i>
           </a>
           <button class="delete" onclick="deleteNote('${notes.id}')">
             <i class="hgi hgi-stroke hgi-delete-02"></i>
           </button>
         </div>
        </div>
        <div class="note-body">
          <p>${notes.body.replace(/\n/g, "<br>")}</p>
        </div>
      </div>
      `;
  };
  const emptyMessage = `
    <span style="text-align: center; color: #777777">
      <i>It seems like you don't have any notes :(</i>
    </span>
    `;

  /** @type {any[]} */
  const notes = JSON.parse(localStorage.getItem("notes") ?? "[]").filter(
    (n) => n.owner === user.email
  );
  _notesContainer.innerHTML = notes.length
    ? notes.map((n) => createNoteElement(n)).join("")
    : emptyMessage;
}
loadNotes();

function generateId() {
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-".split(
      ""
    );

  let result = "";
  for (let i = 0; i < 5; i++) {
    result += letters[getRandomInt(0, letters.length - 1)];
  }

  return result;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
