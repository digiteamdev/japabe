import { Request, Response } from "express";
import prisma from "../middleware/materialMaster";
import pagging from "../utils/paggination";
import url from "url";

const getMaterialMaster = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const materialMasterCount = await prisma.material_Master.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.material_Master.findMany({
        where: {
          deleted: null,
        },
      });
    } else {
      results = await prisma.material_Master.findMany({
        where: {
          deleted: null,
          name: {
            contains: pencarian,
            mode: "insensitive",
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Material",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: materialMasterCount,
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

const createMaterialMaster = async (request: Request, response: Response) => {
  try {
    const results = await prisma.material_Master.create({
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

export default {
  getMaterialMaster,
  createMaterialMaster,
};
