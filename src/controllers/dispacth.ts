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
    const dispactCount = await prisma.timeschedule.count({
      where: {
        deleted: null,
        NOT: {
          dispatchDetail: {
            every: {
              timeschId: null,
            },
          },
        },
      },
    });
    let result: any;
    if (request.query.page === undefined) {
      result = await prisma.timeschedule.findMany({
        where: {
          OR: [
            {
              deleted: null,
            },
          ],
          NOT: {
            dispatchDetail: {
              every: {
                timeschId: null,
              },
            },
          },
        },
        include: {
          dispatchDetail: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              aktivitas: {
                include: {
                  work_scope_item: true,
                },
              },
              sub_depart: true,
              operator: {
                include: {
                  Employee: true,
                },
              },
            },
          },
          aktivitas: {
            include: {
              work_scope_item: true,
            },
          },
          srimg: {
            include: {
              srimgdetail: true,
              timeschedule: {
                include: {
                  aktivitas: true,
                  wor: {
                    include: {
                      work_scope_item: true,
                      customerPo: {
                        include: {
                          quotations: {
                            include: {
                              Customer: true,
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
          createdAt: "asc",
        },
      });
      let worData;
      worData = await prisma.wor.findMany({
        where: {
          OR: [
            {
              Sr: {
                deleted: null,
              },
            },
          ],
          NOT: [
            {
              Sr: {
                deleted: null,
              },
            },
            {
              status: null,
            },
          ],
        },
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
          timeschedule: {
            include: {
              dispatchDetail: true,
              srimg: {
                include: {
                  srimgdetail: true,
                },
              },
            },
          },
          employee: true,
          Sr: true,
        },
      });
      const results = [...result, ...worData];
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
    } else {
      let results: any;
      results = await prisma.timeschedule.findMany({
        where: {
          OR: [
            {
              srimg: {
                timeschedule: {
                  wor: {
                    customerPo: {
                      quotations: {
                        Customer: {
                          name: {
                            contains: pencarian,
                            mode: "insensitive",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            {
              srimg: {
                timeschedule: {
                  wor: {
                    job_no: {
                      contains: pencarian,
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          ],
        },
        include: {
          dispatchDetail: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              aktivitas: {
                include: {
                  work_scope_item: true,
                },
              },
              sub_depart: true,
              operator: {
                include: {
                  Employee: true,
                },
              },
            },
          },
          aktivitas: {
            include: {
              work_scope_item: true,
            },
          },
          srimg: {
            include: {
              srimgdetail: true,
              timeschedule: {
                include: {
                  aktivitas: true,
                  wor: {
                    include: {
                      customerPo: {
                        include: {
                          quotations: {
                            include: {
                              Customer: true,
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
          createdAt: "asc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
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
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const getSumaryDispacth = async (request: Request, response: Response) => {
  try {
    const result = await prisma.srimg.findMany({
      where: {
        OR: [
          {
            deleted: null,
          },
        ],
      },
      orderBy: {
        id: "desc",
      },
      include: {
        srimgdetail: true,
        timeschedule: {
          include: {
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
                work_scope_item: true,
              },
            },
          },
        },
      },
    });
    if (result.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Dispacth Summary",
        result: result,
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
    const updateVerify = request.body.dispatchDetail.map(
      (updateByveri: {
        timeschId: any;
        subdepId: any;
        date_dispatch: any;
        aktivitasID: any;
        id: any;
      }) => {
        return {
          timeschId: updateByveri.timeschId,
          date_dispatch: updateByveri.date_dispatch,
          subdepId: updateByveri.subdepId,
          aktivitasID: updateByveri.aktivitasID,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateDispacthDetail = await prisma.dispatchDetail.create({
        data: {
          timeschedule: { connect: { id: updateVerify[i].timeschId } },
          date_dispatch: new Date(updateVerify[i].date_dispatch),
          sub_depart: { connect: { id: updateVerify[i].subdepId } },
          aktivitas: { connect: { id: updateVerify[i].aktivitasID } },
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

const createOperatorStart = async (request: Request, response: Response) => {
  try {
    const results = await prisma.operator.create({
      data: {
        dispatchDetail: { connect: { id: request.body.dispatchDetailId } },
        Employee: { connect: { id: request.body.employeeId } },
        start: new Date(request.body.start),
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

const createOperatorFinish = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const results = await prisma.operator.update({
      where: {
        id: id,
      },
      data: {
        finish: new Date(request.body.finish),
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
        timeschId: any;
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
          dispacthID: updateByveri.timeschId,
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
      if (
        updateVerify[i].operatorID === null ||
        updateVerify[i].operatorID === ""
      ) {
        const updateDispacthDetail = await prisma.dispatchDetail.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            date_dispatch: new Date(updateVerify[i].date_dispatch),
            sub_depart: { connect: { id: updateVerify[i].subdepId } },
            aktivitas: { connect: { id: updateVerify[i].aktivitasID } },
          },
          update: {
            sub_depart: { connect: { id: updateVerify[i].subdepId } },
            aktivitas: { connect: { id: updateVerify[i].aktivitasID } },
          },
        });
        result = [...result, updateDispacthDetail];
      } else {
        const updateDispacthDetailEmployee = await prisma.dispatchDetail.upsert(
          {
            where: {
              id: updateVerify[i].id,
            },
            create: {
              date_dispatch: new Date(updateVerify[i].date_dispatch),
              sub_depart: { connect: { id: updateVerify[i].subdepId } },
              aktivitas: { connect: { id: updateVerify[i].aktivitasID } },
              timeschedule: { connect: { id: updateVerify[i].timeschId } },
            },
            update: {
              date_dispatch: new Date(updateVerify[i].date_dispatch),
              sub_depart: { connect: { id: updateVerify[i].subdepId } },
              aktivitas: { connect: { id: updateVerify[i].aktivitasID } },
              timeschedule: { connect: { id: updateVerify[i].timeschId } },
            },
          }
        );
        result = [...result, updateDispacthDetailEmployee];
      }
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
    let updateStart;
    if (request.body.so) {
      updateStart = await prisma.aktivitas.update({
        where: { id: id },
        data: {
          so: request.body.so,
        },
      });
    }else{
      updateStart = await prisma.aktivitas.update({
        where: {
          id: id,
        },
        data: {
          actual_start: new Date(request.body.actual_start),
        },
      });
    }
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
    const updateFinish = await prisma.aktivitas.update({
      where: {
        id: id,
      },
      data: {
        actual_finish: new Date(request.body.actual_finish),
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
  getSumaryDispacth,
  createOperatorStart,
  createOperatorFinish,
  createDispacth,
  updateDispacth,
  updateDetailDispacth,
  deleteDispacth,
  deleteDetailDispacth,
  updateFinish,
  updateStart,
};
