const linkModel = require("../model/link.model");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const crypto = require("crypto");
const QRCode = require("qrcode");

const generateShortCode = () => crypto.randomBytes(3).toString("hex");

const createLink = asyncHandler(async (req, res, next) => {
  const { originalUrl, customAlias } = req.body;

  const existOrginalUrl = await linkModel.findOne({ originalUrl });

  if (existOrginalUrl) {
    return sendResponse(res, 400, "URL already exist", existOrginalUrl);
  }

  if (customAlias) {
    const existCustomAlias = await linkModel.findOne({ customAlias });
    if (existCustomAlias) {
      return sendResponse(
        res,
        400,
        "custom alias already exist",
        existCustomAlias,
      );
    }
  }

  const shortCodeGenerate = generateShortCode();
  console.log(shortCodeGenerate);

  const generatedCodeExist = await linkModel.findOne({ shortCodeGenerate });
  while (generatedCodeExist) {
    shortCodeGenerate = generateShortCode();
    const generatedCodeExist = await linkModel.findOne({ shortCodeGenerate });
  }

  const newShortUrl = customAlias
    ? `${req.protocol}://${req.get("host")}/${customAlias}`
    : `${req.protocol}://${req.get("host")}/${shortCode}`;

  await QRCode.toFile(`src/uploads/qr/${shortCodeGenerate}.png`, newShortUrl);

  const newLink = await linkModel.create({
    originalUrl,
    shortCode: shortCodeGenerate,
    customAlias: customAlias || null,
    shortUrl: newShortUrl,
    qrCode: `/uploads/qr/${shortCodeGenerate}.png`,
  });
  console.log(newLink, "tor abba", newShortUrl);

  return sendResponse(res, 201, "short url created", newLink);
});

const redirectOriginal = asyncHandler(async (req, res, next) => {
  const { code } = req.params;
  console.log(req.params);
  const link = await linkModel.findOne({
    $or: [{ shortCode: code }, { customAlias: code }],
  });

  if (!link) sendResponse(res, 404, "link not found");
  link.clickCount += 1;
  link.lastVisitedAt = new Date();
  await link.save();
  return res.redirect(link.originalUrl);
});

const qrCodeDownlad = asyncHandler(async (req, res, next) => {
  const { code } = req.params;
  console.log(req.params);
  const link = await linkModel.findOne({
    $or: [{ shortCode: code }, { customAlias: code }],
  });

  if (!link) sendResponse(res, 404, "link not found");

  const filePath = path.join(
    __dirname,
    "../upload/qr",
    `${link.shortCode}.png`,
  );
  return res.download(filePath);
});

module.exports = { createLink, redirectOriginal, qrCodeDownlad };
