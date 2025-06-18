export default function handler(req, res) {
  // ✅ ดึง token จาก header: ทั้ง Authorization และ TMN-Access-Token
  const token =
    req.headers['tmn-access-token'] || // Truemoney ส่ง header นี้มา
    req.headers.authorization?.split(" ")[1]; // หรือแบบ Authorization: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "❌ ไม่พบ Token ใน Header" });
  }

  // ✅ ส่งกลับ token เพื่อ debug หรือใช้งานต่อ
  res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: req.headers, // ⬅️ ส่ง header กลับมาด้วยเพื่อ debug
  });
}
