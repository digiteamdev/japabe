import { Request, Response } from "express";
import prisma from "../middleware/mRequest";
import pagging from "../utils/paggination";
import url from "url";

const getMr = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const MrCount = await prisma.mr.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.mr.findMany({});
    } else {
      results = await prisma.mr.findMany({
        where: {
          no_mr: {
            contains: pencarian,
          },
        },
        include: {
          detailMr: {
            include: {
              Material_Stock: {
                include: {
                  Material_master: {
                    include: {
                      grup_material: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              username: true,
              employee: {
                select: {
                  id: true,
                  employee_name: true,
                  sub_depart: {
                    select: {
                      id: true,
                      name: true,
                      departement: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
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
        massage: "Get All Material Request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: MrCount,
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

const createMr = async (request: Request, response: Response) => {
  try {
    const r = Math.floor(Math.random() * 1000) + 1;
    const genarate = "MR" + r;
    const results = await prisma.mr.create({
      data: {
        no_mr: genarate,
        user: { connect: { id: request.body.userId } },
        date_mr: new Date(request.body.date_mr),
        detailMr: {
          create: request.body.detailMr,
        },
      },
      include: {
        detailMr: true,
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

const updateMr = async (request: Request, response: Response) => {
  try {
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const deleteMr = async (request: Request, response: Response) => {
  try {
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default {
  getMr,
  createMr,
  updateMr,
  deleteMr,
};
