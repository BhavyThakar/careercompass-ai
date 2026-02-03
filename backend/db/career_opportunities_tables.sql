-- Create career opportunities tables for Phase 2

-- Career Readiness Assessment
CREATE TABLE career_readiness (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    overall_readiness_score INT CHECK (overall_readiness_score BETWEEN 0 AND 100),
    skills_readiness INT CHECK (skills_readiness BETWEEN 0 AND 100),
    experience_readiness INT CHECK (experience_readiness BETWEEN 0 AND 100),
    network_readiness INT CHECK (network_readiness BETWEEN 0 AND 100),
    mindset_readiness INT CHECK (mindset_readiness BETWEEN 0 AND 100),
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_career_readiness_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Resume Ratings
CREATE TABLE resume_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resume_id INT,
    overall_rating DECIMAL(3,1) CHECK (overall_rating BETWEEN 0 AND 5),
    content_rating DECIMAL(3,1) CHECK (content_rating BETWEEN 0 AND 5),
    format_rating DECIMAL(3,1) CHECK (format_rating BETWEEN 0 AND 5),
    keywords_rating DECIMAL(3,1) CHECK (keywords_rating BETWEEN 0 AND 5),
    ats_compatibility_rating DECIMAL(3,1) CHECK (ats_compatibility_rating BETWEEN 0 AND 5),
    feedback TEXT,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resume_ratings_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_resume_ratings_resume
    FOREIGN KEY (resume_id)
    REFERENCES resumes(id)
    ON DELETE SET NULL
);

-- Nearby Opportunities
CREATE TABLE nearby_opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    location_name VARCHAR(255),
    search_radius_km INT DEFAULT 50,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_nearby_opportunities_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- Job Opportunities
CREATE TABLE job_opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    job_type ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance') DEFAULT 'full-time',
    experience_level ENUM('entry', 'mid', 'senior', 'executive') DEFAULT 'entry',
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    application_url VARCHAR(500),
    posted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    source VARCHAR(100) DEFAULT 'internal'
);

-- Job Matches
CREATE TABLE job_matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    match_score DECIMAL(5,2) CHECK (match_score BETWEEN 0 AND 100),
    skills_match DECIMAL(5,2) CHECK (skills_match BETWEEN 0 AND 100),
    experience_match DECIMAL(5,2) CHECK (experience_match BETWEEN 0 AND 100),
    location_match DECIMAL(5,2) CHECK (location_match BETWEEN 0 AND 100),
    salary_match DECIMAL(5,2) CHECK (salary_match BETWEEN 0 AND 100),
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_saved BOOLEAN DEFAULT FALSE,
    is_applied BOOLEAN DEFAULT FALSE,

    CONSTRAINT fk_job_matches_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    CONSTRAINT fk_job_matches_job
    FOREIGN KEY (job_id)
    REFERENCES job_opportunities(id)
    ON DELETE CASCADE,

    UNIQUE KEY unique_user_job_match (user_id, job_id)
);

-- Insert sample career readiness data
INSERT INTO career_readiness (user_id, overall_readiness_score, skills_readiness, experience_readiness, network_readiness, mindset_readiness) VALUES
(1, 75, 80, 70, 65, 85);

-- Insert sample resume ratings
INSERT INTO resume_ratings (user_id, resume_id, overall_rating, content_rating, format_rating, keywords_rating, ats_compatibility_rating, feedback) VALUES
(1, 1, 4.2, 4.5, 4.0, 4.0, 4.2, 'Strong technical background, consider adding more quantifiable achievements.');

-- Insert sample nearby opportunities
INSERT INTO nearby_opportunities (user_id, location_lat, location_lng, location_name, search_radius_km) VALUES
(1, 40.7128, -74.0060, 'New York, NY', 50);

-- Insert sample job opportunities
INSERT INTO job_opportunities (title, company, location, location_lat, location_lng, job_type, experience_level, salary_min, salary_max, description, requirements, benefits, application_url) VALUES
('Software Engineer', 'TechCorp Inc.', 'New York, NY', 40.7128, -74.0060, 'full-time', 'mid', 80000, 120000, 'Develop and maintain web applications using modern technologies.', '3+ years experience with React, Node.js, Python', 'Health insurance, 401k, remote work options', 'https://techcorp.com/careers/software-engineer'),
('Data Scientist', 'DataTech Solutions', 'San Francisco, CA', 37.7749, -122.4194, 'full-time', 'senior', 100000, 150000, 'Analyze large datasets and build predictive models.', '5+ years in data science, ML expertise', 'Stock options, flexible hours, learning budget', 'https://datatech.com/jobs/data-scientist'),
('Frontend Developer', 'StartupXYZ', 'Austin, TX', 30.2672, -97.7431, 'full-time', 'entry', 60000, 80000, 'Build responsive user interfaces.', '1+ years React experience', 'Equity package, casual environment', 'https://startupxyz.com/apply/frontend-dev');

-- Insert sample job matches
INSERT INTO job_matches (user_id, job_id, match_score, skills_match, experience_match, location_match, salary_match) VALUES
(1, 1, 85.5, 90.0, 80.0, 95.0, 70.0),
(1, 2, 78.2, 85.0, 75.0, 60.0, 80.0),
(1, 3, 92.1, 95.0, 85.0, 100.0, 75.0);
