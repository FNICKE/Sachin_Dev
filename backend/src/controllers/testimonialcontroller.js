const pool = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');
const { storeImage } = require('../utils/mediaStorage');

// Client testimonials shown on the website (home page, and on a project's page
// when linked to that project). Managed from the admin panel.

let tableReady = null;
const ensureTable = () => {
  tableReady ||= pool
    .query(
      `CREATE TABLE IF NOT EXISTS testimonials (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        role VARCHAR(160) NOT NULL DEFAULT '',
        company VARCHAR(160) NOT NULL DEFAULT '',
        quote TEXT NOT NULL,
        avatar_url VARCHAR(500) NOT NULL DEFAULT '',
        rating TINYINT UNSIGNED NULL,
        project_id INT NULL,
        published TINYINT(1) NOT NULL DEFAULT 1,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB`
    )
    .catch((error) => {
      tableReady = null;
      throw error;
    });
  return tableReady;
};

const SELECT = `
  SELECT t.*, p.title AS project_title, p.slug AS project_slug
  FROM testimonials t
  LEFT JOIN projects p ON p.id = t.project_id`;

class ValidationError extends Error {}

const text = (value, max) => (value === undefined || value === null ? undefined : String(value).trim().slice(0, max));
const toBool = (value) => value === true || value === 1 || value === '1' || value === 'true' || value === 'on';

/** Reads the fields from a JSON or multipart body. `partial` allows leaving fields out (updates). */
function readFields(body, { partial }) {
  const fields = {};
  const name = text(body.name, 120);
  const quote = text(body.quote, 1200);

  if (name !== undefined || !partial) {
    if (!name) throw new ValidationError("Add the client's name.");
    fields.name = name;
  }
  if (quote !== undefined || !partial) {
    if (!quote || quote.length < 10) throw new ValidationError('The testimonial needs at least 10 characters.');
    fields.quote = quote;
  }
  for (const key of ['role', 'company']) {
    const value = text(body[key], 160);
    if (value !== undefined) fields[key] = value;
    else if (!partial) fields[key] = '';
  }
  if (body.rating !== undefined) {
    const rating = body.rating === '' || body.rating === null ? null : Number.parseInt(body.rating, 10);
    if (rating !== null && !(rating >= 1 && rating <= 5)) throw new ValidationError('Rating must be 1 to 5 stars (or empty).');
    fields.rating = rating;
  }
  if (body.project_id !== undefined) {
    const projectId = body.project_id === '' || body.project_id === null ? null : Number.parseInt(body.project_id, 10);
    fields.project_id = Number.isInteger(projectId) && projectId > 0 ? projectId : null;
  }
  if (body.published !== undefined) fields.published = toBool(body.published) ? 1 : 0;
  if (body.sort_order !== undefined) fields.sort_order = Number.parseInt(body.sort_order, 10) || 0;
  if (body.avatar_url !== undefined) fields.avatar_url = text(body.avatar_url, 500) || '';
  return fields;
}

const handleError = (res, error, fallback) => {
  if (error instanceof ValidationError) return errorResponse(res, error.message, 400);
  console.error(error);
  return errorResponse(res, error.expose ? error.message : fallback, error.status || 500);
};

// GET /api/testimonials — public: published testimonials, in display order.
const getTestimonials = async (req, res) => {
  try {
    await ensureTable();
    const [rows] = await pool.query(`${SELECT} WHERE t.published = 1 ORDER BY t.sort_order ASC, t.created_at DESC`);
    return successResponse(res, rows);
  } catch (error) {
    return handleError(res, error, 'Server error fetching testimonials');
  }
};

// GET /api/testimonials/all — admin: everything, including hidden ones.
const getAllTestimonials = async (req, res) => {
  try {
    await ensureTable();
    const [rows] = await pool.query(`${SELECT} ORDER BY t.sort_order ASC, t.created_at DESC`);
    return successResponse(res, rows);
  } catch (error) {
    return handleError(res, error, 'Server error fetching testimonials');
  }
};

// POST /api/testimonials — admin (multipart: optional "avatar" image).
const createTestimonial = async (req, res) => {
  try {
    await ensureTable();
    const fields = readFields(req.body, { partial: false });
    if (req.file) fields.avatar_url = await storeImage(req.file, req, 'portfolio/testimonials');

    const columns = Object.keys(fields);
    const [result] = await pool.query(
      `INSERT INTO testimonials (${columns.map((c) => `\`${c}\``).join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
      columns.map((c) => fields[c])
    );
    return successResponse(res, { id: result.insertId }, 'Testimonial added', 201);
  } catch (error) {
    return handleError(res, error, 'Server error saving the testimonial');
  }
};

// PUT /api/testimonials/:id — admin. Send remove_avatar=true to clear the photo.
const updateTestimonial = async (req, res) => {
  try {
    await ensureTable();
    const [rows] = await pool.query('SELECT id FROM testimonials WHERE id = ?', [req.params.id]);
    if (!rows.length) return errorResponse(res, 'Testimonial not found', 404);

    const fields = readFields(req.body, { partial: true });
    if (toBool(req.body.remove_avatar)) fields.avatar_url = '';
    if (req.file) fields.avatar_url = await storeImage(req.file, req, 'portfolio/testimonials');

    const columns = Object.keys(fields);
    if (columns.length) {
      await pool.query(
        `UPDATE testimonials SET ${columns.map((c) => `\`${c}\` = ?`).join(', ')} WHERE id = ?`,
        [...columns.map((c) => fields[c]), req.params.id]
      );
    }
    return successResponse(res, null, 'Testimonial updated');
  } catch (error) {
    return handleError(res, error, 'Server error saving the testimonial');
  }
};

// DELETE /api/testimonials/:id — admin.
const deleteTestimonial = async (req, res) => {
  try {
    await ensureTable();
    await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    return successResponse(res, null, 'Testimonial deleted');
  } catch (error) {
    return handleError(res, error, 'Server error deleting the testimonial');
  }
};

module.exports = {
  ensureTable,
  getTestimonials,
  getAllTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
