// pages/api/protected.js

export default function handler(req, res) {
  const headers = req.headers;

  // ✅ รองรับทุกเคส: tmn-access-token, x-access-token, Authorization: Bearer <token>
  const token =
    headers['tmn-access-token'] ||
    headers['x-access-token'] ||
    (headers.authorization?.startsWith("Bearer ")
      ? headers.authorization.split("Bearer ")[1]
      : null);

  if (!token) {
    return res.status(401).json({
      error: "❌ Token not found in known headers",
      allHeaders: headers, // debug headers ทั้งหมด
    });
  }

  return res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: headers,
  });
}
