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


/**
 * schema to validate courseId and title for the lecture
 */
export const addLectureSchema = Joi.object({
  title:Joi.string().min(3).max(100).required(),
  contentType:Joi.string().valid('video','article').required(),
  video:Joi.when('contentType' , {
    is:'video',
    then:Joi.string().uri().required(),
    otherwise:Joi.forbidden(),
  }),
  articleContent:Joi.when('contentType', {
    is:'article',
    then:Joi.string().required(),
    otherwise:Joi.forbidden(),
  })
})

