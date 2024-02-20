import { Request, Response } from "express";
import prisma from "../middleware/outgoingMaterial";
import pagging from "../utils/paggination";
import url from "url";
import { Prisma } from "@prisma/client";

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
                    mr: {
                      include: {
                        wor: {
                          include: {
                            Quotations: {
                              include: {
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
    await prisma.$transaction(
      async (prisma) => {
        let results: any = [];
        if (request.body.pb === undefined) {
          const arra: any = request.body.mr;
          for (let i = 0; i < arra.length; i++) {
            const getStok: any = await prisma.poandso.findFirst({
              where: {
                id: request.body.mr[i].poandsoId,
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
            for (let index = 0; index < getStok.detailMr.length; index++) {
              if (
                getStok.detailMr[index].Material_Stock.jumlah_Stock <= 0 ||
                arra[i].qty_out >
                  getStok.detailMr[index].Material_Stock.jumlah_Stock
              )
                return response.status(400).json({
                  msg: "stok abis",
                });
              await prisma.material_Stock.update({
                where: {
                  id: getStok.detailMr[index].Material_Stock.id,
                },
                data: {
                  jumlah_Stock:
                    getStok.detailMr[index].Material_Stock.jumlah_Stock -
                    arra[i].qty_out,
                },
              });
            }
          }
        } else {
          const pbb: any = request.body.pb;
          for (let a = 0; a < pbb.length; a++) {
            const getStok: any = await prisma.material_Stock.findFirst({
              where: {
                id: request.body.pb[a].materialStockId,
              },
            });
            if (
              getStok.jumlah_Stock <= 0 ||
              pbb[a].qty_out > getStok.jumlah_Stock
            )
              return response.status(400).json({
                msg: "stok abis",
              });
            await prisma.material_Stock.update({
              where: {
                id: getStok.id,
              },
              data: {
                jumlah_Stock: getStok.jumlah_Stock - pbb[a].qty_out,
              },
            });
          }
        }
        if (request.body.mr) {
          results = await prisma.outgoing_material.create({
            data: {
              id_outgoing_material: request.body.id_outgoing_material,
              date_outgoing_material: new Date(
                request.body.date_outgoing_material
              ),
              stock_outgoing_material: {
                create: request.body.mr,
              },
            },
            include: {
              stock_outgoing_material: true,
            },
          });
          const getMrStatus = await prisma.detailMr.findFirst({
            where: {
              poandsoId: request.body.mr.id,
            },
            include: {
              mr: true,
            },
          });
          await prisma.mr.update({
            where: {
              id: getMrStatus?.mr.id,
            },
            data: {
              statusMr: "Finish",
            },
          });
        } else {
          results = await prisma.outgoing_material.create({
            data: {
              id_outgoing_material: request.body.id_outgoing_material,
              date_outgoing_material: new Date(
                request.body.date_outgoing_material
              ),
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
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // optional, default defined by database configuration
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default {
  getOutgoingMaterial,
  createOutgoingMaterial,
};
