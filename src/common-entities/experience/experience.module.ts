import { Module } from '@nestjs/common';

import { ExperienceService } from './experience.service';
import { ExperienceResolver } from './experience.resolver';
import { AppService } from '@/app.service';

@Module({
    providers: [ ExperienceService, ExperienceResolver, AppService ],
    exports: [ ExperienceService ]
})
export class ExperienceModule {}