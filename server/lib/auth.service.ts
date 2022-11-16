import { hash } from "bcrypt";


export const hashPassword = async(password: string): Promise<string> => {
  return hash(password, 10)
}

// export const generateAccessToken = (payload: { userId: string }): string {
//   return this.jwtService.sign(payload);
// }

// export const generateRefreshToken = (payload: { userId: string }): string {
//   return this.jwtService.sign(payload, {
//     secret: process.env.JWT_REFRESH_SECRET,
//     expiresIn: securityConfig.refreshIn,
//   });
// }