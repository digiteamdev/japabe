import { Request, Response } from "express";
import prisma from "../middleware/quotation";
import pagging from "../utils/paggination";
import url from "url";

const getQuotation = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const quotationtCount = await prisma.quotations.count({
      where: {
        deleted: null,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.quotations.findMany({
        where: {
          quo_num: {
            contains: "",
          },
          CustomerPo: null,
        },
        include: {
          CustomerPo: true,
          Customer: {
            include: {
              address: true,
            },
          },
          CustomerContact: true,
          Quotations_Detail: true,
          eqandpart: {
            include: {
              equipment: true,
              eq_part: true,
            },
          },
        },
      });
    } else {
      results = await prisma.quotations.findMany({
        where: {
          quo_num: {
            contains: pencarian,
          },
        },
        include: {
          Customer: {
            include: {
              address: true,
            },
          },
          CustomerContact: true,
          Quotations_Detail: true,
          eqandpart: {
            include: {
              equipment: true,
              eq_part: true,
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
        massage: "Get All Quotation",
        result: results,
        page: pagination.page,
        limit: pagination.perPage,
        totalData: quotationtCount,
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

const getEditPoQuotation = async (request: Request, response: Response) => {
  try {
    const results = await prisma.quotations.findMany({
      where: {
        OR: [
          {
            CustomerPo: null,
          },
          { id: request.params.id },
        ],
      },
      include: {
        CustomerPo: true,
        Customer: {
          include: {
            address: true,
          },
        },
        CustomerContact: true,
        Quotations_Detail: true,
        eqandpart: {
          include: {
            equipment: true,
            eq_part: true,
          },
        },
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Quotation",
        result: results,
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

const createQuotation = async (request: any, response: Response) => {
  try {
    let results;
    results = await prisma.quotations.create({
      data: {
        quo_num: request.body.quo_num,
        quo_auto: request.body.quo_auto,
        Customer: { connect: { id: request.body.customerId } },
        CustomerContact: { connect: { id: request.body.customercontactId } },
        deskription: request.body.deskription,
        date: new Date(request.body.date),
        quo_img: !request.file ? "" : request.file.path,
        Quotations_Detail: {
          create: JSON.parse(request.body.Quotations_Detail),
        },
        eqandpart: {
          create: JSON.parse(request.body.eqandpart),
        },
      },
      include: {
        Quotations_Detail: true,
        eqandpart: true,
      },
    });
    if (results) {
      return response.status(204).json({
        success: true,
        massage: "Success Add Data",
        result: results,
      });
    } else {
      return response.status(200).json({
        success: false,
        result: "Not Succes",
      });
    }
  } catch (error) {
    response.status(500).json({ massage: error.message, code: error }); // this will log any error that prisma throws + typesafety. both code and message are a string
  }
};

const updateQuotation = async (request: any, response: Response) => {
  try {
    const id: string = request.params.id;
    const updateQuotation = await prisma.quotations.update({
      where: {
        id: id,
      },
      data: {
        quo_num: request.body.quo_num,
        quo_auto: request.body.quo_auto,
        Customer: { connect: { id: request.body.customerId } },
        CustomerContact: { connect: { id: request.body.customercontactId } },
        deskription: request.body.deskription,
        date: new Date(request.body.date),
        quo_img: !request.file ? request.body.quo_img : request.file.path,
      },
    });
    if (updateQuotation) {
      response.status(201).json({
        success: true,
        massage: "Success Update Data",
        results: updateQuotation,
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

const updateQuotationDetail = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        item_of_work: any;
        volume: any;
        unit: any;
        quo_id: any;
        id: any;
      }) => {
        return {
          item_of_work: updateByveri.item_of_work,
          volume: updateByveri.volume,
          unit: updateByveri.unit,
          quo_id: updateByveri.quo_id,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateQuotationDetail = await prisma.quotations_Detail.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          item_of_work: updateVerify[i].item_of_work,
          volume: updateVerify[i].volume,
          unit: updateVerify[i].unit,
          quotations: { connect: { id: updateVerify[i].quo_id } },
        },
        update: {
          item_of_work: updateVerify[i].item_of_work,
          volume: updateVerify[i].volume,
          unit: updateVerify[i].unit,
        },
      });
      result = [...result, updateQuotationDetail];
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

const updateQuotationEqPart = async (request: Request, response: Response) => {
  try {
    const updateVerify = request.body.map(
      (updateByveri: {
        id_equipment: any;
        id_part: any;
        id_quotation: any;
        qty: any;
        keterangan: any;
        id: any;
      }) => {
        return {
          id_equipment: updateByveri.id_equipment,
          id_part: updateByveri.id_part,
          id_quotation: updateByveri.id_quotation,
          qty: updateByveri.qty,
          keterangan: updateByveri.keterangan,
          id: updateByveri.id,
        };
      }
    );
    let result: any = [];
    for (let i = 0; i < updateVerify.length; i++) {
      const updateQuotationEqPart = await prisma.eqandpart.upsert({
        where: {
          id: updateVerify[i].id,
        },
        create: {
          equipment: { connect: { id: updateVerify[i].id_equipment } },
          eq_part: { connect: { id: updateVerify[i].id_part } },
          quotations: { connect: { id: updateVerify[i].id_quotation } },
          qty: updateVerify[i].qty,
          keterangan: updateVerify[i].keterangan,
        },
        update: {
          equipment: { connect: { id: updateVerify[i].id_equipment } },
          eq_part: { connect: { id: updateVerify[i].id_part } },
          quotations: { connect: { id: updateVerify[i].id_quotation } },
          qty: updateVerify[i].qty,
          keterangan: updateVerify[i].keterangan,
        },
      });
      result = [...result, updateQuotationEqPart];
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

const deleteQuotation = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteQuotation = await prisma.quotations.delete({
      where: {
        id: id,
      },
    });
    if (deleteQuotation) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteQuotation,
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

const deleteQuotationDetail = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteQuotationDetail = await prisma.quotations_Detail.delete({
      where: {
        id: id,
      },
    });
    if (deleteQuotationDetail) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteQuotationDetail,
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

const deleteQuotationEqPart = async (request: Request, response: Response) => {
  try {
    const id: string = request.params.id;
    const deleteQuotationEqPart = await prisma.eqandpart.delete({
      where: {
        id: id,
      },
    });
    if (deleteQuotationEqPart) {
      response.status(201).json({
        success: true,
        massage: "Success Delete Data",
        results: deleteQuotationEqPart,
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
  getQuotation,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  updateQuotationDetail,
  updateQuotationEqPart,
  deleteQuotationDetail,
  deleteQuotationEqPart,
  getEditPoQuotation,
};
