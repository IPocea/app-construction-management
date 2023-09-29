import { nanoid } from 'nanoid/async';
import { IUser } from '../../users/interface/user.interface';
import {
  IProjectDocumentPagination,
  IProjectDocuments,
  IProjectDocumentsData,
  IProjectQueryParams,
} from '../interfaces';
import { getDocumentsPagination } from '../utils';

import mongoose from 'mongoose';
import { selectOsAndUnlink } from './select-os-and-unlink';

export const documentsUpdateDataArrayAndPaginate = async (
  model: any,
  files: Array<Express.Multer.File>,
  fullDocumentId: string,
  user: IUser,
  actionType: string,
  query: IProjectQueryParams,
  dataItemId: string = null
): Promise<IProjectDocumentPagination> => {
  let updatedDocument: IProjectDocuments;
  switch (actionType) {
    case 'add':
      const response = [];
      for (const file of files) {
        const documentFile: IProjectDocumentsData = {
          id: await nanoid(20),
          userId: user._id.toString(),
          addedBy: {
            userFName: user.firstName,
            userLName: user.lastName,
          },
          name: file.originalname,
          mimeType: file.mimetype,
          path: file.path.slice(file.path.lastIndexOf('\\') + 1),
          createdAt: new Date().toISOString(),
        };
        response.push(documentFile);
      }

      updatedDocument = await model.findOneAndUpdate(
        { _id: fullDocumentId },
        { $push: { data: { $each: response } } },
        { returnOriginal: false }
      );
      break;
    case 'delete':
      const ObjectId = mongoose.Types.ObjectId;
      const selectedDocument = (
        await model
          .aggregate([
            { $match: { _id: new ObjectId(`${fullDocumentId}`) } },
            { $unwind: '$data' },
            { $match: { 'data.id': dataItemId } },
            {
              $project: {
                _id: 0,
                data: 1,
              },
            },
          ])
          .exec()
      )[0].data;
      updatedDocument = await model.findOneAndUpdate(
        { _id: fullDocumentId },
        { $pull: { data: { id: dataItemId } } },
        { returnOriginal: false }
      );
      await selectOsAndUnlink(selectedDocument);
      return await getDocumentsPagination(model, updatedDocument, query);
    default:
      break;
  }
  const pageIndex: number = 0;
  const limit: number = parseInt(query.pageSize) || 10;
  const options: any = [];
  options.splice(
    0,
    0,
    { $match: { _id: updatedDocument._id } },
    { $unwind: '$data' }
  );
  const optionsUntouchedBySkipLimit = [...options];
  optionsUntouchedBySkipLimit.push({
    $project: {
      _id: 0,
      data: 1,
    },
  });
  optionsUntouchedBySkipLimit.push({
    $group: {
      _id: null,
      data: { $push: '$data' },
    },
  });
  options.push({ $skip: pageIndex * limit });
  options.push({ $limit: limit });
  options.push({
    $project: {
      _id: 0,
      data: 1,
    },
  });
  options.push({
    $group: {
      _id: null,
      data: { $push: '$data' },
    },
  });
  const filteredData = await model.aggregate(options).exec();
  const untouchedBySkipLimit = await model
    .aggregate(optionsUntouchedBySkipLimit)
    .exec();
  const total = untouchedBySkipLimit.length
    ? untouchedBySkipLimit[0].data.length
    : 0;
  updatedDocument.data = filteredData.length ? filteredData[0].data : [];
  return {
    documents: updatedDocument,
    pageIndex: pageIndex,
    pageSize: limit,
    totalItems: total,
  };
};
