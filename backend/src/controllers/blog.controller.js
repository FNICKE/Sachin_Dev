const pool = require('../config/database');
const cloudinary = require('../config/cloudinary');
const { createSlug } = require('../utils/slugify');
const { successResponse, errorResponse } = require('../utils/response');

// Get all blogs
const getAllBlogs = async (req, res) => {
  const { published } = req.query;
  let q = 'SELECT * FROM blogs';
  let params = [];

  if (published !== undefined) {
    q += ' WHERE published = ?';
    params.push(published === 'true' ? 1 : 0);
  }

  q += ' ORDER BY created_at DESC';

  try {
    const [rows] = await pool.query(q, params);
    const blogs = rows.map(blog => ({
      ...blog,
      tags: typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags
    }));
    return successResponse(res, blogs);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Get single blog by Slug (Public)
const getBlogBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE slug = ?', [slug]);
    if (rows.length === 0) return errorResponse(res, 'Blog not found', 404);

    const blog = rows[0];
    blog.tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags;

    // Increment views
    await pool.query('UPDATE blogs SET views = views + 1 WHERE id = ?', [blog.id]);

    return successResponse(res, blog);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Get single blog by ID (Admin)
const getById = async (req, res) => {
   const { id } = req.params;
   try {
     const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
     if (rows.length === 0) return errorResponse(res, 'Blog not found', 404);
     const blog = rows[0];
     blog.tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags;
     return successResponse(res, blog);
   } catch (error) {
     console.error(error);
     return errorResponse(res, 'Server error');
   }
};

// Create blog
const createBlog = async (req, res) => {
  const { title, excerpt, content, tags, published, read_time } = req.body;
  let cover_url = 'https://placehold.co/1200x630/020817/white?text=No+Cover';

  try {
    if (req.file) {
      cover_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const slug = createSlug(title);
    const tagsJson = typeof tags === 'string' ? tags : JSON.stringify(tags || []);
    const publishedAt = published ? new Date() : null;

    const [result] = await pool.query(
      'INSERT INTO blogs (title, slug, excerpt, content, cover_url, tags, published, read_time, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, excerpt, content, cover_url, tagsJson, published || 0, read_time || 5, publishedAt]
    );

    return successResponse(res, { id: result.insertId, title, slug }, 'Blog created successfully', 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Update blog
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, excerpt, content, tags, published, read_time } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM blogs WHERE id = ?', [id]);
    if (rows.length === 0) return errorResponse(res, 'Blog not found', 404);

    const blog = rows[0];
    let cover_url = blog.cover_url;
    if (req.file) {
      cover_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const slug = title ? createSlug(title) : blog.slug;
    const tagsJson = tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : blog.tags;
    const publishedAt = (published && !blog.published) ? new Date() : blog.published_at;

    await pool.query(
      'UPDATE blogs SET title = ?, slug = ?, excerpt = ?, content = ?, cover_url = ?, tags = ?, published = ?, read_time = ?, published_at = ? WHERE id = ?',
      [title || blog.title, slug, excerpt || blog.excerpt, content || blog.content, cover_url, tagsJson, published !== undefined ? published : blog.published, read_time || blog.read_time, publishedAt, id]
    );

    return successResponse(res, null, 'Blog updated successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    return successResponse(res, null, 'Blog deleted successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

module.exports = { getAllBlogs, getBySlug: getBlogBySlug, getById, createBlog, updateBlog, deleteBlog };
