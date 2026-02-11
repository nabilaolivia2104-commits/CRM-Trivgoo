import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddProposal() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    no_proposal: "",
    client_id: "",
    need_id: "",
    req_date: "",
    status: "send",
    budget: 0,
    qty: 1,
    total_budget: 0,
  });

  const [clients, setClients] = useState([]);
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchNeeds();
  }, []);

  // =============================
  // FETCH DATA
  // =============================

  const fetchClients = async () => {
    try {
      const res = await api.get("/v1/client");
      setClients(res.data.clients);
    } catch (err) {
      toast.error("Gagal mengambil data client");
    }
  };

  const fetchNeeds = async () => {
    try {
      const res = await api.get("/v1/proposal/need");
      setNeeds(res.data.proposal);
    } catch (err) {
      toast.error("Gagal mengambil data need");
    }
  };

  // =============================
  // HANDLE CHANGE
  // =============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = {
      ...form,
      [name]: value,
    };

    // auto hitung total budget
    if (name === "budget" || name === "qty") {
      const budget =
        name === "budget" ? Number(value) : Number(updatedForm.budget);
      const qty = name === "qty" ? Number(value) : Number(updatedForm.qty);

      updatedForm.total_budget = budget * qty;
    }

    setForm(updatedForm);
  };

  // =============================
  // HANDLE SUBMIT
  // =============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/v1/proposal", form);
      toast.success("Proposal berhasil dibuat");
      navigate("/proposal");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal membuat proposal");
    }
  };

  // =============================
  // UI
  // =============================

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-dark">
          <h5 className="mb-0">Tambah Proposal</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            {/* No Proposal */}
            <div className="mb-3">
              <label className="form-label">No Proposal</label>
              <input
                type="text"
                name="no_proposal"
                className="form-control"
                value={form.no_proposal}
                onChange={handleChange}
                required
              />
            </div>

            {/* Client */}
            <div className="mb-3">
              <label className="form-label">Client</label>
              <select
                name="client_id"
                className="form-select"
                value={form.client_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Client --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Need */}
            <div className="mb-3">
              <label className="form-label">Need</label>
              <select
                name="need_id"
                className="form-select"
                value={form.need_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Need --</option>
                {needs.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal */}
            <div className="mb-3">
              <label className="form-label">Tanggal Request</label>
              <input
                type="date"
                name="req_date"
                className="form-control"
                value={form.req_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Status */}
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="send">Send</option>
                <option value="review">Review</option>
                <option value="revised">Revised</option>
                <option value="submit">Submit</option>
                <option value="accept">Accept</option>
                <option value="lose">Lose</option>
              </select>
            </div>

            <hr />

            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Budget per Unit</label>
                <input
                  type="number"
                  name="budget"
                  className="form-control"
                  value={form.budget}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Qty</label>
                <input
                  type="number"
                  name="qty"
                  className="form-control"
                  value={form.qty}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Total Budget</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.total_budget}
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/proposal")}
            >
              Batal
            </button>

            <button type="submit" className="btn btn-warning">
              Simpan Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
