import { Request, Response } from "express";
import prisma from "../middleware/kontraBon";
import pagging from "../utils/paggination";
import url from "url";
import { Prisma } from "@prisma/client";

const getKontraBon = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const kontrabonCount = await prisma.kontrabon.count({
      where: {
        deleted: null,
      },
    });
    const results = await prisma.kontrabon.findMany({
      where: {
        id_kontrabon: {
          contains: pencarian,
          mode: "insensitive",
        },
      },
      include: {
        term_of_pay_po_so: {
          include: {
            poandso: {
              include: {
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
                SrDetail: {
                  include: {
                    workCenter: true,
                    supplier: {
                      include: {
                        SupplierContact: true,
                        SupplierBank: true,
                      },
                    },
                    approvedRequest: true,
                    coa: true,
                    sr: {
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
                        dispacth: {
                          include: {
                            dispatchDetail: {
                              include: {
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
                                sub_depart: true,
                                workCenter: true,
                              },
                            },
                            srimg: {
                              include: {
                                srimgdetail: true,
                                timeschedule: {
                                  include: {
                                    aktivitas: {
                                      include: {
                                        masterAktivitas: true,
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
        massage: "Get All Kontra Bon",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: kontrabonCount,
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

const createKontraBon = async (request: any, response: Response) => {
  try {
    await prisma.$transaction(
      async (prisma) => {
        const results = await prisma.kontrabon.create({
          data: {
            id_kontrabon: request.body.id_kontrabon,
            term_of_pay_po_so: { connect: { id: request.body.termId } },
            SupplierBank: { connect: { id: request.body.account_name } },
            tax_prepered: new Date(request.body.tax_prepered),
            due_date: new Date(request.body.due_date),
            invoice: request.body.invoice,
            DO: request.body.DO,
            grandtotal: request.body.grandtotal,
            date_prepered: new Date(),
          },
        });
        const updateTerm = await prisma.term_of_pay_po_so.update({
          where: {
            id: results.termId,
          },
          data: {
            status_kontra: true,
            tax_invoice: request.body.tax_invoice,
          },
        });
        const selectTerm = await prisma.term_of_pay_po_so.findMany({
          where: { poandsoId: updateTerm.poandsoId },
        });
        const index: any = selectTerm
          .map((x: any) => {
            return x.tax_invoice;
          })
          .indexOf(false, 0);
        if (index === 1) {
          return response.status(400).json({
            success: false,
            massage: "Tax must be filled",
          });
        }
        if (updateTerm.tax_invoice === true) {
          const updateTax = await prisma.term_of_pay_po_so.updateMany({
            where: {
              poandsoId: updateTerm.poandsoId,
            },
            data: {
              tax_invoice: true,
            },
          });
          const updateTaxPain = await prisma.term_of_pay_po_so.update({
            where: { id: results.termId },
            data: {
              tax_paid: true,
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
  getKontraBon,
  createKontraBon,
};
