import { Router } from "express";
import { getClaimCoupons } from "../../controllers/couponController.js";
const router = Router();

// 領取優惠券
router.post("/claim-coupon", getClaimCoupons);
// router.post("/claim-coupon", (req, res) => {
//   res.send("Hello World coupon!");
// });

export default router;
