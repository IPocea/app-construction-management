import {
  IProjectDocuments,
  IProjectDocumentPagination,
  IProjectQueryParams,
} from '../interfaces';

export const getDocumentsPagination = async (
  model: any,
  document: IProjectDocuments, // the document as it is in the database
  query: IProjectQueryParams
): Promise<IProjectDocumentPagination> => {
  
  // set pageIndex and limit from query params
  const pageIndex: number = parseInt(query.pageIndex) || 0;
  const limit: number = parseInt(query.pageSize) || 10;
  // declare the options we gonna use in aggregation (we need an array of objects)
  const options: any = [];
  // we will add the objects that will help us return the data sorted by our query params
  // $match at top lvl will select our document with the requested projectId and itemId
  // $unwind will destructure the data array in multiple documents
  options.splice(0, 0, { $match: { _id: document._id } }, { $unwind: '$data' });
  // if we have a sortValue we will set orQuerry in order to search in data destructured array
  if (query.searchValue && document.data.length) {
    const dataKeys = Object.keys(document.data[0]);
    const orQueryArray = [];
    for (let key of dataKeys) {
      // if sortValue is NaN then we use regexp, else we look for exactly the typed number
      if (isNaN(+query.searchValue)) {
        orQueryArray.push({
          [`data.${key}`]: new RegExp(query.searchValue.toString(), 'i'),
        });
      } else {
        orQueryArray.push({
          [`data.${key}`]: { $eq: +query.searchValue },
        });
      }
    }
    // we add in option array the $match with $or, after $unwind, in order to
    // select only the items with the searched value
    options.push({
      $match: {
        $or: orQueryArray,
      },
    });
  }
  // if we have sort asc or desc we will add in options sort query which require -1 or 1
  if (query.sortDirection) {
    const sortDirection =
      query.sortDirection === 'asc'
        ? 1
        : query.sortDirection === 'desc'
        ? -1
        : null;
    if (sortDirection) {
      options.push({
        $sort: { [`${'data.' + query.sortBy}`]: sortDirection },
      });
    }
  }
  // in order to get the total number of items we found, we need to save options
  // without skip and limit
  const optionsUntouchedBySkipLimit = [...options];
  // $project specify what items we want to see in the result of the queries from above
  // we will get an object with key data which will the each item which will be returned
  // as an object, individual document
  optionsUntouchedBySkipLimit.push({
    $project: {
      _id: 0,
      data: 1,
    },
  });
  // with grup and push we will take all these item objects and form a single object
  // with key data which will be an array of objects with the items from above
  optionsUntouchedBySkipLimit.push({
    $group: {
      _id: null,
      data: { $push: '$data' },
    },
  });
  // in the options we will use for pagination we use $skip to go to the pageIndex we want
  // and $limit in order to specify how many items we want per page
  options.push({ $skip: pageIndex * limit });
  options.push({ $limit: limit });
  // already explained above what $project and $group does in our case
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
  // we use aggregate with options and get the filtered data
  const filteredData = await model.aggregate(options).exec();
  // we use aggregate without skil and limit to get full data array
  // in order to get the total number of items
  const untouchedBySkipLimit = await model
    .aggregate(optionsUntouchedBySkipLimit)
    .exec();
  const total = untouchedBySkipLimit.length
    ? untouchedBySkipLimit[0].data.length
    : 0;
  // we set our initial document.data to filteredData
  document.data = filteredData.length ? filteredData[0].data : [];
  return {
    documents: document,
    pageIndex: pageIndex,
    pageSize: limit,
    totalItems: total,
  };
  
};
