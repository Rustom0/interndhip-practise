import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CustomersContext from "../CustomersContext";

const ViewProfile = () => {
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { setCustomers } = useContext(CustomersContext);

  const original = state?.customer || {};          // may be empty

  /* ✅ hook is always called – no conditional */
  const [form, setForm] = useState({ ...original });

  /* if user hit /profile directly with no data */
  if (!state?.customer) {
    return (
      <div className="container mt-4">
        No customer data.{" "}
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/")}>
          Back to list
        </button>
      </div>
    );
  }

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = () => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === form.id ? { ...form } : c))
    );
    navigate("/");                      // return to table
  };

  return (
    <div className="container mt-4">
      <h4>Edit Profile</h4>

      {["firstname", "lastname", "email", "phone", "birthday", "website"].map((field) => (
        <div className="mb-3" key={field}>
          <label className="form-label text-capitalize">{field}</label>
          <input
            className="form-control"
            name={field}
            value={form[field] || ""}
            onChange={handleChange}
          />
        </div>
      ))}

      <button className="btn btn-primary me-2" onClick={handleSave}>
        Save
      </button>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>
        Cancel
      </button>
    </div>
  );
};

export default ViewProfile;
