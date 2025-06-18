export default function handler(req, res) {
  const headers = req.headers;

  console.log("🧪 Incoming Headers:", headers);

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
      allHeaders: headers,
    });
  }

  return res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: headers,
  });
}
