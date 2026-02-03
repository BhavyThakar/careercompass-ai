-- Insert queries for user data with Software AI interests
-- Run these queries in your MySQL database to populate data

-- Insert a user (replace with your actual user details)
INSERT INTO users (name, email, password, role) VALUES
('Your Name', 'your.email@example.com', 'hashed_password_here', 'user');

-- Get the user ID (replace with actual ID from above)
SET @user_id = LAST_INSERT_ID();

-- Insert assessments with high technical and logic scores (Software AI focus)
INSERT INTO assessments (user_id, technical_score, creativity_score, logic_score, communication_score, interest_domain, submitted_at) VALUES
(@user_id, 95, 85, 90, 80, 'Technology', NOW()),
(@user_id, 92, 88, 87, 82, 'AI/ML', NOW() - INTERVAL 30 DAY),
(@user_id, 98, 82, 95, 78, 'Software Development', NOW() - INTERVAL 60 DAY);

-- Get assessment IDs
SET @assessment_id1 = LAST_INSERT_ID();
SET @assessment_id2 = @assessment_id1 - 1;
SET @assessment_id3 = @assessment_id1 - 2;

-- Insert career recommendations based on Software AI interests
INSERT INTO career_recommendations (user_id, assessment_id, career_title, confidence_score, explanation) VALUES
(@user_id, @assessment_id1, 'Machine Learning Engineer', 95, 'Your exceptional technical skills (95/100) and strong logical thinking (90/100) make you an ideal candidate for machine learning engineering. Your interest in Technology aligns perfectly with AI/ML development.'),
(@user_id, @assessment_id1, 'Software Developer', 92, 'Your high technical proficiency and programming capabilities indicate strong potential in software development roles.'),
(@user_id, @assessment_id1, 'Data Scientist', 88, 'Your analytical mindset and technical background suggest excellent potential in data science and AI research.'),
(@user_id, @assessment_id2, 'AI Research Engineer', 90, 'Your consistent high scores in technical and logical domains, combined with AI/ML interest, point to research-oriented AI roles.'),
(@user_id, @assessment_id2, 'Full Stack Developer', 85, 'Your versatile technical skills and creativity make you suitable for full-stack development with AI integration.'),
(@user_id, @assessment_id3, 'DevOps Engineer', 82, 'Your technical expertise and logical approach would excel in DevOps and infrastructure automation.');

-- Insert system logs
INSERT INTO system_logs (action, performed_by) VALUES
('User assessment completed', @user_id),
('Career recommendations generated', @user_id),
('AI analysis performed', @user_id);

-- Verify the data
SELECT 'Users inserted:' as info, COUNT(*) as count FROM users WHERE id = @user_id;
SELECT 'Assessments inserted:' as info, COUNT(*) as count FROM assessments WHERE user_id = @user_id;
SELECT 'Recommendations inserted:' as info, COUNT(*) as count FROM career_recommendations WHERE user_id = @user_id;
