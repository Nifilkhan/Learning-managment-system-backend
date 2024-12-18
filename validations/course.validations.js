import Joi from "joi";


export const addCourseSchema = Joi.object({
    title: Joi.string().min(3).required(),
    category: Joi.string().required(),
    description: Joi.string().min(10).required(),
    price: Joi.number().min(0).required(),
  });


//schema to validate courseId and title for the section
export const addSectionSchema = Joi.object({
  title: Joi.string().min(3).required()                
});

