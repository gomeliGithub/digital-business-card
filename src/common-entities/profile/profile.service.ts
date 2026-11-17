import { Injectable, NotFoundException } from '@nestjs/common';
import { type ProfileFindUniqueArgs, type ProfileSelect } from '@/prisma/generated/prisma/models';
import { type DefaultArgs } from '@prisma/client/runtime/client';

import { PrismaService } from '@/prisma/prisma.service';
import { AppService } from '@/app.service';

import { IProfileWithRelations, TPrismaProfileSelect, TRequestedIncludeFields } from '@/types';

@Injectable()
export class ProfileService {
    constructor ( 
        private readonly _prisma: PrismaService,
        private readonly _appService: AppService
    ) { }

    public async getProfile (id: number, requestedIncludeFields: TRequestedIncludeFields[string]): Promise<IProfileWithRelations> {
        let selectArgs: TPrismaProfileSelect = {};
        const profileFindUniqueArgs: ProfileFindUniqueArgs = { where: { id }, select: selectArgs };

        const requestedIncludeFieldsValues: ( string[] | Record<string, string[]> )[] = Object.values(requestedIncludeFields);

        for ( const value of requestedIncludeFieldsValues ) {
            if ( Array.isArray(value) ) {
                selectArgs = this._appService.createSelectArgs(value);
                profileFindUniqueArgs.select = selectArgs;
            } else {
                Object.keys(value).forEach(includeModelName => {
                    let includeRelationsSelect = selectArgs[includeModelName];
                    if ( !includeRelationsSelect || typeof includeRelationsSelect === 'boolean' ) {
                        includeRelationsSelect = {
                            select: {}
                        }

                        selectArgs[includeModelName] = includeRelationsSelect;
                    }

                    value[includeModelName].forEach(includeField => {
                        includeRelationsSelect.select![includeField as keyof ProfileSelect<DefaultArgs>] = true;
                    });
                });
            }
        }

        const profile: IProfileWithRelations | null = await this._prisma.profile.findUnique(profileFindUniqueArgs);

        if ( !profile ) {
            throw new NotFoundException(`Profile with ID ${ id } not found`);
        }

        return profile;
    }

    public async getFirstProfile (requestedIncludeFields: TRequestedIncludeFields[string]): Promise<IProfileWithRelations> {
        return await this.getProfile(1, requestedIncludeFields);
    }
}