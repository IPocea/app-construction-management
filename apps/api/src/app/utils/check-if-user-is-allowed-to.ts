import { UnauthorizedException } from '@nestjs/common';
import mongoose from 'mongoose';
import { IProject } from '../project/interfaces/project.interface';

export const checkIfUserIsAllowedTo = async (
  model: any,
  projectId: string,
  userId: string
): Promise<void> => {
  const ObjectId = mongoose.Types.ObjectId;
  const project = await model.findOne({
    $and: [
      {
        _id: new ObjectId(`${projectId}`),
      },
      {
        $or: [
          { 'roles.admin': userId },
          {
            'roles.editor': userId,
          },
        ],
      },
    ],
  });
  if (!project) {
    throw new UnauthorizedException(
      'You do not have permission on this project for this action'
    );
  }
};
