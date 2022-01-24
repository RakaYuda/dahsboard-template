import type { NextApiRequest, NextApiResponse } from "next";
import { authModel } from "../../../models/auth.model";

type Data = {
  success?: boolean;
  name?: string;
  message?: string;
  username?: string;
  refreshToken?: string;
  accessToken?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    res.setHeader(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(403).send({
        success: false,
        message: "USER_ATTRIBUTE_NOT_PROVIDED",
      });
    }

    const result = await authModel.signIn(req.body);

    if (result?.message === "USER_NOT_REGISTERED") {
      return res.status(400).json({ success: false, message: result?.message });
    }

    if (result?.message === "ERROR_INVALID_PASSWORD") {
      return res.status(401).json({ success: false, message: result?.message });
    }

    return res.status(200).send({
      username: result?.username,
      refreshToken: result?.refreshToken,
      accessToken: result?.accessToken,
    });
  } catch (error) {
    console.log(error);
  }
}
