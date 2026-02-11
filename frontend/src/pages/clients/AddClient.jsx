import { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function AddClient() {
  const user = useAuth();
  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_hp: "",
    owner: user.user.id || "",
    status: "new",
    geo_map: "",
  });

  const [docFile, setDocFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFile = (e) => {
    setDocFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nama.trim() ||
      !form.email.trim() ||
      !form.no_hp.trim() ||
      !form.owner ||
      !form.status.trim() ||
      !form.geo_map.trim()
    ) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      if (docFile) formData.append("doc", docFile);

      const res = await api.post("/v1/client", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      console.log(res.data);
      setForm({
        nama: "",
        email: "",
        no_hp: "",
        owner: user.user.id || "",
        status: "",
        geo_map: "",
      });
      setDocFile(null);
      navigate("/clients");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan client");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    // Hilangkan semua karakter selain angka
    value = value.replace(/\D/g, "");

    // Hilangkan 0 di awal jika user ketik
    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    setForm({ ...form, no_hp: value });
  };

  const [gettingLocation, setGettingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung Geolocation.");
      return;
    }

    setGettingLocation(true); // mulai loading
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setForm({ ...form, geo_map: mapsLink });
        setGettingLocation(false); // selesai
        toast.success("Lokasi berhasil diambil!");
      },
      (error) => {
        console.error(error);
        setGettingLocation(false); // selesai walau gagal
        toast.error(
          "Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.",
        );
      },
    );
  };

  return (
    <div className="container mt-4">
      <h2>Tambah Client Baru</h2>
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
              name="no_hp"
              className="form-control"
              value={form.no_hp} // Hanya nomor sisanya, tanpa 0 di awal
              onChange={handlePhoneChange}
              placeholder="8123456789"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="text-muted small">Owner</label>
          <input
            type="number"
            name="owner"
            className="form-control text-muted"
            value={form.owner}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="mb-3">
          <select
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}
          >
            <option value="new">New</option>
            <option value="qualified">Qualified</option>
            <option value="discussion">Discussion</option>
            <option value="negotiation">Negotiation</option>
          </select>
        </div>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleGetLocation}
            disabled={gettingLocation} // disable sementara geolocation
          >
            {gettingLocation ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Get Location"
            )}
          </button>
        </div>

        <div className="mb-3">
          <label className="text-muted small">Geo Map</label>
          <input
            type="text"
            name="geo_map"
            className="form-control text-muted"
            value={form.geo_map}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Meeting</label>
          <div className="d-flex align-items-center">
            {/* Input file asli disembunyikan */}
            <input
              type="file"
              id="docFile"
              name="doc"
              accept=".txt,.doc,.docx"
              className="d-none"
              onChange={handleFile}
            />

            {/* Label custom sebagai tombol */}
            <label
              htmlFor="docFile"
              className="btn btn-outline-secondary d-flex align-items-center"
              style={{ cursor: "pointer" }}
            >
              <i className="bi bi-file-earmark-arrow-up-fill me-3"></i>
              Upload File
            </label>

            {/* Tampilkan nama file jika sudah dipilih */}
            {docFile && (
              <span
                className="ms-3 text-truncate"
                style={{ maxWidth: "200px" }}
              >
                {docFile.name}
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-warning me-3"
          disabled={loading}
        >
          {loading ? "Mengirim..." : <i className="bi bi-floppy2"> Save</i>}
        </button>
        <button
          type="submit"
          className="btn border border-danger"
          onClick={() => navigate("/clients")}
        >
          <i className="bi bi-x text-danger"> Cancel</i>
        </button>
      </form>
    </div>
  );
}
