import axios from "axios";

export default async function handler(req, res) {
  // const { email, password } = JSON.parse(req.body);
  try {
    // TODO env config
    const response = await axios.post(
      "/v1/logout",
      {},
      {
        baseURL: "http://localhost:9002/api",
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
