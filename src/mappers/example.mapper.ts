import { IExample } from '../models/Example';
import {
  CreateExampleInput,
  UpdateExampleInput,
} from '../schemas/example.schema';

export const toExampleDto = (example: IExample) => {
  return {
    id: example._id.toString(),
    name: example.name,
    description: example.description,
    tags: example.tags,
    price: example.price,
    metadata: {
      category: example.metadata.category,
      priority: example.metadata.priority,
      createdAt: example.metadata.createdAt,
    },
    createdAt: example.createdAt,
    updatedAt: example.updatedAt,
  };
};

export const toExample = (
  createExampleInput: CreateExampleInput
): Partial<IExample> => {
  return {
    name: createExampleInput.name,
    description: createExampleInput.description,
    tags: createExampleInput.tags,
    price: createExampleInput.price,
    metadata: {
      category: createExampleInput.metadata.category,
      priority: createExampleInput.metadata.priority,
      createdAt: new Date(),
    },
  };
};

export const toExampleUpdate = (
  updateExampleInput: UpdateExampleInput
): Partial<IExample> => {
  const updateData: Partial<IExample> = {};

  if (updateExampleInput.name) {
    updateData.name = updateExampleInput.name;
  }
  if (updateExampleInput.description) {
    updateData.description = updateExampleInput.description;
  }
  if (updateExampleInput.tags) {
    updateData.tags = updateExampleInput.tags;
  }
  if (updateExampleInput.price) {
    updateData.price = updateExampleInput.price;
  }
  if (updateExampleInput.metadata) {
    updateData.metadata = {
      ...updateData.metadata,
      category: updateExampleInput.metadata.category,
      priority: updateExampleInput.metadata.priority,
    };
  }

  return updateData;
};
