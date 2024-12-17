import Section from "../models/sectionSchema.js";

export const getSectionsByCourse = async (courseId) => {
  try {
    const section = await Section.find(courseId);
    return section;
  } catch (error) {
    return null;
  }
};

export const deleteSection = async (sectionId) => {
  try {
    await Section.findByIdAndUpdate(sectionId, { isDeleted: true });
  } catch (error) {
    return null;
  }
};
