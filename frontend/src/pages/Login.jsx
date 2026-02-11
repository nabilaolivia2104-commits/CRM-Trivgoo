import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoTrivgoo from "../assets/logo-trivgoo.png";
import LogoOutline from "../assets/offest-inline-trp.png";
const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      console.log("login berhasil");
      navigate("/");
    } catch (err) {
      setError("Email atau password salah");
    }
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center ">
          <div className="col-12 col-lg-8">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="row g-0">
                <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center login-bg">
                  <div className="col-12 text-center text-white">
                    <img
                      src={LogoOutline}
                      alt="logo trivgoo"
                      className="w-75"
                    />
                    <p>Welcome To Crm</p>
                    <p style={{ marginTop: "-1rem" }}>
                      Trivgoo Global Nusantara
                    </p>

                    <div className="d-flex justify-content-center gap-3 mt-3">
                      <a href="#" className="text-dark fs-5">
                        <i className="bi bi-instagram text-white"></i>
                      </a>
                      <a href="#" className="text-dark fs-5">
                        <i className="bi bi-facebook text-white"></i>
                      </a>
                      <a href="#" className="text-dark fs-5">
                        <i className="bi bi-linkedin text-white"></i>
                      </a>
                      <a href="#" className="text-dark fs-5">
                        <i className="bi bi-whatsapp text-white"></i>
                      </a>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE: Form */}
                <div className="col-12 col-lg-6 bg-white p-5 d-flex flex-column justify-content-center">
                  <div className="text-center ">
                    <img
                      src={LogoOutline}
                      alt="logo trivgoo"
                      className="w-75 "
                    />
                  </div>
                  <p className="fs-3 mb-4 text-center">Login</p>
                  <form onSubmit={submit}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label small">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control border border warning"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div>
                      <label htmlFor="password" className="form-label small">
                        Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className="form-control border border-warning"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="text-end mb-3">
                      <small>lupa password</small>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        id="showPassword"
                        className="form-check-input"
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                      />
                      <small
                        htmlFor="showPassword"
                        className="form-check-label samll"
                      >
                        Show Password
                      </small>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-warning w-100 py-2 "
                    >
                      Login
                    </button>
                    {error && (
                      <div className="mt-2 alert alert-danger text-center">
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
