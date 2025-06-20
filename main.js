const STORAGE_KEY = 'BOOKSHELF_APPS';
let books = [];

// DOM Elements
const bookForm = document.getElementById('bookForm');
const titleInput = document.getElementById('bookFormTitle');
const authorInput = document.getElementById('bookFormAuthor');
const yearInput = document.getElementById('bookFormYear');
const isCompleteInput = document.getElementById('bookFormIsComplete');

const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');

const searchForm = document.getElementById('searchBook');
const searchTitleInput = document.getElementById('searchBookTitle');

const generateId = () => +new Date();

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooks() {
  const data = localStorage.getItem(STORAGE_KEY);
  books = data ? JSON.parse(data) : [];
  renderBooks(books);
}

function createBookElement(book) {
  const bookItem = document.createElement('div');
  bookItem.setAttribute('data-bookid', book.id);
  bookItem.setAttribute('data-testid', 'bookItem');

  const title = document.createElement('h3');
  title.textContent = book.title;
  title.setAttribute('data-testid', 'bookItemTitle');

  const author = document.createElement('p');
  author.textContent = `Penulis: ${book.author}`;
  author.setAttribute('data-testid', 'bookItemAuthor');

  const year = document.createElement('p');
  year.textContent = `Tahun: ${book.year}`;
  year.setAttribute('data-testid', 'bookItemYear');

  const actions = document.createElement('div');

  const toggleButton = document.createElement('button');
  toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
  toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  toggleButton.addEventListener('click', () => toggleBookComplete(book.id));

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Hapus Buku';
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.addEventListener('click', () => deleteBook(book.id));

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit Buku';
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.addEventListener('click', () => editBook(book));

  actions.append(toggleButton, deleteButton, editButton);
  bookItem.append(title, author, year, actions);

  return bookItem;
}

function renderBooks(bookList) {
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  bookList.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newBook = {
    id: generateId(),
    title: titleInput.value,
    author: authorInput.value,
    year: parseInt(yearInput.value),
    isComplete: isCompleteInput.checked,
  };

  books.push(newBook);
  saveBooks();
  renderBooks(books);
  bookForm.reset();
});

function toggleBookComplete(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks(books);
  }
}

function deleteBook(bookId) {
  books = books.filter((b) => b.id !== bookId);
  saveBooks();
  renderBooks(books);
}

function editBook(book) {
  const newTitle = prompt('Edit Judul:', book.title);
  const newAuthor = prompt('Edit Penulis:', book.author);
  const newYear = prompt('Edit Tahun:', book.year);

  if (newTitle && newAuthor && newYear) {
    book.title = newTitle;
    book.author = newAuthor;
    book.year = parseInt(newYear);
    saveBooks();
    renderBooks(books);
  }
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const keyword = searchTitleInput.value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(keyword)
  );
  renderBooks(filteredBooks);
});

document.addEventListener('DOMContentLoaded', loadBooks);