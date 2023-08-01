import { Request, Response } from "express";
import prisma from "../middleware/dispacth";
import pagging from "../utils/paggination";
import url from "url";

const getDispatch = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPagee;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const dispactCount = await prisma.dispacth.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.dispacth.findMany({
        include: {
          timeschedule: {
            include: {
              wor: {
                include: {
                  srimg: {
                    include: {
                      srimgdetail: true,
                    },
                  },
                  customerPo: {
                    include: {
                      quotations: {
                        include: {
                          Customer: true,
                          eqandpart: {
                            include: {
                              equipment: true,
                              eq_part: true,
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
          dispatchDetail: {
            include: {
              Employee: {
                select: {
                  id: true,
                  employee_name: true,
                },
              },
              sub_depart: true,
              workCenter: true,
            },
          },
        },
      });
    } else {
      results = await prisma.dispacth.findMany({
        where: {
          id_dispatch: {
            contains: pencarian,
          },
        },
        include: {
          timeschedule: {
            include: {
              wor: {
                include: {
                  srimg: {
                    include: {
                      srimgdetail: true,
                    },
                  },
                  customerPo: {
                    include: {
                      quotations: {
                        include: {
                          Customer: true,
                          eqandpart: {
                            include: {
                              equipment: true,
                              eq_part: true,
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
          dispatchDetail: {
            select: {
              id: true,
              operatorID: true,
              approvebyID: true,
              part: true,
              approve: {
                select: {
                  id: true,
                  employee_name: true,
                },
              },
              Employee: {
                select: {
                  id: true,
                  employee_name: true,
                },
              },
              sub_depart: {
                select: {
                  name: true,
                },
              },
              workCenter: {
                select: {
                  name: true,
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
        massage: "Get All Dispacth",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: dispactCount,
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

const createDispacth = async (request: Request, response: Response) => {
  try {
    const results = await prisma.dispacth.create({
      data: {
        timeschedule: { connect: { id: request.body.timeschId } },
        id_dispatch: request.body.id_dispatch,
        dispacth_date: new Date(request.body.dispacth_date),
        remark: request.body.remark,
        dispatchDetail: {
          create: request.body.dispatchDetail,
        },
      },
      include: {
        dispatchDetail: true,
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

const updateDispacth = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateDispacth = await prisma.dispacth.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateDispacth) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateDispacth,
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

const updateDetailDispacth = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        dispacthID: any;
        workId: any;
        subdepId: any;
        part: any;
        start: any;
        finish: any;
        actual: any;
        operatorID: any;
        approvebyID: any;
        aktivitasID: any;
        id: any;
      }) => {
        return {
          dispacthID: updateByveri.dispacthID,
          workId: updateByveri.workId,
          subdepId: updateByveri.subdepId,
          part: updateByveri.part,
          start: updateByveri.start,
          finish: updateByveri.finish,
          actual: updateByveri.actual,
          operatorID: updateByveri.operatorID,
          approvebyID: updateByveri.approvebyID,
          aktivitasID: updateByveri.aktivitasID,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateDispacthDetail = await prisma.dispatchDetail.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          dispacth: { connect: { id: updateVerify[i].dispacthID } },
          workCenter: { connect: { id: updateVerify[i].workId } },
          sub_depart: { connect: { id: updateVerify[i].subdepId } },
          aktivitas: { connect: { id: updateVerify[i].aktivitasID } },
          part: updateVerify[i].part,
          start: updateVerify[i].start,
          Employee: { connect: { id: updateVerify[i].operatorID } },
        },
        update: {
          workCenter: { connect: { id: updateVerify[i].workId } },
          sub_depart: { connect: { id: updateVerify[i].subdepId } },
          aktivitas: { connect: { id: updateVerify[i].aktivitasID } },
          part: updateVerify[i].part,
          start: updateVerify[i].start,
          Employee: { connect: { id: updateVerify[i].operatorID } },
        },
      });
      result = [...result, updateDispacthDetail];
    }
    if (result) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: result,
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

const updateStart = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateStart = await prisma.dispatchDetail.update({
      where: {
        id: id,
      },
      data: {
        actual: new Date(request.body.actual),
      },
    });
    if (updateStart) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateDispacth,
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

const updateFinish = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateFinish = await prisma.dispatchDetail.update({
      where: {
        id: id,
      },
      data: {
        finish: new Date(request.body.finish),
        approve: { connect: { id: request.body.approvebyID } },
      },
    });
    const selectDispact = await prisma.dispatchDetail.findFirst({
      where: { id: id },
    });
    const totalfinish = await prisma.dispatchDetail.count({
      where: {
        aktivitasID: selectDispact?.aktivitasID,
        finish: {
          not: null,
        },
      },
    });
    const totalfinishnot = await prisma.dispatchDetail.count({
      where: {
        aktivitasID: selectDispact?.aktivitasID,
      },
    });
    const aktivityId = await prisma.dispatchDetail.findFirst({
      where: { id: id },
    });

    const aktifitasId = aktivityId?.aktivitasID;

    const percentase = (totalfinish / totalfinishnot) * 100;

    await prisma.aktivitas.update({
      where: {
        id: aktifitasId,
      },
      data: {
        progress: Math.floor(percentase),
      },
    });
    if (updateFinish) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateDispacth,
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

const deleteDispacth = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDispacth = await prisma.dispacth.delete({
      where: {
        id: id,
      },
    });
    if (deleteDispacth) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDispacth,
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

const deleteDetailDispacth = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDetailDispacth = await prisma.dispatchDetail.delete({
      where: {
        id: id,
      },
    });
    if (deleteDetailDispacth) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDetailDispacth,
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
  getDispatch,
  createDispacth,
  updateDispacth,
  updateDetailDispacth,
  deleteDispacth,
  deleteDetailDispacth,
  updateFinish,
  updateStart,
};
