/**
 * search.js - Regex search engine, text highlighting, filters, sorting & statistics
 * Book & Notes Vault
 */

const SearchEngine = (() => {
  /**
   * Escape HTML to prevent XSS during highlighted string injection
   */
  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Escape regex special characters for literal search
   */
  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Safely compile a regular expression with error reporting
   */
  function compileRegex(pattern, caseInsensitive = true) {
    if (!pattern || pattern.trim() === '') {
      return { regex: null, error: null };
    }
    try {
      const flags = caseInsensitive ? 'gi' : 'g';
      const regex = new RegExp(pattern, flags);
      return { regex, error: null };
    } catch (e) {
      return { regex: null, error: e.message };
    }
  }

  /**
   * Highlight matches inside text safely with HTML escape
   */
  function highlightText(text, query, isRegex = false, caseInsensitive = true) {
    if (!text) return '';
    const cleanText = String(text);
    if (!query || query.trim() === '') {
      return escapeHTML(cleanText);
    }

    try {
      let regex;
      if (isRegex) {
        const compiled = compileRegex(query, caseInsensitive);
        if (compiled.error || !compiled.regex) {
          return escapeHTML(cleanText);
        }
        regex = compiled.regex;
      } else {
        const escaped = escapeRegex(query.trim());
        regex = new RegExp(escaped, caseInsensitive ? 'gi' : 'g');
      }

      // Replace matches with <mark> tags
      const parts = [];
      let lastIndex = 0;
      let match;

      // Reset regex index
      regex.lastIndex = 0;

      while ((match = regex.exec(cleanText)) !== null) {
        // Prevent infinite loops on zero-length matches
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        const matchStart = match.index;
        const matchEnd = match.index + match[0].length;

        // Push text before match
        if (matchStart > lastIndex) {
          parts.push(escapeHTML(cleanText.slice(lastIndex, matchStart)));
        }

        // Push matched highlighted text
        parts.push(`<mark class="regex-highlight">${escapeHTML(match[0])}</mark>`);
        lastIndex = matchEnd;

        // If not global, break
        if (!regex.global) break;
      }

      // Push remaining text
      if (lastIndex < cleanText.length) {
        parts.push(escapeHTML(cleanText.slice(lastIndex)));
      }

      return parts.join('');
    } catch (e) {
      console.warn('Highlight failed:', e);
      return escapeHTML(cleanText);
    }
  }

  /**
   * Filter and sort books based on filter criteria
   */
  function filterAndSortBooks(books, options = {}) {
    const {
      query = '',
      isRegex = false,
      caseInsensitive = true,
      genre = 'All',
      rating = 'All',
      status = 'All',
      sortField = 'dateAdded',
      sortOrder = 'desc'
    } = options;

    let searchRegex = null;
    let searchError = null;

    if (query && query.trim() !== '') {
      if (isRegex) {
        const comp = compileRegex(query.trim(), caseInsensitive);
        searchRegex = comp.regex;
        searchError = comp.error;
      } else {
        const escaped = escapeRegex(query.trim());
        searchRegex = new RegExp(escaped, caseInsensitive ? 'i' : '');
      }
    }

    const filtered = books.filter(book => {
      // 1. Genre filter
      if (genre && genre !== 'All') {
        if (!book.tag || book.tag.toLowerCase() !== genre.toLowerCase()) {
          return false;
        }
      }

      // 2. Rating filter
      if (rating && rating !== 'All') {
        const minRating = parseInt(rating, 10);
        if (isNaN(minRating) || (book.rating || 0) < minRating) {
          return false;
        }
      }

      // 3. Status filter
      if (status && status !== 'All') {
        if (!book.status || book.status.toLowerCase() !== status.toLowerCase()) {
          return false;
        }
      }

      // 4. Query / Regex match
      if (searchRegex && !searchError) {
        const fields = [book.title, book.author, book.tag, book.notes || ''];
        const matched = fields.some(f => {
          if (!f) return false;
          searchRegex.lastIndex = 0;
          return searchRegex.test(f);
        });
        if (!matched) return false;
      }

      return true;
    });

    // Sort results
    const sorted = [...filtered].sort((a, b) => {
      let valA, valB;

      switch (sortField) {
        case 'title':
          valA = (a.title || '').toLowerCase();
          valB = (b.title || '').toLowerCase();
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

        case 'author':
          valA = (a.author || '').toLowerCase();
          valB = (b.author || '').toLowerCase();
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);

        case 'pages':
          valA = a.pages || 0;
          valB = b.pages || 0;
          return sortOrder === 'asc' ? valA - valB : valB - valA;

        case 'dateAdded':
        default:
          valA = new Date(a.dateAdded || 0).getTime();
          valB = new Date(b.dateAdded || 0).getTime();
          return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
    });

    return {
      results: sorted,
      totalMatches: sorted.length,
      searchError
    };
  }

  /**
   * Compute comprehensive dashboard statistics
   */
  function calculateStatistics(books, settings = {}) {
    const readingTarget = settings.readingTarget || 50;
    const targetType = settings.targetType || 'books'; // 'books' or 'pages'
    const unitLabel = settings.unit || 'Pages';

    const totalBooks = books.length;
    const totalPages = books.reduce((sum, b) => sum + (b.pages || 0), 0);

    const readBooks = books.filter(b => b.status === 'Read');
    const readingBooks = books.filter(b => b.status === 'Reading');
    const toReadBooks = books.filter(b => b.status === 'To Read');

    const totalBooksRead = readBooks.length;
    const currentReadPages = readBooks.reduce((sum, b) => sum + (b.pages || 0), 0);

    // Books added during the last seven days
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const addedLastSevenDays = books.filter(b => {
      if (!b.dateAdded) return false;
      const d = new Date(b.dateAdded);
      return d >= sevenDaysAgo && d <= now;
    }).length;

    // Most common tag or genre
    const tagCounts = {};
    books.forEach(b => {
      if (b.tag) {
        const t = b.tag.trim();
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    });

    let mostCommonTag = 'None';
    let maxTagCount = 0;
    Object.entries(tagCounts).forEach(([tag, count]) => {
      if (count > maxTagCount) {
        maxTagCount = count;
        mostCommonTag = tag;
      }
    });

    // Reading Goal Progress
    let goalCurrent = 0;
    let goalTarget = readingTarget;
    let goalPercent = 0;
    let remainingOrExceeded = '';

    if (targetType === 'pages') {
      goalCurrent = currentReadPages;
      goalPercent = goalTarget > 0 ? Math.min(100, Math.round((goalCurrent / goalTarget) * 100)) : 0;
      const diff = goalTarget - goalCurrent;
      if (diff > 0) {
        remainingOrExceeded = `${diff.toLocaleString()} ${unitLabel.toLowerCase()} remaining to reach target`;
      } else if (diff === 0) {
        remainingOrExceeded = `Target reached exactly!`;
      } else {
        remainingOrExceeded = `Target exceeded by ${Math.abs(diff).toLocaleString()} ${unitLabel.toLowerCase()}!`;
      }
    } else {
      // Books target
      goalCurrent = totalBooksRead;
      goalPercent = goalTarget > 0 ? Math.min(100, Math.round((goalCurrent / goalTarget) * 100)) : 0;
      const diff = goalTarget - goalCurrent;
      if (diff > 0) {
        remainingOrExceeded = `${diff} books remaining to reach target`;
      } else if (diff === 0) {
        remainingOrExceeded = `Goal accomplished! (100%)`;
      } else {
        remainingOrExceeded = `Goal exceeded by ${Math.abs(diff)} books!`;
      }
    }

    // Average Pages per Day estimation (based on books read or reading activity)
    // Formula: (Current Read Pages / 30) for a standard monthly reading rate estimate, or 0 if none
    const avgPagesPerDay = totalBooksRead > 0 ? Math.max(1, Math.round(currentReadPages / 30)) : 0;

    return {
      totalBooks,
      totalPages,
      totalBooksRead,
      currentlyReadingCount: readingBooks.length,
      toReadCount: toReadBooks.length,
      currentReadPages,
      addedLastSevenDays,
      mostCommonTag: maxTagCount > 0 ? `${mostCommonTag} (${maxTagCount})` : 'N/A',
      rawMostCommonTag: mostCommonTag,
      goalCurrent,
      goalTarget,
      goalPercent,
      remainingOrExceeded,
      targetType,
      unitLabel,
      avgPagesPerDay
    };
  }

  /**
   * Get unique list of genres / tags from books
   */
  function getUniqueGenres(books) {
    const set = new Set();
    books.forEach(b => {
      if (b.tag) set.add(b.tag.trim());
    });
    return Array.from(set).sort();
  }

  return {
    escapeHTML,
    compileRegex,
    highlightText,
    filterAndSortBooks,
    calculateStatistics,
    getUniqueGenres
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SearchEngine;
} else if (typeof window !== 'undefined') {
  window.SearchEngine = SearchEngine;
}
