import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddDeals() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    proposal_id: "",
    client_id: "",
    status: "close",
  });

  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    fetchProposals();
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
  // HANDLE CHANGE
  // =============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Jika proposal_id berubah, otomatis set client_id
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

    // Ambil proposal yang dipilih
    const selectedProposal = proposals.find(
      (p) => p.id === Number(form.proposal_id),
    );

    // Jika proposal tidak valid
    if (!selectedProposal) {
      return toast.error("Proposal tidak valid");
    }

    // Validasi client status
    // if (selectedProposal.client_status !== "negotioation") {
    //   toast.error(
    //     `Client "${selectedProposal.client_nama}" belum negotiation, data ditolak`,
    //   );
    //   navigate("/deals"); // langsung arahkan ke /deals
    //   return; // hentikan submit
    // }
    // console.log(selectedProposal.client_status);
    try {
      await api.post("/v1/deal", form);
      toast.success("Deal berhasil dibuat");
      navigate("/deals");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal membuat deal");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Tambah Deal</h5>
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

            <button type="submit" className="btn btn-success">
              Simpan Deal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
