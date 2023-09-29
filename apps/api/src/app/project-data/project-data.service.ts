import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  CreateProjectDashboardDto,
  CreateProjectDataCostsDto,
  CreateProjectDataCostsItemDto,
  CreateProjectDocumentsDto,
  UpdateProjectDataCostsItem,
} from './dto';

import { ProjectDataTabs } from './enums/project-data.enum';
import {
  IProjectDashboard,
  IProjectDataCosts,
  IProjectDataCostsItems,
  IProjectDataCostsPagination,
  IProjectDataCostsQueryParams,
  IProjectDocumentPagination,
  IProjectDocuments,
  IProjectDocumentsData,
} from './interfaces';

import { Dashboard, DashboardDocument } from './schemas/dashboard.schema';
import { DataCost, DataCostDocument } from './schemas/data-cost.schema';
import {
  ProjectDocument,
  ProjectDocumentDocument,
} from './schemas/document.schema';
import {
  dataCostsUpdateDataArrayAndPaginate,
  getDataCostsPagination,
  documentsUpdateDataArrayAndPaginate,
  getDocumentsPagination,
} from './utils';
import { ProjectService } from '../project/project.service';
import { UsersService } from '../users/users.service';
import { IProject } from '../project/interfaces/project.interface';

@Injectable()
export class ProjectDataService {
  constructor(
    @InjectModel(Dashboard.name)
    private dashboardModel: Model<DashboardDocument>,
    @InjectModel(DataCost.name) private dataCostModel: Model<DataCostDocument>,
    @InjectModel(ProjectDocument.name)
    private projectDocumentModel: Model<ProjectDocumentDocument>,
    private projectService: ProjectService,
    private usersService: UsersService
  ) {}

  async findProjectData(
    userId: string,
    projectId: string,
    itemId: string,
    tabType: string,
    query: IProjectDataCostsQueryParams
  ): Promise<IProjectDashboard | IProjectDataCostsPagination | any> {
    const check = await this.checkIfProjectIdBelongToTheUser(userId, projectId);
    if (!check) {
      return null;
    }
    switch (tabType) {
      case ProjectDataTabs.Dashboard:
        try {
          const dashboardData = await this.dashboardModel.findOne({
            projectId: projectId,
            itemId: itemId,
          });
          if (dashboardData) {
            return dashboardData;
          }
          return await this.addProjectData(
            userId,
            {
              projectId: projectId,
              itemId: itemId,
              data: {
                progress: 0,
                details: [],
              },
            },
            tabType
          );
        } catch (error) {
          return null;
        }
        break;
      case ProjectDataTabs.DataCosts:
        try {
          // get the document as it is in the database
          const document = await this.dataCostModel.findOne({
            projectId: projectId,
            itemId: itemId,
          });
          if (document) {
            return await getDataCostsPagination(
              this.dataCostModel,
              document,
              query
            );
          }
          return await this.addProjectData(
            userId,
            {
              projectId: projectId,
              itemId: itemId,
              data: [],
            },
            tabType
          );
        } catch (error) {
          return null;
        }
        break;
      case ProjectDataTabs.Documents:
        try {
          const documentsData = await this.projectDocumentModel.findOne({
            projectId: projectId,
            itemId: itemId,
          });
          if (documentsData) {
            return await getDocumentsPagination(
              this.projectDocumentModel,
              documentsData,
              query
            );
          }
          return await this.addProjectData(
            userId,
            {
              projectId: projectId,
              itemId: itemId,
              data: [],
            },
            tabType
          );
        } catch (error) {
          return null;
        }
        break;
      default:
        throw new NotFoundException(
          `There is no Tab as ${tabType} for project details`
        );
        break;
    }
  }

  async addProjectData(
    userId: string,
    createProjectDataDto:
      | CreateProjectDashboardDto
      | CreateProjectDataCostsDto
      | CreateProjectDocumentsDto,
    tabType: string
  ): Promise<
    IProjectDashboard | IProjectDataCostsPagination | IProjectDocumentPagination
  > {
    try {
      let newProjectData;
      switch (tabType) {
        case ProjectDataTabs.Dashboard:
          const duplicateItemIdDashboard = await this.dashboardModel.findOne({
            projectId: createProjectDataDto.projectId,
            itemId: createProjectDataDto.itemId,
          });
          if (duplicateItemIdDashboard) {
            throw new BadRequestException(
              `The item with the id ${createProjectDataDto.itemId} already exists in project with the id ${createProjectDataDto.projectId}`
            );
          }
          newProjectData = new this.dashboardModel(createProjectDataDto);
          break;
        case ProjectDataTabs.DataCosts:
          const duplicateItemIdDataCosts = await this.dataCostModel.findOne({
            projectId: createProjectDataDto.projectId,
            itemId: createProjectDataDto.itemId,
          });
          if (duplicateItemIdDataCosts) {
            throw new BadRequestException(
              `The item with the id ${createProjectDataDto.itemId} already exists in project with the id ${createProjectDataDto.projectId}`
            );
          }
          newProjectData = new this.dataCostModel(createProjectDataDto);
          break;
        case ProjectDataTabs.Documents:
          const duplicateItemIdDocuments =
            await this.projectDocumentModel.findOne({
              projectId: createProjectDataDto.projectId,
              itemId: createProjectDataDto.itemId,
            });
          if (duplicateItemIdDocuments) {
            throw new BadRequestException(
              `The item with the id ${createProjectDataDto.itemId} already exists in project with the id ${createProjectDataDto.projectId}`
            );
          }
          newProjectData = new this.projectDocumentModel(createProjectDataDto);
          break;
        default:
          break;
      }
      const project = await newProjectData.save();
      if (tabType === ProjectDataTabs.DataCosts) {
        return {
          pageIndex: 0,
          pageSize: 10,
          dataCosts: project,
          totalItems: project.data.length,
        };
      }
      if (tabType === ProjectDataTabs.Documents) {
        return {
          pageIndex: 0,
          pageSize: 10,
          documents: project,
          totalItems: project.data.length,
        };
      }
      return project;
    } catch (error) {
      return null;
    }
  }

  async addDataCostsItem(
    dataCostItemDto: CreateProjectDataCostsItemDto,
    _id: string,
    actionType: string,
    query: IProjectDataCostsQueryParams
  ): Promise<IProjectDataCostsPagination> {
    try {
      return await dataCostsUpdateDataArrayAndPaginate(
        this.dataCostModel,
        dataCostItemDto,
        _id,
        actionType,
        query
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async editDataCostsItem(
    dataCostItemDto: UpdateProjectDataCostsItem,
    _id: string,
    actionType: string,
    query: IProjectDataCostsQueryParams,
    dataItemId: string
  ): Promise<IProjectDataCostsPagination> {
    try {
      return await dataCostsUpdateDataArrayAndPaginate(
        this.dataCostModel,
        dataCostItemDto,
        _id,
        actionType,
        query,
        dataItemId
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteDataCostsItem(
    _id: string,
    actionType: string,
    query: IProjectDataCostsQueryParams,
    dataItemId: string
  ): Promise<IProjectDataCostsPagination> {
    try {
      return await dataCostsUpdateDataArrayAndPaginate(
        this.dataCostModel,
        null,
        _id,
        actionType,
        query,
        dataItemId
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllDataDevMode(
    tabType: string
  ): Promise<IProjectDashboard[] | IProjectDataCosts[] | IProjectDocuments[]> {
    switch (tabType) {
      case ProjectDataTabs.Dashboard:
        return await this.dashboardModel.find().exec();
        break;
      case ProjectDataTabs.DataCosts:
        return await this.dataCostModel.find().exec();
        break;
      case ProjectDataTabs.Documents:
        return await this.projectDocumentModel.find().exec();
        break;
      default:
        break;
    }
  }

  async checkIfProjectIdBelongToTheUser(
    userId: string,
    projectId: string
  ): Promise<IProject> {
    return await this.projectService.findOne({
      $and: [
        {
          _id: projectId,
        },
        {
          $or: [
            {
              'roles.admin': userId,
            },
            {
              'roles.editor': userId,
            },
            {
              'roles.viewer': userId,
            },
          ],
        },
      ],
    });
  }

  async addDocuments(
    files: Array<Express.Multer.File>,
    fullDocumentId: string,
    userId: string,
    query: IProjectDataCostsQueryParams
  ): Promise<IProjectDocumentPagination> {
    const user = await this.usersService.findOneNoPass({ _id: userId });
    try {
      return await documentsUpdateDataArrayAndPaginate(
        this.projectDocumentModel,
        files,
        fullDocumentId,
        user,
        'add',
        query
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteDocument(
    fullDocumentId: string,
    userId: string,
    dataItemId: string,
    query: IProjectDataCostsQueryParams
  ): Promise<IProjectDocumentPagination> {
    const user = await this.usersService.findOneNoPass({ _id: userId });
    try {
      return await documentsUpdateDataArrayAndPaginate(
        this.projectDocumentModel,
        [],
        fullDocumentId,
        user,
        'delete',
        query,
        dataItemId
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async checkIfDocumentBelongToUser(
    userId: string,
    fullDocumentId: string,
    dataItemId: string
  ): Promise<string> {
    const ObjectId = mongoose.Types.ObjectId;
    let item: IProjectDocumentsData;
    try {
      item = (
        await this.projectDocumentModel
          .aggregate([
            // get the full document
            { $match: { _id: new ObjectId(`${fullDocumentId}`) } },
            // split each element of data array into documents
            { $unwind: '$data' },
            // get only data documents
            {
              $project: {
                _id: 0,
                data: 1,
              },
            },
            // get only the document with the id of dataItemId
            { $match: { ['data.id']: dataItemId } },
          ])
          // result is an array with an object data which has our object dataItem
          .exec()
      )[0].data;
    } catch (error) {
      item = null;
    }

    // to do to implement a way to be seen by other ppls who have roles on project
    // const path = item && item?.userId === userId ? item.path : null;
    const path = item ? item.path : null;
    return path;
  }

  async projectIdOfDocument(
    documentId: string,
    tabType: string
  ): Promise<string> {
    const ObjectId = mongoose.Types.ObjectId;
    let projectId: string;
    switch (tabType) {
      case ProjectDataTabs.Dashboard:
        break;
      case ProjectDataTabs.DataCosts:
        projectId = (
          await this.dataCostModel.findOne({
            _id: new ObjectId(`${documentId}`),
          })
        ).projectId;
        break;
      case ProjectDataTabs.Documents:
        projectId = (
          await this.projectDocumentModel.findOne({
            _id: new ObjectId(`${documentId}`),
          })
        ).projectId;
        break;
      default:
        break;
    }
    return projectId;
  }
}
