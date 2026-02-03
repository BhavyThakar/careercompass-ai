CREATE DATABASE IF NOT EXISTS career_compass_ai;
USE career_compass_ai;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT * FROM users;

CREATE TABLE assessments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    technical_score INT CHECK (technical_score BETWEEN 0 AND 100),
    creativity_score INT CHECK (creativity_score BETWEEN 0 AND 100),
    logic_score INT CHECK (logic_score BETWEEN 0 AND 100),
    communication_score INT CHECK (communication_score BETWEEN 0 AND 100),
    interest_domain VARCHAR(100),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_assessment_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

SELECT * FROM assessments;
SELECT * FROM assessments WHERE user_id = 1;

CREATE TABLE career_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    assessment_id INT NOT NULL,
    career_title VARCHAR(120),
    confidence_score INT CHECK (confidence_score BETWEEN 0 AND 100),
    explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_reco_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_reco_assessment
    FOREIGN KEY (assessment_id)
    REFERENCES assessments(id)
    ON DELETE CASCADE
);
SELECT * FROM career_recommendations;
SELECT * FROM career_recommendations WHERE user_id = 1;

CREATE TABLE system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255),
    performed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_logs_user
    FOREIGN KEY (performed_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);
SELECT * FROM system_logs;

CREATE TABLE resume_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE scoring_criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    criteria_name VARCHAR(100) NOT NULL UNIQUE,
    weight INT NOT NULL CHECK (weight BETWEEN 0 AND 100),
    required BOOLEAN DEFAULT FALSE,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE resume_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    downloads INT DEFAULT 0,
    template_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default resume settings
INSERT INTO resume_settings (setting_key, setting_value, setting_type, description) VALUES
('max_file_size', '5', 'number', 'Maximum file size in MB'),
('allowed_formats', '["PDF","DOC","DOCX"]', 'json', 'Allowed file formats'),
('auto_analysis', 'true', 'boolean', 'Automatically analyze resumes upon upload'),
('email_notifications', 'true', 'boolean', 'Send email notifications for analysis completion'),
('analysis_timeout', '30', 'number', 'Analysis timeout in seconds');

-- Insert default scoring criteria
INSERT INTO scoring_criteria (criteria_name, weight, required, description) VALUES
('keywords', 30, true, 'Keyword matching in resume'),
('experience', 25, true, 'Work experience evaluation'),
('education', 20, true, 'Education background check'),
('skills', 15, false, 'Technical skills assessment'),
('projects', 10, false, 'Project portfolio evaluation');

-- Insert default resume templates
INSERT INTO resume_templates (name, active, downloads) VALUES
('Standard Template', true, 245),
('Tech Template', true, 189),
('Creative Template', false, 67);

SELECT u.name, a.*
FROM users u
JOIN assessments a ON u.id = a.user_id;

SELECT 
    u.name,
    a.technical_score,
    a.creativity_score,
    a.logic_score,
    r.career_title,
    r.confidence_score
FROM users u
JOIN assessments a ON u.id = a.user_id
JOIN career_recommendations r ON a.id = r.assessment_id;