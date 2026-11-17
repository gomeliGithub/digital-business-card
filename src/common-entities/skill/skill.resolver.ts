import { UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Skill } from '@/graphql/models/skill.model';
import { GraphQLDataInterceptor } from '@/graphql/interceptors/graphql-data/graphql-data.interceptor';
import { SkillService } from './skill.service';
import { RequestedIncludeFields } from '@/graphql/decorators/requested-include-fields/requested-include-fields.decorator';

import { ISkill, TRequestedIncludeFields } from '@/types';

@Resolver(() => Skill)
@UseInterceptors(GraphQLDataInterceptor)
export class SkillResolver {
    constructor (private readonly skillService: SkillService) { }

    @Query(() => Skill, { name: 'skill' })
    async getSkill (@RequestedIncludeFields('skill') requestedIncludeFields: TRequestedIncludeFields[string],
        @Args('id', { type: () => Int, nullable: true }) id?: number): Promise<ISkill> 
    {
        if ( id ) {
            return this.skillService.getSkill(id, requestedIncludeFields);
        }
            
        return this.skillService.getFirstSkill(requestedIncludeFields);
    }
}