// pages/api/protected.js

export default function handler(req, res) {
  const headers = req.headers;

  // ✅ Log headers เพื่อ debug
  console.log("🧪 Incoming Headers:", headers);

  // ✅ รองรับหลายรูปแบบของ header
  const token =
    headers["tmn-access-token"] ||        // มาตรฐาน
    headers["tmn_access_token"] ||        // แบบ normalize เป็น _
    headers["x-access-token"] ||          // fallback
    headers["x-tmn-access-token"] ||      // บางระบบอาจใช้แบบนี้
    headers["custom-tmn-token"] ||        // เผื่อระบบ custom
    (headers.authorization?.startsWith("Bearer ")
      ? headers.authorization.split("Bearer ")[1]
      : null);                            // fallback แบบ Authorization

  // ❌ ถ้าไม่พบ token เลย
  if (!token) {
    return res.status(401).json({
      error: "❌ Token not found",
      allHeaders: headers, // สำหรับ debug
    });
  }

  // ✅ ส่งกลับ token และ headers ที่ใช้
  return res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: headers,
  });
}
