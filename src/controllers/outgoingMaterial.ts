import { Request, Response } from "express";
import prisma from "../middleware/outgoingMaterial";
import pagging from "../utils/paggination";
import url from "url";

const getOutgoingMaterial = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const customerCount = await prisma.outgoing_material.count({
      where: {
        deleted: null,
      },
    });
    const results = await prisma.outgoing_material.findMany({
      where: {
        id_outgoing_material: {
          contains: pencarian,
          mode: "insensitive",
        },
      },
      include: {
        stock_outgoing_material: {
          include: {
            employee: true,
            coa: true,
            Material_Stock: true,
            poandso: {
              include: {
                term_of_pay_po_so: true,
                supplier: {
                  include: {
                    SupplierContact: true,
                    SupplierBank: true,
                  },
                },
                detailMr: {
                  include: {
                    supplier: {
                      include: {
                        SupplierContact: true,
                        SupplierBank: true,
                      },
                    },
                    approvedRequest: true,
                    coa: true,
                    mr: {
                      include: {
                        wor: {
                          include: {
                            Quotations: {
                              include: {
                                Quotations_Detail: true,
                                CustomerContact: true,
                              },
                            },
                          },
                        },
                        bom: {
                          include: {
                            bom_detail: {
                              include: {
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
                                position: true,
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
                    },
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
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Out Material",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: customerCount,
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

const createOutgoingMaterial = async (request: Request, response: Response) => {
  try {
    const getStok: any = await prisma.poandso.findFirst({
      where: {
        id: request.body.poandsoId,
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
      },
    });
    // const obj: any = {};
    // getStok.detailMr.map((e: any) => {
    //   Object.assign(obj, e)
    // });
    // console.log(obj);

    // console.log(obj.materialStockId);

    // console.log(request.body.pb);
    let results: any;
    if (request.body.mr) {
      results = await prisma.outgoing_material.create({
        data: {
          id_outgoing_material: request.body.id_outgoing_materia,
          date_outgoing_material: new Date(request.body.date_outgoing_material),
          stock_outgoing_material: {
            create: request.body.mr,
          },
        },
        include: {
          stock_outgoing_material: true,
        },
      });
    } else {
      results = await prisma.outgoing_material.create({
        data: {
          id_outgoing_material: request.body.id_outgoing_material,
          date_outgoing_material: new Date(request.body.date_outgoing_material),
          stock_outgoing_material: {
            create: request.body.pb,
          },
        },
        include: {
          stock_outgoing_material: true,
        },
      });
    }
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
  getOutgoingMaterial,
  createOutgoingMaterial,
};
