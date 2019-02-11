import { MenuItem } from "./MenuItem";

/**
 * A menu item added to a check, has additional details
 * 
 * Id is somewhat overloaded - Id on a CheckMenuItem is unique, but Id on a MenuItem is actually the itemId on a CheckMenuItem
 * 
 */
export interface CheckMenuItem extends MenuItem {
    dateCreated: string;
    dateUpdated: string;
    createdBy: string;
    checkId: string;
    itemId: string;
    voided: boolean;
}