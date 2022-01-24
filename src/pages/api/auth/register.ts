import type { NextApiRequest, NextApiResponse } from "next";
import { authModel } from "../../../services/modules/auth";

type Data = {
  username?: string;
  message: string;
  success: boolean;
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

    const result = await authModel.signUp(req.body);

    if (result?.message === "USERNAME_NOT_AVAILABLE") {
      return res.status(400).send({
        success: false,
        message: result?.message,
      });
    }

    return res.status(200).json({
      success: true,
      username: req.body.username,
      message: "USER_REGISTER_SUCCESS",
    });
  } catch (error) {
    console.log(error);
  }
}
