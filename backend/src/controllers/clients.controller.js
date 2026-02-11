const db = require("../config/db");
const path = require("path");
const fs = require("fs");

exports.addClient = async (req, res) => {
  try {
    const { nama, no_hp, email, owner, status, geo_map } = req.body;
    const file = req.file; // file doc yang diupload

    if (!nama || !email) {
      return res.status(400).json({ message: "Nama dan email wajib diisi" });
    }

    // 1️⃣ Generate client_id otomatis
    let client_id = "CLN001";

    // 2️⃣ Path file doc
    let docPath = null;
    if (file) {
      // simpan relative path supaya bisa diakses frontend
      docPath = path.join("upload/clients", file.filename);
    }

    // 3️⃣ Insert ke database
    const [result] = await db.query(
      "INSERT INTO client (client_id, nama, email, no_hp, owner, status, doc, geo_map) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [client_id, nama, email, no_hp, owner, status, docPath, geo_map],
    );

    res.json({
      success: true,
      message: "Client berhasil ditambahkan",
      clientId: result.insertId,
      clientCode: client_id,
      doc: docPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const [clients] = await db.query(`
      SELECT 
        c.*,
        a.nama AS owner_name
      FROM client c
      LEFT JOIN accounts a ON c.owner = a.id
      ORDER BY c.id DESC
    `);

    res.json({
      success: true,
      clients,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClientsById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT id, nama, email, no_hp, owner, status, doc
      FROM client
      WHERE id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client tidak ditemukan",
      });
    }

    res.json({
      success: true,
      client: rows[0], // satu data saja
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, email, no_hp, status } = req.body;
    const file = req.file;

    if (!nama || !email || !status) {
      return res.status(400).json({
        success: false,
        message: "Nama, email, dan status wajib diisi",
      });
    }

    // 1️⃣ Ambil data client lama
    const [rows] = await db.query("SELECT doc FROM client WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client tidak ditemukan",
      });
    }

    let docPath = rows[0].doc; // default: pakai file lama

    // 2️⃣ Jika upload file baru
    if (file) {
      docPath = path.join("upload/clients", file.filename);

      // hapus file lama jika ada
      if (rows[0].doc) {
        const oldPath = path.join(__dirname, "..", rows[0].doc);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    // 3️⃣ Update database
    await db.query(
      `
      UPDATE client
      SET nama = ?, email = ?, no_hp = ?, status = ?, doc = ?
      WHERE id = ?
      `,
      [nama, email, no_hp, status, docPath, id],
    );

    res.json({
      success: true,
      message: "Client berhasil diperbarui",
      doc: docPath,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Ambil data client (untuk cek & ambil path doc)
    const [rows] = await db.query("SELECT doc FROM client WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client tidak ditemukan",
      });
    }

    const docPath = rows[0].doc;

    // 2️⃣ Hapus file dokumen jika ada
    if (docPath) {
      const filePath = path.join(__dirname, "..", docPath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // 3️⃣ Hapus data client dari database
    await db.query("DELETE FROM client WHERE id = ?", [id]);

    res.json({
      success: true,
      message: "Client dan dokumen berhasil dihapus",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
