import { Request, Response } from "express";
import prisma from "../middleware/role";

const getRole = async (request: Request, response: Response) => {
  try {
    const results = await prisma.role.findMany();
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Role",
        result: results,
      });
    } else {
      return response.status(200).json({
        success: false,
        massage: "No data",
        result: []
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const createRole = async (request: Request, response: Response) => {
  try {
    const results = await prisma.role.createMany({
      data: [
        {
          id: "clh7i29ko0000rsi9tlprlcv5",
          role_name: "admin",
          createdAt: "2023-05-02T06:56:46.837Z",
          updatedAt: "2023-05-02T06:56:46.837Z",
        },
        {
          id: "clh788dd40000rsqbrwg7yolx",
          role_name: "HR & GA",
          createdAt: "2023-05-03T04:57:16.457Z",
          updatedAt: "2023-05-03T04:57:16.457Z",
        },
        {
          id: "clh788kbz0002rsqbdch6u2di",
          role_name: "Ppic",
          createdAt: "2023-05-03T04:57:25.488Z",
          updatedAt: "2023-05-03T04:57:25.488Z",
        },
        {
          id: "clh788ygo0004rsqbunx1q46w",
          role_name: "Utility/ty",
          createdAt: "2023-05-03T04:57:43.789Z",
          updatedAt: "2023-05-03T04:57:43.789Z",
        },
        {
          id: "clh789g4n0006rsqbasqn4vah",
          role_name: "FINANCE & ACC",
          createdAt: "2023-05-03T04:58:06.685Z",
          updatedAt: "2023-05-03T04:58:06.685Z",
        },
        {
          id: "clh789m9n0008rsqbj50e7ldi",
          role_name: "MARKETING",
          createdAt: "2023-05-03T04:58:14.652Z",
          updatedAt: "2023-05-03T04:58:14.652Z",
        },
        {
          id: "clh789v1v000arsqblvvj8x65",
          role_name: "QA & ENG",
          createdAt: "2023-05-03T04:58:26.025Z",
          updatedAt: "2023-05-03T04:58:26.025Z",
        },
        {
          id: "clh78a4rx000crsqbm3uz5cfl",
          role_name: "ADMINISTRATOR",
          createdAt: "2023-05-03T04:58:38.638Z",
          updatedAt: "2023-05-03T04:58:38.638Z",
        },
        {
          id: "clh78aasq000ersqb9tr9llw4",
          role_name: "MASTER",
          createdAt: "2023-05-03T04:58:46.433Z",
          updatedAt: "2023-05-03T04:58:46.433Z",
        },
        {
          id: "clh78afgv000grsqb00w04rds",
          role_name: "DRAFTER",
          createdAt: "2023-05-03T04:58:52.495Z",
          updatedAt: "2023-05-03T04:58:52.495Z",
        },
        {
          id: "clh78alo4000irsqb59185bl8",
          role_name: "PURCHASING",
          createdAt: "2023-05-03T04:59:00.533Z",
          updatedAt: "2023-05-03T04:59:00.533Z",
        },
      ],
    });
    if (results) {
      response.status(201).json({
        success: true,
        massage: "Success Add Data",
        results: results,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Add Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updateRole = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateRole = await prisma.role.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateRole) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateRole,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Update Data",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const deleteRole = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteRole = await prisma.role.delete({
      where: {
        id: id,
      },
    });
    if (deleteRole) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteRole,
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
  getRole,
  createRole,
  updateRole,
  deleteRole,
};
