import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ label }) => {
  return (
    <div className='z-99 fixed top-0 bottom-0 flex h-screen w-full items-center justify-center bg-white opacity-75'>
      <LoadingSpinner label={label} />
    </div>
  );
};

export default LoadingOverlay;
