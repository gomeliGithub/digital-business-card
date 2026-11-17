import { Injectable, NotFoundException } from '@nestjs/common';
import { type LinkFindUniqueArgs } from '@/prisma/generated/prisma/models';

import { PrismaService } from '@/prisma/prisma.service';
import { AppService } from '@/app.service';

import { ILink, TRequestedIncludeFields } from '@/types';

@Injectable()
export class LinkService {
    constructor ( 
        private readonly _prisma: PrismaService,
        private readonly _appService: AppService
    ) { }

    public async getLink (id: number, requestedIncludeFields: TRequestedIncludeFields[string]): Promise<ILink> {
        const linkFindUniqueArgs: LinkFindUniqueArgs = { where: { id }, select: this._appService.createSelectArgs(requestedIncludeFields.fields as string[]) };
        const link: ILink | null = await this._prisma.link.findUnique(linkFindUniqueArgs);

        if ( !link ) {
            throw new NotFoundException(`Link with ID ${ id } not found`);
        }

        return link;
    }

    public async getFirstLink (requestedIncludeFields: TRequestedIncludeFields[string]): Promise<ILink> {
        return await this.getLink(1, requestedIncludeFields);
    }
}