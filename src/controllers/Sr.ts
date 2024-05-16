import { Request, Response } from "express";
import prisma from "../middleware/Sr";
import pagging from "../utils/paggination";
import url from "url";
import { Prisma } from "@prisma/client";

const getSr = async (request: any, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const filter: any = request.query.filter || "desc";
    const field: any = request.query.field || "id";
    const status: any = request.query.status || undefined;
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const SrCount = await prisma.sr.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined && status != undefined) {
      results = await prisma.sr.findMany({
        where: {
          status_spv: status,
          status_manager: status,
        },
      });
    } else {
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
      if (
        emplo?.position === "Supervisor" ||
        emplo?.position === "Manager" ||
        emplo?.position === "Director"
      ) {
        results = await prisma.sr.findMany({
          where: {
            no_sr: {
              contains: pencarian,
              mode: "insensitive",
            },
          },
          include: {
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
            SrDetail: true,
          },
          orderBy: [
            {
              _relevance: {
                fields: [field],
                search: "",
                sort: filter,
              },
            },
            {
              createdAt: "desc",
            },
          ],
          take: parseInt(pagination.perPage),
          skip: parseInt(pagination.page) * parseInt(pagination.perPage),
        });
      } else {
        results = await prisma.sr.findMany({
          where: {
            user: {
              username: request.session.userId,
            },
            no_sr: {
              contains: pencarian,
              mode: "insensitive",
            },
          },
          include: {
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
            SrDetail: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: parseInt(pagination.perPage),
          skip: parseInt(pagination.page) * parseInt(pagination.perPage),
        });
      }
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Service Request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: SrCount,
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

const createSr = async (request: Request, response: Response) => {
  try {
    const d = new Date();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();
    const noSr = await prisma.sr.findMany({
      take: 1,
      orderBy: [{ createdAt: "desc" }],
    });
    let genarate;
    if (noSr.length === 0) {
      genarate = 101 + "/" + month.toString() + "/" + year.toString();
    } else {
      const noMrLast: any = noSr[0].no_sr?.split("/");
      let numor = 101;
      if (month.toString() === noMrLast[1]) {
        numor = parseInt(noMrLast[0]) + 1;
      }
      genarate = numor + "/" + month.toString() + "/" + year.toString();
    }
    const dispatchNull = request.body.dispacthIDS;
    const worNull = request.body.worId;
    const dispatchNullId = request.body.dispacthdetailId;
    const newArr = [];
    if (request.body.SrDetail) {
      const arr = request.body.SrDetail;
      for (let i = 0; i < arr.length; i++) {
        newArr.push({
          desc: arr[i].desc,
          qty: arr[i].qty,
          srId: arr[i].srId,
          note: arr[i].note,
          unit: arr[i].unit,
        });
      }
    }
    let results;
    if (dispatchNull === null || worNull === null || dispatchNullId === null) {
      results = await prisma.sr.create({
        data: {
          no_sr: genarate,
          user: { connect: { id: request.body.userId } },
          date_sr: new Date(request.body.date_sr),
          job_no: request.body.job_no,
          SrDetail: {
            create: newArr,
          },
        },
        include: {
          SrDetail: true,
        },
      });
    } else {
      results = await prisma.sr.create({
        data: {
          no_sr: genarate,
          user: { connect: { id: request.body.userId } },
          wor: { connect: { id: request.body.worId } },
          date_sr: new Date(request.body.date_sr),
          job_no: request.body.job_no,
          SrDetail: {
            create: request.body.SrDetail,
          },
        },
        include: {
          SrDetail: true,
        },
      });
    }
    await prisma.sr.update({
      where: {
        id: results.id,
      },
      data: {
        statusSr: "Request",
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

const updateSrStatus = async (request: any, response: Response) => {
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
    const statusPenc = await prisma.sr.findFirst({
      where: {
        id: id,
      },
    });
    let result;
    if (
      (emplo?.position === "Supervisor" && statusPenc?.status_spv === null) ||
      statusPenc?.status_spv === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.sr.update({
        where: { id: id },
        data: {
          status_spv: "valid",
        },
      });
    } else {
      result = await prisma.sr.update({
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

const updateSrStatusM = async (request: any, response: Response) => {
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
    const statusPenc = await prisma.sr.findFirst({
      where: {
        id: id,
      },
    });

    let result;
    if (
      (emplo?.position === "Manager" && statusPenc?.status_manager === null) ||
      statusPenc?.status_manager === "unvalid"
    ) {
      const id = request.params.id;
      result = await prisma.sr.update({
        where: { id: id },
        data: {
          status_manager: "valid",
          status_spv: "valid",
        },
      });
    } else {
      result = await prisma.sr.update({
        where: { id: id },
        data: {
          status_manager: "unvalid",
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

const updateSr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateSr = await prisma.sr.update({
      where: {
        id: id,
      },
      data: request.body,
    });
    if (updateSr) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateSr,
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

const upsertSr = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        srId: any;
        desc: any;
        dispacthdetailId: any;
        qty: any;
        unit: any;
        note: any;
        id: any;
      }) => {
        return {
          srId: updateByveri.srId,
          dispacthdetailId: updateByveri.dispacthdetailId,
          desc: updateByveri.desc,
          qty: updateByveri.qty,
          unit: updateByveri.unit,
          note: updateByveri.note,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      let updateSr;
      if (updateVerify[i].dispacthdetailId === null)
        updateSr = await prisma.srDetail.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            sr: { connect: { id: updateVerify[i].srId } },
            desc: updateVerify[i].desc,
            qty: updateVerify[i].qty,
            unit: updateVerify[i].unit,
            note: updateVerify[i].note,
          },
          update: {
            sr: { connect: { id: updateVerify[i].srId } },
            desc: updateVerify[i].desc,
            qty: updateVerify[i].qty,
            unit: updateVerify[i].unit,
            note: updateVerify[i].note,
          },
        });
      if (updateVerify[i].dispacthdetailId !== null)
        updateSr = await prisma.srDetail.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            sr: { connect: { id: updateVerify[i].srId } },
            dispatchDetail: {
              connect: { id: updateVerify[i].dispacthdetailId },
            },
            desc: updateVerify[i].desc,
            qty: updateVerify[i].qty,
            unit: updateVerify[i].unit,
            note: updateVerify[i].note,
          },
          update: {
            sr: { connect: { id: updateVerify[i].srId } },
            dispatchDetail: {
              connect: { id: updateVerify[i].dispacthdetailId },
            },
            desc: updateVerify[i].desc,
            qty: updateVerify[i].qty,
            unit: updateVerify[i].unit,
            note: updateVerify[i].note,
          },
        });
      result = [...result, updateSr];
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
    console.log(error);

    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const deleteSr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteSr = await prisma.sr.delete({
      where: {
        id: id,
      },
    });
    if (deleteSr) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteSr,
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

const deleteDetailSr = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteSrDetail = await prisma.srDetail.delete({
      where: {
        id: id,
      },
    });
    if (deleteSrDetail) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteSr,
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

const updateApprovalSr = async (request: Request, response: Response) => {
  try {
    await prisma.$transaction(
      async (prisma) => {
        let result: any = [];
        result = await prisma.approvedRequest.create({
          data: {
            idApprove: request.body.idApprove,
            dateApprove: new Date(request.body.dateApprove),
            user: { connect: { id: request.body.approveById } },
          },
        });
        const updateVerify = request.body.srDetail.map(
          (updateByveri: {
            srappr: any;
            supId: any;
            qtyAppr: any;
            id: any;
          }) => {
            return {
              srappr: updateByveri.srappr,
              supId: updateByveri.supId,
              qtyAppr: updateByveri.qtyAppr,
              id: updateByveri.id,
            };
          }
        );
        if (result) {
          for (let i = 0; i < updateVerify.length; i++) {
            let upsertDetailSr;
            upsertDetailSr = await prisma.srDetail.update({
              where: {
                id: updateVerify[i].id,
              },
              data: {
                srappr: updateVerify[i].srappr,
                approvedRequest: { connect: { id: result.id } },
                qtyAppr: parseInt(updateVerify[i].qtyAppr),
              },
            });
          }
          const getIdsr = await prisma.approvedRequest.findFirst({
            where: { id: result.id },
            include: {
              SrDetail: {
                include: {
                  sr: true,
                },
              },
            },
          });
          const updateStatus: any = getIdsr?.SrDetail;
          for (let index = 0; index < updateStatus.length; index++) {
            console.log("1");
            console.log(updateStatus[index], "aaaa");

            await prisma.sr.update({
              where: {
                id: updateStatus[index].sr.id,
              },
              data: {
                statusSr: "Approval",
              },
            });
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

const getdetailSr = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    let results;
    results = await prisma.sr.findMany({
      where: {
        status_manager_director: "approve",
        no_sr: {
          contains: pencarian,
          mode: "insensitive",
        },
        OR: [
          {
            SrDetail: {
              some: {
                supId: null,
              },
            },
          },
        ],
        SrDetail: {
          every: {
            approvedRequestId: null,
          },
        },
      },
      include: {
        SrDetail: true,
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
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All detail service request",
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

const updateApprovalOneSR = async (request: Request, response: Response) => {
  try {
    const id: string = request.body.id;
    let result: any = [];
    result = await prisma.approvedRequest.update({
      where: {
        id: id,
      },
      data: {
        user: { connect: { id: request.body.approveById } },
      },
    });
    const updateVerify = request.body.srDetail.map(
      (updateByveri: {
        srappr: any;
        supId: any;
        qtyAppr: any;
        approvedRequestId: any;
        id: any;
      }) => {
        return {
          approvedRequestId: updateByveri.approvedRequestId,
          srappr: updateByveri.srappr,
          supId: updateByveri.supId,
          qtyAppr: updateByveri.qtyAppr,
          id: updateByveri.id,
        };
      }
    );
    for (let i = 0; i < updateVerify.length; i++) {
      if (updateVerify[i].approvedRequestId === null) {
        let upsertDetailSr;
        upsertDetailSr = await prisma.srDetail.update({
          where: {
            id: updateVerify[i].id,
          },
          data: {
            srappr: updateVerify[i].srappr,
            supplier: { disconnect: true },
            approvedRequest: { disconnect: true },
            qtyAppr: parseInt(updateVerify[i].qtyAppr),
          },
        });
      } else {
        let upsertDetailSr;
        upsertDetailSr = await prisma.srDetail.update({
          where: {
            id: updateVerify[i].id,
          },
          data: {
            srappr: updateVerify[i].srappr,
            supplier: { connect: { id: updateVerify[i].supId } },
            approvedRequest: {
              connect: { id: updateVerify[i].approvedRequestId },
            },
            qtyAppr: parseInt(updateVerify[i].qtyAppr),
          },
        });
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

const getPsR = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const typeMR: any = request.query.type || ("SO" && "DSO");
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const pr = await prisma.purchase.count({
      where: {
        deleted: null,
        idPurchase: {
          startsWith: typeMR,
        },
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.srDetail.findMany({
        where: {
          AND: [
            {
              idPurchaseR: null,
            },
            {
              srappr: typeMR,
            },
          ],
          NOT: {
            approvedRequestId: null,
          },
        },
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
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.purchase.findMany({
        where: {
          idPurchase: {
            contains: pencarian,
            mode: "insensitive",
          },
          OR: [
            {
              idPurchase: {
                startsWith: typeMR,
              },
            },
          ],
        },
        include: {
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
        take: parseInt(pagination.perPage),
        skip: parseInt(pagination.page) * parseInt(pagination.perPage),
      });
    }
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Purchase services request",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: pr,
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

const updatePsr = async (request: Request, response: Response) => {
  try {
    await prisma.$transaction(
      async (prisma) => {
        let result: any = [];
        result = await prisma.purchase.create({
          data: {
            dateOfPurchase: request.body.dateOfPurchase,
            note: request.body.note,
            idPurchase: request.body.idPurchase,
            taxPsrDmr: request.body.taxPsrDmr,
            currency: request.body.currency,
          },
        });
        const updateVerify = request.body.srDetail.map(
          (updateByveri: {
            taxPsrDmr: any;
            idPurchaseR: any;
            akunId: any;
            supId: any;
            price: any;
            qtyAppr: any;
            id: any;
            disc: any;
            currency: any;
            total: any;
          }) => {
            return {
              taxPsrDmr: updateByveri.taxPsrDmr,
              idPurchaseR: updateByveri.idPurchaseR,
              akunId: updateByveri.akunId,
              disc: updateByveri.disc,
              price: updateByveri.price,
              currency: updateByveri.currency,
              qtyAppr: updateByveri.qtyAppr,
              total: updateByveri.total,
              supId: updateByveri.supId,
              id: updateByveri.id,
            };
          }
        );
        let upsertDetailSr: any;
        if (result) {
          for (let i = 0; i < updateVerify.length; i++) {
            upsertDetailSr = await prisma.srDetail.update({
              where: {
                id: updateVerify[i].id,
              },
              data: {
                supplier: { connect: { id: updateVerify[i].supId } },
                disc: updateVerify[i].disc,
                qtyAppr: updateVerify[i].qtyAppr,
                price: updateVerify[i].price,
                total: updateVerify[i].total,
                purchase: { connect: { id: result.id } },
              },
            });
          }
          const getIdmr = await prisma.purchase.findFirst({
            where: { id: result.id },
            include: {
              SrDetail: {
                include: {
                  sr: true,
                },
              },
            },
          });
          const updateStatus: any = getIdmr?.SrDetail;
          for (let index = 0; index < updateStatus.length; index++) {
            await prisma.sr.update({
              where: {
                id: updateStatus[index].sr.id,
              },
              data: {
                statusSr: "Approval",
              },
            });
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

const updatedetailPsr = async (request: Request, response: Response) => {
  try {
    const id = request.body.id;
    let result: any;
    const selectPurchase = await prisma.purchase.findFirst({
      where: { id: id },
      include: {
        SrDetail: true,
      },
    });
    let obj: any = {};
    const validateMR: any = selectPurchase?.SrDetail.map(async (mr: any) => {
      let jumlah = {
        mrappr: mr.mrappr,
      };
      return Object.assign(obj, jumlah);
    });
    if (obj.mrappr === "DP") {
      result = await prisma.purchase.update({
        where: { id: id },
        data: {
          note: request.body.note,
          currency: request.body.currency,
          taxPsrDmr: request.body.taxPsrDmr,
        },
      });
      const updateVerify = request.body.srDetail.map(
        (updateByveri: {
          taxPsrDmr: any;
          akunId: any;
          supId: any;
          id: any;
          disc: any;
          note_revision: any;
          qtyAppr: any;
          price: any;
          currency: any;
          total: any;
        }) => {
          return {
            taxPsrDmr: updateByveri.taxPsrDmr,
            akunId: updateByveri.akunId,
            disc: updateByveri.disc,
            price: updateByveri.price,
            note_revision: updateByveri.note_revision,
            currency: updateByveri.currency,
            qtyAppr: updateByveri.qtyAppr,
            total: updateByveri.total,
            supId: updateByveri.supId,
            id: updateByveri.id,
          };
        }
      );
      for (let i = 0; i < updateVerify.length; i++) {
        let upsertDetailSr;
        upsertDetailSr = await prisma.srDetail.update({
          where: {
            id: updateVerify[i].id,
          },
          data: {
            supplier: { connect: { id: updateVerify[i].supId } },
            price: updateVerify[i].price,
            note_revision: updateVerify[i].note_revision,
            qtyAppr: updateVerify[i].qtyAppr,
            disc: updateVerify[i].disc,
            total: updateVerify[i].total,
          },
        });
        result = [result, upsertDetailSr];
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
    } else {
      let result: any;
      const updateVerify = request.body.srDetail.map(
        (updateByveri: {
          taxPsrDmr: any;
          akunId: any;
          supId: any;
          id: any;
          disc: any;
          note_revision: any;
          qtyAppr: any;
          price: any;
          currency: any;
          total: any;
        }) => {
          return {
            taxPsrDmr: updateByveri.taxPsrDmr,
            akunId: updateByveri.akunId,
            disc: updateByveri.disc,
            price: updateByveri.price,
            note_revision: updateByveri.note_revision,
            currency: updateByveri.currency,
            qtyAppr: updateByveri.qtyAppr,
            total: updateByveri.total,
            supId: updateByveri.supId,
            id: updateByveri.id,
          };
        }
      );
      for (let i = 0; i < updateVerify.length; i++) {
        let upsertDetailSr;
        upsertDetailSr = await prisma.srDetail.update({
          where: {
            id: updateVerify[i].id,
          },
          data: {
            supplier: { connect: { id: updateVerify[i].supId } },
            price: updateVerify[i].price,
            note_revision: updateVerify[i].note_revision,
            qtyAppr: updateVerify[i].qtyAppr,
            disc: updateVerify[i].disc,
            total: updateVerify[i].total,
          },
        });
        result = [result, upsertDetailSr];
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
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updatePsrStatusM = async (request: any, response: Response) => {
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
    let result;
    let error_position: boolean = false;
    if (
      (emplo?.position === "Director" &&
        request.body.statusApprove.status_manager_director !== undefined) ||
      (emplo?.position === "Manager" &&
        request.body.statusApprove.status_manager_pr !== undefined)
    ) {
      result = await prisma.purchase.update({
        where: { id: id },
        data: request.body.statusApprove,
      });
      if (request.body.revision !== undefined) {
        const updateVerify = request.body.revision.map(
          (updateByveri: { note_revision: any; id: any }) => {
            return {
              note_revision: updateByveri.note_revision,
              id: updateByveri.id,
            };
          }
        );
        let result: any = [];
        for (let i = 0; i < updateVerify.length; i++) {
          result = await prisma.srDetail.update({
            where: { id: updateVerify[i].id },
            data: {
              note_revision: updateVerify[i].note_revision,
            },
          });
        }
      }
    } else if (
      (emplo?.position === "Director" &&
        request.body.statusApprove.status_manager_pr === undefined) ||
      (emplo?.position === "Manager" &&
        request.body.statusApprove.status_manager_director === undefined)
    ) {
      false;
    } else {
      error_position = true;
    }
    if (result && !error_position) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: result,
      });
    } else if (error_position) {
      response.status(400).json({
        success: false,
        massage: `anda bukan ${
          emplo?.position === "Director" ? "Manager" : "Director"
        }`,
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
  getSr,
  getPsR,
  updatePsr,
  getdetailSr,
  createSr,
  updateSr,
  upsertSr,
  updateSrStatus,
  updateSrStatusM,
  deleteSr,
  deleteDetailSr,
  updateApprovalSr,
  updateApprovalOneSR,
  updatedetailPsr,
  updatePsrStatusM,
};
