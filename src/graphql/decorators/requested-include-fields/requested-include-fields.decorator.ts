import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IRequest, TRequestedIncludeFields } from '@/types';

export const RequestedIncludeFields = createParamDecorator(
    ( 
        modelName: string, 
        context: ExecutionContext 
    ): TRequestedIncludeFields[string] => {
        const gqlContext: GqlExecutionContext = GqlExecutionContext.create(context);
        const { req } = gqlContext.getContext<{ req: IRequest }>();

        return req.requestedIncludeFields[modelName];
    }
);