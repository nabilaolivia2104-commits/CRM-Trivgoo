const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getAccountByRole = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT * FROM accounts WHERE role = ?`, [
      "sales",
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client tidak ditemukan",
      });
    }

    res.json({
      success: true,
      client: rows,
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /v1/sales
 */
exports.addSales = async (req, res) => {
  try {
    const { team_id, nama, no_hp, email, password, role } = req.body;

    if (!email || !password || !nama) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan password wajib diisi",
      });
    }

    // cek email duplikat
    const [exist] = await db.query("SELECT id FROM accounts WHERE email = ?", [
      email,
    ]);

    if (exist.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO accounts 
        (team_id, nama, no_hp, email, password, role)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [team_id || null, nama, no_hp || null, email, hashedPassword, role],
    );

    res.status(201).json({
      success: true,
      message: "Sales berhasil ditambahkan",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { team_id, nama, no_hp, email, old_password, new_password } =
      req.body;

    const fields = [];
    const values = [];

    if (team_id !== undefined) {
      fields.push("team_id = ?");
      values.push(team_id);
    }
    if (nama) {
      fields.push("nama = ?");
      values.push(nama);
    }
    if (no_hp) {
      fields.push("no_hp = ?");
      values.push(no_hp);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }

    // 🔐 JIKA MAU GANTI PASSWORD
    if (new_password) {
      if (!old_password) {
        return res.status(400).json({
          success: false,
          message: "Password lama wajib diisi",
        });
      }

      // ambil password lama
      const [[user]] = await db.query(
        "SELECT password FROM accounts WHERE id = ? AND role = 'sales'",
        [id],
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Sales tidak ditemukan",
        });
      }

      const match = await bcrypt.compare(old_password, user.password);
      if (!match) {
        return res.status(401).json({
          success: false,
          message: "Password lama salah",
        });
      }

      const hashed = await bcrypt.hash(new_password, 10);
      fields.push("password = ?");
      values.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data untuk diupdate",
      });
    }

    values.push(id);

    await db.query(
      `UPDATE accounts SET ${fields.join(", ")} WHERE id = ? AND role = 'sales'`,
      values,
    );

    res.json({
      success: true,
      message: "Sales berhasil diperbarui",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /v1/sales/:id
 */
exports.deleteSales = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      "DELETE FROM accounts WHERE id = ? AND role = ?",
      [id, "sales"],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Sales tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Sales berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSalesById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT id, team_id, nama, no_hp, email, role, created_at
       FROM accounts
       WHERE id = ? AND role = ?`,
      [id, "sales"],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Sales tidak ditemukan",
      });
    }

    res.json({
      success: true,
      sales: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
