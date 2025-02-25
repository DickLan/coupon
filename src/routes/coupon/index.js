import { Router } from "express";
import {
  getClaimCoupons,
  useCoupon,
  getUserCoupons,
} from "../../controllers/couponController.js";
const router = Router();

/**
 * @swagger
 * /claim-coupon:
 *   post:
 *     summary: 領取優惠券
 *     description: 使用者領取優惠券，成功領取後將創建一筆優惠券領取紀錄。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               couponId:
 *                 type: number
 *             example:
 *               userId: 1
 *               couponId: 1
 *     responses:
 *       200:
 *         description: 優惠券領取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     user_id:
 *                       type: number
 *                     coupon_id:
 *                       type: number
 *                     status:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     used_at:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *             example:
 *               message: "優惠券領取成功"
 *               data:
 *                 id: 1
 *                 user_id: 1
 *                 coupon_id: 1
 *                 status: 1
 *                 created_at: "2023-05-01T10:00:00.000Z"
 *                 used_at: null
 *       400:
 *         description: 領取失敗，可能因優惠券已達上限或其他錯誤
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "領取失敗，優惠券已達上限"
 */
router.post("/claim-coupon", getClaimCoupons);

/**
 * @swagger
 * /use-coupon:
 *   post:
 *     summary: 使用優惠券
 *     description: 使用者使用已領取的優惠券，系統會檢查優惠券的有效性後更新狀態為已使用。
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *               couponId:
 *                 type: number
 *             example:
 *               userId: 1
 *               couponId: 1
 *     responses:
 *       200:
 *         description: 優惠券使用成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     user_id:
 *                       type: number
 *                     coupon_id:
 *                       type: number
 *                     status:
 *                       type: number
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     used_at:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *             example:
 *               message: "優惠券使用成功"
 *               data:
 *                 id: 1
 *                 user_id: 1
 *                 coupon_id: 1
 *                 status: 2
 *                 created_at: "2023-05-01T10:00:00.000Z"
 *                 used_at: "2025-02-25T14:50:18.000Z"
 *       400:
 *         description: 使用失敗，可能因優惠券不在有效期內或已使用
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "使用失敗，優惠券不在有效期內或已使用"
 */
router.post("/use-coupon", useCoupon);

/**
 * @swagger
 * /user-coupons:
 *   get:
 *     summary: 查詢使用者所有優惠券
 *     description: 根據使用者 ID 查詢該使用者所有優惠券的狀態（未使用、已使用、已過期）。
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: number
 *         description: 使用者 ID
 *     responses:
 *       200:
 *         description: 查詢成功，返回使用者優惠券清單
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       redemptionId:
 *                         type: number
 *                       couponId:
 *                         type: number
 *                       couponTitle:
 *                         type: string
 *                       couponType:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                       endDate:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                       usedAt:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *             example:
 *               message: "查詢成功"
 *               data:
 *                 - redemptionId: 1
 *                   couponId: 1
 *                   couponTitle: "滿千折百"
 *                   couponType: "discount"
 *                   startDate: "2023-01-01T00:00:00.000Z"
 *                   endDate: "2023-12-31T23:59:59.000Z"
 *                   status: "未使用"
 *                   usedAt: null
 *                   createdAt: "2023-06-15T10:00:00.000Z"
 *       400:
 *         description: 查詢失敗，請確認參數是否正確
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "缺少 userId 參數"
 */
router.get("/user-coupons", getUserCoupons);

export default router;
