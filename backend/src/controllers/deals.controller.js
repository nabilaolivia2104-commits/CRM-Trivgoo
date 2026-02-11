const db = require("../config/db");

exports.createDeal = async (req, res) => {
  try {
    const { proposal_id, client_id, status } = req.body;

    if (!proposal_id || !client_id) {
      return res.status(400).json({
        success: false,
        message: "Proposal dan Client wajib diisi",
      });
    }

    const [exist] = await db.query(
      "SELECT id FROM deal WHERE proposal_id = ?",
      [proposal_id],
    );

    if (exist.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Proposal sudah menjadi deal",
      });
    }

    await db.query(
      "INSERT INTO deal (proposal_id, client_id, status) VALUES (?, ?, ?)",
      [proposal_id, client_id, status || "close"],
    );

    res.status(201).json({
      success: true,
      message: "Deal berhasil dibuat",
    });
  } catch (err) {
    console.error("Create Deal Error:", err);
    res.status(500).json({
      success: false,
      message: "Gagal membuat deal",
    });
  }
};

// exports.getDeals = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT
//         d.id,
//         d.status,
//         d.created_at,
//         p.no_proposal,
//         p.total_budget,
//         c.nama AS client_nama,
//         a.nama AS sales_nama
//       FROM deal d
//       JOIN proposal p ON d.proposal_id = p.id
//       JOIN client c ON d.client_id = c.id
//       JOIN accounts a ON p.created_by = a.id
//       ORDER BY d.created_at DESC
//     `);

//     res.status(200).json({
//       success: true,
//       total: rows.length,
//       deals: rows,
//     });
//   } catch (err) {
//     console.error("Error getDeals:", err);
//     res.status(500).json({
//       success: false,
//       message: "Gagal mengambil deal",
//     });
//   }
// };
exports.getDeals = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.id,
        d.status,
        d.created_at,
        p.no_proposal,
        p.total_budget,
        c.nama AS client_nama,
        u.nama AS sales_nama
      FROM deal d
      JOIN proposal p ON d.proposal_id = p.id
      JOIN client c ON d.client_id = c.id
      LEFT JOIN accounts u ON c.owner = u.id
      ORDER BY d.created_at DESC
    `);

    res.status(200).json({
      success: true,
      total: rows.length,
      deals: rows,
    });
  } catch (err) {
    console.error("Error getDeals:", err);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil deal",
    });
  }
};

exports.getDealById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        d.*,
        p.no_proposal,
        p.total_budget,
        c.nama AS client_name
      FROM deal d
      JOIN proposal p ON d.proposal_id = p.id
      JOIN client c ON d.client_id = c.id
      WHERE d.id = ?
    `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Deal tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error ambil detail deal",
    });
  }
};
exports.updateDeal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["paid", "close", "lose"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status tidak valid",
      });
    }

    const [result] = await db.query("UPDATE deal SET status = ? WHERE id = ?", [
      status,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Deal tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Status deal berhasil diupdate",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal update deal",
    });
  }
};
exports.deleteDeal = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM deal WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Deal tidak ditemukan",
      });
    }

    res.status(200).json({
      success: true,
      message: "Deal berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Gagal menghapus deal",
    });
  }
};
