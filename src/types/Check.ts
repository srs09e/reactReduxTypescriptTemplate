import { CheckMenuItem } from "./CheckMenuItem";

/**
 * Check corresponding to a given table.
 */
export interface Check {
    id: string;
    dateCreated: string;
    dateCreatedDate: Date;
    dateUpdated: string;
    dateUpdatedDate: Date;
    createdBy: string;
    tableId: string;
    table: number;
    closed: boolean;
    tax: number;
    tip: number;
    orderedItems: CheckMenuItem[];
}