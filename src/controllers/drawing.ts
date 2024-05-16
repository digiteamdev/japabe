import { Request, Response } from "express";
import prisma from "../middleware/drawing";
import pagging from "../utils/paggination";
import url from "url";

const getDrawing = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const drawingCount = await prisma.drawing.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.drawing.findMany({});
    } else {
      results = await prisma.drawing.findMany({
        where: {
          timeschedule: {
            wor: {
              job_no: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
          },
        },
        include: {
          file_drawing: true,
          timeschedule: {
            include: {
              dispatchDetail: true,
              srimg: {
                include: {
                  srimgdetail: true,
                },
              },
              wor: {
                include: {
                  employee: true,
                  customerPo: {
                    include: {
                      Deskription_CusPo: true,
                      quotations: {
                        include: {
                          CustomerContact: true,
                          Customer: {
                            include: {
                              address: true,
                            },
                          },
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
        massage: "Get All Drawing",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: drawingCount,
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

const getDrawingId = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    let results;
    results = await prisma.drawing.findMany({
      where: {
        id: request.params.id,
      },
      include: {
        file_drawing: true,
        timeschedule: {
          include: {
            dispatchDetail: true,
            srimg: {
              include: {
                srimgdetail: true,
              },
            },
            wor: {
              include: {
                employee: true,
                customerPo: {
                  include: {
                    Deskription_CusPo: true,
                    quotations: {
                      include: {
                        CustomerContact: true,
                        Customer: {
                          include: {
                            address: true,
                          },
                        },
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
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Drawing",
        result: results,
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

const getDrawingTms = async (request: Request, response: Response) => {
  try {
    const results = await prisma.timeschedule.findMany({
      where: {
        drawing: null,
      },
      orderBy: {
        wor: {
          job_no: "asc",
        },
      },
      include: {
        drawing: true,
        srimg: {
          include: {
            srimgdetail: true,
          },
        },
        wor: {
          include: {
            customerPo: {
              include: {
                quotations: {
                  include: {
                    CustomerContact: true,
                    Customer: {
                      include: {
                        address: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },

        aktivitas: {
          include: {
            dispatchDetail: true,
          },
        },
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Time Schedule",
        result: results,
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

const createDrawing = async (request: any, response: Response) => {
  try {
    const newArrDetail: any = [];
    for (let i = 0; i < parseInt(request.body.file_lenght); i++) {
      newArrDetail.push({
        file_upload: !request.files ? null : request.files[i].path,
      });
    }
    const results = await prisma.drawing.create({
      data: {
        id_drawing: request.body.id_drawing,
        timeschedule: { connect: { id: request.body.timeschId } },
        date_drawing: new Date(request.body.date_drawing),
        file_drawing: {
          create: newArrDetail,
        },
      },
      include: {
        file_drawing: true,
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

const updateDrawing = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateDrawing = await prisma.drawing.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateDrawing) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateDrawing,
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

const updateFileDrawing = async (request: any, response: Response) => {
  try {
    const newArrDetail: any = [];
    for (let i = 0; i < parseInt(request.body.file_lenght); i++) {
      newArrDetail.push({
        file_upload: !request.files ? null : request.files[i].path,
      });
    }
    let result: any = [];
    for (let i = 0; i < request.body.length; i++) {
      const upsertFileDrawing = await prisma.file_drawing.upsert({
        where: {
          id: request.body[i].drawingId,
        },
        create: {
          drawing: { connect: { id: request.bod[i].drawingId } },
          file_upload: newArrDetail,
        },
        update: {
          file_upload: newArrDetail,
        },
      });
      result = [...result, upsertFileDrawing];
    }
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

const deleteDrawing = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDrawing = await prisma.drawing.delete({
      where: {
        id: id,
      },
    });
    if (deleteDrawing) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDrawing,
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

const deleteFileDrawing = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDrawing = await prisma.file_drawing.delete({
      where: {
        id: id,
      },
    });
    if (deleteDrawing) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDrawing,
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
  getDrawing,
  getDrawingId,
  createDrawing,
  getDrawingTms,
  updateDrawing,
  updateFileDrawing,
  deleteDrawing,
  deleteFileDrawing,
};
