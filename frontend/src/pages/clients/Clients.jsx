import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Clients() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get("/v1/client");
      setClients(res.data.clients);
    } catch (err) {
      console.error(err);
      alert("Gagal ambil data client");
    }
  };
  const handleDownload = (docPath) => {
    if (!docPath) return alert("Tidak ada dokumen untuk client ini");
    // Buat link sementara untuk download
    const link = document.createElement("a");
    link.href = docPath; // ini path/file URL dari db
    link.download = docPath.split("/").pop(); // nama file
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (id) => {
    if (!id) return;
    navigate(`/clients/${id}/edit`);
  };

  const handleDelete = (id) => {
    if (!id) return;

    // Buat toast custom sebagai konfirmasi
    const ToastConfirm = ({ closeToast }) => (
      <div>
        <p>Apakah Anda yakin ingin menghapus client ini?</p>
        <div className="d-flex justify-content-end mt-2">
          <button
            className="btn btn-sm btn-danger me-2"
            onClick={async () => {
              try {
                await api.delete(`/v1/client/${id}`);
                toast.success("Client berhasil dihapus");
                setClients(clients.filter((c) => c.id !== id));
              } catch (err) {
                console.error(err);
                toast.error("Gagal menghapus client");
              } finally {
                closeToast(); // tutup toast
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

  return (
    <div>
      <h2 className="text-muted">Daftar Clients</h2>
      <p className="text-muted">
        Ini halaman untuk melihat daftar clients perusahaan.
      </p>
      <div className="d-flex align-items-center justify-content-end mb-3">
        {/* Tombol Tambah Client */}
        <button
          className="btn btn-warning me-2"
          onClick={() => navigate("/clients/add")} // pastikan useNavigate sudah diimport
        >
          <i className="bi bi-person-fill-add"></i>
        </button>

        {/* Input Search */}
        <input
          type="text"
          className="form-control w-25"
          placeholder="Cari client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Owner</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Data client belum ada
              </td>
            </tr>
          ) : (
            clients.map((c, index) => (
              <tr key={c.id}>
                <td>{index + 1}</td>
                <td>{c.nama}</td>
                <td>{c.email}</td>
                <td>{c.no_hp || "-"}</td>
                <td>{c.owner_name}</td>
                <td>{c.status}</td>
                <td>
                  {/* Dropup dengan ikon saja dan z-index tinggi */}
                  <div
                    className="dropup"
                    style={{ position: "relative", zIndex: 1050 }}
                  >
                    <button
                      className="btn btn-light btn-sm"
                      type="button"
                      id={`dropdownMenuButton-${c.id}`}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-three-dots-vertical"></i>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby={`dropdownMenuButton-${c.id}`}
                      style={{ zIndex: 2000 }}
                    >
                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handleDownload(c.doc)}
                        >
                          <i className="bi bi-arrow-down-circle me-2"></i>
                          Download
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center"
                          onClick={() => handleEdit(c.id)}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Edit
                        </button>
                      </li>

                      <li>
                        <button
                          className="dropdown-item d-flex align-items-center text-danger"
                          onClick={() => handleDelete(c.id)}
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
