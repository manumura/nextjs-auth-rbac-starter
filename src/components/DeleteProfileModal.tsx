import Modal from './Modal';

const DeleteProfileModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (success: boolean) => Promise<void>;
}) => {
  const isLoading = false;

  const onCancel = async (): Promise<void> => {
    onClose(false);
  };

  const onDelete = async (): Promise<void> => {
    onClose(true);
  };

  const btn = (
    <button className='btn btn-accent mx-1' id='btn-delete' onClick={onDelete}>
      Delete
    </button>
  );
  const btnLoading = (
    <button
      className='btn btn-disabled btn-accent mx-1'
      id='btn-delete-loading'
    >
      <span className='loading loading-spinner'></span>
      Delete
    </button>
  );

  const title = (
    <div>
      <h3 className='text-red-500 text-lg font-bold'>CONFIRM DELETE</h3>
    </div>
  );

  const body = (
    <div className='mt-5'>Are you sure you want to delete your profile ?</div>
  );

  const footer = (
    <div className='flex'>
      {isLoading ? btnLoading : btn}
      <button
        id='btn-cancel'
        type='button'
        className={`btn btn-outline mx-1 ${isLoading ? 'btn-disabled' : ''}`}
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
      onClose={(): Promise<void> => onClose(false)}
    />
  );
};

export default DeleteProfileModal;
