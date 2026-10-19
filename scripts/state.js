/**
 * state.js - Centralized reactive state store for Book & Notes Vault
 * Handles application view, filters, active editing book, and subscriptions.
 */

const AppState = (() => {
  const state = {
    books: [],
    settings: {
      unit: 'Pages',
      readingTarget: 50,
      targetType: 'books' // 'books' or 'pages'
    },
    filters: {
      query: '',
      isRegex: false,
      caseInsensitive: true,
      genre: 'All',
      rating: 'All',
      status: 'All',
      sortField: 'dateAdded',
      sortOrder: 'desc'
    },
    activePage: 'dashboard', // 'dashboard' | 'catalog' | 'add-book' | 'settings'
    editingBookId: null,
    perspectiveMode: 'responsive', // 'responsive' | 'desktop' | 'mobile' | 'dual'
    sketchMode: false,
    mobileMenuOpen: false
  };

  const listeners = [];

  function getState() {
    return state;
  }

  function subscribe(listener) {
    if (typeof listener === 'function') {
      listeners.push(listener);
    }
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function notify(changedProperty) {
    listeners.forEach(fn => {
      try {
        fn(state, changedProperty);
      } catch (err) {
        console.error('Error in state subscriber:', err);
      }
    });
  }

  function setBooks(books) {
    state.books = Array.isArray(books) ? books : [];
    notify('books');
  }

  function setSettings(settings) {
    state.settings = { ...state.settings, ...settings };
    notify('settings');
  }

  function setFilter(key, value) {
    state.filters[key] = value;
    notify('filters');
  }

  function resetFilters() {
    state.filters = {
      query: '',
      isRegex: false,
      caseInsensitive: true,
      genre: 'All',
      rating: 'All',
      status: 'All',
      sortField: 'dateAdded',
      sortOrder: 'desc'
    };
    notify('filters');
  }

  function setActivePage(page, editingId = null) {
    state.activePage = page;
    state.editingBookId = editingId;
    state.mobileMenuOpen = false;
    notify('page');
  }

  function setPerspectiveMode(mode) {
    state.perspectiveMode = mode;
    notify('perspective');
  }

  function toggleSketchMode() {
    state.sketchMode = !state.sketchMode;
    notify('sketchMode');
  }

  function toggleMobileMenu(force) {
    state.mobileMenuOpen = typeof force === 'boolean' ? force : !state.mobileMenuOpen;
    notify('mobileMenu');
  }

  return {
    getState,
    subscribe,
    setBooks,
    setSettings,
    setFilter,
    resetFilters,
    setActivePage,
    setPerspectiveMode,
    toggleSketchMode,
    toggleMobileMenu
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppState;
} else if (typeof window !== 'undefined') {
  window.AppState = AppState;
}
