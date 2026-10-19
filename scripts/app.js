/**
 * app.js - Main Application Orchestration, Routing & Event Handlers
 * Book & Notes Vault
 */

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Storage & State
  const initialSettings = Storage.getSettings();
  AppState.setSettings(initialSettings);

  const initialBooks = await Storage.initializeSeedData();
  AppState.setBooks(initialBooks);

  // 2. Setup Routing based on URL hash
  function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const validPages = ['dashboard', 'catalog', 'add-book', 'settings'];
    const targetPage = validPages.includes(hash) ? hash : 'dashboard';
    AppState.setActivePage(targetPage, AppState.getState().editingBookId);
  }

  window.addEventListener('hashchange', handleHashChange);

  // 3. Render Orchestrator
  let pendingDeleteBookId = null;

  function renderApp() {
    const state = AppState.getState();
    const appRoot = document.getElementById('app-root');
    if (!appRoot) return;

    // Perspective body class synchronization
    document.body.classList.remove('perspective-desktop-mode', 'perspective-mobile-mode', 'perspective-dual-mode');
    if (state.perspectiveMode === 'desktop') {
      document.body.classList.add('perspective-desktop-mode');
    } else if (state.perspectiveMode === 'mobile') {
      document.body.classList.add('perspective-mobile-mode');
    } else if (state.perspectiveMode === 'dual') {
      document.body.classList.add('perspective-dual-mode');
    }

    if (state.sketchMode) {
      document.body.classList.add('sketch-mode');
    } else {
      document.body.classList.remove('sketch-mode');
    }

    // Render perspective bar at very top
    const perspectiveBarHtml = UI.renderPerspectiveBar(state.perspectiveMode, state.sketchMode);

    // Active page content
    let mainContentHtml = '';
    switch (state.activePage) {
      case 'catalog':
        mainContentHtml = UI.renderCatalog(state);
        break;
      case 'add-book':
        mainContentHtml = UI.renderAddEditBook(state);
        break;
      case 'settings':
        mainContentHtml = UI.renderSettingsAbout(state);
        break;
      case 'dashboard':
      default:
        mainContentHtml = UI.renderDashboard(state);
        break;
    }

    // Wrap according to perspective mode
    let contentBody = '';
    if (state.perspectiveMode === 'dual') {
      // Side-by-side Desktop and Mobile wireframes
      contentBody = `
        <div class="perspective-stage">
          <div class="dual-container">
            <!-- Left: Desktop Wireframe Perspective -->
            <div class="dual-desktop-column">
              <div class="dual-column-header">
                <svg class="icon" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                <span>Desktop Perspective Wireframe</span>
              </div>
              <div class="dual-frame-box">
                ${UI.renderHeader(state.activePage)}
                <div id="main-content" style="padding: 20px 0;">
                  ${mainContentHtml}
                </div>
              </div>
            </div>

            <!-- Right: Mobile Wireframe Perspective -->
            <div class="dual-mobile-column">
              <div class="dual-column-header">
                <svg class="icon" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                <span>Mobile Perspective</span>
              </div>
              <div class="dual-frame-box dual-mobile-frame">
                <div class="mobile-mockup-speaker">12:00 • 5G • 100%</div>
                ${UI.renderHeader(state.activePage)}
                <div style="padding: 16px 0; overflow-y: auto; max-height: 600px;">
                  ${mainContentHtml}
                </div>
                ${UI.renderMobileBottomNav(state.activePage)}
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Standard or Single Frame perspective
      contentBody = `
        <div class="perspective-stage">
          <div class="app-viewport-frame">
            ${state.perspectiveMode === 'mobile' ? '<div class="mobile-mockup-speaker">12:00 • 5G • 100%</div>' : ''}
            ${UI.renderHeader(state.activePage)}
            <main id="main-content" tabindex="-1">
              ${mainContentHtml}
            </main>
            <footer class="app-footer">
              <div class="container footer-inner">
                <span>© 2026 Book & Notes Vault • Minimalist Wireframe Student Project</span>
                <span>Navy-blue Outlines • White Canvas • Semantic Accessible HTML</span>
              </div>
            </footer>
            ${UI.renderMobileBottomNav(state.activePage)}
          </div>
        </div>
      `;
    }

    appRoot.innerHTML = `
      ${perspectiveBarHtml}
      ${contentBody}
      ${UI.renderModals()}
      <div id="toast-container" class="toast-container" aria-live="polite"></div>
    `;

    bindInteractiveEvents();
  }

  // 4. Interactive Event Delegations
  function bindInteractiveEvents() {
    // A. Perspective Switcher buttons
    document.querySelectorAll('.perspective-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = e.currentTarget.getAttribute('data-perspective');
        AppState.setPerspectiveMode(mode);
      });
    });

    const btnSketch = document.getElementById('btn-toggle-sketch');
    if (btnSketch) {
      btnSketch.addEventListener('click', () => {
        AppState.toggleSketchMode();
      });
    }

    // B. Mobile Header Menu Toggle
    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    if (btnMobileMenu && mobileDrawer) {
      btnMobileMenu.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        btnMobileMenu.setAttribute('aria-expanded', String(isOpen));
      });
    }

    // C. Search input handling
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        AppState.setFilter('query', e.target.value);
      });
    }

    const regexToggle = document.getElementById('regex-toggle');
    if (regexToggle) {
      regexToggle.addEventListener('change', (e) => {
        AppState.setFilter('isRegex', e.target.checked);
      });
    }

    const caseToggle = document.getElementById('case-toggle');
    if (caseToggle) {
      caseToggle.addEventListener('change', (e) => {
        AppState.setFilter('caseInsensitive', e.target.checked);
      });
    }

    const btnClearSearch = document.getElementById('btn-clear-search');
    if (btnClearSearch) {
      btnClearSearch.addEventListener('click', () => {
        AppState.setFilter('query', '');
      });
    }

    // D. Dashboard Sidebar Filters
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const type = e.currentTarget.getAttribute('data-filter-type');
        const val = e.currentTarget.getAttribute('data-filter-val');
        AppState.setFilter(type, val);
      });
    });

    const btnResetFilters = document.getElementById('btn-reset-filters');
    if (btnResetFilters) {
      btnResetFilters.addEventListener('click', () => {
        AppState.resetFilters();
      });
    }

    const btnClearFiltersEmpty = document.getElementById('btn-clear-filters-empty');
    if (btnClearFiltersEmpty) {
      btnClearFiltersEmpty.addEventListener('click', () => {
        AppState.resetFilters();
      });
    }

    // E. Catalog Sorting & Filters
    const catalogSort = document.getElementById('catalog-sort-field');
    if (catalogSort) {
      catalogSort.addEventListener('change', (e) => {
        const [field, order] = e.target.value.split('-');
        AppState.setFilter('sortField', field);
        AppState.setFilter('sortOrder', order);
      });
    }

    const catalogGenre = document.getElementById('catalog-genre-filter');
    if (catalogGenre) {
      catalogGenre.addEventListener('change', (e) => {
        AppState.setFilter('genre', e.target.value);
      });
    }

    const catalogStatus = document.getElementById('catalog-status-filter');
    if (catalogStatus) {
      catalogStatus.addEventListener('change', (e) => {
        AppState.setFilter('status', e.target.value);
      });
    }

    // F. Edit & Delete action buttons on cards/table rows
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookId = e.currentTarget.getAttribute('data-id');
        AppState.setActivePage('add-book', bookId);
        window.location.hash = '#add-book';
      });
    });

    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const bookId = e.currentTarget.getAttribute('data-id');
        openDeleteModal(bookId);
      });
    });

    // G. Form Validations and Submissions (Add / Edit Book)
    bindFormValidations();

    // H. Settings & Data Actions
    bindSettingsEvents();

    // I. ISBN Helper Modal events
    bindISBNModalEvents();
  }

  // 5. Form Validation Binding
  function bindFormValidations() {
    const form = document.getElementById('book-form');
    if (!form) return;

    const inputTitle = document.getElementById('input-title');
    const inputAuthor = document.getElementById('input-author');
    const inputPages = document.getElementById('input-pages');
    const inputTag = document.getElementById('input-tag');
    const inputDate = document.getElementById('input-date');
    const inputStatus = document.getElementById('input-status');
    const inputRating = document.getElementById('input-rating');
    const inputNotes = document.getElementById('input-notes');
    const bookId = document.getElementById('form-book-id')?.value;

    function validateField(inputEl, errorElId, validatorFn, warnElId, warnFn) {
      const errorEl = document.getElementById(errorElId);
      const val = inputEl.value;
      const res = validatorFn(val);

      if (!res.valid) {
        inputEl.classList.add('is-invalid');
        if (errorEl) {
          errorEl.textContent = res.message;
          errorEl.classList.add('visible');
        }
      } else {
        inputEl.classList.remove('is-invalid');
        if (errorEl) {
          errorEl.textContent = '';
          errorEl.classList.remove('visible');
        }
      }

      if (warnElId && warnFn) {
        const warnEl = document.getElementById(warnElId);
        const warning = warnFn(val);
        if (warning && warnEl) {
          warnEl.textContent = '⚠️ ' + warning;
          warnEl.classList.add('visible');
        } else if (warnEl) {
          warnEl.textContent = '';
          warnEl.classList.remove('visible');
        }
      }

      return res.valid;
    }

    // Blur & input listeners
    inputTitle?.addEventListener('input', () => {
      validateField(inputTitle, 'error-title', Validators.validateTitle, 'warn-title', Validators.detectRepeatedWords);
    });
    inputAuthor?.addEventListener('input', () => {
      validateField(inputAuthor, 'error-author', Validators.validateAuthor, 'warn-author', Validators.detectRepeatedWords);
    });
    inputPages?.addEventListener('input', () => {
      validateField(inputPages, 'error-pages', Validators.validatePages);
    });
    inputTag?.addEventListener('input', () => {
      validateField(inputTag, 'error-tag', Validators.validateTag);
    });
    inputDate?.addEventListener('input', () => {
      validateField(inputDate, 'error-date', Validators.validateDate);
    });

    const btnCancel = document.getElementById('btn-cancel-form');
    if (btnCancel) {
      btnCancel.addEventListener('click', () => {
        AppState.setActivePage('catalog', null);
        window.location.hash = '#catalog';
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const bookData = {
        title: inputTitle.value,
        author: inputAuthor.value,
        pages: inputPages.value,
        tag: inputTag.value,
        dateAdded: inputDate.value,
        status: inputStatus.value,
        rating: parseInt(inputRating.value, 10),
        notes: inputNotes.value
      };

      const check = Validators.validateBookRecord(bookData);

      if (!check.isValid) {
        // Highlight errors
        if (check.errors.title) validateField(inputTitle, 'error-title', Validators.validateTitle);
        if (check.errors.author) validateField(inputAuthor, 'error-author', Validators.validateAuthor);
        if (check.errors.pages) validateField(inputPages, 'error-pages', Validators.validatePages);
        if (check.errors.tag) validateField(inputTag, 'error-tag', Validators.validateTag);
        if (check.errors.dateAdded) validateField(inputDate, 'error-date', Validators.validateDate);

        UI.showToast('Please correct form validation errors before saving.', 'error');
        return;
      }

      if (bookId) {
        // Edit existing
        const updated = Storage.updateBook(bookId, bookData);
        if (updated) {
          AppState.setBooks(Storage.getBooks());
          UI.showToast(`Updated "${updated.title}" successfully!`, 'success');
          AppState.setActivePage('catalog', null);
          window.location.hash = '#catalog';
        }
      } else {
        // Add new
        const created = Storage.addBook(bookData);
        if (created) {
          AppState.setBooks(Storage.getBooks());
          UI.showToast(`Added "${created.title}" to vault!`, 'success');
          AppState.setActivePage('catalog', null);
          window.location.hash = '#catalog';
        }
      }
    });
  }

  // 6. Settings & Data Import/Export Handlers
  function bindSettingsEvents() {
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
      settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const unit = document.getElementById('setting-unit').value;
        const readingTarget = parseInt(document.getElementById('setting-target').value, 10) || 50;
        const targetType = document.getElementById('setting-target-type').value;

        const updated = { unit, readingTarget, targetType };
        Storage.saveSettings(updated);
        AppState.setSettings(updated);
        UI.showToast('Preferences updated successfully!', 'success');
      });
    }

    const btnExport = document.getElementById('btn-export-json');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        Storage.exportToJSON();
        UI.showToast('Book data exported to JSON.', 'success');
      });
    }

    const btnImportTrigger = document.getElementById('btn-import-trigger');
    const fileInput = document.getElementById('file-import-input');
    if (btnImportTrigger && fileInput) {
      btnImportTrigger.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          const res = Storage.importFromJSON(content);
          if (res.success) {
            AppState.setBooks(Storage.getBooks());
            UI.showToast(res.message, 'success');
          } else {
            UI.showToast('Import error: ' + res.message, 'error');
          }
        };
        reader.readAsText(file);
        fileInput.value = '';
      });
    }

    const btnResetSeed = document.getElementById('btn-reset-seed');
    if (btnResetSeed) {
      btnResetSeed.addEventListener('click', async () => {
        if (confirm('Reset all vault records to default seed data? Any new additions will be replaced.')) {
          const fresh = await Storage.resetToSeed();
          AppState.setBooks(fresh);
          UI.showToast('Vault records reset to seed data.', 'success');
        }
      });
    }
  }

  // 7. Delete Modal Handling
  function openDeleteModal(bookId) {
    pendingDeleteBookId = bookId;
    const book = Storage.getBookById(bookId);
    if (!book) return;

    const modal = document.getElementById('modal-delete');
    const titleDisplay = document.getElementById('delete-book-title-display');
    if (titleDisplay) titleDisplay.textContent = `"${book.title}"`;
    if (modal) modal.classList.add('open');

    const btnClose = document.getElementById('btn-close-delete-modal');
    const btnCancel = document.getElementById('btn-cancel-delete');
    const btnConfirm = document.getElementById('btn-confirm-delete');

    const closeModal = () => {
      if (modal) modal.classList.remove('open');
      pendingDeleteBookId = null;
    };

    btnClose?.onclick = closeModal;
    btnCancel?.onclick = closeModal;

    btnConfirm.onclick = () => {
      if (pendingDeleteBookId) {
        Storage.deleteBook(pendingDeleteBookId);
        AppState.setBooks(Storage.getBooks());
        UI.showToast('Book record deleted.', 'info');
        closeModal();
      }
    };
  }

  // 8. ISBN Extractor Modal Handling
  function bindISBNModalEvents() {
    const btnOpen = document.getElementById('btn-open-isbn-helper');
    const modal = document.getElementById('modal-isbn');
    const btnClose = document.getElementById('btn-close-isbn-modal');
    const btnDone = document.getElementById('btn-done-isbn');
    const btnExtract = document.getElementById('btn-run-isbn-extract');
    const btnSample = document.getElementById('btn-isbn-paste-sample');
    const inputArea = document.getElementById('isbn-input-text');
    const resultsBox = document.getElementById('isbn-results-box');

    if (!btnOpen || !modal) return;

    btnOpen.addEventListener('click', () => modal.classList.add('open'));
    btnClose?.addEventListener('click', () => modal.classList.remove('open'));
    btnDone?.addEventListener('click', () => modal.classList.remove('open'));

    btnSample?.addEventListener('click', () => {
      if (inputArea) {
        inputArea.value = 'Catalog citation: Martin, Robert C. Clean Architecture: A Craftsman\'s Guide to Software Structure and Design. Prentice Hall, 2017. ISBN-13: 978-0-13-449416-6. ISBN-10: 0-13-449416-4.';
      }
    });

    btnExtract?.addEventListener('click', () => {
      const text = inputArea ? inputArea.value : '';
      const isbns = Validators.extractISBN(text);

      if (!resultsBox) return;

      if (isbns.length === 0) {
        resultsBox.innerHTML = '<span style="color: var(--color-danger-border);">No ISBN numbers detected. Ensure format is like 978-0-13-449416-6 or 0-13-449416-4.</span>';
      } else {
        resultsBox.innerHTML = `
          <strong>Detected ${isbns.length} ISBN record(s):</strong>
          <ul style="margin-top: 6px; padding-left: 18px;">
            ${isbns.map(item => `
              <li style="margin-bottom: 4px;">
                <code>${item.clean}</code> (${item.type}) 
                <button type="button" class="btn btn-outline btn-sm btn-use-isbn" data-isbn="${item.clean}" style="padding: 1px 6px; font-size: 0.72rem; margin-left: 6px;">
                  Use in Search
                </button>
              </li>
            `).join('')}
          </ul>
        `;

        document.querySelectorAll('.btn-use-isbn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const isbn = e.currentTarget.getAttribute('data-isbn');
            AppState.setFilter('query', isbn);
            AppState.setFilter('isRegex', false);
            modal.classList.remove('open');
            UI.showToast(`Applied ISBN "${isbn}" to search.`, 'info');
          });
        });
      }
    });
  }

  // 9. Subscribe to State Changes & Initial Render
  AppState.subscribe(() => {
    renderApp();
  });

  // Check initial hash
  handleHashChange();
  renderApp();
});
