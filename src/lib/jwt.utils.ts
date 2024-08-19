import * as jose from 'jose';
import { appConstant } from '../config/constant';
import { IUser } from '../types/custom-types';
import appConfig from '../config/config';

const idTokenPublicKey = Buffer.from(appConfig.idTokenPublicKeyAsBase64, 'base64').toString('utf8');

export const getUserFromIdToken = async (idToken: string): Promise<IUser | null> => {
  if (!idToken) {
    console.error('No idToken found');
    return null;
  }

  try {
    const publicKey = await jose.importSPKI(
      idTokenPublicKey,
      appConstant.ALG,
    );
    const { payload } = await jose.jwtVerify(
      idToken,
      publicKey,
    );
    // const idToken = jose.decodeJwt(res.data.idToken) as IdTokenPayload;
    const user = payload?.user as IUser;
    return user;
  } catch (error) {
    console.error('Error verifying idToken', error);
    return null;
  }
};
