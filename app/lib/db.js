import mysql from 'mysql2/promise';

const connectionPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodsite',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function executeQuery(query, params = []) {
  try {
    const [results] = await connectionPool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Database operation failed');
  }
}

// Content related queries
export async function getContentList(type = null, categoryId = null, languageCode = 'en') {
  const languageId = getLanguageIdFromCode(languageCode);
  
  let query = `
    SELECT 
      c.id, c.slug, c.type, c.thumbnail_url, c.video_url, c.category_id,
      ct.title, ct.summary
    FROM contents c
    LEFT JOIN content_translations ct ON c.id = ct.content_id AND ct.language_id = ?
    WHERE 1=1
  `;
  
  const params = [languageId];
  
  if (type) {
    query += ' AND c.type = ?';
    params.push(type);
  }
  
  if (categoryId) {
    query += ' AND c.category_id = ?';
    params.push(categoryId);
  }
  
  query += ' ORDER BY c.created_at DESC';
  
  return executeQuery(query, params);
}

export async function getContentBySlug(slug, languageCode = 'en') {
  const languageId = getLanguageIdFromCode(languageCode);
  
  const query = `
    SELECT 
      c.id, c.slug, c.type, c.thumbnail_url, c.video_url, c.category_id, c.author_id,
      ct.title, ct.summary, ct.body,
      u.username as author_name,
      cat.slug as category_slug,
      cat_t.name as category_name
    FROM contents c
    LEFT JOIN content_translations ct ON c.id = ct.content_id AND ct.language_id = ?
    LEFT JOIN users u ON c.author_id = u.id
    LEFT JOIN categories cat ON c.category_id = cat.id
    LEFT JOIN category_translations cat_t ON cat.id = cat_t.category_id AND cat_t.language_id = ?
    WHERE c.slug = ?
    LIMIT 1
  `;
  
  const results = await executeQuery(query, [languageId, languageId, slug]);
  return results[0] || null;
}

export async function getCategories(languageCode = 'en') {
  const languageId = getLanguageIdFromCode(languageCode);
  
  const query = `
    SELECT 
      c.id, c.slug,
      ct.name, ct.description
    FROM categories c
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.language_id = ?
    ORDER BY ct.name ASC
  `;
  
  return executeQuery(query, [languageId]);
}

export async function getCategoryBySlug(slug, languageCode = 'en') {
  const languageId = getLanguageIdFromCode(languageCode);
  
  const query = `
    SELECT 
      c.id, c.slug,
      ct.name, ct.description
    FROM categories c
    LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.language_id = ?
    WHERE c.slug = ?
    LIMIT 1
  `;
  
  const results = await executeQuery(query, [languageId, slug]);
  return results[0] || null;
}

export async function getRecipeDetails(contentId, languageCode = 'en') {
  // Get ingredients
  const ingredientsQuery = `
    SELECT name, quantity, step_order
    FROM ingredients
    WHERE content_id = ?
    ORDER BY step_order ASC
  `;
  
  // Get instructions
  const instructionsQuery = `
    SELECT step_order, description
    FROM instructions
    WHERE content_id = ?
    ORDER BY step_order ASC
  `;
  
  const ingredients = await executeQuery(ingredientsQuery, [contentId]);
  const instructions = await executeQuery(instructionsQuery, [contentId]);
  
  return {
    ingredients,
    instructions
  };
}

export async function getRelatedContent(contentId, categoryId, limit = 3, languageCode = 'en') {
  const languageId = getLanguageIdFromCode(languageCode);
  
  const query = `
    SELECT 
      c.id, c.slug, c.type, c.thumbnail_url,
      ct.title, ct.summary
    FROM contents c
    LEFT JOIN content_translations ct ON c.id = ct.content_id AND ct.language_id = ?
    WHERE c.category_id = ? AND c.id != ?
    ORDER BY RAND()
    LIMIT ?
  `;
  
  return executeQuery(query, [languageId, categoryId, contentId, limit]);
}

export async function getPopularContent(limit = 8, languageCode = 'en') {
  const languageId = getLanguageIdFromCode(languageCode);
  
  const query = `
    SELECT 
      c.id, c.slug, c.type, c.thumbnail_url,
      ct.title, ct.summary,
      COUNT(l.id) as like_count
    FROM contents c
    LEFT JOIN content_translations ct ON c.id = ct.content_id AND ct.language_id = ?
    LEFT JOIN likes l ON c.id = l.content_id
    GROUP BY c.id
    ORDER BY like_count DESC, c.created_at DESC
    LIMIT ?
  `;
  
  return executeQuery(query, [languageId, limit]);
}

// Helper function
function getLanguageIdFromCode(code) {
  const langMap = {
    'en': 2,
    'tr': 1,
    'ar': 3,
    'es': 4,
    'ru': 5
  };
  
  return langMap[code] || 2; // Default to English (2)
}

// Auth related functions
export async function getUserByEmail(email) {
  const query = `
    SELECT id, username, email, password_hash, role
    FROM users
    WHERE email = ?
    LIMIT 1
  `;
  
  const results = await executeQuery(query, [email]);
  return results[0] || null;
}

export async function getUserById(id) {
  const query = `
    SELECT id, username, email, role, created_at
    FROM users
    WHERE id = ?
    LIMIT 1
  `;
  
  const results = await executeQuery(query, [id]);
  return results[0] || null;
}