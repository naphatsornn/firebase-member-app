import admin from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    // ✅ ผ่าน token verification แล้ว
    res.status(200).json({
      message: "Access granted ✅",
      uid,
      email: decoded.email,
    });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
}
