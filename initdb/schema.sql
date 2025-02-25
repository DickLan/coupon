-- 關閉外鍵檢查，以便 drop table
SET FOREIGN_KEY_CHECKS = 0;

-- 如果已存在則刪除舊有的資料表
DROP TABLE IF EXISTS `coupon_redemption`;
DROP TABLE IF EXISTS `coupon`;
DROP TABLE IF EXISTS `user`;

-- 重新開啟外鍵檢查
SET FOREIGN_KEY_CHECKS = 1;

-- 建立使用者表 (user)
CREATE TABLE `user` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) UNIQUE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 建立優惠券表 (coupon)
CREATE TABLE `coupon` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `discount_value` FLOAT,
  `max_usage` INT NOT NULL,
  `used_count` INT NOT NULL DEFAULT 0,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 建立優惠券使用紀錄表 (coupon_redemption)
CREATE TABLE `coupon_redemption` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `coupon_id` INT NOT NULL,
  `status` TINYINT NOT NULL,  -- 1: 未使用, 2: 已使用, 3: 過期
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `used_at` DATETIME DEFAULT NULL,
  CONSTRAINT `fk_coupon_redemption_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
  CONSTRAINT `fk_coupon_redemption_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupon`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
