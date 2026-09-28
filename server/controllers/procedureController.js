import { Procedure } from '../models/Procedure.js';
import { ProcedureStep } from '../models/ProcedureStep.js';
import { Dependency } from '../models/Dependency.js';
import { DocumentRequirement } from '../models/DocumentRequirement.js';
import { GovernmentSource } from '../models/GovernmentSource.js';
import { CivicTask } from '../models/CivicTask.js';
import mongoose from 'mongoose';

export const getProcedures = async (req, res, next) => {
  try {
    const { state, district, city, serviceType, search, verifiedOnly } = req.query;
    const filter = {};

    if (state) filter.state = new RegExp(state, 'i');
    if (district) filter.district = new RegExp(district, 'i');
    if (city) filter.city = new RegExp(city, 'i');
    if (serviceType) filter.serviceType = new RegExp(serviceType, 'i');
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
        { serviceType: new RegExp(search, 'i') },
      ];
    }

    const procedures = await Procedure.find(filter).sort({ createdAt: -1 });

    const catalogItems = await Promise.all(
      procedures.map(async (proc) => {
        const steps = await ProcedureStep.find({ procedureId: proc._id });
        let allStepsVerified = steps.length > 0;
        const verifiedSourcesMap = new Map();

        for (const s of steps) {
          if (!s.sourceIds || s.sourceIds.length === 0) {
            allStepsVerified = false;
          } else {
            const linkedSources = await GovernmentSource.find({ _id: { $in: s.sourceIds } });
            const approvedVerifiedSources = linkedSources.filter(
              (src) => src.sourceStatus === 'verified' && src.verificationStatus === 'approved'
            );

            if (linkedSources.length === 0 || approvedVerifiedSources.length !== linkedSources.length) {
              allStepsVerified = false;
            }

            for (const src of approvedVerifiedSources) {
              verifiedSourcesMap.set(src._id.toString(), {
                sourceId: src._id.toString(),
                title: src.extractedContent?.title || src.sourceName || src.service || 'Official Government Source',
                url: src.sourceUrl || src.url,
                officialDomain: src.officialDomain || src.domain,
                verificationStatus: 'verified',
                lastCheckedAt: src.lastVerifiedAt || src.lastCheckedAt || src.updatedAt,
              });
            }
          }
        }

        const procedureSourceVerified = proc.sourceStatus === 'verified';
        const officialSourceVerified = procedureSourceVerified && allStepsVerified;

        let statusStr = 'database_only';
        if (proc.sourceStatus === 'review_required' || proc.sourceStatus === 'inactive') {
          statusStr = 'review_required';
        } else if (officialSourceVerified) {
          statusStr = 'verified';
        } else {
          statusStr = 'database_only';
        }

        const sourcesList = Array.from(verifiedSourcesMap.values());

        return {
          _id: proc._id,
          id: proc._id.toString(),
          title: proc.title,
          description: proc.description,
          serviceType: proc.serviceType,
          jurisdiction: proc.jurisdiction,
          location: {
            state: proc.state,
            district: proc.district,
            city: proc.city,
          },
          status: proc.status,
          sourceStatus: proc.sourceStatus,
          groundingStatus: {
            databaseGrounded: true,
            officialSourceVerified,
            status: statusStr,
          },
          sourcesCount: sourcesList.length,
          sources: sourcesList,
          stepsCount: steps.length,
          createdAt: proc.createdAt,
          updatedAt: proc.updatedAt,
        };
      })
    );

    let filtered = catalogItems;
    if (verifiedOnly === 'true' || verifiedOnly === true) {
      filtered = catalogItems.filter((item) => item.groundingStatus.officialSourceVerified);
    }

    return res.json({
      success: true,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

export const getProcedureById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid procedure ID format',
      });
    }

    const procedure = await Procedure.findById(id);
    if (!procedure) {
      return res.status(404).json({
        success: false,
        message: 'Procedure not found',
      });
    }

    return res.json({
      success: true,
      data: procedure,
    });
  } catch (error) {
    next(error);
  }
};

export const getProcedureFullGraph = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid procedure ID format',
      });
    }

    const procedure = await Procedure.findById(id);
    if (!procedure) {
      return res.status(404).json({
        success: false,
        message: 'Procedure not found',
      });
    }

    const steps = await ProcedureStep.find({ procedureId: id }).sort({ order: 1 }).populate('sourceIds');
    const stepIds = steps.map((s) => s._id);

    const dependencies = await Dependency.find({ procedureId: id });
    const documents = await DocumentRequirement.find({ stepId: { $in: stepIds } }).populate('sourceId');
    const sources = await GovernmentSource.find({});

    return res.json({
      success: true,
      data: {
        procedure,
        steps,
        dependencies,
        documents,
        sources,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProcedure = async (req, res, next) => {
  try {
    const {
      title,
      description,
      serviceType,
      jurisdiction,
      state,
      district,
      city,
      sourceStatus,
      status,
      version,
      steps: inputSteps,
    } = req.body;

    if (!title || !state || !district || !city) {
      return res.status(400).json({
        success: false,
        message: 'Title, state, district, and city are required fields',
      });
    }

    const procedure = await Procedure.create({
      title,
      description: description || '',
      serviceType: serviceType || 'Business Registration',
      jurisdiction: jurisdiction || 'Municipal Corporation',
      state,
      district,
      city,
      status: status || 'published',
      sourceStatus: sourceStatus || 'demo',
      version: version || '1.0',
    });

    let createdSteps = [];
    if (Array.isArray(inputSteps) && inputSteps.length > 0) {
      createdSteps = await Promise.all(
        inputSteps.map(async (st, idx) => {
          return await ProcedureStep.create({
            procedureId: procedure._id,
            nodeId: st.nodeId || `step-${idx + 1}`,
            title: st.title,
            description: st.description || '',
            order: st.order !== undefined ? st.order : idx + 1,
            department: st.department || '[Department]',
            locationMode: st.locationMode || 'Municipal Office',
            sourceIds: st.sourceIds || [],
          });
        })
      );
    }

    const fallbackUserId = req.user?._id || new mongoose.Types.ObjectId();
    const task = await CivicTask.create({
      title: procedure.title,
      userId: fallbackUserId,
      location: { state, district, city },
      answers: {},
    });

    return res.status(201).json({
      success: true,
      data: {
        procedure,
        steps: createdSteps,
        task,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProcedure = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid procedure ID format',
      });
    }

    const procedure = await Procedure.findByIdAndUpdate(id, req.body, { new: true });
    if (!procedure) {
      return res.status(404).json({
        success: false,
        message: 'Procedure not found',
      });
    }

    return res.json({
      success: true,
      data: procedure,
    });
  } catch (error) {
    next(error);
  }
};
