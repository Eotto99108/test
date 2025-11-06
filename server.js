// test/server.js
const express = require("express");
const path = require("path");
const mysql = require("mysql2/promise");

const app = express();

// MySQL 연결 (테스트용 DB)
const db = mysql.createPool({
  host: "localhost",       // Cloud SQL이면 외부 IP로 변경
  user: "root",            // 사용자명
  password: "",            // 비밀번호
  database: "test_db"      // test_db는 아래 SQL 참고
});

// 간단한 API (DB 연결 테스트)
app.get("/api/hello", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 'Hello from MySQL' AS msg");
    res.json({ message: rows[0].msg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// React build 결과물 정적 제공
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// 서버 시작
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Test server running on http://0.0.0.0:${PORT}`)
);
