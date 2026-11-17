import { Module } from '@nestjs/common';

import { SkillService } from './skill.service';
import { SkillResolver } from './skill.resolver';
import { AppService } from '@/app.service';

@Module({
    providers: [ SkillService, SkillResolver, AppService ],
    exports: [ SkillService ]
})
export class SkillModule {}