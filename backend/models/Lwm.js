import mongoose from 'mongoose';

/**
 * 1) First, define a schema with the fields for a single MenuItem:
 *    - title
 *    - placeholderContent (optional)
 *    - We'll add `children` below, after this definition to avoid circular reference issues.
 */
const menuItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  placeholderContent: {
    type: String
  }
}, { _id: false }); 
// ^ _id: false so each child doesn't get its own subdoc _id (optional).

/**
 * 2) Now we "add" a children field that references the same schema.
 *    This is the official Mongoose approach to self-referencing subdocs.
 */
menuItemSchema.add({
  children: [menuItemSchema] // an array of the same schema
});

/**
 * 3) For your top-level Lwm doc, you might store an array of these MenuItems
 *    or just a single "root" item, depending on how you want it. 
 *    We'll store an array 'items' for demonstration.
 */
const lwmSchema = new mongoose.Schema({
  items: [menuItemSchema]
  // Optionally, you could store more fields, e.g. name of the "tree" or timestamps.
}, { timestamps: true });

// 4) Finally export the model
const Lwm = mongoose.model('Lwm', lwmSchema);
export default Lwm;
