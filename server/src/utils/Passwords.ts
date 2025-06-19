import bcrypt from "bcrypt";
import ApiError from "./ApiError";
import logger from "./logger";

export const encryptedPassword = async (password: string) => {
  if (password) {
    // 10 is salt round
    const newPassword = await bcrypt.hash(password, 10);
    return newPassword;
  } else {
    logger.error("password is required for encryption");
    throw new ApiError(400, "password is required for encryption");
  }
};

export const comparePassword = async (
  password: string,
  encryptedPassword: string
) => {
  if (!password || !encryptedPassword) {
    logger.error("password is required for comparison");
    throw new ApiError(400, "password is required for comparison");
  }
  const result = await bcrypt.compare(password, encryptedPassword);
  return result;
};
