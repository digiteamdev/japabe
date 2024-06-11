var pdf = require("pdf-creator-node");
import fs from "fs";
import mustache from 'mustache';

const formatKertas = {
  format: "A4",
  printBackground: true,
};
const htmlToPdf = async (options: any = formatKertas) => {
  const htmlBody = fs.readFileSync(__dirname + "/purchaseOrder.html", "utf8");
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
      data: data,
    },
    path: "./public/pdf/PO.pdf",
    type: "pdf",
  };
  const pdfDownload = await pdf.create(document, options)
  return pdfDownload
};

export default htmlToPdf;
