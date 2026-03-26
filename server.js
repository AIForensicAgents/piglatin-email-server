const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '1mb' }));

/**
 * Checks if a character is a vowel.
 * @param {string} char - A single character to check.
 * @returns {boolean} True if the character is a vowel.
 */
function isVowel(char) {
  return /^[aeiouAEIOU]$/.test(char);
}

/**
 * Checks if a character is a letter.
 * @param {string} char - A single character to check.
 * @returns {boolean} True if the character is a letter.
 */
function isLetter(char) {
  return /^[a-zA-Z]$/.test(char);
}

/**
 * Checks if a string is all uppercase.
 * @param {string} str - The string to check.
 * @returns {boolean} True if all letters in the string are uppercase.
 */
function isAllUpperCase(str) {
  const letters = str.replace(/[^a-zA-Z]/g, '');
  return letters.length > 0 && letters === letters.toUpperCase();
}

/**
 * Checks if a string starts with an uppercase letter (title case).
 * @param {string} str - The string to check.
 * @returns {boolean} True if the first letter is uppercase and not all letters are uppercase.
 */
function isTitleCase(str) {
  const letters = str.replace(/[^a-zA-Z]/g, '');
  if (letters.length === 0) return false;
  if (letters.length === 1) return letters[0] === letters[0].toUpperCase();
  return letters[0] === letters[0].toUpperCase() && !isAllUpperCase(str);
}

/**
 * Applies the original capitalization pattern to a new word.
 * @param {string} originalWord - The original word with capitalization to preserve.
 * @param {string} newWord - The new word to apply capitalization to.
 * @returns {string} The new word with appropriate capitalization applied.
 */
function applyCapitalization(originalWord, newWord) {
  const originalLetters = originalWord.replace(/[^a-zA-Z]/g, '');

  if (isAllUpperCase(originalLetters) && originalLetters.length > 1) {
    return newWord.toUpperCase();
  }

  if (isTitleCase(originalLetters)) {
    return newWord.charAt(0).toUpperCase() + newWord.slice(1).toLowerCase();
  }

  return newWord.toLowerCase();
}

/**
 * Converts a single English word to Pig Latin.
 *
 * Rules:
 * - Words starting with a vowel: add "yay" to the end (e.g., "apple" -> "appleyay")
 * - Words starting with a consonant cluster: move all leading consonants to the end
 *   and add "ay" (e.g., "string" -> "ingstray")
 * - Special handling for "qu" as a consonant cluster
 * - Preserves original capitalization pattern
 * - Preserves leading and trailing punctuation
 *
 * @param {string} word - The word to convert to Pig Latin.
 * @returns {string} The word converted to Pig Latin.
 *
 * @example
 * pigLatinWord("hello")    // "ellohay"
 * pigLatinWord("apple")    // "appleyay"
 * pigLatinWord("string")   // "ingstray"
 * pigLatinWord("Hello!")   // "Ellohay!"
 * pigLatinWord("HELLO")    // "ELLOHAY"
 * pigLatinWord("Queen")    // "Eenquay"
 */
function pigLatinWord(word) {
  if (!word || typeof word !== 'string') {
    return word || '';
  }

  // Separate leading punctuation
  let leadingPunct = '';
  let trailingPunct = '';
  let core = word;

  // Extract leading non-letter characters
  while (core.length > 0 && !isLetter(core[0])) {
    leadingPunct += core[0];
    core = core.slice(1);
  }

  // Extract trailing non-letter characters
  while (core.length > 0 && !isLetter(core[core.length - 1])) {
    trailingPunct = core[core.length - 1] + trailingPunct;
    core = core.slice(0, -1);
  }

  // If no letters remain, return the original
  if (core.length === 0) {
    return word;
  }

  // Check if the word contains only letters (with possible internal punctuation like apostrophes)
  // For simplicity, handle internal apostrophes as part of the word
  const lowerCore = core.toLowerCase();

  let pigWord;

  if (isVowel(lowerCore[0])) {
    // Starts with a vowel: add "yay" to the end
    pigWord = lowerCore + 'yay';
  } else {
    // Starts with a consonant: find the consonant cluster
    let consonantEnd = 0;

    while (consonantEnd < lowerCore.length && !isVowel(lowerCore[consonantEnd])) {
      consonantEnd++;

      // Special case: treat "qu" as a unit
      if (
        consonantEnd < lowerCore.length &&
        lowerCore[consonantEnd - 1] === 'q' &&
        lowerCore[consonantEnd] === 'u'
      ) {
        consonantEnd++;
      }
    }

    // If the entire word is consonants, just add "ay"
    if (consonantEnd >= lowerCore.length) {
      pigWord = lowerCore + 'ay';
    } else {
      const consonantCluster = lowerCore.slice(0, consonantEnd);
      const rest = lowerCore.slice(consonantEnd);
      pigWord = rest + consonantCluster + 'ay';
    }
  }

  // Apply original capitalization
  pigWord = applyCapitalization(core, pigWord);

  return leadingPunct + pigWord + trailingPunct;
}

/**
 * Converts a full sentence or block of text to Pig Latin while preserving
 * whitespace structure, line breaks, and punctuation.
 *
 * @param {string} text - The text to convert to Pig Latin.
 * @returns {string} The text with all words converted to Pig Latin.
 *
 * @example
 * pigLatinSentence("Hello, world!")        // "Ellohay, orldway!"
 * pigLatinSentence("This is a test.")      // "Isthay isyay ayay esttay."
 * pigLatinSentence("Line one\nLine two")   // "Inelay oneyay\nInelay otway"
 */
function pigLatinSentence(text) {
  if (!text || typeof text !== 'string') {
    return text || '';
  }

  // Split by whitespace while preserving the whitespace tokens
  // This regex splits into words and whitespace segments
  const tokens = text.split(/(\s+)/);

  const converted = tokens.map((token) => {
    // If the token is purely whitespace, preserve it
    if (/^\s+$/.test(token)) {
      return token;
    }

    // The token may contain multiple "words" joined by hyphens or other characters
    // Handle hyphenated words by splitting on hyphens
    if (token.includes('-')) {
      return token
        .split('-')
        .map((part) => pigLatinWord(part))
        .join('-');
    }

    return pigLatinWord(token);
  });

  return converted.join('');
}

/**
 * Request logging middleware.
 * Logs method, URL, and timestamp for every incoming request.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
}

app.use(requestLogger);

/**
 * Health check endpoint.
 * Returns the service status and current timestamp.
 *
 * @route GET /health
 * @returns {object} 200 - Health status response
 * @returns {string} status - "ok"
 * @returns {string} timestamp - ISO timestamp
 * @returns {number} uptime - Process uptime in seconds
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'pig-latin-email-server',
  });
});

/**
 * Incoming email webhook endpoint.
 * Accepts an email payload and returns the subject and body converted to Pig Latin.
 *
 * @route POST /incoming-email
 * @param {object} req.body - The email payload.
 * @param {string} req.body.from - Sender email address.
 * @param {string} req.body.to - Recipient email address.
 * @param {string} req.body.subject - Email subject line.
 * @param {string} req.body.body - Email body text.
 * @returns {object} 200 - Pig Latin converted email response
 * @returns {string} from - Original sender
 * @returns {string} to - Original recipient
 * @returns {string} originalSubject - Original subject line
 * @returns {string} originalBody - Original email body
 * @returns {string} pigLatinSubject - Subject converted to Pig Latin
 * @returns {string} pigLatinBody - Body converted to Pig Latin
 * @returns {string} processedAt - ISO timestamp of processing
 * @returns {object} 400 - Validation error if required fields are missing
 * @returns {object} 500 - Internal server error
 */
app.post('/incoming-email', (req, res) => {
  try {
    const { from, to, subject, body } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!from) missingFields.push('from');
    if (!to) missingFields.push('to');
    if (subject === undefined || subject === null) missingFields.push('subject');
    if (body === undefined || body === null) missingFields.push('body');

    if (missingFields.length > 0) {
      console.error(
        `[${new Date().toISOString()}] Validation error: missing fields: ${missingFields.join(', ')}`
      );
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields,
        required: ['from', 'to', 'subject', 'body'],
      });
    }

    // Ensure subject and body are strings
    const subjectStr = String(subject);
    const bodyStr = String(body);

    // Log incoming message
    console.log(`[${new Date().toISOString()}] Incoming email:`);
    console.log(`  From: ${from}`);
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subjectStr}`);
    console.log(`  Body: ${bodyStr.substring(0, 200)}${bodyStr.length > 200 ? '...' : ''}`);

    // Convert to Pig Latin
    const pigLatinSubject = pigLatinSentence(subjectStr);
    const pigLatinBody = pigLatinSentence(bodyStr);

    const response = {
      from,
      to,
      originalSubject: subjectStr,
      originalBody: bodyStr,
      pigLatinSubject,
      pigLatinBody,
      processedAt: new Date().toISOString(),
    };

    // Log outgoing message
    console.log(`[${new Date().toISOString()}] Outgoing (Pig Latin):`);
    console.log(`  Subject: ${pigLatinSubject}`);
    console.log(
      `  Body: ${pigLatinBody.substring(0, 200)}${pigLatinBody.length > 200 ? '...' : ''}`
    );

    return res.status(200).json(response);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error processing email:`, error.message);
    console.error(error.stack);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing the email',
    });
  }
});

/**
 * 404 handler for undefined routes.
 *
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
  });
});

/**
 * Global error handling middleware.
 *
 * @param {Error} err - The error that occurred.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @param {import('express').NextFunction} next - Express next function.
 */
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Unhandled error:`, err.message);
  console.error(err.stack);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid JSON in request body',
    });
  }

  return res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});

/**
 * Start the Express server.
 * Listens on the port specified by the PORT environment variable, or 3000 by default.
 */
const server = app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Pig Latin Email Server started`);
  console.log(`[${new Date().toISOString()}] Listening on port ${PORT}`);
  console.log(`[${new Date().toISOString()}] Health check: http://localhost:${PORT}/health`);
  console.log(
    `[${new Date().toISOString()}] Incoming email endpoint: POST http://localhost:${PORT}/incoming-email`
  );
});

/**
 * Graceful shutdown handler.
 * Closes the server and exits the process cleanly on SIGTERM or SIGINT.
 *
 * @param {string} signal - The signal that triggered the shutdown.
 */
function gracefulShutdown(signal) {
  console.log(`\n[${new Date().toISOString()}] Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] Server closed.`);
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error(`[${new Date().toISOString()}] Forced shutdown after timeout.`);
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Export for testing
module.exports = { app, server, pigLatinWord, pigLatinSentence };