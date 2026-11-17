import { UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Profile } from '@/graphql/models/profile.model';
import { GraphQLDataInterceptor } from '@/graphql/interceptors/graphql-data/graphql-data.interceptor';
import { ProfileService } from './profile.service';
import { RequestedIncludeFields } from '@/graphql/decorators/requested-include-fields/requested-include-fields.decorator';

import { IProfileWithRelations, type TRequestedIncludeFields } from '@/types';

@Resolver(() => Profile)
@UseInterceptors(GraphQLDataInterceptor)
export class ProfileResolver {
    constructor (private readonly profileService: ProfileService) {}

    @Query(() => Profile, { name: 'profile' })
    async getProfile (@RequestedIncludeFields('profile') requestedIncludeFields: TRequestedIncludeFields[string],
        @Args('id', { type: () => Int, nullable: true }) id?: number): Promise<IProfileWithRelations> 
    {
        if ( id ) {
            return this.profileService.getProfile(id, requestedIncludeFields);
        }
        
        return this.profileService.getFirstProfile(requestedIncludeFields);
    }
}