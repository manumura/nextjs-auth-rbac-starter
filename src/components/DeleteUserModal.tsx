import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteUser } from "../lib/api";
import Modal from "./Modal";

const DeleteUserModal = ({ user, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    onClose(false);
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      // TODO remove this
      await sleep(1000);
      const res = await deleteUser(user?.id);
      if (res?.data) {
        toast(`User successfully deleted: ${user.name}`, {
          type: "success",
          position: "top-center",
        });
        onClose(true);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // TODO test to remove
  function sleep(ms) {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
  }

  const btnClass = clsx(
    "btn-outline btn-accent btn mx-1",
    `${loading ? "loading" : ""}`,
  );

  const title = (
    <div>
      <h3 className="text-lg font-bold">CONFIRM DELETE</h3>
    </div>
  );

  const body = (
    <div className="mt-5">
      Are you sure you want to delete this user <b>{user?.name}</b> ?
    </div>
  );

  const footer = (
    <div className="flex">
      <button id="btn-delete" className={btnClass} onClick={onDelete}>
        Delete
      </button>
      <button
        id="btn-cancel"
        className="btn-outline btn-ghost btn mx-1"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );

  return (
    <Modal
      title={title}
      body={body}
      footer={footer}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default DeleteUserModal;
