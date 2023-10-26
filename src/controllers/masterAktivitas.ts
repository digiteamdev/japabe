import { Request, Response } from "express";
import prisma from "../middleware/masterAktivitas";
import pagging from "../utils/paggination";
import url from "url";

const getAktivitas = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const masterAktivitasCount = await prisma.masterAktivitas.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.masterAktivitas.findMany({
        orderBy: {
          name: "asc",
        },
      });
    } else {
      results = await prisma.masterAktivitas.findMany({
        where: {
          name: {
            contains: pencarian,
            mode: "insensitive",
          },
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
        massage: "Get All Master Aktivitas",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: masterAktivitasCount,
        currentPage: pagination.currentPage,
        nextPage: pagination.next(),
        previouspage: pagination.prev(),
      });
    } else {
      return response.status(200).json({
        success: false,
        massage: "No data",
        totalData: 0,
        result: [],
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const createMasterAktivitas = async (request: Request, response: Response) => {
  try {
    const results = await prisma.masterAktivitas.create({
      data: request.body,
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

const updateMasterAktivitas = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateMasterAktivitas = await prisma.masterAktivitas.update({
      data: request.body,
      where: {
        id: id,
      },
    });
    if (updateMasterAktivitas) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: updateMasterAktivitas,
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

const deleteMasterAktivitas = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteMasterAktivitas = await prisma.masterAktivitas.delete({
      where: {
        id: id,
      },
    });
    if (deleteMasterAktivitas) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteMasterAktivitas,
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
  getAktivitas,
  createMasterAktivitas,
  updateMasterAktivitas,
  deleteMasterAktivitas,
};
