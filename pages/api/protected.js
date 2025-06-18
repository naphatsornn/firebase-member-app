// pages/api/protected.js

export default function handler(req, res) {
  const headers = req.headers;

  // ✅ Log headers เพื่อ debug
  console.log("🧪 Incoming Headers:", headers);

  // ✅ กรณีพิเศษ: Token อาจอยู่ใน x-vercel-sc-headers → ต้อง parse JSON ก่อน
  let embeddedToken = null;
  try {
    const vercelHeader = headers["x-vercel-sc-headers"];
    if (vercelHeader) {
      const parsed = JSON.parse(vercelHeader);
      if (parsed.Authorization?.startsWith("Bearer ")) {
        embeddedToken = parsed.Authorization.split("Bearer ")[1];
      }
    }
  } catch (err) {
    console.warn("⚠️ Failed to parse x-vercel-sc-headers:", err);
  }

  // ✅ รวมหลายรูปแบบ header ที่อาจส่งมา
  const token =
    headers["tmn-access-token"] ||        // มาตรฐาน
    headers["tmn_access_token"] ||        // normalize เป็น _
    headers["x-access-token"] ||          // fallback
    headers["x-tmn-access-token"] ||      // บางระบบอาจใช้แบบนี้
    headers["custom-tmn-token"] ||        // custom
    (headers.authorization?.startsWith("Bearer ")
      ? headers.authorization.split("Bearer ")[1]
      : null) ||
    embeddedToken;                        // fallback จาก x-vercel-sc-headers

  // ❌ ไม่พบ token
  if (!token) {
    return res.status(401).json({
      error: "❌ Token not found",
      allHeaders: headers,
    });
  }

  // ✅ พบ token ส่งกลับ
  return res.status(200).json({
    message: "✅ Token received",
    token,
    allHeaders: headers,
  });
}
