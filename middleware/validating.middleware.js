import Joi from "joi";
import { addLectureSchema } from "../validations/course.validations.js";

export const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

 export const validateSection = (schema) => (req,res,next)=> {
        const {error} = schema.validate({params:req.params,body:req.body})

        if (error) {
            return res.status(400).json({ message: error.details[0].message });
          }
          next();
}

export const validateLecture = (req,res,next) => {
  const {error} = addLectureSchema.validate(req.body);
if(error) {
  return res.status(400).json({message:error.details[0].message})
}

next;
}

export default {validateRequest,validateSection};