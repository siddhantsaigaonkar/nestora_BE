import Joi from "joi";

 const listingJoiSchema = Joi.object({
   title: Joi.string().min(3).required().messages({
     "string.empty": "Title is required",
     "string.min": "Title must be at least 3 characters long",
   }),

   description: Joi.string().min(5).required().messages({
     "string.empty": "Description is required",
     "string.min": "Description must be at least 5 characters long",
   }),

   price: Joi.number().positive().required().messages({
     "number.base": "Price must be a number",
     "number.positive": "Price must be greater than 0",
     "any.required": "Price is required",
   }),

   location: Joi.string().required().messages({
     "string.empty": "Location is required",
   }),

   country: Joi.string().required().messages({
     "string.empty": "Country is required",
   }),
   // Optional image field
   image: Joi.object({
     filename: Joi.string().optional(),
     url: Joi.string().uri().optional(),
   }).optional(),
 });

export default listingJoiSchema;