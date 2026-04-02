-- TaskMate Enhanced Demo Data SQL Dump (MySQL Compatible)
-- ---------------------------------------------------------

SET FOREIGN_KEY_CHECKS=0;

-- Database: taskmate_db
-- ---------------------------------------------------------

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS taskmate_db;
USE taskmate_db;

-- 1. Create Tables
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    hashed_password VARCHAR(256) NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    profile_picture VARCHAR(500),
    push_notifications BOOLEAN DEFAULT 1,
    location_reminders BOOLEAN DEFAULT 0,
    deadline_alerts BOOLEAN DEFAULT 1,
    location_services BOOLEAN DEFAULT 1,
    daily_reminder BOOLEAN DEFAULT 0,
    task_streak INT DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Personal',
    priority VARCHAR(10) DEFAULT 'medium',
    status VARCHAR(15) DEFAULT 'pending',
    due_date DATETIME,
    daily_reminder BOOLEAN DEFAULT 0,
    is_shared BOOLEAN DEFAULT 0,
    owner_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS task_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL UNIQUE,
    user_id INT NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    address VARCHAR(500),
    place_name VARCHAR(200),
    radius_meters FLOAT DEFAULT 500.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS team_memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'Member',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    task_id INT,
    type VARCHAR(20) DEFAULT 'system',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ai_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    query_type VARCHAR(50) DEFAULT 'general',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. Clear Existing Data
-- ---------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE ai_queries;
TRUNCATE TABLE notifications;
TRUNCATE TABLE team_memberships;
TRUNCATE TABLE teams;
TRUNCATE TABLE task_locations;
TRUNCATE TABLE tasks;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Demo Data Insertion (Using PLAIN TEXT Passwords for Demo)
-- ---------------------------------------------------------

INSERT INTO users (id, full_name, email, hashed_password, phone, bio, task_streak) VALUES 
(1, 'Rohith Developer', 'rohith@example.com', 'Password123!', '+91 9876543210', 'Primary developer for TaskMate.', 12),
(2, 'Alice Johnson', 'alice@team.com', 'Password123!', '+1 234567890', 'UI/UX Designer.', 5),
(3, 'Bob Smith', 'bob@team.com', 'Password123!', '+1 345678901', 'Backend Specialist.', 8),
(4, 'Charlie Brown', 'charlie@team.com', 'Password123!', '+1 456789012', 'QA Engineer.', 2);

-- Tasks for Rohith (User 1)
INSERT INTO tasks (id, title, description, category, priority, status, due_date, owner_id) VALUES 
(1, 'Finalize API Integration', 'Connect all screens to the FastAPI backend.', 'Dev', 'high', 'in_progress', DATE_ADD(NOW(), INTERVAL 2 HOUR), 1),
(2, 'Gym Workout', 'Morning cardio and strength training.', 'Health', 'medium', 'completed', DATE_SUB(NOW(), INTERVAL 1 DAY), 1),
(3, 'Buy Groceries', 'Milk, eggs, bread, and fruits.', 'Home', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 5 HOUR), 1),
(4, 'Team Sync Call', 'Discuss next sprint objectives.', 'Work', 'medium', 'pending', DATE_ADD(NOW(), INTERVAL 1 DAY), 1),
(5, 'Prepare Presentation', 'Create slides for the project demo.', 'Work', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 2 DAY), 1),
(6, 'Read Research Paper', 'Analyze AI suggestion algorithms.', 'Dev', 'low', 'pending', DATE_ADD(NOW(), INTERVAL 3 DAY), 1),
(7, 'Pay Electricity Bill', 'Must be done before Friday.', 'Personal', 'high', 'pending', DATE_ADD(NOW(), INTERVAL 12 HOUR), 1),
(8, 'Water Plants', 'Backyard garden needs attention.', 'Home', 'low', 'completed', DATE_SUB(NOW(), INTERVAL 4 HOUR), 1);

-- Locations
INSERT INTO task_locations (task_id, user_id, latitude, longitude, address, place_name) VALUES 
(1, 1, 13.0827, 80.2707, 'SIMATS Campus, Chennai', 'Development Lab'),
(3, 1, 13.0850, 80.2100, 'Green Supermarket, Anna Nagar', 'Supermarket'),
(2, 1, 13.0600, 80.2500, 'Gold Gym, Chennai Central', 'Gym');

-- Teams
INSERT INTO teams (id, name, description, created_by) VALUES 
(1, 'TaskMate Android Team', 'Main development group for the mobile app.', 1),
(2, 'Chennai AI Club', 'Hobbyist group for AI enthusiasts.', 1);

-- Team Memberships
INSERT INTO team_memberships (team_id, user_id, role) VALUES 
(1, 1, 'Project Lead'),
(1, 2, 'Designer'),
(1, 3, 'Backend developer'),
(1, 4, 'Tester'),
(2, 1, 'Founder'),
(2, 3, 'Moderator');

-- Notifications
INSERT INTO notifications (user_id, task_id, type, title, message, is_read) VALUES 
(1, 1, 'deadline', 'Upcoming Deadline', 'Finalize API Integration is due in 2 hours!', 0),
(1, 7, 'deadline', 'Bill Due', 'Pay Electricity Bill is due tonight.', 0),
(1, 3, 'location', 'Nearby Store', 'You are near Green Supermarket. Buy groceries!', 0),
(1, NULL, 'system', 'System Update', 'Version 1.0.2 is now available.', 1);

-- AI Queries
INSERT INTO ai_queries (user_id, query, response, query_type) VALUES 
(1, 'Show me my productivity stats.', 'You have completed 12 tasks this week. Your completion rate is 75%. Keep up the good work!', 'productivity'),
(1, 'How can I optimize my day?', 'You have 3 high-priority tasks due today. I recommend starting with "Finalize API Integration" as it requires the most focus.', 'optimize'),
(1, 'Suggest some health tasks.', 'Based on your history, you usually hit the gym in the mornings. How about a 30-minute meditation session this evening?', 'suggestions');

SET FOREIGN_KEY_CHECKS=1;
