import { claimCoupomn, useCouponService } from "../services/couponService.js";

export async function getClaimCoupons(req, res, next) {
  const { userId, couponId } = req.body;
  try {
    const result = await claimCoupomn(userId, couponId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}

export async function useCoupon(req, res, next) {
  const { userId, couponId } = req.body;
  try {
    const result = await useCouponService(userId, couponId);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
}
