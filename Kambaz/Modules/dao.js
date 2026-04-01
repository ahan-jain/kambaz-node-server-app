import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function ModulesDao(db) {
  async function findModulesForCourse(courseId) {
    return model.find({ course: courseId });
  }
  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4(), course: courseId };
    return model.create(newModule);
  }
  async function deleteModule(courseId, moduleId) {
    return model.deleteOne({ _id: moduleId, course: courseId });
  }
  async function updateModule(courseId, moduleId, moduleUpdates) {
    return model.updateOne({ _id: moduleId }, { $set: moduleUpdates });
  }
  return { findModulesForCourse, createModule, deleteModule, updateModule };
}
