var pdf = require("pdf-creator-node");
import { Request, Response } from "express";
import prisma from "../middleware/timeSheet";
import fs from "fs";


const htmlToPdf = async (request: Request) => {
  const htmlBody = fs.readFileSync(
    __dirname + "/LaporanTimeSheet.html",
    "utf-8"
  );
  const formatKertas = {
    format: "A4",
    border: "10mm"
  };

  const userId: any = request.query.userId || "";
  const dateStar: any = request.query.dateStar || new Date();
  const dateEnd: any = request.query.dateEnd || new Date();
  const type: any = request.query.type || "";
  const date = new Date(dateStar);
  const mountt = date.getMonth() + 1;
  const formattedDate = `${date.getFullYear()}-${
    mountt < 10 ? "0" + mountt : mountt
  }-${date.getDate()} 00:00:00`;

  const dateS = new Date(dateEnd);
  const mount = dateS.getMonth() + 1;
  const formatS = `${dateS.getFullYear()}-${
    mount < 10 ? "0" + mount : mount
  }-${dateS.getDate()} 23:59:59`;
  let results: any;
  results = await prisma.time_sheet.findMany({
    distinct: ["id"],
    where: {
      deleted: null,
      userId: {
        contains: userId,
      },
      date: {
        lte: new Date(formatS),
        gte: new Date(formattedDate),
      },
    },
    include: {
      time_sheet_add: true,
      user: {
        include: {
          employee: {
            include: {
              sub_depart: {
                include: {
                  departement: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });  
  let csV: any = [];
  let objData: any = {}
  results.map((e: any, i: number) => {    
    const arr: any = e.time_sheet_add;
    for (let m = 0; m < arr.length; m++) {
      const j = new Date(arr[m].actual_start);
      const p = new Date(arr[m].actual_finish);
      const dateSi = new Date(e.date);
      const tggl = `${dateSi.getDate()}-${dateSi.getMonth() + 1}-${dateSi.getFullYear()}`;
      const start = new Intl.DateTimeFormat('id', { hour: '2-digit', minute: '2-digit' });
      const start1 = start.format(j)
      const finish = new Intl.DateTimeFormat('id', { hour: '2-digit', minute: '2-digit' });
      const finish1 = finish.format(p)
      const csvTimes: any = {
        No: m,
        date: tggl,
        job: arr[m].job,
        part_name: arr[m].part_name,
        job_description: arr[m].job_description,
        start: start1,
        end: finish1,
        totaljam: arr[m].total_hours,
        type: e.type_timesheet,
        departement: e.user.employee.sub_depart.name,
        name: e.user.employee.employee_name,
      };
      csV.push(csvTimes);
      Object.assign(objData, csvTimes);
    }
  });      
  var document = {
    html: htmlBody,
    data: {
      data: csV,objData,
    },
    path: "./public/pdf/timesheet.pdf",
    type: "pdf",
  };    
  const pdfDownload = await pdf.create(document, formatKertas);
  return pdfDownload;
};

export default htmlToPdf;
