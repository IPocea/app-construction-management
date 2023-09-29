import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AccesTokenGuard } from '../auth/guards/access-token-guard';
import { CreateProjectDashboardDto } from './dto/create-dashboard.dto';
import {
  CreateProjectDataCostsDto,
  CreateProjectDataCostsItemDto,
  CreateProjectDocumentsDto,
  UpdateProjectDataCostsItem,
} from './dto';
import {
  IProjectDashboard,
  IProjectDataCosts,
  IProjectDataCostsPagination,
  IProjectDataCostsQueryParams,
  IProjectDocumentPagination,
  IProjectDocuments,
} from './interfaces';
import { ProjectDataService } from './project-data.service';
import { Express } from 'express';
import { diskStorage, Multer } from 'multer';
import { MaxFileSizeCustomValidator } from './validators/custom-file-size.pipe';
import { FileTypeCustomValidator } from './validators/custom-file-type.pipe';
import * as path from 'path';
import {
  checkIfUserIsAllowedTo,
} from '../utils';
import { Project, ProjectDocument } from '../project/schemas/project.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Controller('project-details')
export class ProjectDataController {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private projectDataService: ProjectDataService
  ) {}

  // please keep in mind that when you need to use a param in route
  // you need to use camelCase. kebab-case won't work. Will make route to not be recognised
  @UseGuards(AccesTokenGuard)
  @Get(':projectId/:itemId/:tabType')
  async getProjectData(
    @Param('projectId') projectId: string,
    @Param('itemId') itemId: string,
    @Param('tabType') tabType: string,
    @Query() query: IProjectDataCostsQueryParams,
    @Request() req
  ): Promise<
    IProjectDashboard | IProjectDataCostsPagination | IProjectDocumentPagination
  > {
    const userId = req.user._id;
    const result = await this.projectDataService.findProjectData(
      userId,
      projectId,
      itemId,
      tabType,
      query
    );
    if (result) {
      return result;
    }
    throw new BadRequestException(
      `There is no project with the id ${projectId}`
    );
  }

  @UseGuards(AccesTokenGuard)
  @Post(':tabType/add')
  async addProjectData(
    @Body()
    createProjectDataDto:
      | CreateProjectDashboardDto
      | CreateProjectDataCostsDto
      | CreateProjectDocumentsDto,
    @Param('tabType') tabType: string,
    @Request() req
  ): Promise<
    IProjectDashboard | IProjectDataCostsPagination | IProjectDocumentPagination
  > {
    try {
      const userId = req.user._id;
      return await this.projectDataService.addProjectData(
        userId,
        createProjectDataDto,
        tabType
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // For development purpose, to check all data
  @Get(':tabType/find')
  async getAllProjectDataDevMode(
    @Param('tabType') tabType: string
  ): Promise<IProjectDashboard[] | IProjectDataCosts[] | IProjectDocuments[]> {
    return await this.projectDataService.findAllDataDevMode(tabType);
  }

  // project data-costs

  @UseGuards(AccesTokenGuard)
  @Post('data-costs-data/:id/add')
  async addDataCostsItem(
    @Body() dataCostItemDto: CreateProjectDataCostsItemDto,
    @Param('id') _id: string,
    @Query() query: IProjectDataCostsQueryParams,
    @Request() req
  ): Promise<IProjectDataCostsPagination> {
    const projectId = await this.projectDataService.projectIdOfDocument(
      _id,
      'data-costs'
    );
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    try {
      return await this.projectDataService.addDataCostsItem(
        dataCostItemDto,
        _id,
        'add',
        query
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AccesTokenGuard)
  @Patch('data-costs-data/:id/:dataItemId/edit')
  async editDataCostsItem(
    @Body() dataCostItemDto: UpdateProjectDataCostsItem,
    @Param('id') _id: string,
    @Param('dataItemId') dataItemId: string,
    @Query() query: IProjectDataCostsQueryParams,
    @Request() req
  ): Promise<IProjectDataCostsPagination> {
    const projectId = await this.projectDataService.projectIdOfDocument(
      _id,
      'data-costs'
    );
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    try {
      return await this.projectDataService.editDataCostsItem(
        dataCostItemDto,
        _id,
        'edit',
        query,
        dataItemId
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AccesTokenGuard)
  @Delete('data-costs-data/:id/:dataItemId/delete')
  async deleteDataCostsItem(
    @Param('id') _id: string,
    @Param('dataItemId') dataItemId: string,
    @Query() query: IProjectDataCostsQueryParams,
    @Request() req
  ): Promise<IProjectDataCostsPagination> {
    const projectId = await this.projectDataService.projectIdOfDocument(
      _id,
      'data-costs'
    );
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    try {
      return await this.projectDataService.deleteDataCostsItem(
        _id,
        'delete',
        query,
        dataItemId
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // project documents data
  @UseGuards(AccesTokenGuard)
  @Post('documents/:fullDocumentId/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './apps/api/src/files',
      }),
    })
  )
  async uploadDocument(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeCustomValidator({
            fileType: /(application\/pdf|image\/*)/,
          }),
          new MaxFileSizeCustomValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      })
    )
    files: Array<Express.Multer.File>,
    @Param('fullDocumentId') fullDocumentId: string,
    @Query() query: IProjectDataCostsQueryParams,
    @Request() req
  ): Promise<IProjectDocumentPagination> {
    const projectId = await this.projectDataService.projectIdOfDocument(
      fullDocumentId,
      'documents'
    );
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    const userId = req.user._id;
    if (!files.length) {
      throw new BadRequestException('There is no file');
    }
    return await this.projectDataService.addDocuments(
      files,
      fullDocumentId,
      userId,
      query
    );
  }

  @UseGuards(AccesTokenGuard)
  @Get('documents/:fullDocumentId/:dataItemId/find')
  async seeDocuments(
    @Param('fullDocumentId') fullDocumentId: string,
    @Param('dataItemId') dataItemId: string,
    @Request() req,
    @Res() res
  ) {
    const userId = req.user._id;
    const filePathName =
      await this.projectDataService.checkIfDocumentBelongToUser(
        userId,
        fullDocumentId,
        dataItemId
      );
    if (filePathName) {
      const os = process.platform;
      switch (os) {
        case 'win32':
          return res.sendFile(filePathName, {
            root: path.join(
              path.resolve(process.cwd(), 'apps', 'api', 'src', 'files')
            ),
          });
        case 'linux':
          return res.sendFile(filePathName, {
            root: path.resolve(process.cwd()),
          });
        default:
          return res.sendFile(filePathName, {
            root: path.join(
              path.resolve(process.cwd(), 'apps', 'api', 'src', 'files')
            ),
          });
      }
    } else {
      throw new NotFoundException(
        'There is no document with the requested params'
      );
    }
  }

  @UseGuards(AccesTokenGuard)
  @Delete('documents/:fullDocumentId/:dataItemId/delete')
  async deleteDocument(
    @Param('fullDocumentId') fullDocumentId: string,
    @Param('dataItemId') dataItemId: string,
    @Query() query: IProjectDataCostsQueryParams,
    @Request() req
  ): Promise<IProjectDocumentPagination> {
    const projectId = await this.projectDataService.projectIdOfDocument(
      fullDocumentId,
      'documents'
    );
    await checkIfUserIsAllowedTo(this.projectModel, projectId, req.user._id);
    const userId = req.user._id;
    try {
      return await this.projectDataService.deleteDocument(
        fullDocumentId,
        userId,
        dataItemId,
        query
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
