import { Request, Response } from "express";
import prisma from "../middleware/bom";
import pagging from "../utils/paggination";
import url from "url";

const getBom = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const status: any = request.query.status || undefined;
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const bomCOunt = await prisma.bom.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined && status != undefined) {
      results = await prisma.bom.findMany({
        where: {
          status_spv: status,
          status_manager: status,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          bom_detail: {
            include: {
              Material_master: true,
              srimgdetail: true,
            },
          },
          srimg: {
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
                },
              },
              dispacth: {
                include: {
                  dispatchDetail: {
                    select: {
                      id: true,
                      operatorID: true,
                      approvebyID: true,
                      part: true,
                      start: true,
                      finish: true,
                      actual: true,
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
                      workCenter: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                      aktivitas: {
                        select: {
                          id: true,
                          aktivitasId: true,
                          masterAktivitas: {
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
          },
        },
      });
    } else {
      results = await prisma.bom.findMany({
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
          bom_detail: {
            include: {
              Material_master: true,
              srimgdetail: true,
            },
          },
          srimg: {
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
                },
              },
              dispacth: {
                include: {
                  dispatchDetail: {
                    select: {
                      id: true,
                      operatorID: true,
                      approvebyID: true,
                      part: true,
                      start: true,
                      finish: true,
                      actual: true,
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
                      workCenter: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                      aktivitas: {
                        select: {
                          id: true,
                          aktivitasId: true,
                          masterAktivitas: {
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
        massage: "Get All Bom",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: bomCOunt,
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

const getSumaryBom = async (request: Request, response: Response) => {
  try {
    const result = await prisma.bom.findMany({
      where: {
        OR: [
          {
            deleted: null,
          },
          {
            srimg: {
              deleted: null,
            },
          },
        ],
        NOT: {
          srimg: {
            deleted: null,
          },
        },
      },
      include: {
        bom_detail: {
          include: {
            Material_master: true,
            srimgdetail: true,
          },
        },
        srimg: {
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
              },
            },
            dispacth: {
              include: {
                dispatchDetail: {
                  select: {
                    id: true,
                    operatorID: true,
                    approvebyID: true,
                    part: true,
                    start: true,
                    finish: true,
                    actual: true,
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
                    workCenter: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    aktivitas: {
                      select: {
                        id: true,
                        aktivitasId: true,
                        masterAktivitas: {
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
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (result.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Summary Bom",
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

const getBomMr = async (request: Request, response: Response) => {
  try {
    let result;
    result = await prisma.bom.findMany({
      where: {
        NOT: {
          Mr: {
            deleted: null,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        Mr: true,
        bom_detail: {
          include: {
            detailMr: {
              select: {
                id: true,
                mr: true,
              },
            },
            Material_master: {
              include: {
                Material_Stock: true,
                grup_material: true,
              },
            },
          },
        },
        srimg: {
          include: {
            srimgdetail: true,
            timeschedule: {
              include: {
                wor: true,
              },
            },
          },
        },
      },
    });
    let worData;
    worData = await prisma.wor.findMany({
      where: {
        OR: [
          {
            NOT: {
              Mr: {
                deleted: null,
              },
              status: null
            },
            Mr: {
              deleted: null,
            },
          },
        ],
        // NOT: [
        //   {
        //     Mr: {
        //       deleted: null,
        //     },
        //   },
        //   {
        //     status: null,
        //   },
        // ],
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
        timeschedule: true,
        employee: true,
        Mr: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const results = [...result, ...worData];

    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Material Request Bom",
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

const getUserMr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;

    const userExist = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        employeeId: true,
      },
    });
    let result;
    const EmployeeUser = userExist?.employeeId;
    if (userExist)
      result = await prisma.user.findFirst({
        where: {
          employeeId: EmployeeUser,
        },
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
      });
    if (result) {
      return response.status(200).json({
        success: true,
        massage: "Get All Material User",
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

const CreateBom = async (request: Request, response: Response) => {
  try {
    const results = await prisma.bom.create({
      data: {
        srimg: { connect: { id: request.body.srId } },
        bom_detail: {
          create: request.body.bom_detail,
        },
      },
      include: {
        bom_detail: true,
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

const UpdategetBom = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateBom = await prisma.bom.update({
      where: {
        id: id,
      },
      data: {
        srimg: { connect: { id: request.body.srId } },
      },
    });
    if (updateBom) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateBom,
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

const updateBom = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        bomId: any;
        partId: any;
        materialId: any;
        dimensi: any;
        id: any;
      }) => {
        return {
          bomId: updateByveri.bomId,
          partId: updateByveri.partId,
          materialId: updateByveri.materialId,
          dimensi: updateByveri.dimensi,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateDetailBom = await prisma.bom_detail.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          bom: { connect: { id: updateVerify[i].bomId } },
          srimgdetail: { connect: { id: updateVerify[i].partId } },
          Material_master: { connect: { id: updateVerify[i].materialId } },
          dimensi: updateVerify[i].dimensi,
        },
        update: {
          bom: { connect: { id: updateVerify[i].bomId } },
          srimgdetail: { connect: { id: updateVerify[i].partId } },
          Material_master: { connect: { id: updateVerify[i].materialId } },
          dimensi: updateVerify[i].dimensi,
        },
      });
      result = [...result, updateDetailBom];
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

const updateBomStatusSpv = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    const statusPenc = await prisma.bom.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (
      statusPenc?.status_spv === null ||
      statusPenc?.status_spv === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.bom.update({
        where: { id: id },
        data: {
          status_spv: "valid",
        },
      });
    } else {
      result = await prisma.bom.update({
        where: { id: id },
        data: {
          status_spv: "unvalid",
        },
      });
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

const updateBomStatusM = async (request: Request, response: Response) => {
  try {
    const id = request.params.id;
    const statusPenc = await prisma.bom.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (
      statusPenc?.status_manager === null ||
      statusPenc?.status_manager === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.bom.update({
        where: { id: id },
        data: {
          status_manager: "valid",
        },
      });
    } else {
      result = await prisma.bom.update({
        where: { id: id },
        data: {
          status_manager: "unvalid",
        },
      });
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

const DeleteBom = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteBom = await prisma.bom.delete({
      where: {
        id: id,
      },
    });
    if (deleteBom) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteBom,
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

const DeleteBomDetail = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteBom = await prisma.bom_detail.delete({
      where: {
        id: id,
      },
    });
    if (deleteBom) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteBom,
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
  getBom,
  getBomMr,
  getUserMr,
  CreateBom,
  UpdategetBom,
  updateBomStatusSpv,
  updateBomStatusM,
  updateBom,
  DeleteBom,
  DeleteBomDetail,
  getSumaryBom,
};
