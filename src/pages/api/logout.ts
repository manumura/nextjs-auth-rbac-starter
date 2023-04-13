import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import appConfig from "../../config/config";
import { getAuthCookies, setAuthCookies } from "../../lib/cookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const BASE_URL = appConfig.baseUrl;
  // const { email, password } = JSON.parse(req.body);

  try {
    const authCookies = getAuthCookies(req, res);
    const response = await axios.post(
      "/v1/logout",
      {},
      {
        baseURL: `${BASE_URL}/api`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          Cookie: authCookies,
        },
      },
    );

    setAuthCookies(response.headers, res);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error("Logout handler error: ", err.response?.data);
    // Set new cookies in case tokens are expired (set from axios interceptor)
    setAuthCookies(err.response?.headers, res);

    const data = err.response?.data;
    res.status(data.statusCode).json({ message: data.message });
  }
}
