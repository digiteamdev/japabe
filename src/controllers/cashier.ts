import { Request, Response } from "express";
import prisma from "../middleware/cashier";
import pagging from "../utils/paggination";
import url from "url";

const getCashier = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const cashieCount = await prisma.cashier.count({
      where: {
        deleted: null,
      },
    });
    const results = await prisma.kontrabon.findMany({
      where: {
        due_date: {
          gte: new Date(),
        },
        cashier: {
          every: {
            kontrabonId: undefined,
          },
        },
      },
      include: {
        cashier: true,
        SupplierBank: true,
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
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Cashier",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: cashieCount,
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

const createCashier = async (request: Request, response: Response) => {
  try {
    const results = await prisma.cashier.create({
      data: {
        id_cashier: request.body.id_cashier,
        status_payment: request.body.status_payment,
        kontrabon: { connect: { id: request.body.kontrabonId } },
        date_cashier: request.body.date_cashier,
        note: request.body.note,
        total: request.body.total,
        journal_cashier: {
          create: request.body.journal_cashier,
        },
      },
      include: {
        journal_cashier: true,
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

export default {
  getCashier,
  createCashier,
};
