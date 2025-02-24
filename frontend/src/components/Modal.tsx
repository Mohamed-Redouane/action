import React from "react";

interface ModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div data-testid="modal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
        <p className="text-lg font-semibold">{message}</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            data-testid="modal-confirm"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
          data-testid="modal-cancel"
            className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;