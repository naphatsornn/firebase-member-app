// pages/api/protected.js

export default function handler(req, res) {
  const token =
    req.headers['tmn-access-token'] ||
    req.headers['x-access-token'] ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split("Bearer ")[1]
      : null);

  if (!token) {
    return res.status(401).json({
      error: "❌ Token not found in known headers",
      allHeaders: req.headers,
    });
  }

  return res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: req.headers,
  });
}
