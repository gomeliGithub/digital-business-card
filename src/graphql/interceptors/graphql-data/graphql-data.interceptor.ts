import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo, type SelectionNode } from 'graphql';
import { Observable } from 'rxjs';

import { IRequest, TRequestedIncludeFields } from '@/types';

const includeModels: Set<string> = new Set([ 'links', 'skills', 'experiences', 'projects' ]);

@Injectable()
export class GraphQLDataInterceptor<T> implements NestInterceptor<T, T> {
    intercept (context: ExecutionContext, next: CallHandler): Observable<T> {
        const gqlContext = GqlExecutionContext.create(context);
        const info: GraphQLResolveInfo = gqlContext.getInfo();
        const ctx = gqlContext.getContext();

        ( ctx.req as IRequest ).requestedIncludeFields = this._collectFields(info);

        return next.handle();
    }

    private _collectFields (info: GraphQLResolveInfo): TRequestedIncludeFields {
        const requiredFields: TRequestedIncludeFields = {};

        info.fieldNodes.forEach(primaryNode => {
            if ( !primaryNode.alias ) {
                requiredFields[primaryNode.name.value] = {
                    fields: []
                };

                if ( primaryNode.selectionSet ) findFields(primaryNode.name.value, primaryNode.selectionSet.selections);
            }
        });

        function findFields (primaryNodeValue: string, nestedSelectionNodes: readonly SelectionNode[], nestedRequiredFields?: Record<string, string[]> | Record<string, Record<string, string[]>>) {
            nestedSelectionNodes.forEach(selectionNode => {
                if ( selectionNode.kind === 'Field' ) {
                    if ( !includeModels.has(selectionNode.name.value) ) {
                        if ( !nestedRequiredFields ) {
                            ( requiredFields[primaryNodeValue].fields as string[] ).push(selectionNode.name.value);
                        } else {
                            let targetIncludeRelationsFields: string[] | undefined = ( nestedRequiredFields.includeRelationsFields as Record<string, string[]> )[primaryNodeValue];

                            if ( !targetIncludeRelationsFields ) {
                                targetIncludeRelationsFields = [];

                                ( nestedRequiredFields.includeRelationsFields as Record<string, string[]> )[primaryNodeValue] = targetIncludeRelationsFields;
                            }

                            targetIncludeRelationsFields.push(selectionNode.name.value);
                        }
                    } else if ( selectionNode.selectionSet ) {
                        if ( !requiredFields[primaryNodeValue].includeRelationsFields ) requiredFields[primaryNodeValue].includeRelationsFields = {};

                        findFields(selectionNode.name.value, selectionNode.selectionSet.selections, requiredFields[primaryNodeValue]);
                    }
                }
            });
        }

        return requiredFields;
    }
}