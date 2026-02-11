import { useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AddSales() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    team_id: "",
    nama: "",
    no_hp: "",
    email: "",
    password: "",
    role: "sales",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, ""); // hanya angka
    if (value.startsWith("0")) value = value.substring(1);
    setForm({ ...form, no_hp: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.team_id) {
      toast.error("Team wajib dipilih!");
      return;
    }

    if (!form.nama.trim()) {
      toast.error("Nama wajib diisi!");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email wajib diisi!");
      return;
    }

    if (!form.password) {
      toast.error("Password wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        team_id: Number(form.team_id), // 🔥 PENTING
      };

      const res = await api.post("/v1/sales", payload);
      toast.success(res.data.message || "Sales berhasil ditambahkan!");
      navigate("/sales");
    } catch (err) {
      console.error(err.response?.data || err);
      toast.error(err.response?.data?.message || "Gagal menambahkan sales!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Tambah Sales Baru</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="text-muted small">Team ID</label>
          <input
            type="text"
            name="team_id"
            className="form-control"
            value={form.team_id}
            onChange={(e) => setForm({ ...form, team_id: e.target.value })}
            placeholder="ID team"
            min="1"
          />
        </div>

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
          <label className="text-muted small">No HP</label>
          <div className="input-group">
            <span className="input-group-text">+62</span>
            <input
              type="text"
              name="no_hp"
              className="form-control"
              value={form.no_hp}
              onChange={handlePhoneChange}
              placeholder="8123456789"
            />
          </div>
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
          <label className="text-muted small">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="text-muted small">Role</label>
          <select
            name="role"
            className="form-control"
            value={form.role}
            onChange={handleChange}
          >
            <option value="sales">Sales</option>
            <option value="admin">Admin</option>
            <option value="bd">BD</option>
            <option value="finance">Finance</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn btn-warning me-3"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Save"}
        </button>

        <button
          type="button"
          className="btn border border-danger"
          onClick={() => navigate("/sales")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
