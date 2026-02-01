Career Compass AI

Career Compass AI is an AI-powered career guidance platform designed to help students discover suitable career paths based on their skills, interests, and assessments, while providing administrators with real-time analytics and management tools.
The platform is built using Flask, React, and MySQL with a clear separation of student and admin roles.

Key Features

Student Features
Secure login and registration
Skill-based career assessment
AI-generated career recommendations
Career readiness dashboard
Learning roadmaps and action plans
Resume analysis and ratings (extensible)
Job matching and opportunities (extensible)

Admin Features
Secure admin-only dashboard
Dynamic analytics fetched from MySQL
Total students, assessments, resumes, and job matches
Career distribution charts
View all students dynamically
CSV-based bulk student data support
Role-based access control
AI Logic (Current Phase)
Rule-based AI engine for career recommendations
Confidence score calculation
Designed to be extended with machine learning or LLM models
Tech Stack

Frontend
React with TypeScript
Vite
Tailwind CSS
shadcn/ui
Recharts for analytics
Framer Motion for animations

Backend
Flask
Flask-CORS
MySQL
REST APIs
Role-based access control
Database
MySQL
Normalized relational schema
Project Structure
careercompass-ai

backend

app.py
config.py
models
routes
services
utils
db

src
components
pages
admin
student
hooks
lib
main.tsx

public
package.json
tailwind.config.ts
README.md
.gitignore

How to Run Locally
Clone the repository
git clone https://github.com/BhavyThakar/careercompass-ai.git
cd careercompass-ai
Backend setup

cd backend
pip install -r requirements.txt
python app.py

Backend runs on http://localhost:5000

Frontend setup

npm install
npm run dev

Frontend runs on http://localhost:5173

Authentication and Roles

Student users can access only student pages

Admin users can access only admin pages

Backend enforces role-based access control

Unauthorized access returns 403 Forbidden

Admin Analytics

Admin dashboard fetches real-time data from MySQL including:

Total students

Total assessments

Resume uploads

Job matches

Career distribution charts

CSV Support

Supports bulk student data using CSV

CSV data is used for admin views and analytics

Designed for scalability

Security

Password hashing

Role-based API protection

node_modules excluded via .gitignore

No sensitive credentials committed

License

This project is licensed under the MIT License and is free to use, modify, and distribute.

Author

Bhavy Thakar
Career Compass AI

Future Enhancements

Machine learning-based career prediction

Resume parsing using NLP

Advanced recommendation tuning

Cloud deployment

Automated CSV-to-database pipeline
