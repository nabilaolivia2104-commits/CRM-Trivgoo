import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function EditDeals() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    proposal_id: "",
    client_id: "",
    status: "close",
  });

  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetchProposals();
    fetchDeal();
  }, []);

  // =============================
  // FETCH PROPOSALS
  // =============================
  const fetchProposals = async () => {
    try {
      const res = await api.get("/v1/proposal");
      setProposals(res.data.proposal || []);
    } catch (err) {
      toast.error("Gagal mengambil data proposal");
    }
  };

  // =============================
  // FETCH DEAL BY ID
  // =============================
  const fetchDeal = async () => {
    try {
      const res = await api.get(`/v1/deal/${id}`);
      const deal = res.data.data;

      setForm({
        proposal_id: deal.proposal_id,
        client_id: deal.client_id,
        status: deal.status,
      });
    } catch (err) {
      toast.error("Gagal mengambil data deal");
      navigate("/deals");
    }
  };

  // =============================
  // HANDLE CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "proposal_id") {
      const selectedProposal = proposals.find((p) => p.id === Number(value));
      setForm({
        ...form,
        proposal_id: value,
        client_id: selectedProposal ? selectedProposal.client_id : "",
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  // =============================
  // HANDLE SUBMIT
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.proposal_id || !form.client_id) {
      return toast.error("Proposal wajib dipilih");
    }

    try {
      await api.put(`/v1/deal/${id}`, form);
      toast.success("Deal berhasil diperbarui");
      navigate("/deals");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui deal");
    }
  };

  // =============================
  // UI
  // =============================
  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Edit Deal</h5>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card-body">
            {/* Proposal */}
            <div className="mb-3">
              <label className="form-label">Proposal</label>
              <select
                name="proposal_id"
                className="form-select"
                value={form.proposal_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Pilih Proposal --</option>
                {proposals.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.no_proposal} - {p.client_nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Client (Readonly / Auto Fill) */}
            <div className="mb-3">
              <label className="form-label">Client</label>
              <input
                type="text"
                className="form-control"
                value={
                  proposals.find((p) => p.id === Number(form.proposal_id))
                    ?.client_nama || ""
                }
                readOnly
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
                <option value="paid">Paid</option>
                <option value="close">Close</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          <div className="card-footer d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/deals")}
            >
              Batal
            </button>

            <button type="submit" className="btn btn-primary">
              Update Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
