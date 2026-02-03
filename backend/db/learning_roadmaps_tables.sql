-- Create learning roadmaps tables

CREATE TABLE learning_roadmaps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    roadmap_type ENUM('strength', 'improvement') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_roadmap_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

    UNIQUE KEY unique_user_roadmap (user_id, roadmap_type)
);

CREATE TABLE roadmap_phases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roadmap_id INT NOT NULL,
    phase_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(100),
    status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_phase_roadmap
    FOREIGN KEY (roadmap_id)
    REFERENCES learning_roadmaps(id)
    ON DELETE CASCADE
);

CREATE TABLE roadmap_milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phase_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    icon VARCHAR(50) DEFAULT 'Code',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_milestone_phase
    FOREIGN KEY (phase_id)
    REFERENCES roadmap_phases(id)
    ON DELETE CASCADE
);

-- Insert sample data for demonstration
INSERT INTO learning_roadmaps (user_id, roadmap_type, title, description) VALUES
(1, 'strength', 'Strength-Based Learning Path', 'Leverage your existing programming and problem-solving skills'),
(1, 'improvement', 'Improvement-Based Learning Path', 'Close learning gaps in Machine Learning');

-- Insert phases for strength-based roadmap
INSERT INTO roadmap_phases (roadmap_id, phase_order, title, duration, status) VALUES
(1, 1, 'Current', 'Ongoing', 'active'),
(1, 2, 'Month 1-2', '8 weeks', 'upcoming'),
(1, 3, 'Month 3-4', '8 weeks', 'upcoming'),
(1, 4, 'Month 5+', 'Ongoing', 'future');

-- Insert milestones for strength-based phases
INSERT INTO roadmap_milestones (phase_id, title, completed, icon) VALUES
(1, 'Advanced Data Structures', true, 'Code'),
(1, 'System Design Fundamentals', true, 'BookOpen'),
(1, 'Algorithm Optimization', false, 'Code'),
(2, 'Full-Stack Web Application', false, 'Code'),
(2, 'Open Source Contribution', false, 'Briefcase'),
(2, 'Technical Blog Posts', false, 'BookOpen'),
(3, 'Interview Preparation', false, 'Briefcase'),
(3, 'Networking Events', false, 'Briefcase'),
(3, 'Mock Interviews', false, 'Award'),
(4, 'Apply to Target Companies', false, 'Briefcase'),
(4, 'Negotiate Offers', false, 'Award'),
(4, 'Start New Role', false, 'Award');

-- Insert phases for improvement-based roadmap
INSERT INTO roadmap_phases (roadmap_id, phase_order, title, duration, status) VALUES
(2, 1, 'Week 1-4', '4 weeks', 'active'),
(2, 2, 'Week 5-8', '4 weeks', 'upcoming'),
(2, 3, 'Week 9-12', '4 weeks', 'upcoming'),
(2, 4, 'Week 13+', 'Ongoing', 'future');

-- Insert milestones for improvement-based phases
INSERT INTO roadmap_milestones (phase_id, title, completed, icon) VALUES
(5, 'Machine Learning Basics', false, 'BookOpen'),
(5, 'Python for ML Libraries', false, 'Code'),
(5, 'Statistics Refresher', false, 'BookOpen'),
(6, 'Kaggle Competitions', false, 'Code'),
(6, 'Mini ML Projects', false, 'Briefcase'),
(6, 'Model Evaluation', false, 'BookOpen'),
(7, 'Deep Learning Intro', false, 'Code'),
(7, 'Neural Networks', false, 'BookOpen'),
(7, 'End-to-End Project', false, 'Briefcase'),
(8, 'Choose ML Specialty', false, 'Award'),
(8, 'Advanced Certifications', false, 'Award'),
(8, 'Industry Projects', false, 'Briefcase');
