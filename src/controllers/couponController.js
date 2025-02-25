import {
  claimCoupomn,
  useCouponService,
  getUserCouponsService,
} from "../services/couponService.js";

export async function getClaimCoupons(req, res, next) {
  const { userId, couponId } = req.body;

  try {
    const result = await claimCoupomn(userId, couponId);
    res.status(200).json({ message: "優惠券領取成功", data: result });

  } catch (error) {
    next(error);
  }
}

export async function useCoupon(req, res, next) {
  const { userId, couponId } = req.body;
  try {
    const result = await useCouponService(userId, couponId);
    res.status(200).json({ message: "優惠券使用成功", data: result });
  } catch (error) {
    next(error);
  }
}

// 查詢使用者所有優惠券
export async function getUserCoupons(req, res, next) {
  try {
    // 目前先用 GET /user-coupons?userId=1
    // 若有需要 uuid 或改成 post, 再來修正
    const { userId } = req.query;
    if (!userId) {
      throw new Error("缺少 userId 參數");
    }

    const result = await getUserCouponsService(parseInt(userId, 10));
    res.status(200).json({ message: "查詢成功", data: result });
  } catch (error) {
    next(error);
  }
}