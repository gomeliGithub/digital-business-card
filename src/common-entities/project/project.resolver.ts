import { UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Project } from '@/graphql/models/project.model';
import { GraphQLDataInterceptor } from '@/graphql/interceptors/graphql-data/graphql-data.interceptor';
import { ProjectService } from './project.service';
import { RequestedIncludeFields } from '@/graphql/decorators/requested-include-fields/requested-include-fields.decorator';

import { IProject, TRequestedIncludeFields } from '@/types';

@Resolver(() => Project)
@UseInterceptors(GraphQLDataInterceptor)
export class ProjectResolver {
    constructor (private readonly projectService: ProjectService) { }

    @Query(() => Project, { name: 'project' })
    async getProject (@RequestedIncludeFields('project') requestedIncludeFields: TRequestedIncludeFields[string],
        @Args('id', { type: () => Int, nullable: true }) id?: number): Promise<IProject> 
    {
        if ( id ) {
            return this.projectService.getProject(id, requestedIncludeFields);
        }
                
        return this.projectService.getFirstProject(requestedIncludeFields);
    }
}