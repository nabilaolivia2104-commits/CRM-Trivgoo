import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function EditSales() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    team_id: "",
    nama: "",
    no_hp: "",
    email: "",
    role: "sales",
    old_password: "",
    new_password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSales();
  }, [id]);

  const fetchSales = async () => {
    try {
      const res = await api.get(`/v1/sales/${id}`);
      const data = res.data.sales;

      setForm({
        team_id: data.team_id || "",
        nama: data.nama || "",
        no_hp: data.no_hp || "",
        email: data.email || "",
        role: data.role || "sales",
        password: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil data sales");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.team_id || !form.nama || !form.email) {
      toast.error("Team, Nama dan Email wajib diisi!");
      return;
    }

    // 🔐 VALIDASI PASSWORD
    if (form.new_password && !form.old_password) {
      toast.error("Password lama wajib diisi!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        team_id: Number(form.team_id),
        nama: form.nama,
        no_hp: form.no_hp,
        email: form.email,
        role: form.role,
      };

      if (form.new_password) {
        payload.old_password = form.old_password;
        payload.new_password = form.new_password;
      }

      const res = await api.put(`/v1/sales/${id}`, payload);
      toast.success(res.data.message || "Sales berhasil diperbarui");
      navigate("/sales");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal update sales");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Sales</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="text-muted small">Team ID</label>
          <input
            type="number"
            name="team_id"
            className="form-control"
            value={form.team_id}
            onChange={handleChange}
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
          <label className="text-muted small">Password Lama</label>
          <input
            type="password"
            name="old_password"
            className="form-control"
            value={form.old_password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="text-muted small">Password Baru</label>
          <input
            type="password"
            name="new_password"
            className="form-control"
            value={form.new_password}
            onChange={handleChange}
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
          {loading ? "Menyimpan..." : "Save"}
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
