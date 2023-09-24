import * as jose from 'jose';
import { appConstant } from '../config/constant';
import { IUser } from './user-store';

const idTokenPublicKeyAsBase64 = process.env.NEXT_PUBLIC_ID_TOKEN_PUBLIC_KEY_AS_BASE64 as string;
const idTokenPublicKey = Buffer.from(idTokenPublicKeyAsBase64, 'base64').toString('utf8');

export const getUserFromIdToken = async (idToken: string): Promise<IUser | undefined> => {
  if (!idToken) {
    console.error('No idToken found');
    return undefined;
  }

  const publicKey = await jose.importSPKI(
    idTokenPublicKey,
    appConstant.ALG,
  );
  const { payload } = await jose.jwtVerify(
    idToken as string,
    publicKey,
  );
  // const idToken = jose.decodeJwt(res.data.idToken) as IdTokenPayload;
  const user = payload?.user as IUser;
  return user;
};
