import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Proposal() {
  const [search, setSearch] = useState("");
  const [proposals, setProposals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const res = await api.get("/v1/proposal");
      setProposals(res.data.proposal);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data proposal");
    }
  };

  const handleEdit = (id) => {
    navigate(`/proposal/${id}/edit`);
  };

  const handleDelete = (id) => {
    const ToastConfirm = ({ closeToast }) => (
      <div>
        <p>Yakin ingin menghapus proposal ini?</p>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={async () => {
              try {
                await api.delete(`/v1/proposal/${id}`);
                toast.success("Proposal berhasil dihapus");
                setProposals(proposals.filter((p) => p.id !== id));
              } catch (err) {
                toast.error("Gagal menghapus proposal");
              } finally {
                closeToast();
              }
            }}
          >
            Ya
          </button>
          <button className="btn btn-sm btn-secondary" onClick={closeToast}>
            Tidak
          </button>
        </div>
      </div>
    );

    toast.info(<ToastConfirm />, {
      autoClose: false,
      closeButton: false,
    });
  };

  const filteredData = proposals.filter((p) =>
    p.no_proposal.toLowerCase().includes(search.toLowerCase()),
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDetail = (id) => {
    navigate(`/proposal/${id}/detail`);
  };

  return (
    <div>
      <h2 className="text-muted">Daftar Proposal</h2>
      <p className="text-muted">
        Ini halaman untuk melihat daftar proposal perusahaan.
      </p>

      <div className="d-flex align-items-center justify-content-end mb-3">
        <button
          className="btn btn-warning me-2"
          onClick={() => navigate("/proposal/add")}
        >
          <i className="bi bi-file-earmark-plus"></i>
        </button>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Cari nomor proposal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>No Proposal</th>
            <th>Client</th>
            <th>Need</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Total Budget</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                Data proposal belum ada
              </td>
            </tr>
          ) : (
            filteredData.map((p, index) => (
              <tr key={p.id}>
                <td>{index + 1}</td>
                <td>{p.no_proposal}</td>
                <td>{p.client_nama}</td>
                <td>{p.need_nama}</td>
                <td>{formatDate(p.req_date)}</td>
                <td>
                  <span
                    className={`badge ${
                      p.status === "accept"
                        ? "bg-success"
                        : p.status === "lose"
                          ? "bg-danger"
                          : p.status === "review"
                            ? "bg-primary"
                            : p.status === "revised"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>{formatCurrency(p.total_budget)}</td>
                <td>
                  <div
                    className="dropup"
                    style={{ position: "relative", zIndex: 1050 }}
                  >
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleDetail(p.id)}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Detail
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleEdit(p.id)}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Edit
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(p.id)}
                        >
                          <i className="bi bi-trash me-2"></i>
                          Hapus
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
