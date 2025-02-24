import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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
      if (updateResult.affectedRows === 0) {
        throw new Error("該優惠券已領取完畢或不可領取");
      }

      // 新增優惠券醒取紀錄 預設 status = 1 (unused)
      const redemption = await tx.redemption.create({
        data: {
          user_id: userId,
          coupon_id: couponId,
          status: 1,
        },
      });

      return redemption;
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
