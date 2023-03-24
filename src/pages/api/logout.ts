import axios from "axios";
import appConfig from "../../config/config";

export default async function handler(req, res) {
  const BASE_URL = appConfig.baseUrl;
  // const { email, password } = JSON.parse(req.body);

  try {
    const response = await axios.post(
      "/v1/logout",
      {},
      {
        baseURL: `${BASE_URL}/api`,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          Cookie: req.headers.cookie,
        },
      },
    );

    const setCookieHeader = response.headers['set-cookie'];
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', response.headers['set-cookie']);
    }
    
    res.status(response.status).json(response.data);
  } catch (err) {
    const data = err.response.data;
    res.status(data.statusCode).json({ message: data.message });
  }
}
