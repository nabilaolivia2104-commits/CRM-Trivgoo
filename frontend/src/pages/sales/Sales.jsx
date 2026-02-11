import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function Sales() {
  const [search, setSearch] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await api.get("/v1/sales");
      console.log("API Response:", res.data);

      const data = res.data.client || [];
      setAccounts(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      toast.error("Gagal ambil data sales");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/sales/${id}/edit`);
  };

  const handleDelete = (id) => {
    const ToastConfirm = ({ closeToast }) => (
      <div>
        <p>Yakin ingin menghapus sales ini?</p>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={async () => {
              try {
                await api.delete(`/v1/sales/${id}`);
                toast.success("Sales berhasil dihapus");
                setAccounts((prev) => prev.filter((s) => s.id !== id));
              } catch (err) {
                console.error(err);
                toast.error("Gagal menghapus sales");
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

    toast.info(<ToastConfirm />, { autoClose: false, closeButton: false });
  };

  // 🔍 filter search
  const filteredSales = accounts.filter((s) =>
    `${s.nama} ${s.email}`.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Daftar Sales</h2>
      <p className="text-muted">
        Ini halaman untuk melihat daftar sales perusahaan.
      </p>
      <div className="d-flex align-items-center justify-content-end mb-3">
        {/* Tambah Sales */}
        <button
          className="btn btn-warning me-2"
          onClick={() => navigate("/sales/add")}
        >
          <i className="bi bi-person-fill-add"></i>
        </button>

        {/* Search */}
        <input
          type="text"
          className="form-control w-25"
          placeholder="Cari sales..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Nama</th>
            <th>No HP</th>
            <th>Email</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Data sales belum ada
              </td>
            </tr>
          ) : (
            filteredSales.map((a, index) => (
              <tr key={a.id}>
                <td>{index + 1}</td>
                <td>{a.team_id || "-"}</td>
                <td>{a.nama}</td>
                <td>{a.no_hp || "-"}</td>
                <td>{a.email}</td>
                <td>
                  <div className="dropup">
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
                          onClick={() => handleEdit(a.id)}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(a.id)}
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
