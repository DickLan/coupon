import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// 領取優惠券
export async function claimCoupomn(userId, couponId) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 檢查優惠券是否過期
      const couponCheck = await tx.coupon.findUnique({
        where: {
          id: couponId,
        },
      });

      if (couponCheck.end_date < new Date()) {
        throw new Error("該優惠券已過期");
      }

      // 檢查此 user 是否已經領取過此優惠券
      const userRedemption = await tx.coupon_redemption.findFirst({
        where: {
          user_id: userId,
          coupon_id: couponId,
        },
      });
      if (userRedemption) {
        throw new Error("該使用者已領取過此優惠券");
      }

      // 使用原子操作條件更新，確保不會超過最大使用數量
      // 也可以用 Redis 等工具的分布式鎖功能
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

      if (!redemption) {
        throw new Error("找不到可使用的優惠券");
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

// 查詢使用者所有的優惠券（未使用、已使用、已過期）
export async function getUserCouponsService(userId) {
  try {
    // 確認使用者是否存在
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("找不到該使用者");
    }

    // 找出該使用者的所有領取紀錄，並包含對應的優惠券資訊
    const redemptions = await prisma.coupon_redemption.findMany({
      where: { user_id: userId },
      include: { coupon: true },
    });

    const now = new Date();

    // 依照 status 與日期計算最終狀態
    //  1 -> 未使用；若過了 end_date -> 已過期
    //  2 -> 已使用
    //  3 -> 已過期
    const result = redemptions.map((item) => {
      let displayStatus;

      if (item.status === 2) {
        displayStatus = "已使用";
      } else if (now > item.coupon.end_date) {
        displayStatus = "已過期";
      } else {
        displayStatus = "未使用";
      }
      // 回傳轉換成 camelCase 以配合前端使用
      return {
        redemptionId: item.id,
        couponId: item.coupon_id,
        couponTitle: item.coupon.title,
        couponType: item.coupon.type,
        startDate: item.coupon.start_date,
        endDate: item.coupon.end_date,
        status: displayStatus,
        usedAt: item.used_at,
        createdAt: item.created_at,
      };
    });

    return result;
  } catch (error) {
    // 直接拋錯讓 controller 捕獲
    throw error;
  }
}
