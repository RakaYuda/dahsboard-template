import { RefreshTokenAttribute } from "../../types";
import executeQuery from "../../utils/db/db";

const saveRefreshToken = async ({
  token,
  username,
  expiryDate,
}: RefreshTokenAttribute) => {
  try {
    //Convert number to date format sql
    var date = new Date(expiryDate);

    const result_user: any = await executeQuery({
      query: "SELECT * FROM user WHERE username = ?",
      values: [username],
    });

    if (result_user.length === 0) {
      return {
        message: "USER_NOT_FOUND",
      };
    }

    const { id: userId } = result_user[0];

    const result = await executeQuery({
      query:
        "INSERT INTO refresh_token(token, user_id, expiry_date) VALUES(?, ?, ?)",
      values: [token, userId, date],
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
};

const removeRefreshToken = async ({ token }: RefreshTokenAttribute) => {
  try {
    //Convert number to date format sql

    const result = await executeQuery({
      query: "DELETE FROM refresh_token WHERE token = ?",
      values: [token],
    });

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
  }
};

const findOneToken = async ({ token }: RefreshTokenAttribute) => {
  try {
    // console.log("req nom", req.body);
    const result: any = await executeQuery({
      query: "SELECT * FROM refresh_token WHERE token = ?",
      values: [token],
    });

    if (result.length === 0) {
      return {
        message: "REFRESH_TOKEN_NOT_FOUND",
      };
    }

    return result[0];
  } catch (error) {
    console.log(error);
  }
};

const tokenModel = {
  saveRefreshToken,
  removeRefreshToken,
  findOneToken,
};

export { tokenModel };
