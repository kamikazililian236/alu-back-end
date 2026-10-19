/**
 * validators.js - Form validation rules, regex verification, and ISBN extraction
 * Book & Notes Vault
 */

const Validators = (() => {
  // Rule 1: Title and author must not have leading or trailing spaces or unintended repeated spaces
  // Regex: ^(?!\s)(?!.*\s{2,})(?!.*\s$).+$
  const NO_EXCESS_SPACES_REGEX = /^(?!\s)(?!.*\s{2,})(?!.*\s$).+$/;

  // Rule 2: Pages must be a valid non-negative integer
  const NON_NEGATIVE_INT_REGEX = /^\d+$/;

  // Rule 3: Date Added must follow YYYY-MM-DD format and represent a valid calendar date
  const DATE_FORMAT_REGEX = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

  // Rule 4: Tags must contain valid words separated by spaces or hyphens
  const VALID_TAG_REGEX = /^[A-Za-z0-9]+(?:[- ][A-Za-z0-9]+)*$/;

  // Rule 5: Advanced regex validation - detects repeated consecutive words (e.g., "Martin Martin" or "The The")
  const REPEATED_WORDS_REGEX = /\b(\w+)\s+\1\b/i;

  // ISBN extraction regex (supports ISBN-10 and ISBN-13 with optional dashes and ISBN prefix)
  const ISBN_REGEX = /(?:ISBN(?:-1[03])?:?\s*)?(97[89][- ]?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9]|[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9Xx])/gi;

  /**
   * Validate Title
   */
  function validateTitle(title) {
    if (!title || typeof title !== 'string' || title.length === 0) {
      return { valid: false, message: 'Book title is required.' };
    }
    if (title.length < 2) {
      return { valid: false, message: 'Title must be at least 2 characters long.' };
    }
    if (!NO_EXCESS_SPACES_REGEX.test(title)) {
      return {
        valid: false,
        message: 'Title must not have leading/trailing spaces or multiple consecutive spaces.'
      };
    }
    return { valid: true, message: '' };
  }

  /**
   * Validate Author
   */
  function validateAuthor(author) {
    if (!author || typeof author !== 'string' || author.length === 0) {
      return { valid: false, message: 'Author name is required.' };
    }
    if (author.length < 2) {
      return { valid: false, message: 'Author must be at least 2 characters long.' };
    }
    if (!NO_EXCESS_SPACES_REGEX.test(author)) {
      return {
        valid: false,
        message: 'Author must not have leading/trailing spaces or multiple consecutive spaces.'
      };
    }
    return { valid: true, message: '' };
  }

  /**
   * Validate Pages
   */
  function validatePages(pages) {
    if (pages === undefined || pages === null || String(pages).trim() === '') {
      return { valid: false, message: 'Number of pages is required.' };
    }
    const strVal = String(pages).trim();
    if (!NON_NEGATIVE_INT_REGEX.test(strVal)) {
      return { valid: false, message: 'Pages must be a valid non-negative whole number.' };
    }
    const num = parseInt(strVal, 10);
    if (num <= 0) {
      return { valid: false, message: 'Pages must be greater than zero.' };
    }
    if (num > 50000) {
      return { valid: false, message: 'Pages count cannot exceed 50,000.' };
    }
    return { valid: true, message: '' };
  }

  /**
   * Validate Date Added (YYYY-MM-DD format AND real calendar date validation)
   */
  function validateDate(dateStr) {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.trim() === '') {
      return { valid: false, message: 'Date added is required (YYYY-MM-DD).' };
    }
    const match = dateStr.trim().match(DATE_FORMAT_REGEX);
    if (!match) {
      return { valid: false, message: 'Date must be formatted as YYYY-MM-DD.' };
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    // Verify calendar date correctness (handles leap years, month boundaries)
    const dateObj = new Date(year, month - 1, day);
    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() !== month - 1 ||
      dateObj.getDate() !== day
    ) {
      return { valid: false, message: 'Invalid calendar date specified.' };
    }

    if (year < 1800 || year > 2100) {
      return { valid: false, message: 'Year must be between 1800 and 2100.' };
    }

    return { valid: true, message: '' };
  }

  /**
   * Validate Tag / Genre
   */
  function validateTag(tag) {
    if (!tag || typeof tag !== 'string' || tag.trim() === '') {
      return { valid: false, message: 'Tag or genre is required.' };
    }
    const clean = tag.trim();
    if (!VALID_TAG_REGEX.test(clean)) {
      return {
        valid: false,
        message: 'Tag must contain valid alphanumeric words separated only by single spaces or hyphens.'
      };
    }
    return { valid: true, message: '' };
  }

  /**
   * Advanced Rule: Check for repeated consecutive words
   */
  function detectRepeatedWords(text) {
    if (!text || typeof text !== 'string') return null;
    const match = text.match(REPEATED_WORDS_REGEX);
    if (match) {
      return `Potential duplicated word detected: "${match[1]}"`;
    }
    return null;
  }

  /**
   * Extract ISBN from arbitrary text using regex
   */
  function extractISBN(text) {
    if (!text || typeof text !== 'string') return [];
    const matches = [];
    let match;
    const regex = new RegExp(ISBN_REGEX.source, 'gi');
    while ((match = regex.exec(text)) !== null) {
      const cleanIsbn = match[1] ? match[1].replace(/[-\s]/g, '') : match[0].replace(/[-\s]/g, '');
      matches.push({
        raw: match[0],
        clean: cleanIsbn,
        type: cleanIsbn.length === 10 ? 'ISBN-10' : cleanIsbn.length === 13 ? 'ISBN-13' : 'ISBN'
      });
    }
    return matches;
  }

  /**
   * Comprehensive validation for book record
   */
  function validateBookRecord(data) {
    const errors = {};
    const titleCheck = validateTitle(data.title);
    if (!titleCheck.valid) errors.title = titleCheck.message;

    const authorCheck = validateAuthor(data.author);
    if (!authorCheck.valid) errors.author = authorCheck.message;

    const pagesCheck = validatePages(data.pages);
    if (!pagesCheck.valid) errors.pages = pagesCheck.message;

    const dateCheck = validateDate(data.dateAdded);
    if (!dateCheck.valid) errors.dateAdded = dateCheck.message;

    const tagCheck = validateTag(data.tag);
    if (!tagCheck.valid) errors.tag = tagCheck.message;

    // Check optional warnings (repeated words)
    const warnings = {};
    const titleRepeats = detectRepeatedWords(data.title);
    if (titleRepeats) warnings.title = titleRepeats;

    const authorRepeats = detectRepeatedWords(data.author);
    if (authorRepeats) warnings.author = authorRepeats;

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings
    };
  }

  return {
    validateTitle,
    validateAuthor,
    validatePages,
    validateDate,
    validateTag,
    detectRepeatedWords,
    extractISBN,
    validateBookRecord,
    NO_EXCESS_SPACES_REGEX,
    NON_NEGATIVE_INT_REGEX,
    DATE_FORMAT_REGEX,
    VALID_TAG_REGEX,
    REPEATED_WORDS_REGEX
  };
})();

// Export for module environments or window
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validators;
} else if (typeof window !== 'undefined') {
  window.Validators = Validators;
}
