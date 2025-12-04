import mongoose, { Schema, Document } from 'mongoose';

export interface IExample extends Document {
  name: string;
  description: string;
  isDeleted: boolean;
  tags: string[];
  price: number;
  metadata: {
    category: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ExampleSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10; // Maximum 10 tags
        },
        message: 'Cannot have more than 10 tags',
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      max: [10000, 'Price cannot exceed 10000'],
    },
    metadata: {
      category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['electronics', 'clothing', 'books', 'food', 'other'],
      },
      priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IExample>('Example', ExampleSchema);
