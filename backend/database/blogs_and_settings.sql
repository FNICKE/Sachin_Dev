-- Blogs Table Implementation (Matching user schema)
CREATE TABLE IF NOT EXISTS blogs (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(320) NOT NULL UNIQUE,
    excerpt VARCHAR(500),
    content LONGTEXT,
    cover_url VARCHAR(500),
    tags LONGTEXT, -- JSON format recommended
    published TINYINT(1) DEFAULT 0,
    views INT(11) DEFAULT 0,
    read_time TINYINT(4) DEFAULT 5,
    published_at DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (title),
    INDEX (slug),
    INDEX (published),
    INDEX (published_at)
);

-- Site Settings Table for Resume
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial Resume Entry
INSERT INTO site_settings (setting_key, setting_value) 
VALUES ('resume_url', '') 
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;
