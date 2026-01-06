import { FaFacebook } from 'react-icons/fa';

// https://github.com/greatSumini/react-facebook-login/tree/master
// https://medium.com/@syedmahmad/login-with-facebook-meta-in-react-app-88efb7a9fc0a
export default function FacebookLoginButton({
  onClick,
}: {
  readonly onClick: () => void;
}): React.ReactElement {
  return (
    <button
      type='button'
      className='btn text-md w-full rounded-md bg-[#4267b2] text-[#fff] hover:bg-[#3B5998]'
      onClick={onClick}
    >
      <FaFacebook className='text-2xl' />
      <span>Continue with Facebook</span>
    </button>
  );
}
