// Require Node.js Dependencies
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Require Third-party Dependencies
import puppeteer from "puppeteer";

// Require Internal Dependencies
import { config, cleanReportName } from "./utils.js";

// CONSTANTS
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const kDistDir = path.join(__dirname, "..", "reports");

export async function generatePDF(reportHTMLPath, name = config.report_title) {
  await fs.mkdir(kDistDir, { recursive: true });
  const cleanName = cleanReportName(name, ".pdf");

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.emulateMediaType("print");

    await page.goto(`file:${reportHTMLPath}`, {
      waitUntil: "networkidle2"
    });
    await page.waitForFunction("window.isReadyForPDF");

    await page.pdf({
      path: path.join(kDistDir, cleanName),
      format: "A4",
      printBackground: true
    });

    return path;
  }
  finally {
    browser.close();
  }
}

