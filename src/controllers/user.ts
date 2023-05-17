import { Request, Response } from "express";
import prisma from "../middleware/user";

const getUser = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany({
      include: {
        employee: {
          include: {
            departement: true,
          },
        },
        userRole: {
          include: {
            role: true,
          },
        },
      },
    });
    if (user.length > 0) {
      return res.status(200).json({
        success: true,
        massage: "Get All user",
        result: user,
      });
    } else {
      return res.status(404).json({
        success: false,
        massage: "No data",
      });
    }
  } catch (error) {
    res.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default { getUser };
