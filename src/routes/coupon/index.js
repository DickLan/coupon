import { Router } from "express";
import {
  getClaimCoupons,
  useCoupon,
  getUserCoupons,
} from "../../controllers/couponController.js";
const router = Router();

// 領取優惠券
router.post("/claim-coupon", getClaimCoupons);
// 使用優惠券
router.post("/use-coupon", useCoupon);
// 查詢使用者所有優惠券（未使用、已使用、已過期）
router.get("/user-coupons", getUserCoupons);

export default router;
