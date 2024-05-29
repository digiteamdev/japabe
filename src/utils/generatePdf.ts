import puppeteer from "puppeteer";
const formatKertas = {
  format: "A4",
  printBackground: true,
};
const htmlToPdf = async (html: any ,options: any = formatKertas) => {
  const browser = await puppeteer.launch({ headless: "shell" });
  const page = await browser.newPage();
  await page.setContent(html), { waitUntil: "coba" };
  const pdfBuffer = await page.pdf(options);

  return pdfBuffer;
};

export default htmlToPdf;
