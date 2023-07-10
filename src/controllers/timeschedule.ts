import { Request, Response } from "express";
import prisma from "../middleware/timeschedule";
import pagging from "../utils/paggination";
import url from "url";

const getTimeschedule = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const countTimeschedule = await prisma.timeschedule.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.timeschedule.findMany({
        orderBy: {
          id: "asc",
        },
      });
    } else {
      results = await prisma.timeschedule.findMany({
        where: {
          idTs: {
            contains: pencarian,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          wor: {
            include: {
              srimg: {
                include: {
                  dispacth: {
                    include: {
                      dispatchDetail: true,
                    },
                  },
                },
              },
            },
          },
          aktivitas: {
            include: {
              masterAktivitas: true,
            },
          },
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Time Schedule",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: countTimeschedule,
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

const createTimeschedule = async (request: Request, response: Response) => {
  try {
    const results = await prisma.timeschedule.create({
      data: {
        idTs: request.body.idTs,
        wor: { connect: { id: request.body.worId } },
        timesch: new Date(request.body.timesch),
        aktivitas: {
          create: request.body.aktivitas,
        },
      },
      include: {
        aktivitas: true,
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
    console.log(error);

    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updateTimeschedule = async (request: Request, response: Response) => {
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

const deleteTimeschedule = async (request: Request, response: Response) => {
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
  getTimeschedule,
  createTimeschedule,
  updateTimeschedule,
  deleteTimeschedule,
};
