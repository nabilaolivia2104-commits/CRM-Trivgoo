import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function DetailProposal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    fetchProposal();
  }, [id]);

  const fetchProposal = async () => {
    try {
      const res = await api.get(`/v1/proposal/${id}`);
      setProposal(res.data.proposal);
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengambil detail proposal");
    }
  };

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
      month: "long",
      year: "numeric",
    });
  };

  const renderStatusBadge = (status) => {
    const statusClass =
      status === "accept"
        ? "bg-success"
        : status === "lose"
          ? "bg-danger"
          : status === "review"
            ? "bg-primary"
            : status === "revised"
              ? "bg-warning text-dark"
              : "bg-secondary";

    return <span className={`badge ${statusClass}`}>{status}</span>;
  };

  if (!proposal) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Detail Proposal</h5>
          {renderStatusBadge(proposal.status)}
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>No Proposal:</strong>
              <p>{proposal.no_proposal}</p>
            </div>

            <div className="col-md-6">
              <strong>Tanggal Request:</strong>
              <p>{formatDate(proposal.req_date)}</p>
            </div>
          </div>

          <hr />

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Client:</strong>
              <p>{proposal.client_nama}</p>
            </div>

            <div className="col-md-6">
              <strong>Need:</strong>
              <p>{proposal.need_nama}</p>
            </div>
            <div className="col-md-4">
              <strong>Sales:</strong>
              <p>{proposal.sales_nama}</p>
            </div>
          </div>

          <hr />

          <h6 className="mb-3">Detail Budget</h6>

          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Budget per Unit</th>
                <th>Qty</th>
                <th>Total Budget</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatCurrency(proposal.budget)}</td>
                <td>{proposal.qty}</td>
                <td className="fw-bold">
                  {formatCurrency(proposal.total_budget)}
                </td>
              </tr>
            </tbody>
          </table>

          <hr />

          <div className="row mt-4">
            <div className="col-md-6">
              <small className="text-muted">
                Created At: {proposal.created_at}
              </small>
            </div>
            <div className="col-md-6 text-end">
              <small className="text-muted">
                Updated At: {proposal.updated_at}
              </small>
            </div>
          </div>
        </div>

        <div className="card-footer d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/proposal")}
          >
            Kembali
          </button>

          <button
            className="btn btn-warning"
            onClick={() => navigate(`/proposal/${proposal.id}/edit`)}
          >
            Edit Proposal
          </button>
        </div>
      </div>
    </div>
  );
}
