const pool = require('../config/database');
const { createSlug } = require('../utils/slugify');
const { successResponse, errorResponse } = require('../utils/response');
const { storeImage } = require('../utils/mediaStorage');

// Get all projects with skills
const getAllProjects = async (req, res) => {
  try {
    const query = `
      SELECT
        p.*,
        CASE 
          WHEN COUNT(s.id) > 0 THEN 
            CONCAT(
              '[',
              GROUP_CONCAT(
                JSON_OBJECT(
                  'id',   s.id,
                  'name', s.name,
                  'level', s.level
                )
                ORDER BY s.sort_order ASC
                SEPARATOR ','
              ),
              ']'
            )
          ELSE '[]'
        END AS skills
      FROM projects p
      LEFT JOIN project_skills ps ON p.id = ps.project_id
      LEFT JOIN skills s ON ps.skill_id = s.id
      GROUP BY p.id
      ORDER BY p.sort_order ASC, p.created_at DESC
    `;
    const [rows] = await pool.query(query);
    
    // Parse JSON skills
    const projects = rows.map(row => ({
      ...row,
      skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills,
      tech_stack: typeof row.tech_stack === 'string' ? JSON.parse(row.tech_stack) : row.tech_stack
    }));

    return successResponse(res, projects);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Get single project by slug
const getProjectBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const query = `
      SELECT p.* FROM projects p WHERE p.slug = ?
    `;
    const [rows] = await pool.query(query, [slug]);

    if (rows.length === 0) return errorResponse(res, 'Project not found', 404);
    
    const project = rows[0];
    project.tech_stack = typeof project.tech_stack === 'string' ? JSON.parse(project.tech_stack) : project.tech_stack;

    // Get images
    const [images] = await pool.query('SELECT * FROM project_images WHERE project_id = ? ORDER BY sort_order ASC', [project.id]);
    project.images = images;

    // Get skills
    const [skills] = await pool.query(`
      SELECT s.* FROM skills s 
      JOIN project_skills ps ON s.id = ps.skill_id 
      WHERE ps.project_id = ?
    `, [project.id]);
    project.skills = skills;

    return successResponse(res, project);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Get single project by ID (Internal Admin)
const getById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows.length === 0) return errorResponse(res, 'Project not found', 404);
    
    const project = rows[0];
    project.tech_stack = typeof project.tech_stack === 'string' ? JSON.parse(project.tech_stack) : project.tech_stack;

    // Get skills
    const [skills] = await pool.query(`
      SELECT s.id FROM skills s 
      JOIN project_skills ps ON s.id = ps.skill_id 
      WHERE ps.project_id = ?
    `, [project.id]);
    project.skills = skills;

    return successResponse(res, project);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

// Create new project
const createProject = async (req, res) => {
  const { title, short_desc, description, live_url, github_url, tech_stack, category, status, featured, sort_order, skill_ids, thumbnail_url: selectedThumbnailUrl } = req.body;
  let thumbnail_url = selectedThumbnailUrl || 'https://placehold.co/600x400/020817/white?text=No+Image';

  try {
    if (req.file) {
      thumbnail_url = await storeImage(req.file, req, 'portfolio/projects');
    }

    const slug = createSlug(title);
    
    // Parse tech_stack if it's a string (it usually is when coming from FormData)
    let techStackJson = '[]';
    try {
      techStackJson = typeof tech_stack === 'string' ? tech_stack : JSON.stringify(tech_stack || []);
    } catch (e) { techStackJson = '[]'; }

    const [result] = await pool.query(
      'INSERT INTO projects (title, slug, short_desc, description, thumbnail_url, live_url, github_url, tech_stack, category, status, featured, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, slug, short_desc, description, thumbnail_url, live_url, github_url, techStackJson, category || 'fullstack', status || 'completed', featured || 0, sort_order || 0]
    );

    const projectId = result.insertId;

    // Handle polyfilled skill associations
    if (skill_ids) {
      try {
        const parsedSkillIds = typeof skill_ids === 'string' ? JSON.parse(skill_ids) : skill_ids;
        if (Array.isArray(parsedSkillIds)) {
          for (const skillId of parsedSkillIds) {
            await pool.query('INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)', [projectId, skillId]);
          }
        }
      } catch (skillErr) { console.error('Skill linking failed:', skillErr); }
    }

    return successResponse(res, { id: projectId, title, slug }, 'Project created successfully', 201);
  } catch (error) {
    console.error('Create Project Error:', error);
    return errorResponse(res, 'Project creation failed. ' + error.message);
  }
};

// Update project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, short_desc, description, live_url, github_url, tech_stack, category, status, featured, sort_order, skill_ids, thumbnail_url: selectedThumbnailUrl } = req.body;

  try {
    const [current] = await pool.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (current.length === 0) return errorResponse(res, 'Project not found', 404);

    let thumbnail_url = selectedThumbnailUrl || current[0].thumbnail_url;
    if (req.file) {
      thumbnail_url = await storeImage(req.file, req, 'portfolio/projects');
    }

    const slug = title ? createSlug(title) : current[0].slug;
    
    let techStackJson = current[0].tech_stack;
    if (tech_stack) {
      try {
         techStackJson = typeof tech_stack === 'string' ? tech_stack : JSON.stringify(tech_stack);
      } catch (e) {}
    }

    await pool.query(
      'UPDATE projects SET title = ?, slug = ?, short_desc = ?, description = ?, thumbnail_url = ?, live_url = ?, github_url = ?, tech_stack = ?, category = ?, status = ?, featured = ?, sort_order = ? WHERE id = ?',
      [
        title || current[0].title,
        slug,
        short_desc !== undefined ? short_desc : current[0].short_desc,
        description !== undefined ? description : current[0].description,
        thumbnail_url,
        live_url !== undefined ? live_url : current[0].live_url,
        github_url !== undefined ? github_url : current[0].github_url,
        techStackJson,
        category !== undefined ? category : current[0].category,
        status !== undefined ? status : current[0].status,
        featured !== undefined ? featured : current[0].featured,
        sort_order !== undefined ? sort_order : current[0].sort_order,
        id
      ]
    );

    // Update skills if provided
    if (skill_ids) {
      try {
        const parsedSkillIds = typeof skill_ids === 'string' ? JSON.parse(skill_ids) : skill_ids;
        if (Array.isArray(parsedSkillIds)) {
          await pool.query('DELETE FROM project_skills WHERE project_id = ?', [id]);
          for (const skillId of parsedSkillIds) {
            await pool.query('INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)', [id, skillId]);
          }
        }
      } catch (e) {}
    }

    return successResponse(res, null, 'Project updated successfully');
  } catch (error) {
    console.error('Update Project Error:', error);
    return errorResponse(res, 'Project update failed.');
  }
};

// Delete project
const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    return successResponse(res, null, 'Project deleted successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Server error');
  }
};

module.exports = { getAllProjects, getBySlug: getProjectBySlug, getById, createProject, updateProject, deleteProject };
