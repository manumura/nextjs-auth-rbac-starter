import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

export default function GoogleLoginButton({
  onGoogleLoginSuccess,
  onGoogleLoginFailed,
}: {
  readonly onGoogleLoginSuccess: (
    credentialResponse: CredentialResponse | null,
  ) => void;
  readonly onGoogleLoginFailed: () => void;
}): React.ReactElement {
  return (
    <GoogleLogin
      theme='filled_blue'
      size='large'
      onSuccess={(credentialResponse) => {
        onGoogleLoginSuccess(credentialResponse);
      }}
      onError={() => {
        onGoogleLoginFailed();
      }}
    />
  );
}
