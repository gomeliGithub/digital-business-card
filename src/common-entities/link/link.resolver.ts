import { UseInterceptors } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Link } from '@/graphql/models/link.model';
import { GraphQLDataInterceptor } from '@/graphql/interceptors/graphql-data/graphql-data.interceptor';
import { LinkService } from './link.service';
import { RequestedIncludeFields } from '@/graphql/decorators/requested-include-fields/requested-include-fields.decorator';

import { ILink, TRequestedIncludeFields } from '@/types';

@Resolver(() => Link)
@UseInterceptors(GraphQLDataInterceptor)
export class LinkResolver {
    constructor (private readonly linkService: LinkService) {}

    @Query(() => Link, { name: 'link' })
    async getLink (@RequestedIncludeFields('link') requestedIncludeFields: TRequestedIncludeFields[string],
        @Args('id', { type: () => Int, nullable: true }) id?: number): Promise<ILink> 
    {
        if ( id ) {
            return this.linkService.getLink(id, requestedIncludeFields);
        }
            
        return this.linkService.getFirstLink(requestedIncludeFields);
    }
}