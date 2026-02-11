import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Deals() {
  const [search, setSearch] = useState("");
  const [deals, setDeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const res = await api.get("/v1/deal");
      setDeals(res.data.deals);
      console.log(res.data.deals || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data deal");
    }
  };

  const handleDelete = (id) => {
    const ToastConfirm = ({ closeToast }) => (
      <div>
        <p>Yakin ingin menghapus deal ini?</p>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={async () => {
              try {
                await api.delete(`/v1/deal/${id}`);
                toast.success("Deal berhasil dihapus");
                setDeals(deals.filter((d) => d.id !== id));
              } catch (err) {
                toast.error("Gagal menghapus deal");
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

  const renderStatusBadge = (status) => {
    const statusClass =
      status === "paid"
        ? "bg-success"
        : status === "close"
          ? "bg-primary"
          : status === "lose"
            ? "bg-danger"
            : "bg-secondary";

    return <span className={`badge ${statusClass}`}>{status}</span>;
  };

  return (
    <div>
      <h2 className="text-muted">Daftar Deals</h2>
      <p className="text-muted">
        Ini halaman untuk melihat daftar deal yang sudah masuk.
      </p>

      <div className="d-flex align-items-center justify-content-end mb-3">
        <button
          className="btn btn-warning me-2"
          onClick={() => navigate("/deals/add")}
        >
          <i className="bi bi-plus-circle"></i>
        </button>

        <input
          type="text"
          className="form-control w-25"
          placeholder="Cari client..."
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
            <th>Sales</th>
            <th>Total Budget</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {deals.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                Belum ada deal
              </td>
            </tr>
          ) : (
            deals.map((d, index) => (
              <tr key={d.id}>
                <td>{index + 1}</td>
                <td>{d.no_proposal}</td>
                <td>{d.client_nama}</td>
                <td>{d.sales_nama}</td>
                <td>
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(d.total_budget)}
                </td>
                <td>{renderStatusBadge(d.status)}</td>
                <td>{new Date(d.created_at).toLocaleDateString("id-ID")}</td>
                <td>
                  <div className="dropup" style={{ zIndex: 1050 }}>
                    <button
                      className="btn btn-light btn-sm"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => navigate(`/deals/${d.id}/edit`)}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Edit
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(d.id)}
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
