import { Injectable, NotFoundException } from '@nestjs/common';
import { type ProjectFindUniqueArgs } from '@/prisma/generated/prisma/models';

import { PrismaService } from '@/prisma/prisma.service';
import { AppService } from '@/app.service';

import { IProject, TRequestedIncludeFields } from '@/types';

@Injectable()
export class ProjectService {
    constructor ( 
        private readonly _prisma: PrismaService,
        private readonly _appService: AppService
    ) { }

    public async getProject (id: number, requestedIncludeFields: TRequestedIncludeFields[string]): Promise<IProject> {
        const projectFindUniqueArgs: ProjectFindUniqueArgs = { where: { id }, select: this._appService.createSelectArgs(requestedIncludeFields.fields as string[]) };
        const project: IProject | null = await this._prisma.project.findUnique(projectFindUniqueArgs);

        if ( !project ) {
            throw new NotFoundException(`Project with ID ${ id } not found`);
        }
    
        return project;
    }

    public async getFirstProject (requestedIncludeFields: TRequestedIncludeFields[string]): Promise<IProject> {
        return await this.getProject(1, requestedIncludeFields);
    }
}