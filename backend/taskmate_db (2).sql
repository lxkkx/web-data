-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 02, 2026 at 05:56 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskmate_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_queries`
--

CREATE TABLE `ai_queries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `query` text NOT NULL,
  `response` text NOT NULL,
  `query_type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ai_queries`
--

INSERT INTO `ai_queries` (`id`, `user_id`, `query`, `response`, `query_type`, `created_at`) VALUES
(1, 1, 'Show me my productivity stats.', 'You have completed 12 tasks this week. Your completion rate is 75%. Keep up the good work!', 'productivity', '2026-03-19 14:22:06'),
(2, 1, 'How can I optimize my day?', 'You have 3 high-priority tasks due today. I recommend starting with \'Finalize API Integration\'.', 'optimize', '2026-03-19 14:22:06'),
(3, 5, 'Help me optimize my task schedule for today', 'Hi Soda Likitha ! You\'re all caught up on high-priority tasks. Great work! 🎉', 'help me optimize my task schedule for today', '2026-03-19 14:47:56'),
(4, 1, 'hii', 'Hi Rohith Developer! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-20 15:01:13'),
(5, 5, 'Help me optimize my task schedule for today', 'Hi Likki! You\'re all caught up on high-priority tasks. Great work! 🎉', 'help me optimize my task schedule for today', '2026-03-23 08:48:49'),
(6, 5, 'Help me optimize my task schedule for today', 'Hi Likki! You\'re all caught up on high-priority tasks. Great work! 🎉', 'general', '2026-03-23 08:48:50'),
(7, 5, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Likki:\n\n1. 📋 You have 1 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'suggest new tasks based on my productivity pattern', '2026-03-23 09:01:31'),
(8, 5, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Likki:\n\n1. 📋 You have 1 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'general', '2026-03-23 09:01:41'),
(9, 5, 'Analyze my work-life balance for this week', 'Hi lxkkx! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-23 09:44:11'),
(10, 6, 'Help me optimize my task schedule for today', 'Hi t1! You\'re all caught up on high-priority tasks. Great work! 🎉', 'help me optimize my task schedule for today', '2026-03-23 15:29:38'),
(11, 6, 'Help me optimize my task schedule for today', 'Hi t1! You\'re all caught up on high-priority tasks. Great work! 🎉', 'general', '2026-03-23 15:30:02'),
(12, 6, '45', 'Hi t1! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-23 15:30:17'),
(13, 6, 'vinay birthday day 23/03/2026 ', 'Hi t1! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-23 15:32:25'),
(14, 6, 'take the task vinay birthday party today ', 'Hi t1! You\'re all caught up on high-priority tasks. Great work! 🎉', 'general', '2026-03-23 15:33:19'),
(15, 6, 'hii', 'Hi t1! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-23 15:57:20'),
(16, 6, 'behenjeej', 'Hi t1! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-23 15:57:44'),
(17, 6, 'what\'s task for today', 'Hi t1! You\'re all caught up on high-priority tasks. Great work! 🎉', 'general', '2026-03-23 15:58:57'),
(18, 6, 'b jpejsnsobj', 'Hi t1! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-23 15:59:42'),
(19, 9, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, soda Likitha :\n\n1. 📋 You have 5 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'suggest new tasks based on my productivity pattern', '2026-03-24 14:32:46'),
(20, 9, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, soda Likitha :\n\n1. 📋 You have 5 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'general', '2026-03-24 14:32:56'),
(21, 9, 'what are the pending tasks', 'Hi soda Likitha ! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-24 14:33:04'),
(22, 9, 'any deadlines today ?', 'Hi soda Likitha ! You have 5 tasks remaining. Here are your upcoming tasks:\n\n• chh (Due: Mar 24)\n• n dhakti (Due: Mar 20)\n• full (Due: Mar 22)\n• DD (Due: Mar 10)\n• dusra (Due: Mar 25)', 'general', '2026-03-24 14:40:39'),
(23, 9, 'what tasks are left', 'Hi soda Likitha ! You have 5 tasks remaining. Here are your upcoming tasks:\n\n• chh (Due: Mar 24)\n• n dhakti (Due: Mar 20)\n• full (Due: Mar 22)\n• DD (Due: Mar 10)\n• dusra (Due: Mar 25)', 'general', '2026-03-24 14:40:54'),
(24, 9, 'don\'t show for previous tasks', 'Hi soda Likitha ! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-24 14:41:15'),
(25, 9, 'what tasks are left', 'Hi soda Likitha ! You have 2 tasks remaining. Here are your upcoming tasks:\n\n• chh (Due: Mar 24)\n• dusra (Due: Mar 25)', 'general', '2026-03-24 14:44:30'),
(26, 5, 'pending tasks', 'Hi Likki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-27 12:50:19'),
(27, 5, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Likki:\n\n1. 📋 You have 1 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'suggest new tasks based on my productivity pattern', '2026-03-27 12:50:50'),
(28, 5, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Likki:\n\n1. 📋 You have 1 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'general', '2026-03-27 12:50:51'),
(29, 5, 'pending taks', 'Hi Likki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-28 09:17:30'),
(30, 5, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Likki:\n\n1. 📋 You have 0 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'suggest new tasks based on my productivity pattern', '2026-03-28 09:17:48'),
(31, 5, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Likki:\n\n1. 📋 You have 0 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'general', '2026-03-28 09:17:50'),
(32, 5, 'hi', 'Hi Likki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-28 09:21:54'),
(33, 5, 'pending tasks', 'Hi Likki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-28 09:22:01'),
(34, 5, 'provide productivity insights', '📊 Your Productivity Insights:\n\n• Total tasks: 1\n• Completed: 0\n• Completion rate: 0.0%\n• Pending: 1\n\n💪 Keep pushing, you can do it!', 'general', '2026-03-28 09:22:33'),
(35, 5, 'dlete the pending tasks', 'Hi Likki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-28 09:23:37'),
(36, 5, 'create a task', 'I heard your request! To create a task via voice, say:\n\"Create task [title] due [date] with priority [high/medium/low]\"\n\nFor example: \"Create task Buy groceries due tomorrow with priority high\"', 'general', '2026-03-28 09:26:36'),
(37, 5, 'no voice command', 'Hi Likki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-28 09:26:58'),
(38, 5, 'dlete the pending tasks', 'Hi Likki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-03-28 09:28:43'),
(39, 5, 'Help me optimize my task schedule for today', 'Hi Llikki! You have 5 tasks remaining. Here are your upcoming tasks:\n\n• vinayy birthday  (Due: Mar 23)\n• chhuk (Due: Mar 24)\n• hi (Due: Mar 27)\n• driver (Due: Mar 27)\n• fuff gun (Due: Mar 28)', 'help me optimize my task schedule for today', '2026-03-28 09:30:52'),
(40, 5, 'Help me optimize my task schedule for today', 'Hi Llikki! You have 5 tasks remaining. Here are your upcoming tasks:\n\n• vinayy birthday  (Due: Mar 23)\n• chhuk (Due: Mar 24)\n• hi (Due: Mar 27)\n• driver (Due: Mar 27)\n• fuff gun (Due: Mar 28)', 'general', '2026-03-28 09:30:56'),
(41, 5, 'create a task', 'Hi Llikki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n\nHow can I help you today?', 'general', '2026-03-28 09:31:30'),
(42, 5, 'create a task', 'Hi Llikki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n\nHow can I help you today?', 'general', '2026-03-28 09:31:39'),
(43, 5, 'create a task', 'Hi Llikki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n\nHow can I help you today?', 'general', '2026-03-28 09:33:21'),
(44, 5, 'create a new task to buy groceries ', 'Hi Llikki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n\nHow can I help you today?', 'general', '2026-03-28 09:35:02'),
(45, 5, 'create a new task to buy ge ', 'Hi Llikki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n\nHow can I help you today?', 'general', '2026-03-28 09:35:38'),
(46, 5, 'delete the pending tasks', 'Hi Llikki! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n\nHow can I help you today?', 'general', '2026-03-28 09:35:50'),
(47, 5, 'optimize your daily schedule ', 'Hi Llikki! You have 4 tasks remaining. Here are your upcoming tasks:\n\n• yftghijk (Due: Mar 30)\n• hgchgbjnbkjnm (Due: Mar 30)\n• hgvhiujhoi (Due: Mar 30)\n• tiffin (Due: Apr 01)', 'general', '2026-04-01 12:27:25'),
(48, 5, 'alert you about deadline risks', '⚠️ DEADLINE RISK ALERT\n\nYou have 4 overdue task(s). Immediate action needed!\n• yftghijk\n• hgchgbjnbkjnm\n• hgvhiujhoi\n• tiffin', 'general', '2026-04-01 12:43:19'),
(49, 13, 'Help me optimize my task schedule for today', 'Hi Ramcharan! You\'re all caught up on high-priority tasks. Great work! 🎉', 'optimize', '2026-04-01 14:16:41'),
(50, 13, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Ramcharan:\n\n1. 📋 You have 1 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'suggestions', '2026-04-01 14:16:50'),
(51, 13, 'Analyze my upcoming goals for this month', 'Hi Ramcharan! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-04-01 14:17:02'),
(52, 13, 'test', 'Hi Ramcharan! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-04-01 14:17:46'),
(53, 13, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Ramcharan:\n\n1. 📋 You have 1 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'suggestions', '2026-04-01 14:18:18'),
(54, 13, 'Suggest new tasks based on my productivity pattern', 'Here are my suggestions for you, Ramcharan:\n\n1. 📋 You have 1 pending tasks. Try to complete 3 today.\n2. ⏰ Set reminders 30 minutes before due times.\n3. 🏃 Break large tasks into smaller sub-tasks.\n4. 🤝 Consider delegating lower-priority tasks to your team.\nWould you like tips on any specific task?', 'suggestions', '2026-04-01 14:18:26'),
(55, 13, 'Analyze my upcoming goals for this month', 'Hi Ramcharan! I\'m your TaskMate AI assistant. I can help you:\n\n• 🗓️ Optimize your daily schedule\n• 🔁 Reschedule overdue tasks\n• 💡 Provide productivity insights\n• ⚠️ Alert you about deadline risks\n• 🎙️ Create tasks via voice command\n\nHow can I help you today?', 'general', '2026-04-01 14:18:31');

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `team_id`, `user_id`, `message`, `created_at`) VALUES
(1, 3, 5, 'Hi', '2026-03-23 08:49:00'),
(2, 3, 5, 'gff', '2026-03-23 15:50:36');

-- --------------------------------------------------------

--
-- Table structure for table `invite_tokens`
--

CREATE TABLE `invite_tokens` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `token` varchar(256) NOT NULL,
  `is_used` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invite_tokens`
--

INSERT INTO `invite_tokens` (`id`, `team_id`, `email`, `token`, `is_used`, `created_at`, `expires_at`) VALUES
(1, 3, 'pavigoud29@gmail.com', '5sFaeoZofZRMwbDR8XZjjjhhSohYKtVlxzzWBdmCs_c', 0, '2026-03-20 10:13:43', '2026-03-27 04:43:43'),
(2, 3, 'shaikmasoodsk67@gmail.com', 'DEYHMHZ', 0, '2026-03-23 10:53:38', '2026-03-30 05:23:38'),
(3, 5, 'tejaswibodapati19@gmail.com', 'MQogehkm6R5TT-ySwoTzuHvhldpERkY0wuUPaCwTJcQ', 0, '2026-03-24 14:46:14', '2026-03-31 09:16:14'),
(4, 3, 'masoodsk89@gmail.com', '1s7fPrBkU-0me4Ahj3PVDU1mGl_47e5Q_wZW41GGTOk', 0, '2026-03-27 13:34:21', '2026-04-03 08:04:21'),
(5, 3, 'shaikmasoodsk67@gmail.com', 'Q2CCmJR0adjFzJH5-PDfmQ_2_MUQxYd3qXV9KlvuBRI', 0, '2026-03-27 13:35:39', '2026-04-03 08:05:39');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `type` enum('deadline','location','assignment','completion','system') DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `task_id`, `type`, `title`, `message`, `is_read`, `created_at`) VALUES
(1, 1, NULL, 'deadline', 'Upcoming Deadline', 'Finalize API Integration is due in 2 hours!', 1, '2026-03-19 14:22:06'),
(2, 1, NULL, 'location', 'Nearby Store', 'You are near Green Supermarket. Buy groceries!', 1, '2026-03-19 14:22:06'),
(3, 5, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi Soda Likitha ! Start by creating your first task.', 1, '2026-03-19 14:45:34'),
(5, 6, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi t1! Start by creating your first task.', 1, '2026-03-23 15:28:14'),
(6, 7, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi chup! Start by creating your first task.', 0, '2026-03-24 13:44:26'),
(7, 8, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi soda fhf fbj! Start by creating your first task.', 1, '2026-03-24 14:05:25'),
(8, 9, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi soda Likitha ! Start by creating your first task.', 0, '2026-03-24 14:11:57'),
(12, 10, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi soda Likitha ! Start by creating your first task.', 0, '2026-03-28 09:48:07'),
(13, 11, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi Test User! Start by creating your first task.', 0, '2026-03-28 13:54:47'),
(14, 12, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi Test User! Start by creating your first task.', 1, '2026-03-30 09:31:37'),
(15, 5, 38, 'system', 'Task Created Successfully', 'You added a new task: \"tiffin\"', 1, '2026-04-01 12:25:46'),
(16, 5, 36, 'assignment', 'New task assigned', 'Llikki assigned you to \"hgvhiujhoi\"', 1, '2026-04-01 12:26:40'),
(17, 5, 39, 'system', 'Task Created Successfully', 'You added a new task: \"chh chaudh\"', 1, '2026-04-01 13:28:51'),
(18, 13, NULL, 'system', 'Welcome to TaskMate! 🎉', 'Hi Ramcharan! Start by creating your first task.', 0, '2026-04-01 14:13:51');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_codes`
--

CREATE TABLE `password_reset_codes` (
  `id` int(11) NOT NULL,
  `email` varchar(150) NOT NULL,
  `code` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `priority` enum('low','medium','high') DEFAULT NULL,
  `status` enum('pending','in_progress','completed') DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `daily_reminder` tinyint(1) DEFAULT NULL,
  `is_shared` tinyint(1) DEFAULT NULL,
  `owner_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `category`, `priority`, `status`, `due_date`, `daily_reminder`, `is_shared`, `owner_id`, `created_at`, `updated_at`) VALUES
(1, 'Finalize API Integration', 'Connect all screens to the FastAPI backend.', 'Dev', 'high', 'in_progress', '2026-03-19 10:52:06', 0, 0, 1, '2026-03-19 14:22:06', NULL),
(2, 'Gym Workout', 'Morning cardio and strength training.', 'Health', 'medium', 'completed', '2026-03-18 08:52:06', 0, 0, 1, '2026-03-19 14:22:06', NULL),
(3, 'Buy Groceries', 'Milk, eggs, bread, and fruits.', 'Home', 'high', 'pending', '2026-03-19 13:52:06', 0, 0, 1, '2026-03-19 14:22:06', NULL),
(4, 'Team Sync Call', 'Discuss next sprint objectives.', 'Work', 'medium', 'pending', '2026-03-20 08:52:06', 0, 1, 1, '2026-03-19 14:22:06', NULL),
(5, 'Prepare Presentation', 'Create slides for the project demo.', 'Work', 'high', 'pending', '2026-03-21 08:52:06', 0, 0, 1, '2026-03-19 14:22:06', NULL),
(6, 'Pay Electricity Bill', 'Must be done before Friday.', 'Personal', 'high', 'pending', '2026-03-19 20:52:06', 0, 0, 1, '2026-03-19 14:22:06', NULL),
(9, 'see', 'studying', 'Personal', 'medium', 'pending', '2026-03-20 00:00:00', 0, 0, 1, '2026-03-20 14:51:34', NULL),
(15, 'birthday ', 'birthday party today vinay', 'Personal', 'medium', 'pending', '2026-03-23 00:00:00', 0, 0, 6, '2026-03-23 15:36:49', NULL),
(18, 'yfffccg', 'cch', 'Personal', 'medium', 'pending', '2026-03-03 00:00:00', 0, 0, 6, '2026-03-23 15:56:41', NULL),
(19, 'cubicle', 'vibhinn', 'Personal', 'medium', 'pending', '2026-03-24 00:00:00', 1, 0, 8, '2026-03-24 14:06:25', NULL),
(21, 'chh', 'driver', 'Work', 'medium', 'pending', '2026-03-24 00:00:00', 0, 0, 9, '2026-03-24 14:12:20', NULL),
(22, 'n dhakti', 'chh', 'Personal', 'medium', 'pending', '2026-03-20 00:00:00', 0, 0, 9, '2026-03-24 14:13:09', NULL),
(24, 'full', 'fifty fl', 'Personal', 'medium', 'pending', '2026-03-22 00:00:00', 0, 0, 9, '2026-03-24 14:16:30', NULL),
(25, 'DD', 'andham gm', 'Personal', 'medium', 'pending', '2026-03-10 00:00:00', 0, 0, 9, '2026-03-24 14:17:19', NULL),
(26, 'h full', 'chh', 'Personal', 'medium', 'completed', '2026-03-24 00:00:00', 0, 0, 9, '2026-03-24 14:30:53', '2026-03-24 14:30:59'),
(27, 'dusra', 'Sudhakar', 'Fitness', 'medium', 'pending', '2026-03-25 00:00:00', 1, 0, 9, '2026-03-24 14:32:22', NULL),
(30, 'f ', 'cucum', 'Personal', 'medium', 'pending', '2026-03-27 00:00:00', 1, 0, 1, '2026-03-27 13:17:24', NULL),
(34, 'yftghijk', 'fcguhkjjhhgfy', 'Personal', 'medium', 'pending', '2026-03-30 00:00:00', 1, 0, 5, '2026-03-30 09:07:44', NULL),
(35, 'hgchgbjnbkjnm', 'yfgkjhkjkl', 'Personal', 'medium', 'pending', '2026-03-30 00:00:00', 1, 0, 5, '2026-03-30 09:18:33', NULL),
(36, 'hgvhiujhoi', '8yg7y7u98uy9iuo', 'Personal', 'medium', 'pending', '2026-03-30 00:00:00', 1, 1, 5, '2026-03-30 09:24:53', '2026-04-01 12:26:40'),
(37, 'tfuhijoikljlk', 'gybiuhokjij', 'Personal', 'medium', 'pending', '2026-03-30 00:00:00', 1, 0, 12, '2026-03-30 09:36:46', NULL),
(38, 'tiffin', 'diggy', 'Personal', 'medium', 'pending', '2026-04-01 00:00:00', 0, 0, 5, '2026-04-01 12:25:46', NULL),
(39, 'chh chaudh', 'chh Chachi', 'Personal', 'medium', 'pending', '2026-04-01 00:00:00', 1, 0, 5, '2026-04-01 13:28:51', NULL),
(40, 'creating a task', 'need to study', 'Personal', 'medium', 'pending', '2026-04-01 00:00:00', 1, 0, 13, '2026-04-01 14:15:38', NULL),
(41, 'dyguhjh', 'dfgjjjvjkhjj', 'Personal', 'medium', 'completed', '2026-04-01 00:00:00', 1, 0, 13, '2026-04-01 14:20:57', '2026-04-01 14:21:20');

-- --------------------------------------------------------

--
-- Table structure for table `task_assignments`
--

CREATE TABLE `task_assignments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `team_id` int(11) DEFAULT NULL,
  `assigned_to` int(11) NOT NULL,
  `assigned_by` int(11) NOT NULL,
  `assigned_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_assignments`
--

INSERT INTO `task_assignments` (`id`, `task_id`, `team_id`, `assigned_to`, `assigned_by`, `assigned_at`) VALUES
(3, 36, NULL, 5, 5, '2026-04-01 12:26:40');

-- --------------------------------------------------------

--
-- Table structure for table `task_locations`
--

CREATE TABLE `task_locations` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `address` varchar(500) DEFAULT NULL,
  `place_name` varchar(200) DEFAULT NULL,
  `radius_meters` float DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_locations`
--

INSERT INTO `task_locations` (`id`, `task_id`, `user_id`, `latitude`, `longitude`, `address`, `place_name`, `radius_meters`, `created_at`) VALUES
(1, 1, 1, 13.0827, 80.2707, 'SIMATS Campus, Chennai, India', 'Development Lab', 500, '2026-03-19 14:22:06'),
(2, 3, 1, 13.085, 80.21, 'Green Supermarket, Anna Nagar', 'Supermarket', 500, '2026-03-19 14:22:06'),
(10, 15, 6, 13.0265, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-03-23 15:36:49'),
(12, 19, 8, 13.0265, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-03-24 14:06:25'),
(14, 21, 9, 13.0265, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-03-24 14:12:20'),
(15, 22, 9, 13.0265, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-03-24 14:13:09'),
(17, 24, 9, 13.0265, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-03-24 14:16:30'),
(18, 26, 9, 13.0265, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-03-24 14:30:53'),
(19, 27, 9, 13.0265, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-03-24 14:32:22'),
(22, 30, 1, 13.0283, 80.0159, 'Current Location Area', 'Current Location', 1000, '2026-03-27 13:17:24'),
(26, 34, 5, 13.028, 80.0158, NULL, 'Current Location', 500, '2026-03-30 09:07:44'),
(27, 37, 12, 13.028, 80.0157, NULL, 'NH48', 500, '2026-03-30 09:36:46'),
(28, 38, 5, 13.0266, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-04-01 12:25:46'),
(29, 39, 5, 13.0265, 80.016, 'Current Location Area', 'Current Location', 1000, '2026-04-01 13:28:51'),
(30, 40, 13, 13.0265, 80.0161, NULL, 'Saveetha Engineering College', 500, '2026-04-01 14:15:38');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name`, `description`, `created_by`, `created_at`) VALUES
(1, 'TaskMate Android Team', 'Main development group for the mobile app.', 1, '2026-03-19 14:22:06'),
(2, 'Chennai AI Club', 'Hobbyist group for AI enthusiasts.', 1, '2026-03-19 14:22:06'),
(3, 'Likitha', 'house hold works', 5, '2026-03-20 10:13:14'),
(4, 'Likitha', '', 6, '2026-03-23 16:03:59'),
(5, 'zo', 'zo', 9, '2026-03-24 14:45:47');

-- --------------------------------------------------------

--
-- Table structure for table `team_memberships`
--

CREATE TABLE `team_memberships` (
  `id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `joined_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `team_memberships`
--

INSERT INTO `team_memberships` (`id`, `team_id`, `user_id`, `role`, `joined_at`) VALUES
(1, 1, 1, 'Project Lead', '2026-03-19 14:22:06'),
(2, 1, 2, 'Designer', '2026-03-19 14:22:06'),
(3, 1, 3, 'Developer', '2026-03-19 14:22:06'),
(4, 1, 4, 'QA', '2026-03-19 14:22:06'),
(5, 2, 1, 'Founder', '2026-03-19 14:22:06'),
(6, 2, 3, 'Moderator', '2026-03-19 14:22:06'),
(7, 3, 5, 'Team Lead', '2026-03-20 10:13:14'),
(8, 4, 6, 'Team Lead', '2026-03-23 16:03:59'),
(9, 5, 9, 'Team Lead', '2026-03-24 14:45:47');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(256) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `push_notifications` tinyint(1) DEFAULT NULL,
  `location_reminders` tinyint(1) DEFAULT NULL,
  `deadline_alerts` tinyint(1) DEFAULT NULL,
  `location_services` tinyint(1) DEFAULT NULL,
  `daily_reminder` tinyint(1) DEFAULT NULL,
  `task_streak` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `is_pro` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password`, `phone`, `bio`, `profile_picture`, `push_notifications`, `location_reminders`, `deadline_alerts`, `location_services`, `daily_reminder`, `task_streak`, `is_active`, `created_at`, `updated_at`, `is_pro`) VALUES
(1, 'Rohith Developer', 'rohith@example.com', 'Password123!', '+91 9876543210', 'Primary developer for TaskMate. Passionate about AI.', NULL, 1, 0, 1, 1, 0, 12, 1, '2026-03-19 14:22:06', NULL, 0),
(2, 'Alice Johnson', 'alice@team.com', 'Password123!', '+1 234567890', 'UI/UX Designer.', NULL, 1, 0, 1, 1, 0, 5, 1, '2026-03-19 14:22:06', NULL, 0),
(3, 'Bob Smith', 'bob@team.com', 'Password123!', '+1 345678901', 'Backend Specialist.', NULL, 1, 0, 1, 1, 0, 8, 1, '2026-03-19 14:22:06', NULL, 0),
(4, 'Charlie Brown', 'charlie@team.com', 'Password123!', '+1 456789012', 'QA Engineer.', NULL, 1, 0, 1, 1, 0, 2, 1, '2026-03-19 14:22:06', NULL, 0),
(5, 'Likki', 'sodalikhitha@gmail.com', 'Lxkxx@2411', '9573735529', '', '/uploads/profile_pictures/5_c1eb4310766b4920b6dcf906e7d62876.jpg', 1, 1, 1, 1, 0, 5, 1, '2026-03-19 14:45:34', '2026-04-01 12:52:34', 0),
(6, 't1', '1@a.m', 'Ab@12345', '3151616161', NULL, NULL, 1, 1, 1, 1, 0, 0, 1, '2026-03-23 15:28:14', '2026-03-23 16:04:13', 0),
(7, 'chup', '2@a.m', 'Lxkkx@2411', '8569869886', NULL, NULL, 1, 0, 1, 1, 0, 0, 1, '2026-03-24 13:44:26', NULL, 0),
(8, 'soda fhf fbj', 'masoodsk@gmail.com', 'Lxkkxh@123', '1234567890', NULL, NULL, 1, 0, 1, 1, 0, 0, 1, '2026-03-24 14:05:25', NULL, 0),
(9, 'soda Likitha ', 'likhithasoda@gmail.com', 'Likhitha@2411', '9573735529', NULL, NULL, 1, 1, 1, 1, 0, 4, 1, '2026-03-24 14:11:57', '2026-03-24 14:46:50', 0),
(10, 'soda Likitha ', 'fandi@team.com', 'Likki@#2411', '8639642952', NULL, NULL, 1, 0, 1, 1, 0, 0, 1, '2026-03-28 09:48:07', NULL, 0),
(11, 'Test User', 'user1774686287@gmail.com', 'Test@1234', NULL, NULL, NULL, 1, 0, 1, 1, 0, 0, 1, '2026-03-28 13:54:47', NULL, 0),
(12, 'likitha', 'jetski_bot@example.com', 'Jetski@2024!', '', '', NULL, 1, 0, 1, 1, 0, 0, 1, '2026-03-30 09:31:37', '2026-03-30 09:37:43', 0),
(13, 'Ramcharan', 'ramcharan@gmail.com', 'Charan@2411', '9573284051', NULL, NULL, 1, 0, 1, 1, 0, 1, 1, '2026-04-01 14:13:51', '2026-04-01 14:21:20', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_queries`
--
ALTER TABLE `ai_queries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ix_ai_queries_id` (`id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ix_chat_messages_id` (`id`);

--
-- Indexes for table `invite_tokens`
--
ALTER TABLE `invite_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `team_id` (`team_id`),
  ADD KEY `ix_invite_tokens_id` (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `ix_notifications_id` (`id`);

--
-- Indexes for table `password_reset_codes`
--
ALTER TABLE `password_reset_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ix_password_reset_codes_id` (`id`),
  ADD KEY `ix_password_reset_codes_email` (`email`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `ix_tasks_id` (`id`);

--
-- Indexes for table `task_assignments`
--
ALTER TABLE `task_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `team_id` (`team_id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `assigned_by` (`assigned_by`),
  ADD KEY `ix_task_assignments_id` (`id`);

--
-- Indexes for table `task_locations`
--
ALTER TABLE `task_locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ix_task_locations_id` (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `ix_teams_id` (`id`);

--
-- Indexes for table `team_memberships`
--
ALTER TABLE `team_memberships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `team_id` (`team_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `ix_team_memberships_id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ix_users_email` (`email`),
  ADD KEY `ix_users_id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_queries`
--
ALTER TABLE `ai_queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `invite_tokens`
--
ALTER TABLE `invite_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `password_reset_codes`
--
ALTER TABLE `password_reset_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `task_assignments`
--
ALTER TABLE `task_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `task_locations`
--
ALTER TABLE `task_locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `team_memberships`
--
ALTER TABLE `team_memberships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_queries`
--
ALTER TABLE `ai_queries`
  ADD CONSTRAINT `ai_queries_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `chat_messages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `invite_tokens`
--
ALTER TABLE `invite_tokens`
  ADD CONSTRAINT `invite_tokens_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `task_assignments`
--
ALTER TABLE `task_assignments`
  ADD CONSTRAINT `task_assignments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_assignments_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_assignments_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `task_assignments_ibfk_4` FOREIGN KEY (`assigned_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `task_locations`
--
ALTER TABLE `task_locations`
  ADD CONSTRAINT `task_locations_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_locations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `teams`
--
ALTER TABLE `teams`
  ADD CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `team_memberships`
--
ALTER TABLE `team_memberships`
  ADD CONSTRAINT `team_memberships_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `team_memberships_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
