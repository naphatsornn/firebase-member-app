// pages/api/protected.js

export default async function handler(req, res) {
  // 🔍 รองรับทุกเคสของ token ที่อาจส่งมา
  const token =
    req.headers["tmn-access-token"] ||                       // 🔸 TrueMoney mini app
    req.headers["x-access-token"] ||                         // 🔹 บาง API ส่ง token ตรงนี้
    (req.headers.authorization?.startsWith("Bearer ")        // 🔸 Firebase / OAuth
      ? req.headers.authorization.split("Bearer ")[1]
      : req.headers.authorization);                          // 🔹 ถ้า auth แต่ไม่ใช่ Bearer

  if (!token) {
    return res.status(401).json({ error: "❌ No token found" });
  }

  res.status(200).json({
    message: "✅ Token received",
    token,
  });
}
