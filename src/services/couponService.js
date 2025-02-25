import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 領取優惠券
export async function claimCoupomn(userId, couponId) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 使用條件更新，確保不會超過最大使用數量
      const updateResult = await tx.$executeRaw`
        UPDATE coupon 
        SET used_count = used_count + 1 
        WHERE id = ${couponId} AND used_count < max_usage
      `;
      // 若沒有更新成功，表示該優惠券已超過領取上限
      if (updateResult === 0) {
        throw new Error("該優惠券已領取完畢或不可領取");
      }

      // 新增優惠券醒取紀錄 預設 status = 1 (unused)
      const redemption = await tx.coupon_redemption.create({
        data: {
          user_id: userId,
          coupon_id: couponId,
          status: 1,
        },
      });

      return redemption;
    });
    return result;
  } catch (error) {
    throw error;
  }
}

/**
 * 使用優惠券
 * 驗證優惠券是否在有效期內、尚未使用，若可用，更新為已使用 (status = 2)。
 */
export async function useCouponService(userId, couponId) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 找出該使用者領取的該優惠券，且未使用 (status = 1)
      const redemption = await tx.coupon_redemption.findFirst({
        where: {
          user_id: userId,
          coupon_id: couponId,
          status: 1, // 未使用
        },
      });
      if (!redemption) {
        throw new Error("找不到可使用的優惠券，可能已使用或未領取");
      }

      // 取得優惠券資訊，檢查有效期
      const coupon = await tx.coupon.findUnique({
        where: { id: couponId },
      });
      if (!coupon) {
        throw new Error("該優惠券不存在");
      }

      const now = new Date();
      if (now < coupon.start_date || now > coupon.end_date) {
        throw new Error("該優惠券不在有效期內");
      }

      // 更新 redemption 狀態為已使用 (status = 2), 並設置 used_at
      const updated = await tx.coupon_redemption.update({
        where: { id: redemption.id },
        data: {
          status: 2, // 2 代表已使用
          used_at: new Date(),
        },
      });

      return updated;
    });
    return result;
  } catch (error) {
    throw error;
  }
}
