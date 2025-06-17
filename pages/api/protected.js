// pages/api/protected.js

import admin from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    // Optional: ดึงข้อมูลผู้ใช้จาก Firestore ถ้ามี
    const userDoc = await admin.firestore().collection("users").doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : null;

    // ส่งข้อมูลกลับ
    return res.status(200).json({
      message: "Access granted ✅",
      uid,
      email: decodedToken.email,
      userData,
    });
  } catch (error) {
    console.error("❌ Token verification failed:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
