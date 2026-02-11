const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password, nama } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi",
      });
    }

    const [users] = await db.query(
      "SELECT id, nama, no_hp, email, password, role FROM accounts WHERE email = ? OR nama = ?",
      [email, nama],
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        email: user.email,
        nama: user.nama,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      success: true,
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
