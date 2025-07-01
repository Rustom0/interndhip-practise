/*
|--------------------------------------------------
| CustomerModal Component
|--------------------------------------------------
*/
import React, { useEffect, useRef } from "react";

const CustomerModal = ({ customer, visible, onClose }) => {
  const modalRef = useRef(null);
  const bsInstance = useRef(null);

  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    /*
    |--------------------------------------------------
    // Initialize modal only once
    |--------------------------------------------------
    */
    if (!bsInstance.current) {
      bsInstance.current = new window.bootstrap.Modal(modalEl, {
        backdrop: "static",
      });

      modalEl.addEventListener("hidden.bs.modal", () => {
        if (onClose) onClose();
      });
    }

    if (visible) {
      /*
        |--------------------------------------------------
        | Delay to show to next event loop to ensure DOM ready
        |--------------------------------------------------
        */
      setTimeout(() => {
        bsInstance.current?.show();
      }, 0);
    } else {
      bsInstance.current?.hide();
    }
    /*
    |--------------------------------------------------
    | Cleanup: Dispose of the Bootstrap modal instance
    |--------------------------------------------------
    */
    return () => {
      if (bsInstance.current) {
        bsInstance.current.dispose();
        bsInstance.current = null;
      }
    };
  }, [visible, onClose]);

  return (
    <div
      id="customerModal"
      className={`modal fade ${visible ? "show" : ""}`}
      tabIndex="-1"
      aria-modal={visible ? "true" : undefined}
      role="dialog"
      style={{ display: visible ? "block" : "none" }}
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Customer Details</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="modal-body">
            {customer ? (
              <>
                <p>
                  <strong>Name:</strong> {customer.firstname}{" "}
                  {customer.lastname}
                </p>
                <p>
                  <strong>Email:</strong> {customer.email}
                </p>
                <p>
                  <strong>Phone:</strong> {customer.phone}
                </p>
                <p>
                  <strong>Gender:</strong> {customer.gender}
                </p>
                <p>
                  <strong>Birthday:</strong> {customer.birthday}
                </p>
                <p>
                  <strong>Website:</strong> {customer.website}
                </p>
                <p>
                    <strong>Address:</strong> {customer.address.country},{customer.address.city},{customer.address.street}
                </p>
              </>
            ) : (
              <p>No customer selected.</p>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerModal;
