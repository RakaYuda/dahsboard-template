import { RefreshTokenAttribute } from "./../../../types/refresh-token-attribute";
import type { NextApiRequest, NextApiResponse } from "next";
import { authModel } from "../../../services/modules/auth";

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
    const { token } = req.body;
    const result = await authModel.refreshToken(token);

    console.log(result);

    if (!token) {
      return res.status(403).send({
        success: false,
        message: "TOKEN_NOT_PROVIDED",
      });
    }

    if (result?.message === "TOKEN_NOT_FOUND") {
      return res.status(404).json({ success: false, message: result?.message });
    }

    if (result?.message === "TOKEN_WAS_EXPIRED") {
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
