import mongoose from 'mongoose';
import { nanoid } from 'nanoid/async';
import {
  CreateProjectDataCostsItemDto,
  UpdateProjectDataCostsItem,
} from '../dto';
import {
  IProjectQueryParams,
  IProjectDataCosts,
  IProjectDataCostsPagination,
} from '../interfaces';
import { getDataCostsPagination } from './get-data-costs-pagination';

export const dataCostsUpdateDataArrayAndPaginate = async (
  model: any,
  dataCostItemDto: CreateProjectDataCostsItemDto | UpdateProjectDataCostsItem,
  _id: string,
  actionType: string,
  query: IProjectQueryParams,
  dataItemId: string = null
): Promise<IProjectDataCostsPagination> => {
  let updatedDocument: IProjectDataCosts;
  switch (actionType) {
    case 'add':
      const newItem: any = { ...dataCostItemDto };
      newItem.id = await nanoid(20);
      const createdAndUpdatedAt: string = new Date().toISOString();
      newItem.createdAt = createdAndUpdatedAt;
      newItem.updatedAt = createdAndUpdatedAt;
      updatedDocument = await model.findOneAndUpdate(
        { _id: _id },
        { $push: { data: newItem } },
        { returnOriginal: false }
      );
      break;
    case 'edit':
      const ObjectId = mongoose.Types.ObjectId;
      const selectedItem = (
        await model
          .aggregate([
            { $match: { _id: new ObjectId(`${_id}`) } },
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
      const updatedAt: string = new Date().toISOString();
      const updatedItem: any = { ...dataCostItemDto };
      updatedItem.id = dataItemId;
      updatedItem.createdAt = selectedItem.createdAt;
      updatedItem.updatedAt = updatedAt;
      updatedDocument = await model.findOneAndUpdate(
        { _id: _id, 'data.id': dataItemId },
        { $set: { 'data.$': updatedItem } },
        { returnOriginal: false }
      );
      return await getDataCostsPagination(model, updatedDocument, query);
    case 'delete':
      updatedDocument = await model.findOneAndUpdate(
        { _id: _id },
        { $pull: { data: { id: dataItemId } } },
        { returnOriginal: false }
      );
      return await getDataCostsPagination(model, updatedDocument, query);
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
    { $unwind: '$data' },
    {
      $sort: { 'data.updatedAt': -1 },
    }
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
  // get total field to each dataCostsItem
  options.push({
    $addFields: {
      data: {
        $map: {
          input: '$data',
          as: 'data',
          in: {
            id: '$$data.id',
            name: '$$data.name',
            measurementUnit: '$$data.measurementUnit',
            quantity: '$$data.quantity',
            unitPrice: '$$data.unitPrice',
            value: {
              $multiply: ['$$data.quantity', '$$data.unitPrice'],
            },
            createdAt: '$$data.createdAt',
            updatedAt: '$$data.updatedAt',
            mentiones: '$$data.mentiones',
          },
        },
      },
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
    dataCosts: updatedDocument,
    pageIndex: pageIndex,
    pageSize: limit,
    totalItems: total,
  };
};
