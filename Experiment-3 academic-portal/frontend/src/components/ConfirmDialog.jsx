import React from "react";
import Modal from "./Modal";

export default function ConfirmDialog({ open, title = "Are you sure?", message, onCancel, onConfirm }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-danger" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
