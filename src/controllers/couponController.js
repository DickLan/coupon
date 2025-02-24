import {claimCoupomn} from "../services/couponService.js";
export async function getClaimCoupons(req, res, next) {
  const { userId, couponId } = req.body;
  try {
    const result = await claimCoupomn(userId, couponId);
  } catch (error) {
    next(error);
  }
}
