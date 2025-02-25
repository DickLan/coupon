
-- 插入使用者測資
INSERT INTO `user` (name, email) VALUES
('Alice', 'alice@example.com'),
('Bob', 'bob@example.com'),
('Charlie', 'charlie@example.com');

-- 插入 10 筆優惠券測資
INSERT INTO `coupon` (title, type, description, discount_value, max_usage, used_count, start_date, end_date) VALUES
('Coupon 1', 'discount', '10% off on orders above $50', 10, 100, 0, '2023-01-01 00:00:00', '2023-12-31 23:59:59'),
('Coupon 2', 'cash', 'Save $5 on your purchase', 5, 100, 0, '2023-01-01 00:00:00', '2023-12-31 23:59:59'),
('Coupon 3', 'discount', '15% off on electronics', 15, 50, 0, '2023-01-01 00:00:00', '2023-06-30 23:59:59'),
('Coupon 4', 'cash', 'Get $10 off', 10, 200, 0, '2023-01-01 00:00:00', '2023-12-31 23:59:59'),
('Coupon 5', 'discount', '20% off on all items', 20, 150, 0, '2023-02-01 00:00:00', '2023-11-30 23:59:59'),
('Coupon 6', 'discount', '5% off for new customers', 5, 100, 0, '2023-03-01 00:00:00', '2023-09-30 23:59:59'),
('Coupon 7', 'cash', 'Save $20 on orders above $100', 20, 80, 0, '2023-01-01 00:00:00', '2023-12-31 23:59:59'),
('Coupon 8', 'discount', 'Free shipping discount', 0, 500, 0, '2023-01-01 00:00:00', '2023-12-31 23:59:59'),
('Coupon 9', 'cash', 'Get $15 off your order', 15, 120, 0, '2023-01-01 00:00:00', '2023-12-31 23:59:59'),
('Coupon 10', 'discount', '25% off on select items', 25, 60, 0, '2023-04-01 00:00:00', '2023-10-31 23:59:59');

-- 插入優惠券領取記錄測資
INSERT INTO `coupon_redemption` (user_id, coupon_id, status, created_at, used_at) VALUES
(1, 1, 1, '2023-05-01 10:00:00', NULL),
(1, 2, 2, '2023-05-02 11:00:00', '2023-05-03 12:00:00'),
(2, 3, 1, '2023-05-04 13:00:00', NULL);
