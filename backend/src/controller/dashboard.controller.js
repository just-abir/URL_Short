const linkModel = require("../model/link.model");
const clickModel = require("../model/click.model");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

const getDashboard = asyncHandler(async (req, res) => {
  const topLinks = await linkModel.aggregate([
    { $sort: { clickCount: -1 } },
    { $limit: 10 },
  ]);

  const browser = await clickModel.aggregate([
    {
      $group: {
        _id: "$browser",
        totalClicks: { $sum: 1 },
      },
    },
    { $sort: { totalClicks: -1 } },
  ]);

  const devices = await clickModel.aggregate([
    {
      $group: {
        _id: "$device",
        totalClicks: { $sum: 1 },
      },
    },
    { $sort: { totalClicks: -1 } },
  ]);

  const operatingSystem = await clickModel.aggregate([
    {
      $group: {
        _id: "$operatingSystem",
        totalClicks: { $sum: 1 },
      },
    },
    { $sort: { totalClicks: -1 } },
  ]);

  const dailyReport = await clickModel.aggregate([
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$visitedAt",
          },
        },
        totalClicks: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const extraStats = await linkModel.aggregate([
    {
      $facet: {
        totalLinks: [{ $count: "count" }],
        totalClicks: [
          {
            $group: {
              _id: null,
              total: { $sum: "$clickCount" },
            },
          },
        ],
        activeLinks: [{ $match: { isActive: true } }, { $count: "count" }],
        reachableLinks: [
          { $match: { isReachable: true } },
          { $count: "count" },
        ],
      },
    },
  ]);

  return sendResponse(res, 200, "Dashboard fetched successfully", {
    topLinks,
    browser,
    devices,
    operatingSystem,
    dailyReport,
    extraStats,
  });
});

module.exports = {
  getDashboard,
};
