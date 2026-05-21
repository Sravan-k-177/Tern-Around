-- Universal relation used for normalization:
-- TernAroundUR(ur_id, account_name, email, password_hash, phone, email_verified,
--              role_type, place_name, place_type, country, state, city,
--              latitude, longitude, summary, detail_kind, detail_text, detail_url,
--              visit_timestamp, wishlist_timestamp, submission_type, submission_status,
--              review_notes, reviewed_at)
-- Primary key: ur_id
--
-- Normalized design:
-- accounts, contributors, admins, places, place_details, visits,
-- wishlist_items, place_submissions.

CREATE DATABASE IF NOT EXISTS tern_around_v2
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tern_around_v2;

CREATE TABLE IF NOT EXISTS accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_accounts_email (email),
  UNIQUE KEY uq_accounts_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contributors (
  account_id INT PRIMARY KEY,
  contributor_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contributors_account
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admins (
  account_id INT PRIMARY KEY,
  access_level VARCHAR(40) NOT NULL DEFAULT 'moderator',
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admins_account
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS places (
  place_id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  place_type VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  summary TEXT NOT NULL,
  created_by_admin_id INT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_places_geo (country, state, city, place_type),
  CONSTRAINT fk_places_admin
    FOREIGN KEY (created_by_admin_id) REFERENCES admins(account_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS place_details (
  detail_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  place_id VARCHAR(80) NOT NULL,
  detail_kind VARCHAR(30) NOT NULL,
  detail_title VARCHAR(150) NULL,
  detail_text TEXT NOT NULL,
  detail_url VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_place_detail_order (place_id, detail_kind, sort_order),
  KEY idx_place_details_kind (place_id, detail_kind),
  CONSTRAINT fk_place_details_place
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS visits (
  visit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  place_id VARCHAR(80) NOT NULL,
  visited_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT NULL,
  UNIQUE KEY uq_visit_once (account_id, place_id, visited_at),
  KEY idx_visits_account (account_id, visited_at),
  KEY idx_visits_place (place_id),
  CONSTRAINT fk_visits_account
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_visits_place
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS wishlist_items (
  account_id INT NOT NULL,
  place_id VARCHAR(80) NOT NULL,
  note TEXT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id, place_id),
  KEY idx_wishlist_place (place_id),
  CONSTRAINT fk_wishlist_account
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  CONSTRAINT fk_wishlist_place
    FOREIGN KEY (place_id) REFERENCES places(place_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS place_submissions (
  submission_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  contributor_account_id INT NOT NULL,
  submission_type ENUM('new_place', 'update_place') NOT NULL,
  target_place_id VARCHAR(80) NULL,
  proposed_name VARCHAR(255) NOT NULL,
  place_type VARCHAR(120) NOT NULL,
  country VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  city VARCHAR(120) NOT NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  summary TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  review_notes TEXT NULL,
  reviewed_by_admin_id INT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME NULL,
  KEY idx_submissions_status (status, submitted_at),
  CONSTRAINT fk_submissions_contributor
    FOREIGN KEY (contributor_account_id) REFERENCES contributors(account_id) ON DELETE CASCADE,
  CONSTRAINT fk_submissions_target_place
    FOREIGN KEY (target_place_id) REFERENCES places(place_id) ON DELETE SET NULL,
  CONSTRAINT fk_submissions_admin
    FOREIGN KEY (reviewed_by_admin_id) REFERENCES admins(account_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;