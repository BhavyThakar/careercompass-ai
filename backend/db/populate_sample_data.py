import mysql.connector
from config import Config
import random
from datetime import datetime, timedelta

# Connect to database
db = mysql.connector.connect(**Config.DB_CONFIG)
cursor = db.cursor()

def populate_sample_data():
    try:
        # Check if data already exists
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        print(f"Current users in database: {user_count}")
        # For testing, always populate
        # if cursor.fetchone()[0] > 0:
        #     print("Sample data already exists. Skipping population.")
        #     return

        print("Populating sample data...")

        # Sample users
        users = [
            ("John Doe", "john@example.com", "hashed_password", "user"),
            ("Jane Smith", "jane@example.com", "hashed_password", "user"),
            ("Bob Johnson", "bob@example.com", "hashed_password", "user"),
            ("Alice Brown", "alice@example.com", "hashed_password", "user"),
            ("Charlie Wilson", "charlie@example.com", "hashed_password", "user"),
            ("Admin User", "admin@studentiq.com", "admin123", "admin"),
        ]

        # Insert users
        cursor.executemany(
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s)",
            users
        )
        db.commit()

        # Get user IDs
        cursor.execute("SELECT id FROM users WHERE role = 'user'")
        user_ids = [row[0] for row in cursor.fetchall()]

        # Sample assessments
        assessments = []
        for user_id in user_ids:
            # Create multiple assessments per user over time
            for i in range(random.randint(1, 3)):
                submitted_at = datetime.now() - timedelta(days=random.randint(0, 180))
                assessment = (
                    user_id,
                    random.randint(60, 100),  # technical_score
                    random.randint(60, 100),  # creativity_score
                    random.randint(60, 100),  # logic_score
                    random.randint(60, 100),  # communication_score
                    random.choice(["Technology", "Business", "Arts", "Science", "Healthcare"]),
                    submitted_at
                )
                assessments.append(assessment)

        cursor.executemany("""
            INSERT INTO assessments (user_id, technical_score, creativity_score, logic_score, communication_score, interest_domain, submitted_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, assessments)
        db.commit()

        # Get assessment IDs
        cursor.execute("SELECT id, user_id FROM assessments")
        assessment_data = cursor.fetchall()

        # Sample career recommendations
        careers = [
            "Software Developer", "Data Scientist", "Web Developer", "Cloud Engineer",
            "AI/ML Engineer", "DevOps Engineer", "Product Manager", "UX Designer",
            "Business Analyst", "Marketing Specialist", "Financial Analyst", "Teacher"
        ]

        recommendations = []
        for assessment_id, user_id in assessment_data:
            # Create 1-3 recommendations per assessment
            num_recos = random.randint(1, 3)
            selected_careers = random.sample(careers, num_recos)
            for career in selected_careers:
                recommendation = (
                    user_id,
                    assessment_id,
                    career,
                    random.randint(70, 100),  # confidence_score
                    f"Based on your assessment results, {career} appears to be a strong match for your skills and interests."
                )
                recommendations.append(recommendation)

        cursor.executemany("""
            INSERT INTO career_recommendations (user_id, assessment_id, career_title, confidence_score, explanation)
            VALUES (%s, %s, %s, %s, %s)
        """, recommendations)
        db.commit()

        # Sample system logs
        logs = [
            ("User registration", 1),
            ("Assessment submitted", 1),
            ("Career recommendations generated", 1),
            ("User login", 2),
            ("Assessment submitted", 2),
            ("Data export", 6),  # Admin action
        ]

        cursor.executemany("""
            INSERT INTO system_logs (action, performed_by)
            VALUES (%s, %s)
        """, logs)
        db.commit()

        print("Sample data populated successfully!")

    except Exception as e:
        print(f"Error populating sample data: {e}")
        db.rollback()
    finally:
        cursor.close()
        db.close()

if __name__ == "__main__":
    populate_sample_data()
