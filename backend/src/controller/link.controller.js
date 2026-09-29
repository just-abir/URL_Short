const linkModel = require("../model/link.model");
const clickModel = require("../model/click.model");

const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const crypto = require("crypto");
const QRCode = require("qrcode");

const axios = require("axios");
const UAParser = require("ua-parser-js");
const uploadQrToCloudinary = require("../utils/uploadQrCloudinary");

const generateShortCode = () => crypto.randomBytes(3).toString("hex");
const checkingUrl = async (url) => {
  try {
    const liveUrl = await axios.get(url, { timeout: 5000, maxRedirects: 5 });
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const createLink = asyncHandler(async (req, res, next) => {
  const { originalUrl, customAlias } = req.body;

  const trimmedUrl = originalUrl?.trim();
  const trimmedAlias = customAlias?.trim();

  // 1. Check original URL
  if (!trimmedUrl) {
    return sendResponse(res, 400, "Original URL is required");
  }

  // 2. Check if this is already a short URL
  try {
    const parsedUrl = new URL(trimmedUrl);
    const currentHost = req.get("host");

    if (parsedUrl.host === currentHost) {
      const code = parsedUrl.pathname.replace(/^\/+|\/+$/g, "");

      if (code) {
        const existingShortUrl = await linkModel.findOne({
          $or: [{ shortCode: code }, { customAlias: code }],
        });

        if (existingShortUrl) {
          return sendResponse(
            res,
            400,
            "This URL is already a short URL",
            existingShortUrl,
          );
        }
      }
    }
  } catch (error) {
    // Ignore URL parsing error here
    // checkingUrl() will handle URL validation
  }

  // 3. Check if original URL already exists
  const existingOriginalUrl = await linkModel.findOne({
    originalUrl: trimmedUrl,
  });

  if (existingOriginalUrl) {
    return sendResponse(
      res,
      200,
      "URL already shortened. Existing URL information is shown below.",
      existingOriginalUrl,
    );
  }

  // 4. Check custom alias
  if (trimmedAlias) {
    const existingCustomAlias = await linkModel.findOne({
      customAlias: trimmedAlias,
    });

    if (existingCustomAlias) {
      return sendResponse(
        res,
        400,
        "Custom alias already exists",
        existingCustomAlias,
      );
    }
  }

  // 5. Generate unique short code
  let shortCodeGenerate = generateShortCode();

  let generatedCodeExist = await linkModel.findOne({
    shortCode: shortCodeGenerate,
  });

  while (generatedCodeExist) {
    shortCodeGenerate = generateShortCode();

    generatedCodeExist = await linkModel.findOne({
      shortCode: shortCodeGenerate,
    });
  }

  // 6. Create short URL
  const finalCode = trimmedAlias || shortCodeGenerate;

const newShortUrl = `${process.env.BASE_URL}/${finalCode}`;
  // 7. Generate QR code

  const qrBuffer = await QRCode.toBuffer(newShortUrl);
  
  const uploadResult = await uploadQrToCloudinary(qrBuffer, finalCode);
 

  const qrCodeUrl = uploadResult.secure_url;

  // 8. Check original URL
  const isUrlReachable = await checkingUrl(trimmedUrl);

  // 9. Expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 20);

  // 10. Create database object
  const linkData = {
    originalUrl: trimmedUrl,
    shortCode: shortCodeGenerate,
    shortUrl: newShortUrl,
    qrCode: qrCodeUrl,
    isReachable: isUrlReachable,
    expiresAt,
  };

  if (trimmedAlias) {
    linkData.customAlias = trimmedAlias;
  }

  // 11. Save to database
  const newLink = await linkModel.create(linkData);

 

  return sendResponse(res, 201, "Short URL created successfully", newLink);
});

const redirectOriginal = asyncHandler(async (req, res, next) => {
  const { code } = req.params;

  const link = await linkModel.findOne({
    $or: [{ shortCode: code }, { customAlias: code }],
  });

  if (!link) return sendResponse(res, 404, "link not found");

  if (link.expiresAt && new Date() > link.expiresAt) {
    return sendResponse(res, 400, "This link has expired ");
  }

  const parser = new UAParser(req.headers["user-agent"]);
  const result = parser.getResult();
 

  const moreInfo = await clickModel.create({
    linkID: link._id,
    ipAddress: req.ip,
    browser: result.browser.name || "Unknown",
    operatingSystem: result.os.name || "Unknown",
    device: result.device.type || "Desktop",
    referrer: req.get("referer") || "Direct",
  });
 
  link.clickCount += 1;
  link.lastVisitedAt = new Date();
  await link.save();
  return res.redirect(link.originalUrl);
});

const qrCodeDownlad = asyncHandler(async (req, res, next) => {
  const { code } = req.params;

  const link = await linkModel.findOne({
    $or: [{ shortCode: code }, { customAlias: code }],
  });

  if (!link) return sendResponse(res, 404, "link not found");

  if (!link.qrCode) {
    return sendResponse(res, 404, "QR code not found for this link");
  }

  const fileName = link.customAlias || link.shortCode;

  try {
    const response = await axios.get(link.qrCode, {
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName}.png"`,
    );
    res.setHeader("Content-Type", "image/png");

    response.data.pipe(res);

    // handle stream errors after piping starts
    response.data.on("error", (err) => {
      if (!res.headersSent) {
        sendResponse(res, 500, "Failed to download QR code");
      } else {
        res.end();
      }
    });
  } catch (error) {
    return sendResponse(res, 500, "Failed to fetch QR code");
  }
});

module.exports = { createLink, redirectOriginal, qrCodeDownlad };
