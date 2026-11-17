import { UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Experience } from '@/graphql/models/experience.model';
import { GraphQLDataInterceptor } from '@/graphql/interceptors/graphql-data/graphql-data.interceptor';
import { ExperienceService } from './experience.service';
import { RequestedIncludeFields } from '@/graphql/decorators/requested-include-fields/requested-include-fields.decorator';

import { IExperience, TRequestedIncludeFields } from '@/types';

@Resolver(() => Experience)
@UseInterceptors(GraphQLDataInterceptor)
export class ExperienceResolver {
    constructor (private readonly experienceService: ExperienceService) { }

    @Query(() => Experience, { name: 'experience' })
    async getExperience (@RequestedIncludeFields('experience') requestedIncludeFields: TRequestedIncludeFields[string],
        @Args('id', { type: () => Int, nullable: true }) id?: number): Promise<IExperience> 
    {
        if ( id ) {
            return this.experienceService.getExperience(id, requestedIncludeFields);
        }
                
        return this.experienceService.getFirstExperience(requestedIncludeFields);
    }
}