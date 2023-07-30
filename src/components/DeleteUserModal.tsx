import clsx from "clsx";
import { useState } from "react";
import { toast } from "react-toastify";
import { sleep } from "../lib/utils";
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

  const btn = (
    <button className="btn btn-accent mx-1" id="btn-delete" onClick={onDelete}>
      Delete
    </button>
  );
  const btnLoading = (
    <button className="btn btn-accent mx-1 btn-disabled" id="btn-delete-loading">
      <span className="loading loading-spinner"></span>
      Delete
    </button>
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
      {loading ? btnLoading : btn}
      <button
        id="btn-cancel"
        className="btn-outline btn mx-1"
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
      onClose={() => onClose(false)}
    />
  );
};

export default DeleteUserModal;
