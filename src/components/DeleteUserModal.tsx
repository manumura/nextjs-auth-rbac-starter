import Modal from "./Modal";

const DeleteUserModal = ({ user, isOpen, onClose }) => {
  const onDelete = () => {
    console.log("delete");
  };

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
        id="btn-delete"
        className="btn-outline btn-accent btn mx-1"
        onClick={onDelete}
      >
        Delete
      </button>
      <button
        id="btn-cancel"
        className="btn-outline btn-ghost btn mx-1"
        onClick={onClose}
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
