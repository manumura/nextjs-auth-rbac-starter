import { FaFacebook } from 'react-icons/fa';
import { appMessages } from '../config/constant';
import { getUserFromIdToken } from '../lib/jwt.utils';
import { saveAuthentication } from '../lib/storage';
import useUserStore from '../lib/user-store';
import useMessageStore from '../lib/message-store';

// export const loader: LoaderFunction<any> = async ({
//   request,
// }: {
//   request: Request;
// }) => {
//   const url = new URL(request.url);
//   const searchParams = url.searchParams;
//   const accessToken = searchParams.get('access_token');
//   const accessTokenExpiresAt = new Date(searchParams.get('expires_at') ?? '');
//   const idToken = searchParams.get('id_token');
//   const refreshToken = searchParams.get('refresh_token');

//   if (!idToken || !accessToken || !refreshToken) {
//     throw new Error('Login failed. Please try again.');
//   }

//   const user = await getUserFromIdToken(idToken);
//   if (!user) {
//     throw new Error('Login failed. Please try again.');
//   }

//   saveAuthentication(accessToken, accessTokenExpiresAt, refreshToken, idToken);
//   useUserStore.getState().setUser(user);
//   const time = new Date().getTime();

//   useMessageStore.getState().setMessage({
//     type: appMessages.LOGIN_SUCCESS.type,
//     text: appMessages.LOGIN_SUCCESS.text.replace('${name}', user.name),
//     id: time,
//   });

//   router.replace('/');
// };

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
      className='btn w-full bg-[#4267b2] hover:bg-[#3B5998] text-[#fff] text-md rounded-md'
      onClick={onClick}
    >
      <FaFacebook className='text-2xl' />
      <span>Continue with Facebook</span>
    </button>
  );
}
