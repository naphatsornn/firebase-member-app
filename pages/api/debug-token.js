// pages/api/debug-token.js

export default function handler(req, res) {
  const token =
    req.headers["x-access-token"] ||  // ✅ กรณี TrueMoney ส่งแบบ custom header
    req.headers.authorization?.split(" ")[1]; // หรือ Bearer token ปกติ

  if (!token) {
    return res.status(401).json({ error: "❌ No token found in headers" });
  }

  // ✅ ส่ง token กลับมาให้ดู (สำหรับทดสอบก่อน)
  return res.status(200).json({
    message: "✅ Token received",
    token,
  });
}
