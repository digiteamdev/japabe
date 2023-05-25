import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, request } from "express";
import prisma from "../utils/db";

import dotenv from "dotenv";

// env
dotenv.config();

const TOKENACCESS: any = process.env.ACCESS_TOKEN;

function authToken(roles: any) {
  return function (req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader ? authHeader.split(" ")[1] : req.session.token;
      jwt.verify(token, TOKENACCESS, async (err: any, userToken: any) => {
        const cekToken = await prisma.session.findFirst({
          where: {
            acces_token: token,
          },
        });
        if (cekToken) {
          await prisma.user
            .findFirst({
              where: { username: userToken.data },
              include: {
                userRole: {
                  include: {
                    role: true,
                  },
                },
              },
            })
            .then((result: any) => {
              let a = result.userRole.filter((s: any) => {
                return (
                  s.role.role_name === roles.administrator ||
                  s.role.role_name === roles.hr ||
                  s.role.role_name === roles.master ||
                  s.role.role_name === roles.finance ||
                  s.role.role_name === roles.qa ||
                  s.role.role_name === roles.purchasing ||
                  s.role.role_name === roles.drafter ||
                  s.role.role_name === roles.utility ||
                  s.role.role_name === roles.ppic
                );
              });
              req.session.token = token;
              req.session.userId = userToken.data;
              if (a.length > 0) {
                next();
              } else {
                return res.status(401).json({
                  msg: `not acces`,
                });
              }
            });
        } else {
          return res
            .status(401)
            .json({ login: false, msg: "akun ini telah di logout oleh seseorang😔, silahkan login kembali" });
        }
      });
    } else {
      return res.status(401).json({ msg: "anda belum login" });
    }
  };
}

function generateToken(username: string) {
  return jwt.sign({ data: username }, TOKENACCESS, {
    expiresIn: "1d",
  });
}

export default { authToken, generateToken };
