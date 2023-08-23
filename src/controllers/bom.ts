import { Request, Response } from "express";
import prisma from "../middleware/bom";
import pagging from "../utils/paggination";
import url from "url";

const getBom = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
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
    if (request.query.page === undefined) {
      results = await prisma.bom.findMany({
        orderBy: {
          id: "desc",
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
                              Quotations_Detail: true,
                              CustomerContact: true,
                              Customer: {
                                include: {
                                  address: true,
                                },
                              },
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
          srimg: {
            id_summary: {
              contains: pencarian,
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
                              Quotations_Detail: true,
                              CustomerContact: true,
                              Customer: {
                                include: {
                                  address: true,
                                },
                              },
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
          id: "desc",
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
                            Quotations_Detail: true,
                            CustomerContact: true,
                            Customer: {
                              include: {
                                address: true,
                              },
                            },
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
    const result = await prisma.bom.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        bom_detail: {
          include: {
            Material_master: true,
          },
        },
      },
    });
    if (result.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Material Request Bom",
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
    console.log(error);

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
  CreateBom,
  UpdategetBom,
  updateBom,
  DeleteBom,
  DeleteBomDetail,
  getSumaryBom,
};
