import { AppError } from "../utils/appError.js";


export const validate = (schema) => {
  return (req, res, next) => {
    try {
      let imageValue = {};
      if (req.body.images) imageValue.images = req.files || [];
      if (req.body.imageCover) imageValue.imageCover = req.files || [];
      if (req.body.image) imageValue.image = req.file || null;
      if (req.body.logo) imageValue.logo = req.file || null;

      let { error } = schema.validate(
        { ...imageValue, ...req.body, ...req.params, ...req.query },
        { abortEarly: false }
      );
      if (!error) {
        next();
      } else {
        let errMsgs = error.details.map((err) => err.message);
        next(new AppError(errMsgs, 401));
      }
    } catch (error) {
      next(error);
    }
  };
};
