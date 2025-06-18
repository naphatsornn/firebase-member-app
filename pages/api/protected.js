export const config = {
  runtime: "edge", // ✅ ใช้ Edge Runtime
};

export default async function handler(req) {
  const headers = req.headers;

  // ✅ Log header ที่รับมาแบบละเอียด
  console.log("🔥 Raw Token Candidates:", {
    "tmn-access-token": headers.get("tmn-access-token"),
    "x-access-token": headers.get("x-access-token"),
    authorization: headers.get("authorization"),
  });

  // ✅ ดึง token แบบปลอดภัยใน Edge Runtime
  const token =
    headers.get("tmn-access-token") ||
    headers.get("x-access-token") ||
    (headers.get("authorization")?.startsWith("Bearer ")
      ? headers.get("authorization").split("Bearer ")[1]
      : null);

  // ✅ สร้าง JSON response
  return new Response(
    JSON.stringify({
      message: token ? "✅ Token received" : "❌ Token not found",
      token,
      allHeaders: Object.fromEntries(headers), // ✅ แปลง Headers เป็น object
    }),
    {
      status: token ? 200 : 401,
      headers: { "Content-Type": "application/json" },
    }
  );
}
