import clsx from "clsx";

const Modal = ({ title, body, footer, isOpen, onClose }) => {
  const modalClass = clsx(
    "modal modal-bottom sm:modal-middle",
    `${isOpen ? "modal-open" : ""}`,
  );

  return (
    <div className={modalClass} onClick={onClose}>
      <div className="modal-box relative">
        <button
          className="btn-sm btn-circle btn absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        {title}
        {body}
        <div className="modal-action">
          {footer}
        </div>
      </div>
    </div>
  );
};

export default Modal;
