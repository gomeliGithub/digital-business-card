import { Module } from '@nestjs/common';

import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { AppService } from '@/app.service';

@Module({
    providers: [ ProjectService, ProjectResolver, AppService ],
    exports: [ ProjectService ]
})
export class ProjectModule {}