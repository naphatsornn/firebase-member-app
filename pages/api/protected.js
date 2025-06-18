// pages/api/protected.js

export default function handler(req, res) {
  const headers = req.headers;

  // ✅ Log headers เพื่อ debug ว่า TMN header มาไหม
  console.log("🧪 Incoming Headers:", headers);

  // ✅ รองรับหลายรูปแบบ header
  const token =
    headers["tmn-access-token"] ||        // แบบปกติ
    headers["tmn_access_token"] ||        // แบบ normalize เป็น _
    headers["x-access-token"] || 
    headers["x-tmn-access-token"]
    headers["custom-tmn-token"]
         // แบบ custom
    (headers.authorization?.startsWith("Bearer ")
      ? headers.authorization.split("Bearer ")[1]
      : null);

  if (!token) {
    return res.status(401).json({
      error: "❌ Token not found",
      allHeaders: headers, // ส่ง headers กลับไปให้ตรวจสอบ
    });
  }

  return res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: headers,
  });
}
