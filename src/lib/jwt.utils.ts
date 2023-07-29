import * as jose from "jose";
import appConfig from "../config/config";
import { appConstant } from "../config/constant";
import { IUser } from "./user-store";

export const getUserFromIdToken = async (idToken: string): Promise<IUser | undefined> => {
  if (!idToken) {
    console.error("No idToken found");
    return undefined;
  }

  const publicKey = await jose.importSPKI(
    appConfig.idTokenPublicKey,
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
