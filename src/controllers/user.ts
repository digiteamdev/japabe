import { Request, Response } from "express";
import prisma from "../middleware/user";

const getUser = async (request: any, res: Response) => {
  try {
    const username = request.session.userId;
    const user = await prisma.user.findMany({
      where: { username: username },
      select: {
        id: true,
        username: true,
        hashed_password: true,
        employee: {
          select: {
            id: true,
            employee_name: true,
            NIP: true,
            NIK: true,
            NPWP: true,
            id_card: true,
            nick_name: true,
            email: true,
            birth_place: true,
            birth_date: true,
            address: true,
            province: true,
            city: true,
            districts: true,
            sub_districts: true,
            ec_postalcode: true,
            phone_number: true,
            start_join: true,
            remaining_days_of: true,
            gender: true,
            marital_status: true,
            sub_depart: true,
            subdepartId: true,
            employee_status: true,
            spouse_name: true,
            gender_spouse: true,
            spouse_birth_place: true,
            spouse_birth_date: true,
            status_user: true,
            createdAt: true,
            updatedAt: true,
            deleted: true,
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
        totalData: 0,
      });
    }
  } catch (error) {
    res.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updateRole = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteUser = await prisma.userRole.update({
      where: {
        id: id,
      },
      data: {
        role: { connect: { id: request.body.roleId } },
      },
    });
    if (deleteUser) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteUser,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Delete Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const deleteUser = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    if (deleteUser) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteUser,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Delete Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default {
  getUser,
  updateRole,
  deleteUser,
};
