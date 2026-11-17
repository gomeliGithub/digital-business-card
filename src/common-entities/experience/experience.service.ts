import { Injectable, NotFoundException } from '@nestjs/common';
import { type ExperienceFindUniqueArgs } from '@/prisma/generated/prisma/models';

import { PrismaService } from '@/prisma/prisma.service';
import { AppService } from '@/app.service';

import { IExperience, TRequestedIncludeFields } from '@/types';

@Injectable()
export class ExperienceService {
    constructor ( 
        private readonly _prisma: PrismaService,
        private readonly _appService: AppService
    ) { }

    public async getExperience (id: number, requestedIncludeFields: TRequestedIncludeFields[string]): Promise<IExperience> {
        const experienceFindUniqueArgs: ExperienceFindUniqueArgs = { where: { id }, select: this._appService.createSelectArgs(requestedIncludeFields.fields as string[]) };
        const experience: IExperience | null = await this._prisma.experience.findUnique(experienceFindUniqueArgs);

        if ( !experience ) {
            throw new NotFoundException(`Experience with ID ${ id } not found`);
        }
    
        return experience;
    }
        
    public async getFirstExperience (requestedIncludeFields: TRequestedIncludeFields[string]): Promise<IExperience> {
        return await this.getExperience(1, requestedIncludeFields);
    }
}