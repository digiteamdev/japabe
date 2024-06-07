import puppeteer from "puppeteer";
import fs from "fs";
import mustache from "mustache";

const formatKertas = {
  format: "A4",
  printBackground: true,
};
const htmlToPdf = async (options: any = formatKertas) => {
  const htmlBody = fs.readFileSync(__dirname + "/LaporanLabaRugi.html", "utf8");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const data: any = {
    nomor: 112,
    tanggal: "21 September 2020",
    alamat: "Bogor, Jawa Barat",
    pembayaran: [{ metode: "Tunai", jumlah: "Rp2.000.000" }],
    barang: [
      { item: "nVidia GeForce 3090 RTX", harga: "Rp1.000.000" },
      { item: "AMD Ryzen 7", harga: "Rp1.000.000" },
    ],
    total: "Rp2.000.000",
  };
  await page.setContent(mustache.render(htmlBody, data)), { waitUntil: "coba" };
  const pdfBuffer = await page.pdf(options);

  return pdfBuffer;
};

export default htmlToPdf;
