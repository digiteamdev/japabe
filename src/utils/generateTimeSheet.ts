var pdf = require("pdf-creator-node");
import { Request, Response } from "express";
import prisma from "../middleware/timeSheet";
import fs from "fs";


const htmlToPdf = async (request: Request) => {
  const htmlBody = fs.readFileSync(
    __dirname + "/LaporanTimeSheet.html",
    "utf8"
  );
  const formatKertas = {
    format: "A4",
    printBackground: true,
  };

  const userId: any = request.query.userId || "";
  const dateStar: any = request.query.dateStar || new Date();
  const dateEnd: any = request.query.dateEnd || new Date();
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
  results.map((e: any, i: number) => {
    const arr: any = e.time_sheet_add;
    for (let m = 0; m < arr.length; m++) {
      const j = new Date(arr[m].actual_start);
      const p = new Date(arr[m].actual_finish);
      const start = `${j.getHours()}. ${j.getMinutes()}. ${j.getSeconds()}`;
      const end = `${p.getHours()}. ${p.getMinutes()}. ${p.getSeconds()}`;
      const csvTimes: any = {
        No: m,
        date: e.date,
        job: arr[m].job,
        part_name: arr[m].part_name,
        job_description: arr[m].job_description,
        start: start,
        end: end,
        totaljam: arr[m].total_hours,
        type: e.type_timesheet,
        departement: e.user.employee.sub_depart.name,
        name: e.user.employee.employee_name,
      };
      csV.push(csvTimes);
    }
  });
  console.log(csV);
  
  const data: any = [
    {
      nomor: 112,
      tanggal: "21 September 2020",
      alamat: "Bogor, Jawa Barat",
      pembayaran: [{ metode: "Tunai", jumlah: "Rp2.000.000" }],
      barang: [
        { item: "nVidia GeForce 3090 RTX", harga: "Rp1.000.000" },
        { item: "AMD Ryzen 7", harga: "Rp1.000.000" },
      ],
      total: "Rp2.000.000",
    },
  ];
  var document = {
    html: htmlBody,
    data: {
      data: csV,
    },
    path: "./public/pdf/timesheet.pdf",
    type: "pdf",
  };
  const pdfDownload = await pdf.create(document, formatKertas);
  return pdfDownload;
};

export default htmlToPdf;
