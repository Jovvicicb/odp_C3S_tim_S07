-- This is an example schema.
-- The actual database schema is created and initialized in the setup-replication script.

CREATE DATABASE IF NOT EXISTS pulse_net_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pulse_net_db;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username         VARCHAR(40)  NOT NULL UNIQUE CHECK (CHAR_LENGTH(username) BETWEEN 3 AND 40 AND username REGEXP '^[A-Za-z0-9-]+$'),
  fullname         VARCHAR(100) NULL CHECK(fullname IS NULL OR CHAR_LENGTH(fullname) BETWEEN 3 AND 100),
  email            VARCHAR(255) NOT NULL UNIQUE CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  password_hash    VARCHAR(255) NOT NULL,
  bio              VARCHAR(300) NULL CHECK(bio IS NULL OR CHAR_LENGTH(bio) <= 300),
  profile_picture  VARCHAR(500) NULL CHECK(profile_picture IS NULL OR CHAR_LENGTH(profile_picture) <=500),
  role             ENUM('user','admin') NOT NULL DEFAULT 'user',
  is_active        TINYINT(1) NOT NULL DEFAULT 1,
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- COMMUNITIES
CREATE TABLE IF NOT EXISTS communities (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(80) NOT NULL UNIQUE CHECK (CHAR_LENGTH(name) BETWEEN 2 AND 80),
  description    VARCHAR(500) NULL CHECK(description IS NULL OR CHAR_LENGTH(description) <=500),
  rules          VARCHAR(500) NULL CHECK(rules IS NULL OR CHAR_LENGTH(rules) <=500),
  type           ENUM('public','private') NOT NULL,
  owner_id       INT UNSIGNED NOT NULL,
  avatar         VARCHAR(500) NULL CHECK(avatar IS NULL OR CHAR_LENGTH(avatar) <=500),
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_owner (owner_id),
  INDEX idx_type (type)
);

-- -- M:N relationship (Users ↔ Communities)
CREATE TABLE IF NOT EXISTS community_members (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED NOT NULL,
  community_id   INT UNSIGNED NOT NULL,
  role           ENUM('moderator','member') NOT NULL DEFAULT 'member',
  status         ENUM('active','pending','banned') NOT NULL DEFAULT 'active',
  joined_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_community (user_id, community_id),
  INDEX idx_user (user_id),
  INDEX idx_community_status (community_id,status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE
);

-- POSTS
CREATE TABLE IF NOT EXISTS posts (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(200) NOT NULL CHECK (CHAR_LENGTH(title) BETWEEN 5 AND 200),
  content        TEXT NOT NULL CHECK (CHAR_LENGTH(content) BETWEEN 10 AND 10000),
  media_url      VARCHAR(500) NULL CHECK(media_url IS NULL OR CHAR_LENGTH(media_url) <=500),
  author_id      INT UNSIGNED NOT NULL,
  community_id   INT UNSIGNED NOT NULL,
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_author (author_id),
  INDEX idx_community_created (community_id,created_at),
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE
);

-- TAGS
CREATE TABLE IF NOT EXISTS tags (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(50) NOT NULL UNIQUE CHECK(CHAR_LENGTH(name) BETWEEN 2 AND 50),
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- M:N relationship (Posts ↔ Tags)
CREATE TABLE IF NOT EXISTS post_tags (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  post_id      INT UNSIGNED NOT NULL,
  tag_id       INT UNSIGNED NOT NULL,
  UNIQUE KEY   unique_post_tags(post_id, tag_id),
  INDEX        idx_post (post_id),
  INDEX        idx_tag (tag_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- M:N relationship (Users ↔ Posts) 
CREATE TABLE IF NOT EXISTS post_likes (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id       INT UNSIGNED NOT NULL,
  post_id       INT UNSIGNED NOT NULL,
  UNIQUE KEY    unique_user_post (user_id, post_id),
  liked_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX         idx_user (user_id),
  INDEX         idx_post (post_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content      TEXT NOT NULL CHECK (CHAR_LENGTH(content) BETWEEN 1 AND 2000),
  user_id      INT UNSIGNED NOT NULL,
  post_id      INT UNSIGNED NOT NULL,
  parent_id    INT UNSIGNED NULL,
  is_deleted   TINYINT(1) NOT NULL DEFAULT 0,
  is_flagged   TINYINT(1) NOT NULL DEFAULT 0,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_post_created (post_id,created_at),
  INDEX idx_user (user_id),
  INDEX idx_parent (parent_id),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS comment_likes (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  comment_id  INT UNSIGNED NOT NULL,
  UNIQUE KEY unique_comment_likes(user_id, comment_id),
  liked_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_comment (comment_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);
-- M:N relationship (Users ↔ Users)
CREATE TABLE IF NOT EXISTS user_follows (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  follower_id  INT UNSIGNED NOT NULL,
  following_id INT UNSIGNED NOT NULL,
  followed_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_follows(follower_id, following_id),
  INDEX idx_follower (follower_id),
  INDEX idx_following (following_id),
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NULL,
  action      VARCHAR(255) NOT NULL,
  details     TEXT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_created (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);