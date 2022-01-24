import {
  RefreshTokenAttribute,
  UserLoginAttribute,
  UserRegisterAttribute,
} from "../../types";

import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import executeQuery from "../../utils/db/db";
import { tokenModel } from "./token";

const config = {
  jwtExpiration: 60, // 1 minute
  jwtRefreshExpiration: 120, // 2 minutes
  secret: "dashboard-secret-key",
};

const createRefreshToken = async (username: string) => {
  const expiredAt = new Date();

  expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

  const _token: string = uuidv4();

  const refreshToken: RefreshTokenAttribute = {
    token: _token,
    username: username,
    expiryDate: expiredAt.getTime(),
  };

  return refreshToken;
};

const verifyExpiration = (expiryDate: number) => {
  return expiryDate < new Date().getTime();
};

const registerStudent = async (name: string) => {
  try {
    // console.log("req nom", req.body);
    const result = await executeQuery({
      query: "INSERT INTO mahasiswa(nama_mhs) VALUES(?)",
      values: [name],
    });
    console.log("success adding new student", result);
  } catch (error) {
    console.log(error);
  }
};

const signUp = async ({ username, password }: UserRegisterAttribute) => {
  try {
    const newAccount = {
      username,
      password: bcrypt.hashSync(password, 8),
    };

    const queryGetUserExisting: any = await executeQuery({
      query: "SELECT * FROM user WHERE username = ?",
      values: [username],
    });

    if (queryGetUserExisting.length > 0) {
      return {
        success: false,
        message: "USERNAME_NOT_AVAILABLE",
      };
    }

    const queryRegister = await executeQuery({
      query: "INSERT INTO user(username, password) VALUES(?, ?)",
      values: [newAccount.username, newAccount.password],
    });

    return {
      success: true,
      message: "USER_REGISTER_SUCCESS",
    };
  } catch (error) {
    console.log(error);
  }
};

const signIn = async ({ username, password }: UserLoginAttribute) => {
  try {
    const result: any = await executeQuery({
      query: "SELECT * FROM user WHERE username = ?",
      values: [username],
    });

    if (result.length === 0) {
      return {
        success: false,
        message: "USER_NOT_REGISTERED",
      };
    }

    let userData = result[0];

    let passwordIsValid = bcrypt.compareSync(password, userData.password);

    if (!passwordIsValid) {
      return {
        success: false,
        message: "ERROR_INVALID_PASSWORD",
      };
    }

    let token = jwt.sign({ id: username }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    let refreshToken = await createRefreshToken(username);

    tokenModel.saveRefreshToken(refreshToken);

    return {
      success: true,
      username: username,
      refreshToken: refreshToken.token,
      accessToken: token,
    };
  } catch (error) {
    console.log(error);
  }
};

const refreshToken = async (token: string) => {
  try {
    const queryTokenExisting: any = await executeQuery({
      query:
        "SELECT a.token, b.username, a.expiry_date FROM refresh_token a INNER JOIN user b ON a.user_id = b.id WHERE token = ?",
      values: [token],
    });

    if (queryTokenExisting.length === 0) {
      return {
        success: false,
        message: "TOKEN_NOT_FOUND",
      };
    }

    let tokenExisting = queryTokenExisting[0];

    if (verifyExpiration(tokenExisting.expiry_date.getTime())) {
      tokenModel.removeRefreshToken(tokenExisting);
      return {
        success: false,
        message: "TOKEN_WAS_EXPIRED",
      };
    }

    //get a new access token
    const username = tokenExisting.username;
    let newAccessToken = jwt.sign({ id: username }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    console.log(tokenExisting);

    return {
      success: true,
      username: username,
      refreshToken: tokenExisting.token,
      accessToken: newAccessToken,
    };
  } catch (error) {
    console.log(error);
  }
};

const authModel = {
  signUp,
  signIn,
  refreshToken,
};

export { authModel };
