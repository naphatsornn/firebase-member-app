// pages/api/debug-token.js

export default function handler(req, res) {
  const token =
    req.headers["x-access-token"] ||
    req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token found" });
  }

  res.status(200).json({
    message: "Token received ✅",
    token,
  });
}
