import { Request, Response } from "express";
import prisma from "../middleware/customerPo";
import pagging from "../utils/paggination";
import url from "url";

var excel = require("node-excel-export");

const getcusPo = async (request: Request, response: Response) => {
  try {
    const pencarian: any = request.query.search || "";
    const divisi: any = request.query.divisi || "";
    const hostname: any = request.headers.host;
    const pathname = url.parse(request.url).pathname;
    const page: any = request.query.page;
    const perPage: any = request.query.perPage;
    const pagination: any = new pagging(page, perPage, hostname, pathname);
    const cusPoCount = await prisma.customerPo.count({
      where: {
        deleted: null,
        job_operational: divisi,
      },
    });
    let results;
    if (request.query.page === undefined) {
      results = await prisma.customerPo.findMany({
        where: {
          deleted: null,
          wor: {
            every: {
              customerPo: null,
            },
          },
          job_operational: divisi,
        },
        include: {
          price_po: true,
          quotations: {
            include: {
              Customer: {
                include: {
                  address: true,
                },
              },
              CustomerContact: true,
            },
          },
          Deskription_CusPo: true,
          term_of_pay: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    } else {
      results = await prisma.customerPo.findMany({
        where: {
          deleted: null,
          job_operational: divisi,
          OR: [
            {
              job_no: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              po_num_auto: {
                contains: pencarian,
                mode: "insensitive",
              },
            },
            {
              wor: {
                some: {
                  job_no: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
            {
              quotations: {
                quo_num: {
                  contains: pencarian,
                  mode: "insensitive",
                },
              },
            },
            {
              quotations: {
                Customer: {
                  name: {
                    contains: pencarian,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        include: {
          price_po: true,
          wor: {
            orderBy: {
              job_no: "asc",
            },
          },
          quotations: {
            include: {
              price_quotation: true,
              Customer: {
                include: {
                  address: true,
                },
              },
              CustomerContact: true,
            },
          },
          Deskription_CusPo: true,
          term_of_pay: true,
        },
        orderBy: {
          job_no: "asc",
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

const getcusPobyId = async (request: Request, response: Response) => {
  try {
    const divisi: any = request.query.divisi || "";
    let results;
    results = await prisma.customerPo.findMany({
      where: {
        job_operational: divisi,
        id: request.params.id,
      },
      include: {
        price_po: true,
        wor: true,
        quotations: {
          include: {
            price_quotation: true,
            Customer: {
              include: {
                address: true,
              },
            },
            CustomerContact: true,
          },
        },
        Deskription_CusPo: true,
        term_of_pay: true,
      },
    });
    if (results.length > 0) {
      return response.status(200).json({
        success: true,
        massage: "Get All Customer PO by id",
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

const createcusPo = async (request: Request, response: Response) => {
  try {
    const results = await prisma.customerPo.create({
      data: {
        id_po: request.body.id_po,
        po_num_auto: request.body.po_num_auto,
        job_no: request.body.job_no,
        job_operational: request.body.job_operational,
        quotations: { connect: { id: request.body.quo_id } },
        tax: request.body.tax,
        noted: request.body.noted,
        date_of_po: new Date(request.body.date_of_po),
        date_delivery: new Date(request.body.date_delivery),
        discount: parseInt(request.body.discount),
        vat: parseInt(request.body.vat),
        grand_tot: parseInt(request.body.grand_tot),
        total: parseInt(request.body.total),
        upload_doc: !request.file ? null : request.file.path,
        term_of_pay: {
          create: JSON.parse(request.body.term_of_pay),
        },
        price_po: {
          create: JSON.parse(request.body.price_po),
        },
      },
      include: {
        term_of_pay: true,
        price_po: true,
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
    let result: any = [];
    let filePo =
      request.body.upload_doc === "null" ? null : request.body.upload_doc;

    const updatecusPo = await prisma.customerPo.update({
      where: {
        id: id,
      },
      data: {
        id_po: request.body.id_po,
        po_num_auto: request.body.po_num_auto,
        job_no: request.body.job_no,
        quotations: { connect: { id: request.body.quo_id } },
        tax: request.body.tax,
        noted: request.body.noted,
        upload_doc: !request.file ? filePo : request.file.path,
        discount: parseInt(request.body.discount),
        vat: parseInt(request.body.vat),
        grand_tot: parseInt(request.body.grand_tot),
        total: parseInt(request.body.total),
        date_of_po: new Date(request.body.date_of_po),
        date_delivery: new Date(request.body.date_delivery),
      },
    });
    const termPo = JSON.parse(request.body.term_of_pay);
    const updateVerify = termPo.map(
      (updateByveri: {
        cuspoId: any;
        limitpay: any;
        percent: any;
        price: any;
        date_limit: any;
        note: any;
        id: any;
      }) => {
        return {
          cuspoId: updateByveri.cuspoId,
          limitpay: updateByveri.limitpay,
          percent: updateByveri.percent,
          price: updateByveri.price,
          date_limit: updateByveri.date_limit,
          note: updateByveri.note,
          id: updateByveri.id,
        };
      }
    );
    const pricePo = JSON.parse(request.body.price_po);
    const updateVerifyPo = pricePo.map(
      (updateByveri: {
        cuspoId: any;
        discount: any;
        qty: any;
        description: any;
        unit_price: any;
        total_price: any;
        id: any;
      }) => {
        return {
          cuspoId: updateByveri.cuspoId,
          discount: updateByveri.discount,
          description: updateByveri.description,
          qty: updateByveri.qty,
          unit_price: updateByveri.unit_price,
          total_price: updateByveri.total_price,
          id: updateByveri.id,
        };
      }
    );
    const parsedDelete = JSON.parse(request.body.delete);
    const deletePo = parsedDelete.map((deleteByveri: { id: any }) => {
      return {
        id: deleteByveri.id,
      };
    });
    if (updateVerify) {
      for (let i = 0; i < updateVerify.length; i++) {
        const updatePoMany = await prisma.term_of_pay.upsert({
          where: {
            id: updateVerify[i].id,
          },
          create: {
            customerPo: { connect: { id: updateVerify[i].cuspoId } },
            limitpay: updateVerify[i].limitpay,
            percent: parseInt(updateVerify[i].percent),
            price: parseInt(updateVerify[i].price),
            date_limit: new Date(updateVerify[i].date_limit),
            note: updateVerify[i].note,
          },
          update: {
            customerPo: { connect: { id: updateVerify[i].cuspoId } },
            limitpay: updateVerify[i].limitpay,
            percent: parseInt(updateVerify[i].percent),
            price: parseInt(updateVerify[i].price),
            date_limit: new Date(updateVerify[i].date_limit),
            note: updateVerify[i].note,
          },
        });
        result = [...result, updatePoMany];
      }
    }
    if (updateVerifyPo) {
      for (let i = 0; i < updateVerifyPo.length; i++) {
        const updatePricePo = await prisma.price_po.upsert({
          where: {
            id: updateVerifyPo[i].id,
          },
          create: {
            unit: updateVerifyPo[i].unit,
            discount: parseInt(updateVerifyPo[i].discount),
            customerPo: { connect: { id: updateVerifyPo[i].cuspoId } },
            description: updateVerifyPo[i].description,
            unit_price: parseInt(updateVerifyPo[i].unit_price),
            qty: parseInt(updateVerifyPo[i].qty),
            total_price: parseInt(updateVerifyPo[i].total_price),
          },
          update: {
            unit: updateVerifyPo[i].unit,
            discount: parseInt(updateVerifyPo[i].discount),
            customerPo: { connect: { id: updateVerifyPo[i].cuspoId } },
            description: updateVerifyPo[i].description,
            unit_price: parseInt(updateVerifyPo[i].unit_price),
            qty: parseInt(updateVerifyPo[i].qty),
            total_price: parseInt(updateVerifyPo[i].total_price),
          },
        });
        result = [...result, updatePricePo];
      }
    }
    if (deletePo) {
      for (let i = 0; i < deletePo.length; i++) {
        await prisma.term_of_pay.delete({
          where: {
            id: deletePo[i].id,
          },
        });
      }
    }
    if (result || updatecusPo || updateVerify || updateVerifyPo) {
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
          customerPo: { connect: { id: updateVerify[i].cuspoId } },
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
          customerPo: { connect: { id: updateVerify[i].cuspoId } },
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

const getAllCusPocsv = async (request: Request, response: Response) => {
  try {
    const results = await prisma.customerPo.findMany({
      where: {
        job_operational: "S",
      },
      include: {
        price_po: true,
        wor: {
          orderBy: {
            job_no: "asc",
          },
        },
        quotations: {
          include: {
            price_quotation: true,
            Customer: {
              include: {
                address: true,
              },
            },
            CustomerContact: true,
          },
        },
        Deskription_CusPo: true,
        term_of_pay: true,
      },
      orderBy: {
        job_no: "asc",
      },
    });
    let csV: any = [];
    results.map((e: any, i: number) => {
      // let obj: any = {};
      // e.quotations.map((a: any) => {
      //   Object.assign(obj, a);
      // });
      const csvCus: any = {
        No: i + 1,
        QUOTATION_NO: e.quotations.quo_num,
        subject: e.description,
        quotation_date: e.quotations.date,
        customer: e.quotations.Customer.name,
        email: e.quotations.Customer.email,
        phone: e.quotations.Customer.phone,
        contact: e.quotations.CustomerContact.contact_person,
        scope_work: e.quotations.Quotations_Detail,
        desc: e.description,
        unit_price: e.unit_price,
        qty: e.qty,
        unit: e.unit,
        price: e.unit_price,
        total_price: e.total_price,
        estimate_delivered: e.quotations.estimate_delivered,
        warranty: e.quotations.warranty,
      };
      csV.push(csvCus);
    });
    var styles = {
      headerDark: {
        fill: {
          fgColor: {
            rgb: "FF000000",
          },
        },
        font: {
          color: {
            rgb: "FFFFFFFF",
          },
          sz: "11",
          bold: true,
          vertAlign: true,
          underline: false,
        },
      },
      label: {
        fill: {
          fgColor: {
            rgb: "b1a0c7",
          },
        },
        font: {
          color: {
            rgb: "000000",
          },
          sz: "11",
          bold: true,
          vertAlign: true,
          underline: false,
          name: "Calibri",
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: false,
        },
      },
      cellPink: {
        alignment: {
          horizontal: "center",
        },
        font: {
          color: {
            rgb: "000000",
          },
          sz: "11",
          bold: true,
          vertAlign: true,
          underline: false,
          name: "Calibri",
        },
      },
    };
    const heading = [
      [
        { value: "a1", style: styles.headerDark },
        { value: "b1", style: styles.headerDark },
        { value: "c1", style: styles.headerDark },
      ],
    ];
    const merges = [
      { start: { row: 1, column: 1 }, end: { row: 2, column: 1 } },
    ];
    var specification = {
      No: {
        displayName: "NO",
        headerStyle: styles.label,
        width: 50,
        cellStyle: styles.cellPink,
      },
      QUOTATION_NO: {
        displayName: `\n QUOTATION NO \n`,
        headerStyle: styles.label,
        width: 280,
      },
      customer: {
        displayName: "NAME OF COMPANY",
        headerStyle: styles.label,
        width: 250,
      },
      subject: {
        displayName: "DESCRIPTION",
        headerStyle: styles.label,
        width: 320,
      },
      qty: {
        displayName: "QTY",
        headerStyle: styles.label,
        width: 100,
        cellStyle: styles.cellPink,
      },
      unit: {
        displayName: "UNIT",
        headerStyle: styles.label,
        width: 100,
        cellStyle: styles.cellPink,
      },
      price: {
        displayName: "PRICE/PCS",
        headerStyle: styles.label,
        width: 200,
      },
      total_price: {
        displayName: "TOTAL PRICE",
        headerStyle: styles.label,
        width: 200,
      },
      quotation_date: {
        displayName: "DATE OF RFQ",
        headerStyle: styles.label,
        width: 200,
      },
      estimate_delivered: {
        displayName: "DATE OF RFQ",
        headerStyle: styles.label,
        width: 200,
      },
      warranty: {
        displayName: "WARRANTY PERIOD",
        headerStyle: styles.label,
        width: 200,
      },
    };
    var report = excel.buildExport([
      {
        name: "quotation.xlsx",
        specification: specification,
        // heading: heading,
        // merges: merges,
        data: csV,
      },
    ]);
    response.attachment("quotation.xlsx");
    response.send(report);
  } catch (error) {
    console.log(error);
  }
};

export default {
  getcusPo,
  getcusPobyId,
  createcusPo,
  updatecusPo,
  updatePoDetail,
  updatePoTermOfPay,
  deletecusPo,
  deletecusPoDetail,
  deletecusPoTermOfPay,
};
