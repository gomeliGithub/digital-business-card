import { Request } from 'express';

export type TRequestedIncludeFields = Record<string, Record<string, string[]> | Record<string, Record<string, string[]>>>;

export interface IRequest extends Request {
    requestedIncludeFields: TRequestedIncludeFields;
}