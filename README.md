

# 專案架構

```
project/
├── .gitignore               # 忽略不需提交的檔案，例如 node_modules 等
├── docker-compose.yml       # Docker Compose 設定檔
├── Dockerfile               # 建置 Docker 映像檔所需的檔案
├── package.json             # 專案基本設定與依賴 (須包含 "type": "module")
├── package-lock.json        # npm 依賴鎖定檔
├── prisma/
│   └── schema.prisma        # Prisma 主要設定檔 (資料表定義、資料庫連線資訊)
├── src/
│   ├── app.js               # Express 主要初始化檔 & 伺服器啟動邏輯
│   ├── routes/
│   │   └── index.js         # 路由整合進入點，可在此 import 不同路由模組
│   ├── controllers/
│   │   └── couponController.js       # 優惠券相關的業務邏輯進入點
│   │   └── userController.js         # 使用者相關的業務邏輯進入點
│   ├── services/
│   │   └── couponService.js          # 優惠券核心商業邏輯（領券、使用、查詢）
│   │   └── userService.js            # 使用者資料存取與業務邏輯
│   ├── utils/
│   │   └── someUtil.js               # 其他可抽出的工具程式
│   └── middlewares/
│       └── errorHandler.js           # 全域錯誤處理 middleware
├── config/
│   └── config.js                     # 環境變數讀取或 dotenv 設定
└── README.md                         # 專案說明文件 (本檔案)

```