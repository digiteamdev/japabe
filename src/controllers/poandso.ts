import { Request, Response } from "express";
import htmlToPdf from "../utils/generatePdf";
import prisma from "../middleware/podandso";
import pagging from "../utils/paggination";
import url from "url";
import { Prisma } from "@prisma/client";

const getPo = async (request: Request, response: Response) => {
  try {
    const type: any = request.query.type || "";
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    let results: any;
    if (type === "SO") {
      results = await prisma.sr.findMany({
        where: {
          status_manager_director: "approve",
          no_sr: {
            contains: pencarian,
            mode: "insensitive",
          },
          SrDetail: {
            some: {
              srappr: type,
            },
          },
          NOT: [
            {
              SrDetail: {
                some: {
                  idPurchaseR: null,
                },
              },
            },
          ],
        },
        include: {
          SrDetail: {
            where: {
              poandsoId: null,
            },
            include: {
              supplier: {
                include: {
                  SupplierBank: true,
                  SupplierContact: true,
                },
              },
            },
          },
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
        orderBy: {
          no_sr: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    } else if (type === "PO") {
      results = await prisma.mr.findMany({
        where: {
          status_manager_director: "approve",
          no_mr: {
            contains: pencarian,
            mode: "insensitive",
          },
          detailMr: {
            some: {
              mrappr: type,
            },
          },
          NOT: [
            {
              detailMr: {
                some: {
                  mrappr: type,
                  idPurchaseR: null,
                },
              },
            },
          ],
        },
        include: {
          detailMr: {
            where: {
              poandsoId: null,
            },
            include: {
              Material_Master: true,
              supplier: {
                include: {
                  SupplierBank: true,
                  SupplierContact: true,
                },
              },
            },
          },
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
        orderBy: {
          no_mr: "desc",
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
        totalData: results.length,
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
//termin dan repeymen harus ada nomor invoince
//kontrabon
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
        taxPsrDmr: request.body.taxPsrDmr,
        currency: request.body.currency,
        delivery_time: request.body.delivery_time,
        franco: request.body.franco,
        payment_method: request.body.payment_method,
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
        await prisma.detailMr.update({
          where: {
            id: dataId.id,
          },
          data: {
            poandsoId: results.id,
          },
        });
        const getMrId: any = await prisma.detailMr.findFirst({
          where: {
            id: dataId.id,
          },
          include: {
            mr: true,
          },
        });
        const updateStatus: any = getMrId;
        await prisma.mr.update({
          where: {
            id: updateStatus.mr.id,
          },
          data: {
            statusMr: "Purchase",
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
        const getMrId: any = await prisma.srDetail.findFirst({
          where: {
            id: dataId.id,
          },
          include: {
            sr: true,
          },
        });
        const updateStatus: any = getMrId;
        await prisma.sr.update({
          where: {
            id: updateStatus.sr.id,
          },
          data: {
            statusSr: "Purchase",
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

const getPoandSo = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const type: any = request.query.type || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const poandsoCount = await prisma.poandso.count({
      where: {
        deleted: null,
        id_so: {
          startsWith: type,
        },
      },
    });
    let results: any = [];
    let PoandSo: any = [];
    let DmrandDsr: any = [];
    if (request.query.page === undefined) {
      PoandSo = await prisma.poandso.findMany({
        where: {
          status_receive: false,
          deleted: null,
          id_so: {
            contains: pencarian,
            mode: "insensitive",
          },
          // AND: [
          // {
          //   status_receive: false,
          // },
          // {
          //   id_so: {
          //     startsWith: type,
          //   },
          // },
          // ],
        },
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
        orderBy: {
          createdAt: "desc",
        },
      });
      DmrandDsr = await prisma.purchase.findMany({
        distinct: ["id"],
        where: {
          deleted: null,
          status_receive: false,
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
      results = await prisma.poandso.findMany({
        where: {
          id_so: {
            contains: pencarian,
            mode: "insensitive",
          },
          OR: [
            {
              id_so: {
                startsWith: type,
              },
            },
          ],
        },
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
        orderBy: {
          createdAt: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0 || PoandSo.length > 0 || DmrandDsr.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All PO and SO",
        result: [...results, ...PoandSo, ...DmrandDsr],
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

const updateStatusMpoandso = async (request: any, response: Response) => {
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
    const statusPenc = await prisma.poandso.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (
      (emplo?.position === "Manager" && statusPenc?.status_manager === null) ||
      statusPenc?.status_manager === false
    ) {
      const id = request.params.id;
      result = await prisma.poandso.update({
        where: { id: id },
        data: {
          status_manager: true,
        },
      });
    } else {
      result = await prisma.poandso.update({
        where: { id: id },
        data: {
          status_manager: false,
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

const updatePoSoTerm = async (request: any, response: Response) => {
  try {
    const id = request.body.id;
    let result: any;
    result = await prisma.poandso.update({
      where: { id: id },
      data: {
        your_reff: request.body.your_reff,
        note: request.body.note,
        delivery_time: request.body.delivery_time,
        franco: request.body.franco,
        payment_method: request.body.payment_method,
        DP: request.body.DP,
      },
    });
    const updateVerify = request.body.term_of_pay_po_so.map(
      (updateByveri: {
        poandsoId: any;
        limitpay: any;
        percent: any;
        price: any;
        invoice: any;
        id: any;
      }) => {
        return {
          poandsoId: updateByveri.poandsoId,
          limitpay: updateByveri.limitpay,
          price: updateByveri.price,
          percent: updateByveri.percent,
          invoice: updateByveri.invoice,
          id: updateByveri.id,
        };
      }
    );
    for (let i = 0; i < updateVerify.length; i++) {
      let updateTermOfpay;
      updateTermOfpay = await prisma.term_of_pay_po_so.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          poandso: { connect: { id: updateVerify[i].poandsoId } },
          limitpay: updateVerify[i].limitpay,
          price: updateVerify[i].price,
          percent: updateVerify[i].percent,
          invoice: updateVerify[i].invoice,
        },
        update: {
          poandso: { connect: { id: updateVerify[i].poandsoId } },
          limitpay: updateVerify[i].limitpay,
          price: updateVerify[i].price,
          percent: updateVerify[i].percent,
          invoice: updateVerify[i].invoice,
        },
      });
      result = [updateTermOfpay];
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

const getAllReceive = async (request: Request, response: Response) => {
  try {
    const type: any = request.query.type || "";
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const poandsoCount = await prisma.poandso.count({
      where: {
        deleted: null,
        AND: [
          {
            status_receive: true,
          },
          {
            status_manager_director: "approve",
          },
          {
            id_so: {
              startsWith: type,
            },
          },
        ],
      },
    });
    let results: any;
    let detailDmr: any;
    let resultnopage: any;
    let spjCdv: any;
    if (request.query.page === undefined) {
      resultnopage = await prisma.poandso.findMany({
        where: {
          AND: [
            {
              status_receive: true,
            },
          ],
          NOT: [
            {
              term_of_pay_po_so: {
                every: {
                  status_kontra: true,
                },
              },
            },
          ],
        },
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
        orderBy: {
          createdAt: "desc",
        },
      });
      // detailDmr = await prisma.purchase.findMany({
      //   where: {
      //     status_manager_director: "approve",
      //     kontrabon: null,
      //     OR: [
      //       {
      //         idPurchase: {
      //           startsWith: "DMR",
      //         },
      //       },
      //       {
      //         idPurchase: {
      //           startsWith: "DSR",
      //         },
      //       },
      //     ],
      //   },
      //   include: {
      //     supplier: {
      //       include: {
      //         SupplierBank: true,
      //         SupplierContact: true,
      //       },
      //     },
      //     detailMr: {
      //       include: {
      //         supplier: {
      //           include: {
      //             SupplierBank: true,
      //             SupplierContact: true,
      //           },
      //         },
      //         Material_Master: true,
      //         mr: {
      //           include: {
      //             wor: true,
      //             bom: {
      //               include: {
      //                 bom_detail: {
      //                   include: {
      //                     Material_Master: true,
      //                   },
      //                 },
      //                 srimg: {
      //                   include: {
      //                     srimgdetail: true,
      //                   },
      //                 },
      //               },
      //             },
      //             user: {
      //               select: {
      //                 id: true,
      //                 username: true,
      //                 employee: {
      //                   select: {
      //                     id: true,
      //                     employee_name: true,
      //                     position: true,
      //                     sub_depart: {
      //                       select: {
      //                         id: true,
      //                         name: true,
      //                         departement: {
      //                           select: {
      //                             id: true,
      //                             name: true,
      //                           },
      //                         },
      //                       },
      //                     },
      //                   },
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //     SrDetail: {
      //       include: {
      //         supplier: {
      //           include: {
      //             SupplierBank: true,
      //             SupplierContact: true,
      //           },
      //         },
      //         sr: {
      //           include: {
      //             wor: true,
      //             user: {
      //               select: {
      //                 id: true,
      //                 username: true,
      //                 employee: {
      //                   select: {
      //                     id: true,
      //                     employee_name: true,
      //                     position: true,
      //                     sub_depart: {
      //                       select: {
      //                         id: true,
      //                         name: true,
      //                         departement: {
      //                           select: {
      //                             id: true,
      //                             name: true,
      //                           },
      //                         },
      //                       },
      //                     },
      //                   },
      //                 },
      //               },
      //             },
      //           },
      //         },
      //       },
      //     },
      //   },
      //   orderBy: {
      //     createdAt: "desc",
      //   },
      // });
      spjCdv = await prisma.cash_advance.findMany({
        where: {
          id_cash_advance: {
            contains: pencarian,
          },
          NOT: {
            id_spj: null,
          },
          grand_tot: {
            lte: 300000,
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
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.poandso.findMany({
        where: {
          AND: [
            {
              status_receive: true,
            },
            {
              id_so: {
                startsWith: type,
              },
            },
          ],
          OR: [
            {
              id_receive: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              id_so: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
          ],
        },
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
        orderBy: {
          createdAt: "desc",
        },
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    let result: any = [];
    const resultPage: any = [results];
    resultPage.map((p: any) => {
      result.push(...p);
    });
    let noPage: any = [];
    const resultNoPage: any = [resultnopage];
    resultNoPage.map((r: any) => {
      noPage.push(...r);
    });
    // let obj: any = [];
    // const detailDm: any = [detailDmr];
    // detailDm.map((d: any) => {
    //   obj.push(...d);
    // });
    let cdvSpj: any = [];
    const spj: any = [spjCdv];
    spj.map((c: any) => {
      cdvSpj.push(...c);
    });
    if (
      result.length > 0 ||
      // obj.length > 0 ||
      noPage.length > 0 ||
      cdvSpj.length > 0
    ) {
      let res: any = [];
      let arrTerm: any = [];
      noPage.map((a: any) => {
        if (a.term_of_pay_po_so.length > 1) {
          let filtered: any = a.term_of_pay_po_so.filter(
            (c: any) =>
              c.limitpay.includes("Down_Payment") && c.status_kontra == false
          );
          let z: any = {};
          let d: any = filtered.map((s: any) => {
            let ok = {
              status: false,
            };
            Object.assign(z, ok);
          });
          arrTerm.push(...filtered);
          const mj = arrTerm.map((k: any) => {
            const mergeJs = { ...k, ...z };
            return mergeJs;
          });
          const arrNew = {
            id: a.id,
            id_so: a.id_so,
            id_receive: a.id_receive,
            currency: a.currency,
            taxPsrDmr: a.taxPsrDmr,
            date_receive: a.date_receive,
            supplierId: a.supplierId,
            date_prepared: a.date_prepared,
            your_reff: a.your_reff,
            note: a.note,
            status_manager: a.status_manager,
            status_manager_director: a.status_manager_director,
            status_receive: a.status_receive,
            DP: a.DP,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            deleted: a.deleted,
            term_of_pay_po_so: mj,
            supplier: a.supplier,
            detailMr: a.detailMr,
            SrDetail: a.SrDetail,
          };
          if (filtered.length === 0) {
            let filtered: any = a.term_of_pay_po_so.filter(
              (c: any) => c.status_kontra == false
            );
            let filterede: any = a.term_of_pay_po_so.filter(
              (c: any) => c.tax_invoice == false
            );
            let z: any = {};
            let d: any = filterede
              .map((s: any) => {
                let ok = {
                  status: true,
                };
                Object.assign(z, ok);
                return s.tax_invoice;
              })
              .lastIndexOf(false);
            if (d === 1) {
              arrTerm.push(...filtered);
              const mj = arrTerm.map((k: any) => {
                const mergeJs = { ...k, ...z };
                return mergeJs;
              });
              const arrNew: any = {
                id: a.id,
                id_so: a.id_so,
                id_receive: a.id_receive,
                currency: a.currency,
                taxPsrDmr: a.taxPsrDmr,
                date_receive: a.date_receive,
                supplierId: a.supplierId,
                date_prepared: a.date_prepared,
                your_reff: a.your_reff,
                note: a.note,
                status_manager: a.status_manager,
                status_manager_director: a.status_manager_director,
                status_receive: a.status_receive,
                DP: a.DP,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
                deleted: a.deleted,
                term_of_pay_po_so: mj,
                supplier: a.supplier,
                detailMr: a.detailMr,
                SrDetail: a.SrDetail,
              };
              res.push(arrNew);
            } else {
              arrTerm.push(...filtered);
              let z: any = {};
              let d: any = filterede
                .map((s: any) => {
                  let ok = {
                    status: true,
                  };
                  Object.assign(z, ok);
                  return s.tax_invoice;
                })
                .lastIndexOf(false);

              const mj = arrTerm.map((k: any) => {
                const mergeJs = { ...k, ...z };
                return mergeJs;
              });
              const arrNew = {
                id: a.id,
                id_so: a.id_so,
                id_receive: a.id_receive,
                currency: a.currency,
                taxPsrDmr: a.taxPsrDmr,
                date_receive: a.date_receive,
                supplierId: a.supplierId,
                date_prepared: a.date_prepared,
                your_reff: a.your_reff,
                note: a.note,
                status_manager: a.status_manager,
                status_manager_director: a.status_manager_director,
                status_receive: a.status_receive,
                DP: a.DP,
                createdAt: a.createdAt,
                updatedAt: a.updatedAt,
                deleted: a.deleted,
                term_of_pay_po_so: mj,
                supplier: a.supplier,
                detailMr: a.detailMr,
                SrDetail: a.SrDetail,
              };
              res.push(arrNew);
            }
          } else {
            res.push(arrNew);
          }
        } else {
          let z: any = {};
          a.term_of_pay_po_so.map((s: any) => {
            let ok = {
              status: true,
            };
            Object.assign(z, ok);
          });
          const mj = a.term_of_pay_po_so.map((k: any) => {
            const mergeJs = { ...k, ...z };
            return mergeJs;
          });
          const arrNew = {
            id: a.id,
            id_so: a.id_so,
            id_receive: a.id_receive,
            currency: a.currency,
            taxPsrDmr: a.taxPsrDmr,
            date_receive: a.date_receive,
            supplierId: a.supplierId,
            date_prepared: a.date_prepared,
            your_reff: a.your_reff,
            note: a.note,
            status_manager: a.status_manager,
            status_manager_director: a.status_manager_director,
            status_receive: a.status_receive,
            DP: a.DP,
            createdAt: a.createdAt,
            updatedAt: a.updatedAt,
            deleted: a.deleted,
            term_of_pay_po_so: mj,
            supplier: a.supplier,
            detailMr: a.detailMr,
            SrDetail: a.SrDetail,
          };
          res.push(arrNew);
        }
      });
      return response.status(200).json({
        success: true,
        massage: "Get All Receive PO and SO",
        result: [...result, ...res, ...cdvSpj],
        page: pagination.page,
        limit: pagination.perPage,
        totalData: result.length,
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

const updatePoandSo = async (request: Request, response: Response) => {
  try {
    await prisma.$transaction(
      async (prisma) => {
        let result: any = [];
        let statusReceive: any;
        let updateVerify: any;
        let statusReceiveSo: any;
        let updateVerifySo: any;
        if (request.body.type === "po") {
          result = await prisma.poandso.update({
            where: {
              id: request.body.id,
            },
            data: {
              id_receive: request.body.id_receive,
              date_receive: request.body.date_receive,
              currency: request.body.currency,
              taxPsrDmr: request.body.taxPsrDmr,
              delivery_time: request.body.delivery_time,
              franco: request.body.franco,
              payment_method: request.body.payment_method,
            },
          });
        } else if (request.body.type === "pu") {
          result = await prisma.purchase.update({
            where: {
              id: request.body.id,
            },
            data: {
              date_receive: request.body.date_receive,
              id_receive: request.body.id_receive,
            },
          });
        }
        if (request.body.detailMr) {
          statusReceive = await prisma.detailMr.findFirst({
            where: {
              OR: [
                {
                  poandsoId: result.id,
                },
                {
                  idPurchaseR: result.id,
                },
              ],
            },
          });
          updateVerify = request.body.detailMr.map(
            (updateByveri: { qty_receive: any; id: any }) => {
              return {
                qty_receive: updateByveri.qty_receive,
                id: updateByveri.id,
              };
            }
          );
        } else if (request.body.srDetail) {
          statusReceiveSo = await prisma.srDetail.findFirst({
            where: {
              OR: [
                {
                  poandsoId: result.id,
                },
                {
                  idPurchaseR: result.id,
                },
              ],
            },
          });
          updateVerifySo = request.body.srDetail.map(
            (updateByveri: { qty_receive: any; id: any }) => {
              return {
                qty_receive: updateByveri.qty_receive,
                id: updateByveri.id,
              };
            }
          );
        }
        let upsertDetailMr: any = [];
        let upsertDetailSr: any = [];
        if (result && updateVerify) {
          for (let i = 0; i < updateVerify.length; i++) {
            upsertDetailMr = await prisma.detailMr.update({
              where: {
                id: updateVerify[i].id,
              },
              data: {
                qty_receive: updateVerify[i].qty_receive,
              },
            });
            if (
              (result &&
                statusReceive?.qtyAppr === upsertDetailMr.qty_receive) ||
              statusReceive?.qtyAppr < upsertDetailMr.qty_receive
            ) {
              if (request.body.type === "po") {
                result = await prisma.poandso.update({
                  where: {
                    id: result.id,
                  },
                  data: {
                    status_receive: true,
                  },
                });
                const statusMr: any = await prisma.detailMr.findFirst({
                  where: {
                    poandsoId: result.id,
                  },
                  include: {
                    mr: true,
                  },
                });
                if (statusMr) {
                  await prisma.mr.update({
                    where: {
                      id: statusMr.mr.id,
                    },
                    data: {
                      statusMr: "Receive",
                    },
                  });
                }
                const getMaterialS = await prisma.material_Master.findFirst({
                  where: {
                    id: statusMr.materialId,
                  },
                });
                await prisma.material_Master.update({
                  where: {
                    id: statusMr.materialId,
                  },
                  data: {
                    jumlah_Stock:
                      getMaterialS?.jumlah_Stock + updateVerify[i].qty_receive,
                    harga: statusMr.price,
                  },
                });
              } else if (request.body.type === "pu") {
                result = await prisma.purchase.update({
                  where: {
                    id: result.id,
                  },
                  data: {
                    status_receive: true,
                  },
                });
                const statusMr: any = await prisma.detailMr.findFirst({
                  where: {
                    idPurchaseR: result.id,
                  },
                  include: {
                    mr: true,
                  },
                });
                if (statusMr) {
                  await prisma.mr.update({
                    where: {
                      id: statusMr.mr.id,
                    },
                    data: {
                      statusMr: "Receive",
                    },
                  });
                }
                const getMaterialS = await prisma.material_Master.findFirst({
                  where: {
                    id: statusMr.materialId,
                  },
                });
                await prisma.material_Master.update({
                  where: {
                    id: statusMr.materialId,
                  },
                  data: {
                    jumlah_Stock:
                      getMaterialS?.jumlah_Stock + updateVerify[i].qty_receive,
                    harga: statusMr.price,
                  },
                });
              }
            } else {
              result = await prisma.poandso.update({
                where: {
                  id: result.id,
                },
                data: {
                  status_receive: false,
                },
              });
            }
            // journal
            const getPO = await prisma.poandso.findFirst({
              where: {
                id: result.id,
                id_so: {
                  startsWith: "PO",
                },
              },
              include: {
                detailMr: true,
              },
            });
            const getDmr = await prisma.purchase.findFirst({
              where: {
                id: result.id,
                idPurchase: {
                  startsWith: "DMR",
                },
              },
              include: {
                detailMr: true,
              },
            });
            const updateTotalPo: any = getPO?.detailMr;
            const updateTotalPu: any = getDmr?.detailMr;
            if (getPO) {
              for (let index = 0; index < updateTotalPo.length; index++) {
                await prisma.journal_cashier.createMany({
                  data: [
                    {
                      coa_id: "clwftmglr000rrspb2thk69fx",
                      status_transaction: "Debet",
                      poandsoId: getPO.id,
                      id_receive: getPO.id_receive,
                      grandtotal: updateTotalPo[index].total,
                    },
                    {
                      coa_id: "clwftmglr001nrspbdgzabjbl",
                      status_transaction: "Kredit",
                      poandsoId: getPO.id,
                      id_receive: getPO.id_receive,
                      grandtotal: updateTotalPo[index].total,
                    },
                  ],
                });
              }
            } else if (getDmr) {
              for (let index = 0; index < updateTotalPu.length; index++) {
                await prisma.journal_cashier.createMany({
                  data: [
                    {
                      coa_id: "clwftmglr000rrspb2thk69fx",
                      status_transaction: "Debet",
                      purchaseID: getDmr.id,
                      id_receive: getDmr.id_receive,
                      grandtotal: updateTotalPu[index].total,
                    },
                    {
                      coa_id: "clwftmglr001nrspbdgzabjbl",
                      status_transaction: "Kredit",
                      purchaseID: getDmr.id,
                      id_receive: getDmr.id_receive,
                      grandtotal: updateTotalPu[index].total,
                    },
                  ],
                });
              }
            }
          }
          response.status(201).json({
            success: true,
            massage: "Success Update Data",
            results: result,
          });
        } else if (result && updateVerifySo) {
          for (let i = 0; i < updateVerifySo.length; i++) {
            upsertDetailSr = await prisma.srDetail.update({
              where: {
                id: updateVerifySo[i].id,
              },
              data: {
                qty_receive: updateVerifySo[i].qty_receive,
              },
            });
            if (
              (result &&
                statusReceiveSo?.qtyAppr === upsertDetailSr.qty_receive) ||
              statusReceiveSo?.qtyAppr < upsertDetailSr.qty_receive
            ) {
              if (request.body.type === "po") {
                result = await prisma.poandso.update({
                  where: {
                    id: result.id,
                  },
                  data: {
                    status_receive: true,
                  },
                });
                const statusSr: any = await prisma.srDetail.findFirst({
                  where: {
                    poandsoId: result.id,
                  },
                  include: {
                    sr: true,
                  },
                });
                if (statusSr) {
                  await prisma.sr.update({
                    where: {
                      id: statusSr.sr.id,
                    },
                    data: {
                      statusSr: "Receive",
                    },
                  });
                }
              } else if (request.body.type === "pu") {
                result = await prisma.purchase.update({
                  where: {
                    id: result.id,
                  },
                  data: {
                    status_receive: true,
                  },
                });
                const statusSr: any = await prisma.srDetail.findFirst({
                  where: {
                    poandsoId: result.id,
                  },
                  include: {
                    sr: true,
                  },
                });
                if (statusSr) {
                  await prisma.sr.update({
                    where: {
                      id: statusSr.sr.id,
                    },
                    data: {
                      statusSr: "Receive",
                    },
                  });
                }
              }
            } else {
              result = await prisma.poandso.update({
                where: {
                  id: result.id,
                },
                data: {
                  status_receive: false,
                },
              });
            }
            // journal
            const getSO = await prisma.poandso.findFirst({
              where: {
                id: result.id,
                id_so: {
                  startsWith: "SO",
                },
              },
              include: {
                SrDetail: true,
              },
            });
            const getDsr = await prisma.purchase.findFirst({
              where: {
                id: result.id,
                idPurchase: {
                  startsWith: "DSR",
                },
              },
              include: {
                SrDetail: true,
              },
            });
            const updateTotalSo: any = getSO?.SrDetail;
            const updateTotaldSo: any = getDsr?.SrDetail;
            if (getSO) {
              for (let index = 0; index < updateTotalSo.length; index++) {
                await prisma.journal_cashier.createMany({
                  data: [
                    {
                      coa_id: "clwftmgls0066rspb8h6qvpan",
                      status_transaction: "Debet",
                      poandsoId: getSO.id,
                      id_receive: getSO.id_receive,
                      grandtotal: updateTotalSo[index].total,
                    },
                    {
                      coa_id: "clwftmglr001orspbjswfjt31",
                      status_transaction: "Kredit",
                      poandsoId: getSO.id,
                      id_receive: getSO.id_receive,
                      grandtotal: updateTotalSo[index].total,
                    },
                  ],
                });
              }
            } else if (getDsr) {
              for (let index = 0; index < updateTotaldSo.length; index++) {
                await prisma.journal_cashier.createMany({
                  data: [
                    {
                      coa_id: "clwftmgls0066rspb8h6qvpan",
                      status_transaction: "Debet",
                      purchaseID: getDsr.id,
                      id_receive: getDsr.id_receive,
                      grandtotal: updateTotaldSo[index].total,
                    },
                    {
                      coa_id: "clwftmglr001orspbjswfjt31",
                      status_transaction: "Kredit",
                      purchaseID: getDsr.id,
                      id_receive: getDsr.id_receive,
                      grandtotal: updateTotaldSo[index].total,
                    },
                  ],
                });
              }
            }
          }
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

const deleteTermOf = async (request: Request, response: Response) => {
  try {
    const result = request.body.termOfPayRemove.map(
      async (termOfPayRemove: any) => {
        await prisma.term_of_pay_po_so.delete({
          where: {
            id: termOfPayRemove.id,
          },
        });
      }
    );
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

const getGeneratePO = async (request: Request, response: any, error: any) => {
  try {
    const pdf = await htmlToPdf();
    response.contentType("application/pdf");
    response.send(pdf);
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

export default {
  getPo,
  getGeneratePO,
  getPoandSo,
  createPo,
  updateStatusMpoandso,
  updatePoandSo,
  getAllReceive,
  updatePoSoTerm,
  deleteTermOf,
};
