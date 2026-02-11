const db = require("../config/db");

exports.createProposal = async (req, res) => {
  try {
    const { no_proposal, client_id, need_id, req_date,dateline, status, budget, qty } =
      req.body;

    // =========================
    // VALIDASI WAJIB
    // =========================
    if (!no_proposal || !client_id || !need_id || !req_date) {
      return res.status(400).json({
        success: false,
        message: "Field wajib belum lengkap",
      });
    }

    // =========================
    // CEK NO PROPOSAL DUPLIKAT
    // =========================
    const [checkProposal] = await db.query(
      "SELECT id FROM proposal WHERE no_proposal = ?",
      [no_proposal],
    );

    if (checkProposal.length > 0) {
      return res.status(400).json({
        success: false,
        message: "No proposal sudah digunakan",
      });
    }

    // =========================
    // CEK CLIENT ADA
    // =========================
    const [client] = await db.query("SELECT id FROM client WHERE id = ?", [
      client_id,
    ]);

    if (client.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client tidak ditemukan",
      });
    }

    // =========================
    // CEK NEED ADA
    // =========================
    const [need] = await db.query("SELECT id FROM need WHERE id = ?", [
      need_id,
    ]);

    if (need.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Need tidak ditemukan",
      });
    }

    // =========================
    // HITUNG TOTAL
    // =========================
    const finalBudget = Number(budget || 0);
    const finalQty = Number(qty || 1);
    const total_budget = finalBudget * finalQty;

    // =========================
    // INSERT
    // =========================
    const [result] = await db.query(
      `
      INSERT INTO proposal
      (no_proposal, client_id, need_id, req_date, status, budget, qty, total_budget)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        no_proposal,
        client_id,
        need_id,
        req_date,
        status || "send",
        finalBudget,
        finalQty,
        total_budget,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Proposal berhasil dibuat",
      proposal_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllProposal = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        p.*,
        c.nama AS client_nama,
        n.nama AS need_nama
      FROM proposal p
      JOIN client c ON p.client_id = c.id
      JOIN need n ON p.need_id = n.id
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      proposal: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// exports.getProposalById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [rows] = await db.query(
//       `
//       SELECT
//         p.*,
//         c.nama AS client_nama,
//         n.nama AS need_nama
//       FROM proposal p
//       JOIN client c ON p.client_id = c.id
//       JOIN need n ON p.need_id = n.id
//       WHERE p.id = ?
//       `,
//       [id],
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Proposal tidak ditemukan",
//       });
//     }

//     res.json({
//       success: true,
//       proposal: rows[0],
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

exports.getProposalById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        p.*,
        c.nama AS client_nama,
        n.nama AS need_nama,
        u.nama AS sales_nama
      FROM proposal p
      JOIN client c ON p.client_id = c.id
      JOIN need n ON p.need_id = n.id
      LEFT JOIN accounts u ON c.owner = u.id
      WHERE p.id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Proposal tidak ditemukan",
      });
    }

    res.json({
      success: true,
      proposal: rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createProposal = async (req, res) => {
  try {
    const { no_proposal, client_id, need_id, req_date, status, budget, qty } =
      req.body;

    if (!no_proposal || !client_id || !need_id || !req_date) {
      return res.status(400).json({
        success: false,
        message: "Field wajib belum lengkap",
      });
    }

    const total_budget = Number(budget || 0) * Number(qty || 1);

    await db.query(
      `
      INSERT INTO proposal
      (no_proposal, client_id, need_id, req_date, status, budget, qty, total_budget)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        no_proposal,
        client_id,
        need_id,
        req_date,
        status || "send",
        budget || 0,
        qty || 1,
        total_budget,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Proposal berhasil dibuat",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { no_proposal, client_id, need_id, req_date, status, budget, qty } =
      req.body;

    const total_budget = Number(budget || 0) * Number(qty || 1);

    const [result] = await db.query(
      `
      UPDATE proposal SET
        no_proposal = ?,
        client_id = ?,
        need_id = ?,
        req_date = ?,
        status = ?,
        budget = ?,
        qty = ?,
        total_budget = ?
      WHERE id = ?
      `,
      [
        no_proposal,
        client_id,
        need_id,
        req_date,
        status,
        budget,
        qty,
        total_budget,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Proposal tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Proposal berhasil diupdate",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM proposal WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Proposal tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Proposal berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllNeed = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM need
    `);

    res.json({
      success: true,
      proposal: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
