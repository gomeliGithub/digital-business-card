import { Module } from '@nestjs/common';

import { ProfileService } from './profile.service';
import { ProfileResolver } from './profile.resolver';
import { AppService } from '@/app.service';

@Module({
    providers: [ ProfileService, ProfileResolver, AppService ],
    exports: [ ProfileService ]
})
export class ProfileModule {}