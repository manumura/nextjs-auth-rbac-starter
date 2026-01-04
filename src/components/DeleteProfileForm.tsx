import { useState } from 'react';
import DeleteProfileModal from './DeleteProfileModal';

export default function DeleteProfileForm({
  onDeleteProfile,
  onCancel,
  loading,
}: {
  readonly onDeleteProfile: () => void;
  readonly onCancel: () => void;
  readonly loading: boolean;
}): React.ReactElement {
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const openConfirmDeleteModal = (): void => {
    setIsConfirmDeleteModalOpen(true);
  };

  const onCloseConfirmDeleteModal = async (
    confirmed: boolean
  ): Promise<void> => {
    setIsConfirmDeleteModalOpen(false);
    if (confirmed) {
      onDeleteProfile();
    }
  };

  const btnDeleteProfile = (
    <button
      className='btn btn-error text-red-100'
      onClick={(): void => openConfirmDeleteModal()}
    >
      Delete
    </button>
  );
  const btnDeleteLoading = (
    <button className='btn btn-disabled w-full'>
      <span className='loading loading-spinner'></span>
      Delete
    </button>
  );
  const deleteProfileButton = loading ? btnDeleteLoading : btnDeleteProfile;

  return (
    <div className='mx-auto flex max-w-2xl flex-col items-center overflow-hidden pt-5 pb-10'>
      <div className='card w-3/4 bg-red-50 shadow-xl'>
        <div className='card-body'>
          <div className='card-title text-red-500'>
            <h1>Delete my Profile</h1>
          </div>
          <div className='card-actions justify-end'>
            <div>{deleteProfileButton}</div>
            <div>
              <button
                type='button'
                className={`btn btn-outline btn-accent ${
                  loading ? 'btn-disabled' : ''
                }`}
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteProfileModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={onCloseConfirmDeleteModal}
      />
    </div>
  );
}
