import { Request, Response } from "express";
import prisma from "../middleware/customerPo";
import pagging from "../utils/paggination";
import url from "url";

const getcusPo = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const cusPoCount = await prisma.customerPo.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.customerPo.findMany({
        where: {
          id_po: {
            contains: "",
          },
        },
        include: {
          quotations: {
            include: {
              Customer: {
                include: {
                  address: true,
                },
              },
              CustomerContact: true,
              eqandpart: {
                include: {
                  equipment: true,
                  eq_part: true,
                },
              },
            },
          },
          Deskription_CusPo: true,
          term_of_pay: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      results = await prisma.customerPo.findMany({
        where: {
          po_num_auto: {
            contains: pencarian,
          },
        },
        include: {
          quotations: {
            include: {
              Customer: {
                include: {
                  address: true,
                },
              },
              CustomerContact: true,
              eqandpart: {
                include: {
                  equipment: true,
                  eq_part: true,
                },
              },
            },
          },
          Deskription_CusPo: true,
          term_of_pay: true,
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
        massage: "Get All Customer PO",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: cusPoCount,
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

const createcusPo = async (request: Request, response: Response) => {
  try {
    const results = await prisma.customerPo.create({
      data: {
        id_po: request.body.id_po,
        po_num_auto: request.body.po_num_auto,
        quotations: { connect: { id: request.body.quo_id } },
        tax: request.body.tax,
        noted: request.body.noted,
        date_of_po: new Date(request.body.date_of_po),
        vat: request.body.vat,
        grand_tot: request.body.grand_tot,
        total: request.body.total,
        Deskription_CusPo: {
          create: request.body.Deskription_CusPo,
        },
        term_of_pay: {
          create: request.body.term_of_pay,
        },
      },
      include: {
        Deskription_CusPo: true,
        term_of_pay: true,
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

const updatecusPo = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const updatecusPo = await prisma.customerPo.update({
      where: {
        id: id,
      },
      data: {
        id_po: request.body.id_po,
        po_num_auto: request.body.po_num_auto,
        quotations: { connect: { id: request.body.quo_id } },
        tax: request.body.tax,
        noted: request.body.noted,
        date_of_po: new Date(request.body.date_of_po),
      },
    });
    if (updatecusPo) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updatecusPo,
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

const updatePoDetail = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        cuspoId: any;
        qty: any;
        unit: any;
        price: any;
        discount: any;
        total: any;
        description: any;
        id: any;
      }) => {
        return {
          cuspoId: updateByveri.cuspoId,
          qty: updateByveri.qty,
          unit: updateByveri.unit,
          price: updateByveri.price,
          discount: updateByveri.discount,
          total: updateByveri.total,
          description: updateByveri.description,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updatePoDetail = await prisma.deskription_CusPo.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          qty: updateVerify[i].qty,
          unit: updateVerify[i].unit,
          price: updateVerify[i].price,
          discount: updateVerify[i].discount,
          total: updateVerify[i].total,
          description: updateVerify[i].description,
          customerPo: { connect: { id: updateVerify[i].cuspoId } },
        },
        update: {
          qty: updateVerify[i].qty,
          unit: updateVerify[i].unit,
          price: updateVerify[i].price,
          discount: updateVerify[i].discount,
          total: updateVerify[i].total,
        },
      });
      result = [...result, updatePoDetail];
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

const updatePoTermOfPay = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        cuspoId: any;
        limitpay: any;
        percent: any;
        price: any;
        date_limit: any;
        id: any;
      }) => {
        return {
          cuspoId: updateByveri.cuspoId,
          limitpay: updateByveri.limitpay,
          percent: updateByveri.percent,
          price: updateByveri.price,
          date_limit: updateByveri.date_limit,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updatePoTermOfPay = await prisma.term_of_pay.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          limitpay: updateVerify[i].limitpay,
          percent: updateVerify[i].percent,
          price: updateVerify[i].price,
          date_limit: updateVerify[i].date_limit,
          customerPo: { connect: { id: updateVerify[i].cuspoId } },
        },
        update: {
          limitpay: updateVerify[i].limitpay,
          percent: updateVerify[i].percent,
          price: updateVerify[i].price,
          date_limit: updateVerify[i].date_limit,
        },
      });
      result = [...result, updatePoTermOfPay];
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
    response.status(500).json({ massage: error.message, code: error.code }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const deletecusPo = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deletecusPo = await prisma.customerPo.delete({
      where: {
        id: id,
      },
    });
    if (deletecusPo) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deletecusPo,
      });
    } else {
      response.status(400).json({
        success: false,
        massage: "Unsuccess Delete Data",
      });
    }
  } catch (error) {
    response.status(500).json({ masagge: error.message });
  }
};

const deletecusPoDetail = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deletecusPoDetail = await prisma.deskription_CusPo.delete({
      where: {
        id: id,
      },
    });
    if (deletecusPoDetail) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deletecusPoDetail,
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

const deletecusPoTermOfPay = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deletecusPoTermOfPay = await prisma.term_of_pay.delete({
      where: {
        id: id,
      },
    });
    if (deletecusPoTermOfPay) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deletecusPoTermOfPay,
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
  getcusPo,
  createcusPo,
  updatecusPo,
  updatePoDetail,
  updatePoTermOfPay,
  deletecusPo,
  deletecusPoDetail,
  deletecusPoTermOfPay,
};
