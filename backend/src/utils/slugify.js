const slugify = require('slugify');

const createSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true
  });
};

module.exports = { createSlug };
