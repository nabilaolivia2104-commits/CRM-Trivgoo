import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_hp: "",
    status: "new",
  });

  const [docFile, setDocFile] = useState(null);
  const [existingDoc, setExistingDoc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    try {
      const res = await api.get(`/v1/client/${id}`);
      const data = res.data.client;

      setForm({
        nama: data.nama || "",
        email: data.email || "",
        no_hp: data.no_hp || "",
        status: data.status || "new",
      });

      setExistingDoc(data.doc || "");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data client");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.startsWith("0")) value = value.substring(1);
    setForm((prev) => ({ ...prev, no_hp: value }));
  };

  const handleFile = (e) => {
    setDocFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama || !form.email || !form.no_hp || !form.status) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (docFile) {
        formData.append("doc", docFile);
      }

      const res = await api.put(`/v1/client/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message || "Client berhasil diperbarui");
      navigate("/clients");
    } catch (err) {
      console.error(err);
      toast.error("Gagal memperbarui client");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExistingDoc = () => {
    if (!existingDoc) {
      toast.error("Tidak ada dokumen untuk client ini");
      return;
    }

    const link = document.createElement("a");
    link.href = existingDoc;
    link.download = existingDoc.split("/").pop();
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mt-4">
      <h2>Edit Client</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="text-muted small">Nama</label>
          <input
            type="text"
            name="nama"
            className="form-control"
            value={form.nama}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="text-muted small">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="text-muted small">Telepon</label>
          <div className="input-group">
            <span className="input-group-text">+62</span>
            <input
              type="text"
              className="form-control"
              value={form.no_hp}
              onChange={handlePhoneChange}
              placeholder="8123456789"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="text-muted small">Status</label>
          <select
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}
          >
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="discussion">Discussion</option>
            <option value="negotioation">Negotioation</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Meeting Document</label>
          <div className="d-flex align-items-center">
            <input
              type="file"
              id="docFile"
              accept=".txt,.doc,.docx"
              className="d-none"
              onChange={handleFile}
            />

            <label
              htmlFor="docFile"
              className="btn btn-outline-secondary d-flex align-items-center"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-file-earmark-arrow-up-fill me-2"></i>
              Upload File Baru
            </label>

            {docFile && (
              <span
                className="ms-3 text-truncate"
                style={{ maxWidth: "200px" }}
              >
                {docFile.name}
              </span>
            )}

            {!docFile && existingDoc && (
              <button
                type="button"
                className="btn btn-link ms-3"
                onClick={handleDownloadExistingDoc}
              >
                Download File Lama
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-warning me-3"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Save"}
        </button>

        <button
          type="button"
          className="btn border border-danger"
          onClick={() => navigate("/clients")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
