import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";
import { sleep } from "../lib/util";
import Modal from "./Modal";

const DeleteUserModal = ({ user, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);

  const onCancel = () => {
    onClose(false);
  };

  const onDelete = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    // TODO remove this
    await sleep(1000);
    // const res = await deleteUser(user?.id);
    const res = await fetch(`/api/users/${user.id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    setLoading(false);

    if (res.ok) {
      toast(`User successfully deleted: ${json.name}`, {
        type: "success",
        position: "top-center",
      });
      onClose(true);
    } else {
      toast(`Error deleting user: ${json.message}`, {
        type: "error",
        position: "top-center",
      });
    }    
  };

  const btnClass = clsx(
    "btn-accent btn mx-1",
    `${loading ? "loading btn-disabled" : ""}`,
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
      <button
        id="btn-cancel"
        className="btn-outline btn mx-1"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button id="btn-delete" className={btnClass} onClick={onDelete}>
        Delete
      </button>
    </div>
  );

  return (
    <Modal
      title={title}
      body={body}
      footer={footer}
      isOpen={isOpen}
      onClose={() => onClose(false)}
    />
  );
};

export default DeleteUserModal;
