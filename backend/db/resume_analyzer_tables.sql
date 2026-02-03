-- Create resume analyzer tables

CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INT,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analysis_status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),

    CONSTRAINT fk_resume_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE resume_quality_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value INT CHECK (metric_value BETWEEN 0 AND 100),
    color VARCHAR(20) DEFAULT 'primary',

    CONSTRAINT fk_metric_resume
    FOREIGN KEY (resume_id)
    REFERENCES resumes(id)
    ON DELETE CASCADE
);

CREATE TABLE extracted_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    skill_level ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    verified BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_skill_resume
    FOREIGN KEY (resume_id)
    REFERENCES resumes(id)
    ON DELETE CASCADE
);

CREATE TABLE extracted_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies JSON,
    impact ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',

    CONSTRAINT fk_project_resume
    FOREIGN KEY (resume_id)
    REFERENCES resumes(id)
    ON DELETE CASCADE
);

CREATE TABLE improvement_suggestions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',

    CONSTRAINT fk_suggestion_resume
    FOREIGN KEY (resume_id)
    REFERENCES resumes(id)
    ON DELETE CASCADE
);

-- Insert sample data for demonstration
INSERT INTO resumes (user_id, filename, analysis_status, overall_score) VALUES
(1, 'john_doe_resume.pdf', 'completed', 75);

-- Insert quality metrics
INSERT INTO resume_quality_metrics (resume_id, metric_name, metric_value, color) VALUES
(1, 'Content Quality', 78, 'primary'),
(1, 'Keyword Optimization', 65, 'warning'),
(1, 'Format & Structure', 85, 'success'),
(1, 'ATS Compatibility', 72, 'primary');

-- Insert extracted skills
INSERT INTO extracted_skills (resume_id, skill_name, skill_level, verified) VALUES
(1, 'JavaScript', 'Advanced', true),
(1, 'Python', 'Intermediate', true),
(1, 'React', 'Advanced', true),
(1, 'Node.js', 'Intermediate', true),
(1, 'SQL', 'Intermediate', true),
(1, 'Git', 'Advanced', true),
(1, 'Docker', 'Beginner', false),
(1, 'AWS', 'Beginner', false);

-- Insert extracted projects
INSERT INTO extracted_projects (resume_id, title, description, technologies, impact) VALUES
(1, 'E-Commerce Platform', 'Full-stack web application with payment integration', '["React", "Node.js", "MongoDB"]', 'High'),
(1, 'Task Management App', 'Real-time collaborative task tracker', '["React", "Firebase"]', 'Medium'),
(1, 'Weather Dashboard', 'Weather data visualization tool', '["JavaScript", "API Integration"]', 'Low');

-- Insert improvement suggestions
INSERT INTO improvement_suggestions (resume_id, title, description, priority) VALUES
(1, 'Add Quantifiable Achievements', 'Include metrics like \'40% performance improvement\' or \'served 10k users\'', 'High'),
(1, 'Optimize Keywords', 'Add more industry-specific keywords for better ATS matching', 'High'),
(1, 'Expand Project Details', 'Describe your role and specific contributions in each project', 'Medium'),
(1, 'Add Certifications', 'Include relevant certifications to validate your skills', 'Low');
