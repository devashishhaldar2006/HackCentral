import Resource from "../models/Resource.js";
import mongoose from "mongoose";

export const getResources = async (req, res) => {
  try {
    const { domain, type, q } = req.query;
    const filter = {};

    if (domain) {
      filter.domain = domain;
    }

    if (type) {
      filter.type = type;
    }

    if (q) {
      filter.$text = {
        $search: q,
      };
    }

    const resources = await Resource.find(filter)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resources.length,
      resources,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID format",
      });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    const relatedResources = await Resource.find({
      domain: resource.domain,
      _id: { $ne: resource._id },
    }).limit(3);

    resource.clicks += 1;
    await resource.save();

    return res.status(200).json({
      success: true,
      resource,
      relatedResources,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};