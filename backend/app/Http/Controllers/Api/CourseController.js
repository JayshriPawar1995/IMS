import db from "../../../../config/database.js";

export const getCourses = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM coursesvvvv");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
