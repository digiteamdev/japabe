import { Request, Response } from "express";
import prisma from "../middleware/cashier";
import pagging from "../utils/paggination";
import url from "url";
import { Prisma } from "@prisma/client";

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
    let results: any;
    let cdv: any;
    let detailDmr: any;
    if (request.query.page === undefined) {
      results = await prisma.kontrabon.findMany({
        where: {
          OR: [
            {
              status_valid: true,
            },
            {
              status_duedate: true,
            },
            {
              cashier: {
                every: {
                  kontrabonId: "null",
                },
              },
            },
          ],
        },
        include: {
          cashier: true,
          SupplierBank: {
            include: {
              supplier: {
                include: {
                  SupplierContact: true,
                },
              },
            },
          },
          purchase: {
            include: {
              journal_cashier: true,
              supplier: {
                include: {
                  SupplierBank: true,
                  SupplierContact: true,
                },
              },
              detailMr: {
                include: {
                  Material_Master: true,
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
                              Material_Master: true,
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
                },
              },
              SrDetail: {
                include: {
                  supplier: {
                    include: {
                      SupplierContact: true,
                      SupplierBank: true,
                    },
                  },
                  approvedRequest: true,

                  sr: {
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
                },
              },
            },
          },
          term_of_pay_po_so: {
            include: {
              poandso: {
                include: {
                  journal_cashier: {
                    include: {
                      coa: true,
                    },
                  },
                  supplier: {
                    include: {
                      SupplierContact: true,
                      SupplierBank: true,
                    },
                  },
                  detailMr: {
                    include: {
                      Material_Master: true,
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
                                  Material_Master: true,
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
                    },
                  },
                  SrDetail: {
                    include: {
                      supplier: {
                        include: {
                          SupplierContact: true,
                          SupplierBank: true,
                        },
                      },
                      approvedRequest: true,

                      sr: {
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
      cdv = await prisma.cash_advance.findMany({
        where: {
          status_manager_director: "approve",
          cashier: {
            every: {
              cdvId: null,
            },
          },
        },
        include: {
          cdv_detail: true,
          employee: true,
          user: {
            select: {
              id: true,
              username: true,
              employee: {
                select: {
                  id: true,
                  employee_name: true,
                  position: true,
                },
              },
            },
          },
          wor: {
            include: {
              customerPo: {
                include: {
                  quotations: {
                    include: {
                      Customer: true,
                      CustomerContact: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      detailDmr = await prisma.purchase.findMany({
        distinct: ["id"],
        where: {
          idPurchase: {
            contains: pencarian,
            mode: "insensitive",
          },
          OR: [
            {
              idPurchase: {
                startsWith: "DMR",
              },
            },
            {
              idPurchase: {
                startsWith: "DSR",
              },
            },
          ],
        },
        include: {
          detailMr: {
            include: {
              Material_Master: true,
              supplier: true,
              mr: {
                include: {
                  wor: true,
                  bom: {
                    include: {
                      bom_detail: {
                        include: {
                          Material_Master: true,
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
            },
          },
          SrDetail: {
            include: {
              supplier: true,
              sr: {
                include: {
                  wor: true,
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
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.cashier.findMany({
        where: {
          id_cashier: {
            contains: pencarian,
            mode: "insensitive",
          },
        },
        include: {
          journal_cashier: {
            include: {
              coa: true,
            },
          },
          kontrabon: {
            include: {
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
                          Material_Master: true,
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
                                      Material_Master: true,
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
                        },
                      },
                      SrDetail: {
                        include: {
                          supplier: {
                            include: {
                              SupplierContact: true,
                              SupplierBank: true,
                            },
                          },
                          approvedRequest: true,
                          sr: {
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
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          cash_advance: {
            include: {
              employee: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  employee: {
                    select: {
                      id: true,
                      employee_name: true,
                      position: true,
                    },
                  },
                },
              },
            },
          },
          purchase: {
            include: {
              supplier: {
                include: {
                  SupplierBank: true,
                  SupplierContact: true,
                },
              },
              SrDetail: {
                include: {
                  supplier: {
                    include: {
                      SupplierContact: true,
                      SupplierBank: true,
                    },
                  },
                  approvedRequest: true,
                  sr: {
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
                },
              },
              detailMr: {
                include: {
                  Material_Master: true,
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
                              Material_Master: true,
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
    let obj: any = [];
    const cashAdvance: any = [cdv];
    cashAdvance.map((d: any) => {
      obj.push(...d);
    });
    let dmr: any = [];
    const detailDm: any = [detailDmr];
    detailDm.map((d: any) => {
      obj.push(...d);
    });
    if (results.length > 0 || obj.length > 0 || dmr.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Cashier",
        result: [...results, ...obj, ...dmr],
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

const getDueDate = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const dueDateCount = await prisma.kontrabon.count({
      where: {
        deleted: null,
        status_duedate: true,
      },
    });
    let results: any;
    if (request.query.page === undefined) {
      results = await prisma.kontrabon.findMany({
        where: {
          due_date: {
            lte: new Date(),
          },
          status_duedate: false,
        },
        include: {
          cash_advance: {
            include: {
              cdv_detail: true,
              employee: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  employee: {
                    select: {
                      id: true,
                      employee_name: true,
                      position: true,
                    },
                  },
                },
              },
              wor: {
                include: {
                  customerPo: {
                    include: {
                      quotations: {
                        include: {
                          Customer: true,
                          CustomerContact: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          SupplierBank: {
            include: {
              supplier: {
                include: {
                  SupplierContact: true,
                },
              },
            },
          },
          purchase: {
            include: {
              supplier: {
                include: {
                  SupplierBank: true,
                  SupplierContact: true,
                },
              },
              detailMr: {
                include: {
                  Material_Master: true,
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
                              Material_Master: true,
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
                },
              },
              SrDetail: {
                include: {
                  supplier: {
                    include: {
                      SupplierContact: true,
                      SupplierBank: true,
                    },
                  },
                  approvedRequest: true,

                  sr: {
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
                },
              },
            },
          },
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
                      Material_Master: true,
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
                                  Material_Master: true,
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
                    },
                  },
                  SrDetail: {
                    include: {
                      supplier: {
                        include: {
                          SupplierContact: true,
                          SupplierBank: true,
                        },
                      },
                      approvedRequest: true,

                      sr: {
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
      results = await prisma.kontrabon.findMany({
        where: {
          OR: [
            {
              purchaseID: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              status_duedate: true,
            },
          ],
        },
        include: {
          cash_advance: {
            include: {
              cdv_detail: true,
              employee: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  employee: {
                    select: {
                      id: true,
                      employee_name: true,
                      position: true,
                    },
                  },
                },
              },
              wor: {
                include: {
                  customerPo: {
                    include: {
                      quotations: {
                        include: {
                          Customer: true,
                          CustomerContact: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          SupplierBank: {
            include: {
              supplier: {
                include: {
                  SupplierContact: true,
                },
              },
            },
          },
          purchase: {
            include: {
              supplier: {
                include: {
                  SupplierBank: true,
                  SupplierContact: true,
                },
              },
              detailMr: {
                include: {
                  Material_Master: true,
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
                              Material_Master: true,
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
                },
              },
              SrDetail: {
                include: {
                  supplier: {
                    include: {
                      SupplierContact: true,
                      SupplierBank: true,
                    },
                  },
                  approvedRequest: true,

                  sr: {
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
                },
              },
            },
          },
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
                      Material_Master: true,
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
                                  Material_Master: true,
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
                    },
                  },
                  SrDetail: {
                    include: {
                      supplier: {
                        include: {
                          SupplierContact: true,
                          SupplierBank: true,
                        },
                      },
                      approvedRequest: true,

                      sr: {
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
        massage: "Get All Due Date Kontrabon",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: dueDateCount,
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
    await prisma.$transaction(
      async (prisma) => {
        let results: any;
        if (
          request.body.cdvId === null &&
          request.body.kontrabonId === null &&
          request.body.idPurchase === null
        ) {
          results = await prisma.cashier.create({
            data: {
              id_cashier: request.body.id_cashier,
              status_payment: request.body.status_payment,
              date_cashier: request.body.date_cashier,
              note: request.body.note,
              pay_to: request.body.pay_to,
              account_name: request.body.account_name,
              bank_name: request.body.bank_name,
              rekening: request.body.rekening,
              total: request.body.total,
              journal_cashier: {
                create: request.body.journal_cashier,
              },
            },
            include: {
              journal_cashier: true,
            },
          });
        } else if (request.body.cdvId !== null) {
          results = await prisma.cashier.create({
            data: {
              id_cashier: request.body.id_cashier,
              status_payment: request.body.status_payment,
              cash_advance: { connect: { id: request.body.cdvId } },
              date_cashier: request.body.date_cashier,
              pay_to: request.body.pay_to,
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
        } else if (request.body.idPurchase !== null) {
          results = await prisma.cashier.create({
            data: {
              id_cashier: request.body.id_cashier,
              purchase: { connect: { id: request.body.idPurchase } },
              status_payment: request.body.status_payment,
              date_cashier: request.body.date_cashier,
              note: request.body.note,
              pay_to: request.body.pay_to,
              account_name: request.body.account_name,
              bank_name: request.body.bank_name,
              rekening: request.body.rekening,
              total: request.body.total,
              journal_cashier: {
                create: request.body.journal_cashier,
              },
            },
            include: {
              journal_cashier: true,
            },
          });
        } else {
          results = await prisma.cashier.create({
            data: {
              id_cashier: request.body.id_cashier,
              status_payment: request.body.status_payment,
              kontrabon: { connect: { id: request.body.kontrabonId } },
              date_cashier: request.body.date_cashier,
              pay_to: request.body.pay_to,
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

const updateCashier = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    let result: any = [];
    result = await prisma.cashier.update({
      where: {
        id: id,
      },
      data: {
        status_payment: request.body.status_payment,
      },
    });
    const updateVerify = request.body.journal_cashier.map(
      (updateByveri: {
        coa_id: any;
        status_transaction: any;
        grandtotal: any;
        cashier_id: any;
        id: any;
      }) => {
        return {
          coa_id: updateByveri.coa_id,
          status_transaction: updateByveri.status_transaction,
          grandtotal: updateByveri.grandtotal,
          cashier_id: updateByveri.cashier_id,
          id: updateByveri.id,
        };
      }
    );
    for (let i = 0; i < updateVerify.length; i++) {
      const updateDetail = await prisma.journal_cashier.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          cashier: { connect: { id: updateVerify[i].cashier_id } },
          coa: { connect: { id: updateVerify[i].coa_id } },
          status_transaction: updateVerify[i].status_transaction,
          grandtotal: updateVerify[i].grandtotal,
        },
        update: {
          coa: { connect: { id: updateVerify[i].coa_id } },
          status_transaction: updateVerify[i].status_transaction,
          grandtotal: updateVerify[i].grandtotal,
        },
      });
      result = [...result, updateDetail];
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

const updateDuedate = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    let result: any = [];
    result = await prisma.kontrabon.update({
      where: {
        id: id,
      },
      data: {
        due_date: new Date(request.body.due_date),
      },
    });
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

const updateDuedateStatus = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.valid.map(
      (updateByveri: { id: any; status_duedate: any }) => {
        return {
          id: updateByveri.id,
          status_duedate: updateByveri.status_duedate,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      result = await prisma.kontrabon.update({
        where: {
          id: updateVerify[i].id,
        },
        data: {
          status_duedate: updateVerify[i].status_duedate,
        },
      });
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

const deleteCashier = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteCashier = await prisma.cashier.delete({
      where: {
        id: id,
      },
    });
    if (deleteCashier) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteCashier,
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

const deleteDetailCashier = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteDetailCashier = await prisma.journal_cashier.delete({
      where: {
        id: id,
      },
    });
    if (deleteDetailCashier) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteDetailCashier,
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

const updateStatusM = async (request: any, response: Response) => {
  try {
    const id = request.params.id;
    const userLogin = await prisma.user.findFirst({
      where: {
        username: request.session.userId,
      },
    });
    const a: any = userLogin?.employeeId;
    const emplo = await prisma.employee.findFirst({
      where: {
        id: a,
      },
    });
    const statusPenc = await prisma.cashier.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (
      (emplo?.position === "Manager" && statusPenc?.status_valid === null) ||
      statusPenc?.status_valid === false
    ) {
      result = await prisma.cashier.update({
        where: { id: id },
        data: {
          status_valid: true,
        },
      });
    } else {
      result = await prisma.cashier.update({
        where: { id: id },
        data: {
          status_valid: false,
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

const getPosting = async (request: Request, response: Response) => {
  try {
    let l = request.query.status === "true" ? true : false;
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    let status: boolean = l;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    let results: any;
    let cashier: any;
    if (request.query.page === undefined) {
      results = await prisma.cashier.findMany({
        where: {
          id_cashier: {
            contains: pencarian,
            mode: "insensitive",
          },
          NOT: {
            journal_cashier: {
              every: {
                cashier_id: null,
              },
            },
          },
        },
        include: {
          journal_cashier: {
            include: {
              coa: true,
            },
          },
          kontrabon: {
            include: {
              purchase: {
                include: {
                  supplier: {
                    include: {
                      SupplierBank: true,
                      SupplierContact: true,
                    },
                  },
                  detailMr: {
                    include: {
                      Material_Master: true,
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
                                  Material_Master: true,
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
                    },
                  },
                  SrDetail: {
                    include: {
                      supplier: {
                        include: {
                          SupplierContact: true,
                          SupplierBank: true,
                        },
                      },
                      approvedRequest: true,

                      sr: {
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
                    },
                  },
                },
              },
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
                          Material_Master: true,
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
                                      Material_Master: true,
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
                        },
                      },
                      SrDetail: {
                        include: {
                          supplier: {
                            include: {
                              SupplierContact: true,
                              SupplierBank: true,
                            },
                          },
                          approvedRequest: true,

                          sr: {
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
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          cash_advance: {
            include: {
              employee: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  employee: {
                    select: {
                      id: true,
                      employee_name: true,
                      position: true,
                    },
                  },
                },
              },
              wor: {
                include: {
                  customerPo: {
                    include: {
                      quotations: {
                        include: {
                          Customer: true,
                          CustomerContact: true,
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
    } else {
      results = await prisma.poandso.findMany({
        where: {
          journal_cashier: {
            every: {
              status: status,
            },
          },
          NOT: {
            journal_cashier: {
              every: {
                poandsoId: null,
              },
            },
          },
        },
        include: {
          journal_cashier: {
            include: {
              coa: true,
            },
          },
          detailMr: {
            include: {
              Material_Master: true,
              supplier: true,
            },
          },
          SrDetail: {
            include: {
              supplier: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
      cashier = await prisma.cashier.findMany({
        where: {
          journal_cashier: {
            some: {
              status: status,
            },
          },
          id_cashier: {
            contains: pencarian,
            mode: "insensitive",
          },
          NOT: {
            journal_cashier: {
              every: {
                cashier_id: null,
              },
            },
          },
        },
        include: {
          journal_cashier: {
            include: {
              coa: true,
            },
          },
          kontrabon: {
            include: {
              purchase: {
                include: {
                  supplier: {
                    include: {
                      SupplierBank: true,
                      SupplierContact: true,
                    },
                  },
                  detailMr: {
                    include: {
                      Material_Master: true,
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
                                  Material_Master: true,
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
                    },
                  },
                  SrDetail: {
                    include: {
                      supplier: {
                        include: {
                          SupplierContact: true,
                          SupplierBank: true,
                        },
                      },
                      approvedRequest: true,

                      sr: {
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
                    },
                  },
                },
              },
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
                          Material_Master: true,
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
                                      Material_Master: true,
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
                        },
                      },
                      SrDetail: {
                        include: {
                          supplier: {
                            include: {
                              SupplierContact: true,
                              SupplierBank: true,
                            },
                          },
                          approvedRequest: true,

                          sr: {
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
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          cash_advance: {
            include: {
              employee: true,
              user: {
                select: {
                  id: true,
                  username: true,
                  employee: {
                    select: {
                      id: true,
                      employee_name: true,
                      position: true,
                    },
                  },
                },
              },
              wor: {
                include: {
                  customerPo: {
                    include: {
                      quotations: {
                        include: {
                          Customer: true,
                          CustomerContact: true,
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
    const totalData: any = parseInt(results.length) + parseInt(cashier.length);
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Posting Cashier",
        result: [...results, ...cashier],
        page: pagination.page,
        limit: pagination.perPage,
        totalData: totalData,
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

const updatePosting = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    let result: any = [];
    result = await prisma.cashier.update({
      where: {
        id: id,
      },
      data: {
        posting: true,
      },
    });
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

const updateJournalPosting = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.journal.map(
      (updateByveri: {
        coa_id: any;
        grandtotal: any;
        status_transaction: any;
        cashier_id: any;
        poandsoId: any;
        status: any;
        id: any;
      }) => {
        return {
          coa_id: updateByveri.coa_id,
          grandtotal: updateByveri.grandtotal,
          status_transaction: updateByveri.status_transaction,
          cashier_id: updateByveri.cashier_id,
          poandsoId: updateByveri.poandsoId,
          status: updateByveri.status,
          id: updateByveri.id,
        };
      }
    );
    const deleteQu = request.body.delete.map((deleteByveri: { id: any }) => {
      return {
        id: deleteByveri.id,
      };
    });
    let result: any = [];
    if (updateVerify) {
      for (let i = 0; i < updateVerify.length; i++) {
        if (updateVerify[i].cashier_id === null) {
          const updateJournal = await prisma.journal_cashier.upsert({
            where: {
              id: updateVerify[i].id,
            },
            create: {
              grandtotal: updateVerify[i].grandtotal,
              status_transaction: updateVerify[i].status_transaction,
              status: updateVerify[i].status,
              coa: { connect: { id: updateVerify[i].coa_id } },
              poandso: { connect: { id: updateVerify[i].poandsoId } },
            },
            update: {
              grandtotal: updateVerify[i].grandtotal,
              status_transaction: updateVerify[i].status_transaction,
              status: updateVerify[i].status,
              coa: { connect: { id: updateVerify[i].coa_id } },
              poandso: { connect: { id: updateVerify[i].poandsoId } },
            },
          });
          result = [...result, updateJournal];
        } else if (updateVerify[i].poandsoId === null) {
          const updateJournal = await prisma.journal_cashier.upsert({
            where: {
              id: updateVerify[i].id,
            },
            create: {
              grandtotal: updateVerify[i].grandtotal,
              status_transaction: updateVerify[i].status_transaction,
              status: updateVerify[i].status,
              coa: { connect: { id: updateVerify[i].coa_id } },
              cashier: { connect: { id: updateVerify[i].cashier_id } },
            },
            update: {
              grandtotal: updateVerify[i].grandtotal,
              status_transaction: updateVerify[i].status_transaction,
              status: updateVerify[i].status,
              coa: { connect: { id: updateVerify[i].coa_id } },
              cashier: { connect: { id: updateVerify[i].cashier_id } },
            },
          });
          result = [...result, updateJournal];
        }
      }
    }
    if (deleteQu) {
      for (let i = 0; i < deleteQu.length; i++) {
        await prisma.journal_cashier.delete({
          where: {
            id: deleteQu[i].id,
          },
        });
      }
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

export default {
  getCashier,
  getPosting,
  getDueDate,
  createCashier,
  updateCashier,
  updateDuedate,
  updateDuedateStatus,
  deleteCashier,
  deleteDetailCashier,
  updateStatusM,
  updatePosting,
  updateJournalPosting,
};
