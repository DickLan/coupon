import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// swagger-jsdoc 的設定
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Coupon API",
      version: "1.0.0",
      description: "優惠券系統 API 文件",
    },
    servers: [
      {
        url: "http://localhost:3001/api",
      },
    ],
  },
  apis: ["./src/**/*.js"],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
