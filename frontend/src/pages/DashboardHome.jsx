import React from "react";

export default function DashboardHome() {
  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <p>Ini adalah halaman utama CRM perusahaan Anda.</p>

      <div className="row mt-4">
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Users</h5>
              <p className="card-text">Total 120 users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Produk</h5>
              <p className="card-text">Total 80 produk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
