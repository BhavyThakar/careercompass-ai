-- Create resume settings tables for the Resume Settings page

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
