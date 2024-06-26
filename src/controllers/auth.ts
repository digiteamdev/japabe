import { Request, Response } from "express";
import argon2 from "argon2";
import prisma from "../middleware/user";
import jwt from "../middleware/jwt";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, hashed_password, employeeId } = req.body;

    const userExist = await prisma.user.findUnique({
      where: { username },
    });
    if (userExist) {
      return res.json({
        error: true,
        massage: "Username Already Exist",
      });
    }
    const hashpass: string = await argon2.hash(hashed_password);

    const user = await prisma.user.create({
      data: {
        username,
        hashed_password: hashpass,
        employeeId,
        userRole: {
          create: req.body.userRole,
        },
      },
      include: {
        userRole: true,
      },
    });

    await prisma.employee.update({
      where: { id: req.body.employeeId },
      data: {
        status_user: true,
      },
    });

    const userRole = await prisma.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: true,
      },
    });

    const id: any = user.employeeId;
    const userEmploy = await prisma.employee.findUnique({
      where: { id: id },
      select: {
        email: true,
        sub_depart: {
          select: {
            name: true,
            departement: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const resResult = {
      username: user.username,
      employeeId: user.employeeId,
      userRole: userRole,
      userEmploy: userEmploy,
    };

    if (user) {
      return res
        .status(201)
        .json({ msg: "Register Succes", status: true, result: resResult });
    } else {
      return res
        .status(400)
        .json({ msg: "Register Not Succes", status: false });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (request: any, response: Response) => {
  try {
    const { username, hashed_password } = request.body;

    const userExist = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        hashed_password: true,
        employee: {
          select: {
            id: true,
            employee_name: true,
            position: true,
            photo: true,
          },
        },
        userRole: {
          select: {
            roleId: true,
            role: {
              select: {
                role_name: true,
              },
            },
          },
        },
      },
    });
    if (!userExist) {
      return response
        .status(403)
        .json({ msg: "username tidak ada / belum daftar" });
    }
    const passwordIsValid = await argon2.verify(
      userExist.hashed_password,
      hashed_password
    );

    if (!passwordIsValid) {
      return response.status(403).json({ msg: "salah password" });
    }

    const token = jwt.generateToken(userExist.username);

    const cekUserSession = await prisma.session.findUnique({
      where: { username },
    });

    if (!cekUserSession) {
      const userSession = await prisma.session.create({
        data: {
          username: userExist.username,
          acces_token: token,
        },
      });
      const resResult = {
        id: userExist.id,
        username: userExist.username,
        session: userSession,
        role: userExist.userRole,
        employee: userExist.employee,
      };
      if (userSession) {
        return response
          .status(201)
          .json({ msg: "Login Succes", status: true, result: resResult });
      } else {
        return response
          .status(400)
          .json({ msg: "Login Not Succes", status: false });
      }
    } else if (token !== cekUserSession.acces_token) {
      request.session.destroy();
      const updateToken = await prisma.session.update({
        where: {
          username: cekUserSession.username,
        },
        data: {
          acces_token: token,
        },
      });
      const resResult = {
        id: userExist.id,
        username: userExist.username,
        session: updateToken,
        role: userExist.userRole,
        updateToken: updateToken,
        employee: userExist.employee,
      };
      if (updateToken) {
        return response
          .status(201)
          .json({ msg: "Login Succes", status: true, result: resResult });
      } else {
        return response
          .status(400)
          .json({ msg: "Login Not Succes", status: false });
      }
    }
  } catch (error) {
    return response.status(500).json({ message: error.message });
  }
};

const logoutUser = async (request: any, response: Response) => {
  try {
    const username = request.session.userId;
    const cekSession = await prisma.session.findFirst({
      where: { username: username },
    });
    if (!cekSession) {
      return response.status(400).json({
        error: true,
        msg: "not loggin ",
      });
    }
    const sessionDel = await prisma.session.delete({
      where: {
        username: username,
      },
    });
    if (sessionDel) {
      request.session.destroy();
      return response.status(200).json({
        success: true,
        msg: "suscces logout ",
      });
    } else {
      return response.status(400).json({
        error: true,
        msg: "unsucces loggin ",
      });
    }
  } catch (error) {
    return response.status(500).json({ msg: error.masagge });
  }
};

const updatePassword = async (request: any, response: Response) => {
  try {
    const { id } = request.body;
    const userExist: any = await prisma.user.findUnique({
      where: { id },
    });
    const passwordIsValid = await argon2.verify(
      userExist.hashed_password,
      request.body.hashed_password
    );
    if (passwordIsValid === false)
      return response.status(400).json({
        success: false,
        msg: "Password lama anda tidak sama",
      });

    const newPass = await argon2.hash(request.body.passwordnew);
    const changePass = await prisma.user.update({
      where: { id: userExist.id },
      data: {
        hashed_password: newPass,
      },
    });
    if (changePass) {
      return response.status(201).json({
        success: true,
        msg: "Pass change successfully",
      });
    }
  } catch (error) {
    return response.status(500).json({ msg: error.masagge });
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  updatePassword,
};
