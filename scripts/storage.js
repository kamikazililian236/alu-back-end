/**
 * storage.js - LocalStorage management, JSON import/export, and seed data initialization
 * Book & Notes Vault
 */

const Storage = (() => {
  const STORAGE_KEY = 'book_notes_vault_records_v1';
  const SETTINGS_KEY = 'book_notes_vault_settings_v1';

  const DEFAULT_SETTINGS = {
    unit: 'Pages',
    readingTarget: 50,
    targetType: 'books', // 'books' or 'pages'
    theme: 'wireframe-navy'
  };

  /**
   * Load books from localStorage
   */
  function getBooks() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error reading books from localStorage:', e);
      return [];
    }
  }

  /**
   * Save books array to localStorage
   */
  function saveBooks(books) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
      return true;
    } catch (e) {
      console.error('Error saving books to localStorage:', e);
      return false;
    }
  }

  /**
   * Load user settings
   */
  function getSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return { ...DEFAULT_SETTINGS };
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      console.error('Error reading settings:', e);
      return { ...DEFAULT_SETTINGS };
    }
  }

  /**
   * Save user settings
   */
  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Error saving settings:', e);
      return false;
    }
  }

  /**
   * Add a new book record
   */
  function addBook(bookData) {
    const books = getBooks();
    const now = new Date().toISOString();
    const newBook = {
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      title: bookData.title.trim(),
      author: bookData.author.trim(),
      pages: parseInt(bookData.pages, 10),
      tag: bookData.tag.trim(),
      dateAdded: bookData.dateAdded.trim(),
      status: bookData.status || 'To Read',
      rating: bookData.rating ? parseInt(bookData.rating, 10) : 0,
      notes: bookData.notes ? bookData.notes.trim() : '',
      createdAt: now,
      updatedAt: now
    };

    books.unshift(newBook);
    saveBooks(books);
    return newBook;
  }

  /**
   * Update an existing book record
   */
  function updateBook(id, updatedData) {
    const books = getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;

    const existing = books[index];
    const updatedBook = {
      ...existing,
      title: updatedData.title !== undefined ? updatedData.title.trim() : existing.title,
      author: updatedData.author !== undefined ? updatedData.author.trim() : existing.author,
      pages: updatedData.pages !== undefined ? parseInt(updatedData.pages, 10) : existing.pages,
      tag: updatedData.tag !== undefined ? updatedData.tag.trim() : existing.tag,
      dateAdded: updatedData.dateAdded !== undefined ? updatedData.dateAdded.trim() : existing.dateAdded,
      status: updatedData.status !== undefined ? updatedData.status : existing.status,
      rating: updatedData.rating !== undefined ? parseInt(updatedData.rating, 10) : existing.rating,
      notes: updatedData.notes !== undefined ? updatedData.notes.trim() : existing.notes,
      updatedAt: new Date().toISOString()
    };

    books[index] = updatedBook;
    saveBooks(books);
    return updatedBook;
  }

  /**
   * Delete a book record by ID
   */
  function deleteBook(id) {
    const books = getBooks();
    const filtered = books.filter(b => b.id !== id);
    if (filtered.length !== books.length) {
      saveBooks(filtered);
      return true;
    }
    return false;
  }

  /**
   * Get single book by ID
   */
  function getBookById(id) {
    const books = getBooks();
    return books.find(b => b.id === id) || null;
  }

  /**
   * Initialize seed data if storage is empty
   */
  async function initializeSeedData() {
    const current = getBooks();
    if (current && current.length > 0) {
      return current;
    }

    try {
      const response = await fetch('./seed.json');
      if (response.ok) {
        const seed = await response.json();
        if (Array.isArray(seed) && seed.length > 0) {
          saveBooks(seed);
          return seed;
        }
      }
    } catch (e) {
      console.warn('Could not fetch seed.json, using fallback seeds:', e);
    }

    // Fallback seed data if fetch fails
    const fallbackSeed = [
      {
        id: "book-1",
        title: "Clean Architecture",
        author: "Robert Martin",
        pages: 432,
        tag: "Software Engineering",
        dateAdded: "2026-10-10",
        status: "Read",
        rating: 5,
        notes: "Fundamental guide on separation of concerns.",
        createdAt: "2026-10-10T09:00:00.000Z",
        updatedAt: "2026-10-10T09:00:00.000Z"
      },
      {
        id: "book-2",
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        pages: 616,
        tag: "Distributed Systems",
        dateAdded: "2026-10-09",
        status: "Reading",
        rating: 5,
        notes: "Deep dive into storage engines and replication.",
        createdAt: "2026-10-09T14:30:00.000Z",
        updatedAt: "2026-10-11T16:00:00.000Z"
      },
      {
        id: "book-3",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        pages: 352,
        tag: "Software Engineering",
        dateAdded: "2026-10-08",
        status: "Read",
        rating: 5,
        notes: "Advice on software craftsmanship.",
        createdAt: "2026-10-08T11:20:00.000Z",
        updatedAt: "2026-10-08T11:20:00.000Z"
      },
      {
        id: "book-4",
        title: "Atomic Habits",
        author: "James Clear",
        pages: 320,
        tag: "Productivity",
        dateAdded: "2026-10-07",
        status: "Read",
        rating: 4,
        notes: "Small changes lead to remarkable results.",
        createdAt: "2026-10-07T08:15:00.000Z",
        updatedAt: "2026-10-07T08:15:00.000Z"
      },
      {
        id: "book-5",
        title: "Don't Make Me Think",
        author: "Steve Krug",
        pages: 216,
        tag: "UI-UX Design",
        dateAdded: "2026-10-11",
        status: "Read",
        rating: 5,
        notes: "Common-sense approach to web usability.",
        createdAt: "2026-10-11T10:15:00.000Z",
        updatedAt: "2026-10-11T10:15:00.000Z"
      }
    ];

    saveBooks(fallbackSeed);
    return fallbackSeed;
  }

  /**
   * Import JSON data with validation
   */
  function importFromJSON(jsonText) {
    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (e) {
      return {
        success: false,
        message: 'Invalid JSON format: ' + e.message,
        importedCount: 0,
        skippedCount: 0
      };
    }

    if (!Array.isArray(parsed)) {
      return {
        success: false,
        message: 'Imported JSON must be an array of book objects.',
        importedCount: 0,
        skippedCount: 0
      };
    }

    const currentBooks = getBooks();
    const existingIds = new Set(currentBooks.map(b => b.id));
    const validBooks = [];
    let skippedCount = 0;
    const errorsList = [];

    parsed.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        skippedCount++;
        errorsList.push(`Item #${index + 1}: Not an object`);
        return;
      }

      // Validate with Validators module
      const check = window.Validators ? window.Validators.validateBookRecord(item) : { isValid: true };
      if (!check.isValid) {
        skippedCount++;
        errorsList.push(`Item #${index + 1} ("${item.title || 'Untitled'}"): ` + Object.values(check.errors).join(', '));
        return;
      }

      const now = new Date().toISOString();
      let id = item.id;
      if (!id || existingIds.has(id)) {
        id = 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
      }
      existingIds.add(id);

      validBooks.push({
        id,
        title: String(item.title).trim(),
        author: String(item.author).trim(),
        pages: parseInt(item.pages, 10),
        tag: String(item.tag).trim(),
        dateAdded: String(item.dateAdded).trim(),
        status: ['To Read', 'Reading', 'Read'].includes(item.status) ? item.status : 'To Read',
        rating: typeof item.rating === 'number' ? item.rating : 0,
        notes: item.notes ? String(item.notes).trim() : '',
        createdAt: item.createdAt || now,
        updatedAt: item.updatedAt || now
      });
    });

    if (validBooks.length === 0) {
      return {
        success: false,
        message: 'No valid book records could be imported.',
        importedCount: 0,
        skippedCount,
        errors: errorsList
      };
    }

    // Merge or replace
    const combined = [...validBooks, ...currentBooks];
    saveBooks(combined);

    return {
      success: true,
      message: `Successfully imported ${validBooks.length} book(s).`,
      importedCount: validBooks.length,
      skippedCount,
      errors: errorsList
    };
  }

  /**
   * Export books as downloadable JSON file
   */
  function exportToJSON() {
    const books = getBooks();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(books, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute("download", `book-notes-vault-export-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  }

  /**
   * Reset data to default seed file
   */
  async function resetToSeed() {
    localStorage.removeItem(STORAGE_KEY);
    return await initializeSeedData();
  }

  return {
    getBooks,
    saveBooks,
    getSettings,
    saveSettings,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    initializeSeedData,
    importFromJSON,
    exportToJSON,
    resetToSeed,
    DEFAULT_SETTINGS
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Storage;
} else if (typeof window !== 'undefined') {
  window.Storage = Storage;
}
