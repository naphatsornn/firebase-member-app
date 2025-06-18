// pages/api/protected.js

export default function handler(req, res) {
  const headers = req.headers;

  // ✅ ดึง token จากหลายแหล่ง
  const token =
    headers['tmn-access-token'] || // Truemoney Header
    headers['x-access-token'] || // Custom Header
    (headers.authorization?.startsWith("Bearer ")
      ? headers.authorization.split("Bearer ")[1]
      : null);

  if (!token) {
    return res.status(401).json({
      error: "❌ Token not found in known headers",
      allHeaders: headers,
    });
  }

  return res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: headers, // ส่ง header กลับมาทั้งหมดเพื่อ debug
  });
}
