import { Request, Response } from "express";
import prisma from "../middleware/depart";
import pagging from "../utils/paggination";
import url from "url";

const getDepart = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const departCount = await prisma.departement.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.departement.findMany({
        where: {
          name: {
            contains: "",
          },
        },
      });
    } else {
      results = await prisma.departement.findMany({
        where: {
          name: {
            contains: pencarian,
          },
        },
        include: {
          sub_depart: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Departement",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: departCount,
        currentPage: pagination.currentPage,
        nextPage: pagination.next(),
        previouspage: pagination.prev(),
      });
    } else {
      return response.status(200).json({
        success: false,
        massage: "No data",
        result: [],
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const createDepart = async (request: Request, response: Response) => {
  try {
    const results = await prisma.departement.create({
      data: {
        name: request.body.name,
        sub_depart: {
          create: request.body.sub_depart,
        },
      },
      include: {
        sub_depart: true,
      },
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

const createDepartMany = async (request: Request, response: Response) => {
  try {
    const results = await prisma.departement.createMany({
      data: [
        {
          id: "clh8pjceo001irs64p3gtccnw",
          name: "TOOLS KEPPER",
          createdAt: "2023-05-04T05:49:28.070Z",
          updatedAt: "2023-05-04T05:49:28.070Z",
          deleted: null,
        },
        {
          id: "clh8pjceo001irs64p3gtcziw",
          name: "IT",
          createdAt: "2023-05-04T05:49:28.070Z",
          updatedAt: "2023-05-04T05:49:28.070Z",
          deleted: null,
        },
        {
          id: "clh8piqms001grs64j3nh1vqc",
          name: "SALES & MKT",
          createdAt: "2023-05-04T05:48:59.860Z",
          updatedAt: "2023-05-04T05:48:59.860Z",
          deleted: null,
        },
        {
          id: "clh8pifpx001ers64v0lem6at",
          name: "RECEPTIONIST",
          createdAt: "2023-05-04T05:48:45.706Z",
          updatedAt: "2023-05-04T05:48:45.706Z",
          deleted: null,
        },
        {
          id: "clh8phywq001crs64xxrm7z7d",
          name: "QA & INSPECTOR",
          createdAt: "2023-05-04T05:48:23.921Z",
          updatedAt: "2023-05-04T05:48:23.921Z",
          deleted: null,
        },
        {
          id: "clh8php59001ars645gqz2w34",
          name: "QA & ADMINISTRATOR",
          createdAt: "2023-05-04T05:48:11.278Z",
          updatedAt: "2023-05-04T05:48:11.278Z",
          deleted: null,
        },
        {
          id: "clh8phdwr0018rs64s7542uc9",
          name: "QA & HSE",
          createdAt: "2023-05-04T05:47:56.706Z",
          updatedAt: "2023-05-04T05:47:56.706Z",
          deleted: null,
        },
        {
          id: "clh8ph3x60016rs64tt1gnpgk",
          name: "PURCHASING",
          createdAt: "2023-05-04T05:47:43.770Z",
          updatedAt: "2023-05-04T05:47:43.770Z",
          deleted: null,
        },
        {
          id: "clh8pgz3z0014rs64qfqqdef9",
          name: "PPIC",
          createdAt: "2023-05-04T05:47:37.484Z",
          updatedAt: "2023-05-04T05:47:37.484Z",
          deleted: null,
        },
        {
          id: "clh8pgof40012rs64fu1eerku",
          name: "OFFICE BOY",
          createdAt: "2023-05-04T05:47:23.680Z",
          updatedAt: "2023-05-04T05:47:23.680Z",
          deleted: null,
        },
        {
          id: "clh8pgio00010rs641ba3axzs",
          name: "NDT INSPECTOR",
          createdAt: "2023-05-04T05:47:16.214Z",
          updatedAt: "2023-05-04T05:47:16.214Z",
          deleted: null,
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

const updateDepart = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.sub_depart.map(
      (updateByveri: { name: any; deptId: any; id: any }) => {
        return {
          name: updateByveri.name,
          deptId: updateByveri.deptId,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateDepart = await prisma.sub_depart.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          name: updateVerify[i].name,
          departement: { connect: { id: updateVerify[i].deptId } },
        },
        update: {
          name: updateVerify[i].name,
        },
      });
      result = [...result, updateDepart];
    }
    const dept = await prisma.departement.update({
      where: { id: request.body.id },
      data: {
        name: request.body.name,
      },
    });
    if (result) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        result: result,
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

const deleteDepart = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDepart = await prisma.departement.delete({
      where: {
        id: id,
      },
    });
    if (deleteDepart) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDepart,
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

const deleteSubDepart = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDepart = await prisma.sub_depart.delete({
      where: {
        id: id,
      },
    });
    if (deleteDepart) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDepart,
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
  getDepart,
  createDepart,
  updateDepart,
  deleteDepart,
  createDepartMany,
  deleteSubDepart
};
