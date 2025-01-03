import Category from "../models/category.model.js";


export const createCategory = async(req,res)=> {
    try {
        const {name} = req.body;

        const existingCategory = await Category.findOne({ name: name.toLowerCase() })

        if(existingCategory) {
            return res.status(402).json({message:'Category already exists'})
        }

        const newCategory = new Category({ name })
        await newCategory.save();

        return res.status(200).json({message:'Category added succesfully',newCategory})
    } catch (error) {
        throw new error('Error occurred while creating the category')
    }
}

export const getCategory = async(req,res) => {
    try {
        const categories = await Category.find();        
        return res.status(200).json({message:'selected categorie',categories})
    } catch (error) {
        throw new error('Error occurred while retrieving categories')
    }
}