import { Injectable, NotFoundException } from '@nestjs/common';
import { type SkillFindUniqueArgs } from '@/prisma/generated/prisma/models';

import { PrismaService } from '@/prisma/prisma.service';
import { AppService } from '@/app.service';

import { ISkill, TRequestedIncludeFields } from '@/types';

@Injectable()
export class SkillService {
    constructor ( 
        private readonly _prisma: PrismaService,
        private readonly _appService: AppService
    ) { }

    public async getSkill (id: number, requestedIncludeFields: TRequestedIncludeFields[string]): Promise<ISkill> {
        const skillFindUniqueArgs: SkillFindUniqueArgs = { where: { id }, select: this._appService.createSelectArgs(requestedIncludeFields.fields as string[]) };
        const skill: ISkill | null = await this._prisma.skill.findUnique(skillFindUniqueArgs);

        if ( !skill ) {
            throw new NotFoundException(`Skill with ID ${ id } not found`);
        }

        return skill;
    }
    
    public async getFirstSkill (requestedIncludeFields: TRequestedIncludeFields[string]): Promise<ISkill> {
        return await this.getSkill(1, requestedIncludeFields);
    }
}