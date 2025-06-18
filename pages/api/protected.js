// pages/api/protected.js

export default function handler(req, res) {
  const headers = req.headers;

  // ✅ LOG header เฉพาะที่เราต้องการดู
  console.log("🔥 Raw Token Candidates:", {
    'tmn-access-token': headers["tmn-access-token"],
    'x-access-token': headers["x-access-token"],
    'authorization': headers["authorization"],
  });

  // ✅ ตรวจสอบหลายรูปแบบ
  const token =
    headers["tmn-access-token"] ||
    headers["tmn_access_token"] ||
    headers["x-access-token"] ||
    headers["x-tmn-access-token"] ||
    headers["custom-tmn-token"] ||
    (headers.authorization?.startsWith("Bearer ")
      ? headers.authorization.split("Bearer ")[1]
      : null);

  if (!token) {
    return res.status(401).json({
      error: "❌ Token not found",
      allHeaders: headers, // debug เพิ่มเติม
    });
  }

  return res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: headers,
  });
}
