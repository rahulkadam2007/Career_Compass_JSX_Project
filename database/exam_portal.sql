CREATE DATABASE IF NOT EXISTS exam_portal;
USE exam_portal;

CREATE TABLE IF NOT EXISTS users(
 id INT AUTO_INCREMENT PRIMARY KEY,
 fullname VARCHAR(100) NOT NULL,
 email VARCHAR(150) NOT NULL UNIQUE,
 password VARCHAR(255) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS career_path(
 career_id INT AUTO_INCREMENT PRIMARY KEY,
 career_name VARCHAR(150) NOT NULL,
 required_skills TEXT,
 education VARCHAR(255),
 salary_range VARCHAR(100),
 job_roles TEXT
);

CREATE TABLE IF NOT EXISTS quiz_log(
 quiz_id INT AUTO_INCREMENT PRIMARY KEY,
 user_id INT NOT NULL,
 score INT NOT NULL,
 total_questions INT NOT NULL,
 answers_json JSON,
 categories_json JSON,
 quiz_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO career_path(career_name,required_skills,education,salary_range,job_roles) VALUES
('Software Developer','Programming, Problem Solving, Database','BCA / BSc CS / BE / BTech','Varies','Web Developer, Software Engineer'),
('Data Analyst','SQL, Excel, Statistics, Data Visualization','BCA / BSc / BTech / Statistics','Varies','Data Analyst, BI Analyst'),
('UI/UX Designer','Creativity, Design Tools, User Research','Any relevant degree + portfolio','Varies','UI Designer, UX Designer'),
('Digital Marketing','Communication, Content, Analytics','Any degree + certifications','Varies','SEO, Social Media, Marketing'),
('Project Manager','Leadership, Planning, Communication','Any relevant degree + experience','Varies','Project Coordinator, Project Manager');