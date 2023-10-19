import { Request, Response } from "express";
import prisma from "../middleware/podandso";
import pagging from "../utils/paggination";
import url from "url";

const getPo = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const type: any = request.query.type || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const poandsoCount = await prisma.purchase.count({
      where: {
        deleted: null,
        OR: [
          {
            status_manager_director: "approve",
          },
        ],
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.purchase.findMany({
        where: {
          deleted: null,
          status_manager_director: "approve",
          idPurchase: {
            startsWith: type,
          },
        },
        include: {
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
                      customerPo: {
                        include: {
                          quotations: {
                            include: {
                              Quotations_Detail: true,
                              CustomerContact: true,
                            },
                          },
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
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.purchase.findMany({
        where: {
          deleted: null,
          status_manager_director: "approve",
          idPurchase: {
            startsWith: type,
          },
        },
        include: {
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
        massage: "Get All PO and SO",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: poandsoCount,
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

const createPo = async (request: Request, response: Response) => {
  try {
    const results = await prisma.poandso.create({
      data: {
        id_so: request.body.id_so,
        date_prepared: new Date(request.body.date_prepared),
        supplier: { connect: { id: request.body.supplierId } },
        your_reff: request.body.your_reff,
        note: request.body.note,
        DP: request.body.DP,
        term_of_pay_po_so: {
          create: request.body.term_of_pay_po_so,
        },
      },
      include: {
        term_of_pay_po_so: true,
      },
    });
    if (request.body.detailMrID !== null) {
      request.body.detailMrID.map(async (dataId: any) => {
        console.log(results.id);
        await prisma.detailMr.update({
          where: {
            id: dataId.id,
          },
          data: {
            poandsoId: results.id,
          },
        });
      });
    }
    if (request.body.detailSrID !== null) {
      request.body.detailSrID.map(async (dataId: any) => {
        await prisma.srDetail.update({
          where: {
            id: dataId.id,
          },
          data: {
            poandsoId: results.id,
          },
        });
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
  getPo,
  createPo,
};
