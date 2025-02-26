# Coupon 系統 設計說明

本系統為「優惠券系統」，旨在提供優惠券管理功能，包括：  
1.領取優惠券：在領取優惠券時，系統會檢查其可用數量，以確保優惠券不會超發。  
2.使用優惠券：使用前，系統會驗證優惠券的有效期限與當前狀態，確保其有效。  
3.查詢優惠券：用戶可以查詢他們所持有的所有優惠券的狀態，包括未使用、已使用和已過期。

---

## 目錄

- [啟用程式](#啟用程式)
- [API 測試](#api-測試)
- [專案架構](#專案架構)
- [功能設計說明](#功能設計說明)
- [資料庫設計](#資料庫設計)

---

## 啟用程式

1. 運行 Docker，並確保主機的 3001 埠以及所需的資料庫埠 3311 未被占用。
2. 複製 `.env.example` 為 `.env`，內容不用變動即可連線，也可根據需求調整資料庫連線。
3. 執行以下指令以建置並啟動容器，第一次啟動時會自動初始化資料表並載入測試資料：  
   docker-compose up --build

---

## API 測試

### API 文檔和測試介面

- 進入 [http://localhost:3001/api-docs] 可查看並操作 Swagger UI。

### 核心 API 操作

- 核心 API 範例：
  - `POST /api/claim-coupon`：領取優惠券
  - `POST /api/use-coupon`：使用優惠券
  - `GET /api/user-coupons`：查詢使用者所有優惠券

### 測試範例

- **領取優惠券測試範例**：

```
  ＊範例 1：成功領取優惠券
    POST /api/claim-coupon body: { "userId": 1, "couponId": 1 }
  ＊範例 2：重複領取優惠券
    POST /api/claim-coupon body: { "userId": 1, "couponId": 2 }
```

- **使用優惠券測試範例**：

```
  ＊範例 1：成功使用優惠券
    POST /api/use-coupon body: { "userId": 1, "couponId": 1 }
  ＊範例 2：找不到可用優惠券
    POST /api/claim-coupon body: { "userId": 1, "couponId": 2 }
  ＊範例 3：優惠券已過期
    POST /api/claim-coupon body: { "userId": 1, "couponId": 3 }
```

- **查詢使用者所有優惠券範例**：

```
  ＊範例 1：查詢成功
    GET /api/user-coupons?userId=1
  ＊範例 2：使用者不存在
    GET /api/claim-coupon?userId=4
```

---

## 專案架構

```pl
project/
├── .gitignore               # 忽略不需提交的檔案，例如 node_modules 等
├── docker-compose.yml       # Docker Compose 設定檔
├── Dockerfile               # 建置 Docker 映像檔所需的檔案
├── package.json             # 專案基本設定與依賴
├── package-lock.json        # npm 依賴鎖定檔
├── prisma/
│   └── schema.prisma        # Prisma 主要設定檔
├── src/
│   ├── app.js               # Express 主要初始化檔 & 伺服器啟動邏輯
│   ├── routes/
│   │   └── index.js         # 路由整合進入點，可在此 import 不同路由
│   ├── controllers/
│   │   └── couponController.js       # 優惠券相關的業務邏輯進入點
│   ├── services/
│   │   └── couponService.js          # 優惠券核心商業邏輯
│   ├── utils/
│   │   └── someUtil.js               # 其他可抽出的工具程式
│   └── middlewares/
│       └── errorHandler.js           # 全域錯誤處理 middleware
├── config/
│   └── config.js                     # 環境變數讀取或 dotenv 設定
└── README.md                         # 專案說明文件 (本檔案)
```

---

## 功能設計說明

本系統主要提供以下核心功能：

### 領取優惠券 (claimCoupon)

- **流程**
  - 檢查優惠券是否還在有效期內，並確認尚未超過可領取次數 (`max_usage`)。
  - 檢查使用者是否已領取過相同優惠券（避免重複領取）。
  - 使用資料庫原子性操作（如 `UPDATE … SET used_count = used_count + 1 WHERE … AND used_count < max_usage`）以避免超發。
  - 建立 `coupon_redemption` 紀錄，表示使用者成功領取。

### 使用優惠券 (useCoupon)

- **流程**
  - 查詢使用者對應的 `coupon_redemption`，且狀態為「未使用」 (`status=1`)。
  - 檢查優惠券有效期（`start_date ~ end_date`）。
  - 更新優惠券狀態為「已使用」 (`status=2`)，並記錄使用時間 (`used_at`)。

### 查詢使用者所有優惠券 (getUserCoupons)

- **流程**
  - 根據使用者 ID，查詢所有 `coupon_redemption` 與關聯的 `coupon`。
  - 根據目前時間判斷各優惠券的狀態（未使用、已使用、已過期）。
  - 回傳清單供前端顯示。

---

## 資料庫設計

### 1. 優惠券表：儲存優惠券的基本資訊

```sql
CREATE TABLE `coupon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `description` text,
  `discount_value` float DEFAULT NULL,
  `max_usage` int NOT NULL,
  `used_count` int NOT NULL DEFAULT '0',
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 2. 用戶表：紀錄用戶基本資訊

```sql
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 3. 優惠券與用戶關聯表：紀錄用戶領取優惠券的資訊 (多對多)

```sql
CREATE TABLE `coupon_redemption` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `coupon_id` int NOT NULL,
  `status` tinyint NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `used_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_coupon_redemption_user` (`user_id`),
  KEY `fk_coupon_redemption_coupon` (`coupon_id`),
  CONSTRAINT `fk_coupon_redemption_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`),
  CONSTRAINT `fk_coupon_redemption_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```
