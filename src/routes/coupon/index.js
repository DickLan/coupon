import { Router } from "express";
import {
  getClaimCoupons,
  useCoupon,
} from "../../controllers/couponController.js";
const router = Router();

// 領取優惠券
router.post("/claim-coupon", getClaimCoupons);
// 使用優惠券
router.post("/use-coupon", useCoupon);

export default router;
