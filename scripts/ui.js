/**
 * ui.js - User Interface Rendering, DOM Generation & Event Delegations
 * Book & Notes Vault
 */

const UI = (() => {
  // SVG Icon definitions for student-friendly hand-drawable wireframe icons
  const ICONS = {
    book: `<svg class="icon" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
    bookOpen: `<svg class="icon" viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    plus: `<svg class="icon" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
    search: `<svg class="icon search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    filter: `<svg class="icon" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>`,
    edit: `<svg class="icon" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
    trash: `<svg class="icon" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
    check: `<svg class="icon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    close: `<svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    settings: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`,
    info: `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    download: `<svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
    upload: `<svg class="icon" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
    grid: `<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    table: `<svg class="icon" viewBox="0 0 24 24"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>`,
    sparkles: `<svg class="icon" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>`
  };

  /**
   * Show toast alert
   */
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <span>${type === 'success' ? ICONS.check : type === 'error' ? ICONS.close : ICONS.info}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * Render Top Perspective Bar
   */
  function renderPerspectiveBar(currentMode, isSketch) {
    return `
      <div class="perspective-bar" role="toolbar" aria-label="Perspective View Switcher">
        <div class="perspective-label">
          <span>${ICONS.bookOpen}</span>
          <span>PERSPECTIVE VIEWPORT:</span>
        </div>
        <div class="perspective-controls">
          <button type="button" class="perspective-btn ${currentMode === 'responsive' ? 'active' : ''}" data-perspective="responsive" title="Natural screen width (auto-adapts at 360px, 768px, 1024px)">
            ↔️ Responsive Auto
          </button>
          <button type="button" class="perspective-btn ${currentMode === 'desktop' ? 'active' : ''}" data-perspective="desktop" title="Simulated 1100px Desktop Wireframe perspective">
            🖥️ Desktop Perspective
          </button>
          <button type="button" class="perspective-btn ${currentMode === 'mobile' ? 'active' : ''}" data-perspective="mobile" title="Simulated 375px Mobile Phone perspective">
            📱 Mobile Perspective
          </button>
          <button type="button" class="perspective-btn ${currentMode === 'dual' ? 'active' : ''}" data-perspective="dual" title="Side-by-side Desktop and Mobile wireframe view">
            📐 Dual Perspective (Both)
          </button>
          <button type="button" class="sketch-toggle-btn ${isSketch ? 'active' : ''}" id="btn-toggle-sketch" title="Toggle hand-drawn student blueprint grid & borders">
            ✏️ Wireframe Sketch Mode ${isSketch ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Render App Header
   */
  function renderHeader(activePage) {
    return `
      <header class="app-header" role="banner">
        <div class="container header-inner">
          <a href="#dashboard" class="brand-wrapper" aria-label="Book and Notes Vault Home">
            <div class="brand-icon-box" aria-hidden="true">
              ${ICONS.book}
            </div>
            <div>
              <span class="brand-title">Book & Notes Vault</span>
              <span class="brand-subtitle-badge">Wireframe UI</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="desktop-nav" role="navigation" aria-label="Main Navigation">
            <a href="#dashboard" class="nav-link ${activePage === 'dashboard' ? 'active' : ''}">
              ${ICONS.grid} Dashboard
            </a>
            <a href="#catalog" class="nav-link ${activePage === 'catalog' ? 'active' : ''}">
              ${ICONS.table} Catalog
            </a>
            <a href="#add-book" class="nav-link ${activePage === 'add-book' ? 'active' : ''}">
              ${ICONS.plus} Add Book
            </a>
            <a href="#settings" class="nav-link ${activePage === 'settings' ? 'active' : ''}">
              ${ICONS.settings} Settings
            </a>
          </nav>

          <!-- Mobile Hamburger Toggle -->
          <button type="button" class="mobile-menu-toggle" id="btn-mobile-menu" aria-label="Toggle navigation menu" aria-expanded="false">
            <svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        <!-- Mobile Drawer -->
        <div class="mobile-nav-drawer" id="mobile-nav-drawer">
          <a href="#dashboard" class="mobile-nav-link ${activePage === 'dashboard' ? 'active' : ''}">
            ${ICONS.grid} Dashboard
          </a>
          <a href="#catalog" class="mobile-nav-link ${activePage === 'catalog' ? 'active' : ''}">
            ${ICONS.table} Catalog
          </a>
          <a href="#add-book" class="mobile-nav-link ${activePage === 'add-book' ? 'active' : ''}">
            ${ICONS.plus} Add Book
          </a>
          <a href="#settings" class="mobile-nav-link ${activePage === 'settings' ? 'active' : ''}">
            ${ICONS.settings} Settings & About
          </a>
        </div>
      </header>
    `;
  }

  /**
   * Render Mobile Bottom Navigation Bar
   */
  function renderMobileBottomNav(activePage) {
    return `
      <nav class="mobile-bottom-nav" role="navigation" aria-label="Mobile Navigation">
        <a href="#dashboard" class="mobile-bottom-item ${activePage === 'dashboard' ? 'active' : ''}">
          ${ICONS.grid}
          <span>Dashboard</span>
        </a>
        <a href="#catalog" class="mobile-bottom-item ${activePage === 'catalog' ? 'active' : ''}">
          ${ICONS.table}
          <span>Catalog</span>
        </a>
        <a href="#add-book" class="mobile-bottom-item ${activePage === 'add-book' ? 'active' : ''}">
          ${ICONS.plus}
          <span>Add Book</span>
        </a>
        <a href="#settings" class="mobile-bottom-item ${activePage === 'settings' ? 'active' : ''}">
          ${ICONS.settings}
          <span>Settings</span>
        </a>
      </nav>
    `;
  }

  /**
   * Render Search Controls Bar (with Regex Toggle & Case-Insensitive option)
   */
  function renderSearchBar(filters, searchError) {
    return `
      <section class="search-controls-wrapper" aria-label="Book Search and Regex Filtering">
        <div class="search-input-row">
          <div class="search-field-container">
            ${ICONS.search}
            <input 
              type="text" 
              id="search-input" 
              class="search-input" 
              placeholder="${filters.isRegex ? 'Enter regular expression (e.g., ^Clean|Design.*)...' : 'Search by title, author, tag, or note...'}" 
              value="${SearchEngine.escapeHTML(filters.query)}"
              aria-label="Search books"
            />
          </div>

          <div class="search-actions-group">
            <label class="regex-toggle-label" title="Enable advanced Regular Expression query matching">
              <input type="checkbox" id="regex-toggle" ${filters.isRegex ? 'checked' : ''} />
              <span>Regex Filter</span>
            </label>

            <button type="button" class="btn btn-secondary btn-sm" id="btn-open-isbn-helper" title="Extract ISBN from text and test regex">
              ${ICONS.sparkles} ISBN Helper
            </button>
          </div>
        </div>

        <div class="search-meta-row">
          <div class="search-flags">
            <label class="search-flag-item">
              <input type="checkbox" id="case-toggle" ${filters.caseInsensitive ? 'checked' : ''} />
              <span>Case-Insensitive (i)</span>
            </label>
            ${filters.isRegex ? `<span style="font-family: var(--font-mono); font-size: 0.78rem; color: var(--color-navy-muted);">Mode: /${SearchEngine.escapeHTML(filters.query || '')}/${filters.caseInsensitive ? 'gi' : 'g'}</span>` : ''}
          </div>

          ${filters.query ? `
            <button type="button" class="btn btn-outline btn-sm" id="btn-clear-search" style="padding: 2px 8px; font-size: 0.75rem;">
              Clear Search
            </button>
          ` : ''}
        </div>

        <div id="regex-error-box" class="regex-error-banner ${searchError ? 'visible' : ''}" role="alert">
          <strong>Regex Syntax Error:</strong> ${searchError || ''}
        </div>
      </section>
    `;
  }

  /**
   * Render Page 1: Dashboard
   */
  function renderDashboard(state) {
    const { books, filters, settings } = state;
    const stats = SearchEngine.calculateStatistics(books, settings);
    const { results, searchError } = SearchEngine.filterAndSortBooks(books, filters);
    const uniqueGenres = SearchEngine.getUniqueGenres(books);

    // Reading Goal display calculation
    const goalUnit = settings.targetType === 'pages' ? settings.unit : 'Books';
    const goalRatio = `${stats.goalCurrent} / ${stats.goalTarget} ${goalUnit}`;

    return `
      <div class="container">
        <!-- Page Header -->
        <div class="page-header-box">
          <div class="page-title-group">
            <h1>Dashboard</h1>
            <p class="page-subtitle">Track reading progress, statistics, and explore book collection.</p>
          </div>
          <div>
            <a href="#add-book" class="btn btn-primary">
              ${ICONS.plus} Add New Book
            </a>
          </div>
        </div>

        <!-- Reading Goal Section -->
        <section class="reading-goal-box" aria-label="Reading Goal Progress">
          <div class="goal-header">
            <h2 class="goal-title">${ICONS.bookOpen} Reading Goal (${stats.goalPercent}%)</h2>
            <div class="goal-count-badge">${goalRatio}</div>
          </div>
          <div class="progress-track" role="progressbar" aria-valuenow="${stats.goalPercent}" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-fill" style="width: ${stats.goalPercent}%;"></div>
          </div>
          <div class="goal-meta">
            <span class="goal-status-text">${stats.remainingOrExceeded}</span>
            <span>Target: ${stats.goalTarget} ${goalUnit}</span>
          </div>
        </section>

        <!-- 3 Primary Statistics Cards -->
        <section class="stats-primary-grid" aria-label="Key Reading Metrics">
          <div class="stat-card">
            <span class="stat-label">${ICONS.book} Current Read</span>
            <span class="stat-value">${stats.totalBooksRead}</span>
            <span class="stat-caption">Completed reading records</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">${ICONS.sparkles} Average Pages / Day</span>
            <span class="stat-value">${stats.avgPagesPerDay}</span>
            <span class="stat-caption">Estimated 30-day velocity</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">${ICONS.table} Total Books Read</span>
            <span class="stat-value">${stats.totalBooksRead}</span>
            <span class="stat-caption">${stats.currentReadPages.toLocaleString()} pages completed</span>
          </div>
        </section>

        <!-- Secondary Stats Pills -->
        <div class="stats-secondary-grid" aria-label="Collection Overview Summary">
          <div class="stat-mini-pill">
            <span class="pill-label">Total Books</span>
            <span class="pill-val">${stats.totalBooks}</span>
          </div>
          <div class="stat-mini-pill">
            <span class="pill-label">Total Pages</span>
            <span class="pill-val">${stats.totalPages.toLocaleString()}</span>
          </div>
          <div class="stat-mini-pill">
            <span class="pill-label">Top Genre</span>
            <span class="pill-val">${stats.mostCommonTag}</span>
          </div>
          <div class="stat-mini-pill">
            <span class="pill-label">Added Last 7 Days</span>
            <span class="pill-val">${stats.addedLastSevenDays}</span>
          </div>
        </div>

        <!-- Search with Regex -->
        ${renderSearchBar(filters, searchError)}

        <!-- Dashboard Two-Column Layout -->
        <div class="dashboard-layout">
          <!-- Left Sidebar Filters -->
          <aside class="sidebar-box" aria-label="Collection Filters">
            <div class="filter-title">${ICONS.filter} Filters</div>

            <!-- Reading Status Filter -->
            <div class="filter-group">
              <div class="filter-title">Reading Status</div>
              <div class="filter-options-list">
                <button type="button" class="filter-chip ${filters.status === 'All' ? 'active' : ''}" data-filter-type="status" data-filter-val="All">
                  <span>All</span>
                  <span class="chip-count">${books.length}</span>
                </button>
                <button type="button" class="filter-chip ${filters.status === 'Read' ? 'active' : ''}" data-filter-type="status" data-filter-val="Read">
                  <span>Read</span>
                  <span class="chip-count">${stats.totalBooksRead}</span>
                </button>
                <button type="button" class="filter-chip ${filters.status === 'Reading' ? 'active' : ''}" data-filter-type="status" data-filter-val="Reading">
                  <span>Reading</span>
                  <span class="chip-count">${stats.currentlyReadingCount}</span>
                </button>
                <button type="button" class="filter-chip ${filters.status === 'To Read' ? 'active' : ''}" data-filter-type="status" data-filter-val="To Read">
                  <span>To Read</span>
                  <span class="chip-count">${stats.toReadCount}</span>
                </button>
              </div>
            </div>

            <!-- Genre / Tag Filter -->
            <div class="filter-group">
              <div class="filter-title">Genres & Tags</div>
              <div class="filter-options-list">
                <button type="button" class="filter-chip ${filters.genre === 'All' ? 'active' : ''}" data-filter-type="genre" data-filter-val="All">
                  <span>All Genres</span>
                  <span class="chip-count">${books.length}</span>
                </button>
                ${uniqueGenres.map(g => {
                  const count = books.filter(b => b.tag === g).length;
                  return `
                    <button type="button" class="filter-chip ${filters.genre === g ? 'active' : ''}" data-filter-type="genre" data-filter-val="${SearchEngine.escapeHTML(g)}">
                      <span>${SearchEngine.escapeHTML(g)}</span>
                      <span class="chip-count">${count}</span>
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Rating Filter -->
            <div class="filter-group">
              <div class="filter-title">Ratings</div>
              <div class="filter-options-list">
                <button type="button" class="filter-chip ${filters.rating === 'All' ? 'active' : ''}" data-filter-type="rating" data-filter-val="All">
                  <span>All Ratings</span>
                </button>
                <button type="button" class="filter-chip ${filters.rating === '5' ? 'active' : ''}" data-filter-type="rating" data-filter-val="5">
                  <span>★★★★★ 5 Stars</span>
                </button>
                <button type="button" class="filter-chip ${filters.rating === '4' ? 'active' : ''}" data-filter-type="rating" data-filter-val="4">
                  <span>★★★★☆ 4+ Stars</span>
                </button>
                <button type="button" class="filter-chip ${filters.rating === '3' ? 'active' : ''}" data-filter-type="rating" data-filter-val="3">
                  <span>★★★☆☆ 3+ Stars</span>
                </button>
              </div>
            </div>

            <button type="button" class="btn btn-outline btn-sm" id="btn-reset-filters" style="width: 100%; margin-top: 6px;">
              Reset All Filters
            </button>
          </aside>

          <!-- Main Collection Cards Area -->
          <main class="collection-main" aria-label="Book Collection Cards">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="section-title" style="margin-bottom: 0;">
                Collection (${results.length} ${results.length === 1 ? 'book' : 'books'})
              </h2>
              ${filters.query || filters.genre !== 'All' || filters.status !== 'All' || filters.rating !== 'All' ? `
                <span style="font-size: 0.8rem; color: var(--color-navy-muted);">Filtered results</span>
              ` : ''}
            </div>

            ${results.length === 0 ? `
              <div class="empty-state-box">
                <div class="empty-state-icon">${ICONS.bookOpen}</div>
                <h3>No books match your criteria</h3>
                <p>Try clearing your search query or relaxing your sidebar filters.</p>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-filters-empty">Clear Filters</button>
              </div>
            ` : `
              <div class="books-grid">
                ${results.map(book => renderBookCard(book, filters)).join('')}
              </div>
            `}
          </main>
        </div>
      </div>
    `;
  }

  /**
   * Render Individual Book Card
   */
  function renderBookCard(book, filters) {
    const highlightedTitle = SearchEngine.highlightText(book.title, filters.query, filters.isRegex, filters.caseInsensitive);
    const highlightedAuthor = SearchEngine.highlightText(book.author, filters.query, filters.isRegex, filters.caseInsensitive);
    const statusClass = (book.status || 'To Read').toLowerCase().replace(/\s+/g, '');
    const stars = '★'.repeat(book.rating || 0) + '☆'.repeat(5 - (book.rating || 0));

    return `
      <article class="book-card" data-id="${book.id}">
        <!-- Book Cover Placeholder with navy wireframe design -->
        <div class="book-cover-placeholder">
          <span class="cover-badge-tag">${SearchEngine.escapeHTML(book.tag)}</span>
          <div class="cover-book-icon">${ICONS.book}</div>
          <span class="cover-art-text">${SearchEngine.escapeHTML(book.title.slice(0, 18))}</span>
        </div>

        <div class="book-card-body">
          <h3 class="book-title">${highlightedTitle}</h3>
          <div class="book-author">by ${highlightedAuthor}</div>

          <div style="font-size: 0.78rem; color: #eab308; margin-top: 2px;" title="${book.rating || 0} out of 5 stars">
            ${stars}
          </div>

          ${book.notes ? `
            <p style="font-size: 0.78rem; color: var(--color-navy-muted); font-style: italic; margin-top: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              "${SearchEngine.highlightText(book.notes, filters.query, filters.isRegex, filters.caseInsensitive)}"
            </p>
          ` : ''}

          <div class="book-meta-row">
            <span class="book-pages-badge">${book.pages} pages</span>
            <span class="status-badge ${statusClass}">${book.status}</span>
          </div>
        </div>

        <div class="book-card-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-action="edit" data-id="${book.id}" title="Edit book details">
            ${ICONS.edit} Edit
          </button>
          <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${book.id}" title="Delete record">
            ${ICONS.trash} Delete
          </button>
        </div>
      </article>
    `;
  }

  /**
   * Render Page 2: Catalog
   */
  function renderCatalog(state) {
    const { books, filters } = state;
    const { results, searchError } = SearchEngine.filterAndSortBooks(books, filters);
    const uniqueGenres = SearchEngine.getUniqueGenres(books);

    return `
      <div class="container">
        <!-- Page Header -->
        <div class="page-header-box">
          <div class="page-title-group">
            <h1>Catalog</h1>
            <p class="page-subtitle">Full tabular record view of your reading library with sorting and actions.</p>
          </div>
          <div>
            <a href="#add-book" class="btn btn-primary">
              ${ICONS.plus} Add Book
            </a>
          </div>
        </div>

        <!-- Search Bar with Regex -->
        ${renderSearchBar(filters, searchError)}

        <!-- Catalog Controls Bar -->
        <section class="catalog-controls-bar" aria-label="Catalog Sort and Filter Controls">
          <div class="sorting-group">
            <label for="catalog-sort-field" class="control-label">Sort by:</label>
            <select id="catalog-sort-field" class="control-select">
              <option value="title-asc" ${filters.sortField === 'title' && filters.sortOrder === 'asc' ? 'selected' : ''}>Title (A–Z)</option>
              <option value="title-desc" ${filters.sortField === 'title' && filters.sortOrder === 'desc' ? 'selected' : ''}>Title (Z–A)</option>
              <option value="dateAdded-desc" ${filters.sortField === 'dateAdded' && filters.sortOrder === 'desc' ? 'selected' : ''}>Date Added (Newest)</option>
              <option value="dateAdded-asc" ${filters.sortField === 'dateAdded' && filters.sortOrder === 'asc' ? 'selected' : ''}>Date Added (Oldest)</option>
              <option value="pages-asc" ${filters.sortField === 'pages' && filters.sortOrder === 'asc' ? 'selected' : ''}>Pages (Ascending)</option>
              <option value="pages-desc" ${filters.sortField === 'pages' && filters.sortOrder === 'desc' ? 'selected' : ''}>Pages (Descending)</option>
            </select>
          </div>

          <div class="sorting-group">
            <label for="catalog-genre-filter" class="control-label">Genre:</label>
            <select id="catalog-genre-filter" class="control-select">
              <option value="All" ${filters.genre === 'All' ? 'selected' : ''}>All Genres</option>
              ${uniqueGenres.map(g => `<option value="${SearchEngine.escapeHTML(g)}" ${filters.genre === g ? 'selected' : ''}>${SearchEngine.escapeHTML(g)}</option>`).join('')}
            </select>

            <label for="catalog-status-filter" class="control-label">Status:</label>
            <select id="catalog-status-filter" class="control-select">
              <option value="All" ${filters.status === 'All' ? 'selected' : ''}>All Statuses</option>
              <option value="Read" ${filters.status === 'Read' ? 'selected' : ''}>Read</option>
              <option value="Reading" ${filters.status === 'Reading' ? 'selected' : ''}>Reading</option>
              <option value="To Read" ${filters.status === 'To Read' ? 'selected' : ''}>To Read</option>
            </select>
          </div>
        </section>

        <!-- Desktop Records Table -->
        <div class="records-table-container">
          <table class="records-table" aria-label="Book Catalog Table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Author</th>
                <th scope="col">Pages</th>
                <th scope="col">Tag / Genre</th>
                <th scope="col">Date Added</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${results.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 32px; color: var(--color-navy-muted);">
                    No book records match the selected criteria.
                  </td>
                </tr>
              ` : results.map(book => {
                const highlightedTitle = SearchEngine.highlightText(book.title, filters.query, filters.isRegex, filters.caseInsensitive);
                const highlightedAuthor = SearchEngine.highlightText(book.author, filters.query, filters.isRegex, filters.caseInsensitive);
                const statusClass = (book.status || 'To Read').toLowerCase().replace(/\s+/g, '');
                return `
                  <tr data-id="${book.id}">
                    <td><strong>${highlightedTitle}</strong></td>
                    <td>${highlightedAuthor}</td>
                    <td style="font-family: var(--font-mono);">${book.pages}</td>
                    <td><span class="cover-badge-tag" style="position: static;">${SearchEngine.escapeHTML(book.tag)}</span></td>
                    <td style="font-family: var(--font-mono); font-size: 0.82rem;">${book.dateAdded}</td>
                    <td><span class="status-badge ${statusClass}">${book.status}</span></td>
                    <td>
                      <div class="table-actions">
                        <button type="button" class="btn btn-secondary btn-sm" data-action="edit" data-id="${book.id}" title="Edit book">
                          ${ICONS.edit} Edit
                        </button>
                        <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${book.id}" title="Delete record">
                          ${ICONS.trash} Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Mobile Stacked Book Cards -->
        <div class="catalog-mobile-list" aria-label="Book Catalog Stacked Cards for Mobile">
          ${results.length === 0 ? `
            <div class="empty-state-box">
              <p>No book records found.</p>
            </div>
          ` : results.map(book => {
            const highlightedTitle = SearchEngine.highlightText(book.title, filters.query, filters.isRegex, filters.caseInsensitive);
            const highlightedAuthor = SearchEngine.highlightText(book.author, filters.query, filters.isRegex, filters.caseInsensitive);
            const statusClass = (book.status || 'To Read').toLowerCase().replace(/\s+/g, '');
            return `
              <div class="catalog-mobile-card" data-id="${book.id}">
                <div class="catalog-mobile-header">
                  <div>
                    <h3 class="catalog-mobile-title">${highlightedTitle}</h3>
                    <div class="catalog-mobile-author">by ${highlightedAuthor}</div>
                  </div>
                  <span class="status-badge ${statusClass}">${book.status}</span>
                </div>

                <div class="catalog-mobile-details">
                  <span><strong>Pages:</strong> ${book.pages}</span>
                  <span>•</span>
                  <span><strong>Tag:</strong> ${SearchEngine.escapeHTML(book.tag)}</span>
                  <span>•</span>
                  <span><strong>Added:</strong> ${book.dateAdded}</span>
                </div>

                <div class="catalog-mobile-actions">
                  <button type="button" class="btn btn-secondary btn-sm" data-action="edit" data-id="${book.id}" style="flex: 1;">
                    ${ICONS.edit} Edit
                  </button>
                  <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-id="${book.id}" style="flex: 1;">
                    ${ICONS.trash} Delete
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Render Page 3: Add / Edit Book
   */
  function renderAddEditBook(state) {
    const isEdit = Boolean(state.editingBookId);
    const existing = isEdit ? Storage.getBookById(state.editingBookId) : null;
    const today = new Date().toISOString().slice(0, 10);

    const book = existing || {
      title: '',
      author: '',
      pages: '',
      tag: '',
      dateAdded: today,
      status: 'To Read',
      rating: 5,
      notes: ''
    };

    const uniqueGenres = SearchEngine.getUniqueGenres(state.books);

    return `
      <div class="container">
        <!-- Page Header -->
        <div class="page-header-box">
          <div class="page-title-group">
            <h1>${isEdit ? 'Edit Book' : 'Add New Book'}</h1>
            <p class="page-subtitle">${isEdit ? `Updating record for "${SearchEngine.escapeHTML(book.title)}"` : 'Enter the book specifications below. Fields marked with * are required.'}</p>
          </div>
          <div>
            <a href="#catalog" class="btn btn-secondary">
              Back to Catalog
            </a>
          </div>
        </div>

        <!-- Form Container -->
        <div class="form-container-box">
          <form id="book-form" novalidate aria-label="Book Information Form">
            <input type="hidden" id="form-book-id" value="${book.id || ''}" />

            <div class="form-grid">
              <!-- Book Title -->
              <div class="form-field full-width">
                <label for="input-title" class="form-label">
                  <span>Book Title <span class="form-required-mark" aria-hidden="true">*</span></span>
                  <span class="form-hint">Rule 1: No excessive or consecutive spaces</span>
                </label>
                <input 
                  type="text" 
                  id="input-title" 
                  class="form-input" 
                  value="${SearchEngine.escapeHTML(book.title)}" 
                  placeholder="e.g., Clean Architecture"
                  required 
                  aria-describedby="error-title warn-title"
                />
                <div id="error-title" class="form-error-msg" role="alert"></div>
                <div id="warn-title" class="form-warning-badge" role="status"></div>
              </div>

              <!-- Author -->
              <div class="form-field">
                <label for="input-author" class="form-label">
                  <span>Author <span class="form-required-mark" aria-hidden="true">*</span></span>
                  <span class="form-hint">Full author name</span>
                </label>
                <input 
                  type="text" 
                  id="input-author" 
                  class="form-input" 
                  value="${SearchEngine.escapeHTML(book.author)}" 
                  placeholder="e.g., Robert Martin"
                  required 
                  aria-describedby="error-author warn-author"
                />
                <div id="error-author" class="form-error-msg" role="alert"></div>
                <div id="warn-author" class="form-warning-badge" role="status"></div>
              </div>

              <!-- Number of Pages -->
              <div class="form-field">
                <label for="input-pages" class="form-label">
                  <span>Number of Pages <span class="form-required-mark" aria-hidden="true">*</span></span>
                  <span class="form-hint">Rule 2: Non-negative integer</span>
                </label>
                <input 
                  type="number" 
                  id="input-pages" 
                  class="form-input" 
                  value="${book.pages}" 
                  min="1" 
                  step="1"
                  placeholder="e.g., 432"
                  required 
                  aria-describedby="error-pages"
                />
                <div id="error-pages" class="form-error-msg" role="alert"></div>
              </div>

              <!-- Tag or Genre -->
              <div class="form-field">
                <label for="input-tag" class="form-label">
                  <span>Tag or Genre <span class="form-required-mark" aria-hidden="true">*</span></span>
                  <span class="form-hint">Rule 4: Words with hyphens or spaces</span>
                </label>
                <input 
                  type="text" 
                  id="input-tag" 
                  list="tags-datalist"
                  class="form-input" 
                  value="${SearchEngine.escapeHTML(book.tag)}" 
                  placeholder="e.g., Software Engineering"
                  required 
                  aria-describedby="error-tag"
                />
                <datalist id="tags-datalist">
                  ${uniqueGenres.map(g => `<option value="${SearchEngine.escapeHTML(g)}"></option>`).join('')}
                </datalist>
                <div id="error-tag" class="form-error-msg" role="alert"></div>
              </div>

              <!-- Date Added -->
              <div class="form-field">
                <label for="input-date" class="form-label">
                  <span>Date Added <span class="form-required-mark" aria-hidden="true">*</span></span>
                  <span class="form-hint">Rule 3: Valid YYYY-MM-DD date</span>
                </label>
                <input 
                  type="date" 
                  id="input-date" 
                  class="form-input" 
                  value="${book.dateAdded}" 
                  required 
                  aria-describedby="error-date"
                />
                <div id="error-date" class="form-error-msg" role="alert"></div>
              </div>

              <!-- Reading Status (Optional) -->
              <div class="form-field">
                <label for="input-status" class="form-label">
                  <span>Reading Status</span>
                  <span class="form-hint">Current progress state</span>
                </label>
                <select id="input-status" class="form-select">
                  <option value="To Read" ${book.status === 'To Read' ? 'selected' : ''}>To Read</option>
                  <option value="Reading" ${book.status === 'Reading' ? 'selected' : ''}>Reading</option>
                  <option value="Read" ${book.status === 'Read' ? 'selected' : ''}>Read</option>
                </select>
              </div>

              <!-- Rating (Optional) -->
              <div class="form-field">
                <label for="input-rating" class="form-label">
                  <span>Rating (1–5 Stars)</span>
                  <span class="form-hint">Personal assessment</span>
                </label>
                <select id="input-rating" class="form-select">
                  <option value="5" ${book.rating === 5 ? 'selected' : ''}>★★★★★ 5 Stars - Masterpiece</option>
                  <option value="4" ${book.rating === 4 ? 'selected' : ''}>★★★★☆ 4 Stars - Very Good</option>
                  <option value="3" ${book.rating === 3 ? 'selected' : ''}>★★★☆☆ 3 Stars - Average</option>
                  <option value="2" ${book.rating === 2 ? 'selected' : ''}>★★☆☆☆ 2 Stars - Subpar</option>
                  <option value="1" ${book.rating === 1 ? 'selected' : ''}>★☆☆☆☆ 1 Star - Poor</option>
                </select>
              </div>

              <!-- Notes / Key Takeaways -->
              <div class="form-field full-width">
                <label for="input-notes" class="form-label">
                  <span>Notes & Key Quotes</span>
                  <span class="form-hint">Optional summaries or reflections</span>
                </label>
                <textarea 
                  id="input-notes" 
                  class="form-textarea" 
                  rows="3" 
                  placeholder="Summarize main arguments, quotes, or study notes..."
                >${SearchEngine.escapeHTML(book.notes || '')}</textarea>
              </div>
            </div>

            <!-- Form Action Buttons -->
            <div class="form-actions-row">
              <button type="button" class="btn btn-secondary" id="btn-cancel-form">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" id="btn-save-book">
                ${ICONS.check} ${isEdit ? 'Update Book' : 'Save Book'}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  /**
   * Render Page 4: Settings & About
   */
  function renderSettingsAbout(state) {
    const { settings } = state;

    return `
      <div class="container">
        <!-- Page Header -->
        <div class="page-header-box">
          <div class="page-title-group">
            <h1>Settings & About</h1>
            <p class="page-subtitle">Configure application preferences, import/export records, and project documentation.</p>
          </div>
        </div>

        <div class="settings-about-layout">
          <!-- Left Column: Settings -->
          <section class="settings-card" aria-label="Application Settings">
            <h2 class="section-title">${ICONS.settings} Vault Settings</h2>

            <form id="settings-form" novalidate>
              <!-- Unit preference -->
              <div class="settings-group">
                <label for="setting-unit" class="form-label">
                  <span>Page-Count Unit Preference</span>
                </label>
                <select id="setting-unit" class="form-select">
                  <option value="Pages" ${settings.unit === 'Pages' ? 'selected' : ''}>Pages (Standard Print)</option>
                  <option value="Leaves" ${settings.unit === 'Leaves' ? 'selected' : ''}>Leaves (Folio / Manuscript)</option>
                  <option value="E-Pages" ${settings.unit === 'E-Pages' ? 'selected' : ''}>E-Pages (Digital Screen)</option>
                </select>
                <span class="form-hint">Used for displaying page totals and velocities.</span>
              </div>

              <!-- Numeric reading target -->
              <div class="settings-group">
                <label for="setting-target" class="form-label">
                  <span>Reading Goal Target</span>
                </label>
                <div style="display: flex; gap: 8px;">
                  <input 
                    type="number" 
                    id="setting-target" 
                    class="form-input" 
                    value="${settings.readingTarget}" 
                    min="1" 
                    max="100000"
                    style="flex: 2;"
                  />
                  <select id="setting-target-type" class="form-select" style="flex: 1;">
                    <option value="books" ${settings.targetType === 'books' ? 'selected' : ''}>Books</option>
                    <option value="pages" ${settings.targetType === 'pages' ? 'selected' : ''}>Pages</option>
                  </select>
                </div>
                <span class="form-hint">Set your yearly or quarterly reading milestone.</span>
              </div>

              <button type="submit" class="btn btn-primary" style="margin-top: 6px;">
                ${ICONS.check} Save Preferences
              </button>
            </form>

            <!-- Data Management -->
            <div class="settings-group" style="margin-top: 12px;">
              <h3 style="font-size: 0.95rem; margin-bottom: 6px;">Data & Storage (JSON)</h3>
              <p style="font-size: 0.82rem; color: var(--color-navy-muted);">
                Data is saved persistently to browser <code>localStorage</code>. You can back up or migrate records at any time.
              </p>

              <div class="data-actions-row">
                <button type="button" class="btn btn-secondary btn-sm" id="btn-export-json">
                  ${ICONS.download} Export JSON
                </button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-import-trigger">
                  ${ICONS.upload} Import JSON
                </button>
                <input type="file" id="file-import-input" accept=".json,application/json" class="visually-hidden" />
                <button type="button" class="btn btn-outline btn-sm" id="btn-reset-seed">
                  Reset to Seed Data
                </button>
              </div>
            </div>
          </section>

          <!-- Right Column: About -->
          <section class="about-card" aria-label="About Book and Notes Vault">
            <h2 class="section-title">${ICONS.info} About Book & Notes Vault</h2>

            <p style="font-size: 0.92rem; line-height: 1.6;">
              <strong>Book & Notes Vault</strong> is a minimalist, responsive personal library companion engineered to help students, researchers, and avid readers organize books, notes, genres, and track reading milestones.
            </p>

            <div style="background: var(--color-navy-soft-bg); border: var(--border-width) solid var(--color-navy); border-radius: var(--border-radius); padding: 14px;">
              <h4 style="font-size: 0.88rem; margin-bottom: 6px; color: var(--color-navy);">🎨 Wireframe Blueprint Architecture</h4>
              <ul style="font-size: 0.82rem; padding-left: 20px; line-height: 1.6; color: var(--color-navy-dark);">
                <li>Navy-blue wireframe outlines and white backgrounds for easy hand reproduction.</li>
                <li>Live regex search engine with case-insensitivity and syntax safety.</li>
                <li>Four validated fields adhering to strict regular expressions.</li>
                <li>Dual perspective simulation mode for desktop and mobile comparison.</li>
                <li>Pure Vanilla HTML5, CSS3, and ES6+ JavaScript.</li>
              </ul>
            </div>

            <div>
              <h4 style="font-size: 0.88rem; margin-bottom: 8px;">Contact & Project Resources:</h4>
              <div class="contact-links-list">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="contact-link-item">
                  <svg class="icon" viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  <span>GitHub Repository: github.com/student/book-notes-vault</span>
                </a>
                <a href="mailto:support@bookvault.example" class="contact-link-item">
                  <svg class="icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>Email: support@bookvault.example</span>
                </a>
                <a href="./tests.html" class="contact-link-item" style="border-style: dashed;">
                  <svg class="icon" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span>Run Automated Unit Tests (tests.html)</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  /**
   * Render Modals: Delete Confirmation, ISBN Extractor, Import Results
   */
  function renderModals() {
    return `
      <!-- Delete Confirmation Modal -->
      <div id="modal-delete" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-delete-title">
        <div class="modal-window">
          <div class="modal-header">
            <h3 id="modal-delete-title" class="modal-title">Delete Book Record</h3>
            <button type="button" class="btn btn-outline btn-sm btn-icon" id="btn-close-delete-modal" aria-label="Close modal">
              ${ICONS.close}
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong id="delete-book-title-display"></strong>?</p>
            <p style="font-size: 0.82rem; color: var(--color-navy-muted);">This action removes the record from your localStorage library and cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-cancel-delete">Cancel</button>
            <button type="button" class="btn btn-danger" id="btn-confirm-delete">Yes, Delete Record</button>
          </div>
        </div>
      </div>

      <!-- ISBN Extractor Helper Modal -->
      <div id="modal-isbn" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-isbn-title">
        <div class="modal-window" style="max-width: 600px;">
          <div class="modal-header">
            <h3 id="modal-isbn-title" class="modal-title">${ICONS.sparkles} Live Regex ISBN Extractor</h3>
            <button type="button" class="btn btn-outline btn-sm btn-icon" id="btn-close-isbn-modal" aria-label="Close modal">
              ${ICONS.close}
            </button>
          </div>
          <div class="modal-body">
            <p>Paste any book text, bibliographic citation, or barcode description below to extract valid <strong>ISBN-10</strong> or <strong>ISBN-13</strong> numbers via regular expressions.</p>
            <textarea id="isbn-input-text" class="form-textarea" rows="4" placeholder="Sample text: Robert Martin published Clean Architecture with ISBN-13: 978-0-13-449416-6 or older edition 0-13-449416-4..."></textarea>
            
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn btn-primary btn-sm" id="btn-run-isbn-extract">Extract ISBNs</button>
              <button type="button" class="btn btn-outline btn-sm" id="btn-isbn-paste-sample">Insert Sample Text</button>
            </div>

            <div id="isbn-results-box" style="margin-top: 8px; font-size: 0.85rem; border-top: 1px dashed var(--color-navy-subtle); padding-top: 8px;">
              <em>No ISBN extracted yet. Click "Extract ISBNs" above.</em>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" id="btn-done-isbn">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  return {
    ICONS,
    showToast,
    renderPerspectiveBar,
    renderHeader,
    renderMobileBottomNav,
    renderDashboard,
    renderCatalog,
    renderAddEditBook,
    renderSettingsAbout,
    renderModals
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UI;
} else if (typeof window !== 'undefined') {
  window.UI = UI;
}
