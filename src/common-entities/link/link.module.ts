import { Module } from '@nestjs/common';

import { LinkService } from './link.service';
import { LinkResolver } from './link.resolver';
import { AppService } from '@/app.service';

@Module({
    providers: [ LinkService, LinkResolver, AppService ],
    exports: [ LinkService ]
})
export class LinkModule {}