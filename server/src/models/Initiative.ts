import mongoose, { Schema, Document } from 'mongoose';

export interface IInitiative extends Document {
  title: string;
  description?: string;
  owner: string;
  status: 'Not Started' | 'In Progress' | 'At Risk' | 'Completed' | 'On Hold';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deadline: Date;
  category?: string;
  tags: string[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

const initiativeSchema = new Schema<IInitiative>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    owner: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Not Started', 'In Progress', 'At Risk', 'Completed', 'On Hold'],
      default: 'Not Started',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    deadline: { type: Date, required: true },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    progress: { type: Number, min: 0, max: 100, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IInitiative>('Initiative', initiativeSchema);
