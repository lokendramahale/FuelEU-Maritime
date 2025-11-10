const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const sqlPath = path.resolve(__dirname, "../../schema.sql");
    let sql = "";
    if (fs.existsSync(sqlPath)) {
      sql = fs.readFileSync(sqlPath, "utf-8");
    } else {
      const alt = path.resolve(__dirname, "../../../schema.sql");
      if (fs.existsSync(alt)) sql = fs.readFileSync(alt, "utf-8");
    }

    if (sql) {
      console.log("Running schema SQL...");
      const stmts = sql
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      for (const stmt of stmts) {
        await pool.query(stmt);
      }
      console.log("Schema applied.");
    } else {
      console.warn("schema.sql not found; skipping schema apply");
    }

    const sample = [
      { route_id: "R-BASE", year: 2025, ghg: 90.0, is_baseline: true },
      { route_id: "R-2", year: 2025, ghg: 95.2, is_baseline: false },
      { route_id: "R-3", year: 2025, ghg: 88.5, is_baseline: false },
      { route_id: "R-4", year: 2024, ghg: 92.0, is_baseline: true },
      { route_id: "R-5", year: 2024, ghg: 85.3, is_baseline: false },
    ];

    console.log("Seeding routes...");
    for (const r of sample) {
      await pool.query(
        "INSERT INTO routes (route_id, year, ghg_intensity, is_baseline) VALUES ($1,$2,$3,$4) ON CONFLICT (route_id) DO UPDATE SET ghg_intensity = EXCLUDED.ghg_intensity, is_baseline = EXCLUDED.is_baseline",
        [r.route_id, r.year, r.ghg, r.is_baseline]
      );
    }

    console.log("Seed complete.");
  } catch (err) {
    console.error("Seed failed:", err);
  } finally {
    try {
      await pool.end();
    } catch (e) {}
    process.exit(0);
  }
}

run();
