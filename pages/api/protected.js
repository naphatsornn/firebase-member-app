// pages/api/protected.js

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split("Bearer ")[1];

  res.status(200).json({
    message: "Token received ✅",
    token, // ส่ง token กลับมา (เพื่อ debug ดูใน client)
  });
}
