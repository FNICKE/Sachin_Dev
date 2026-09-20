const pool = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// Get all skills
const getAllSkills = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM skills ORDER BY category, sort_order ASC');
    return successResponse(res, rows);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Create skill
const createSkill = async (req, res) => {
  const { name, icon_url, category, level, sort_order } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO skills (name, icon_url, category, level, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, icon_url || '', category || 'other', level || 80, sort_order || 0]
    );
    return successResponse(res, { id: result.insertId, name }, 'Skill created successfully', 201);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Update skill
const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, icon_url, category, level, sort_order } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);
    if (rows.length === 0) return errorResponse(res, 'Skill not found', 404);

    const skill = rows[0];
    await pool.query(
      'UPDATE skills SET name = ?, icon_url = ?, category = ?, level = ?, sort_order = ? WHERE id = ?',
      [name || skill.name, icon_url || skill.icon_url, category || skill.category, level || skill.level, sort_order || skill.sort_order, id]
    );
    return successResponse(res, null, 'Skill updated successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM skills WHERE id = ?', [id]);
    return successResponse(res, null, 'Skill deleted successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

module.exports = { getAllSkills, createSkill, updateSkill, deleteSkill };
