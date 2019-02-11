import {MessageType} from "./messages";
import {Table} from '../types/Table';
import {MenuItem} from '../types/MenuItem';
import {Check} from '../types/Check';

export interface IAction {
    type:MessageType;
}

/**
 * @member payload: Table[] the retrieved tables
 */
export interface ITablesAction extends IAction {
    payload:Table[];
}

/**
 * Creates a table action for a table query result
 * 
 * @param tables : Table[] the result of the table query.
 */
export function GetTablesAction(tables: Table[]) : ITablesAction {
    return {type: MessageType.GET_TABLES_RESULT, payload: tables };
}

/**
 * @member payload : MenuItem[] the retrieved menuItems
 */
export interface IMenuItemsAction extends IAction {
    payload:MenuItem[];
}

/**
 * Creates a menuItem action for a menu item query result
 * 
 * @param items : MenuItem[] the result of the menuitem query
 */
export function GetMenuItemsAction(items: MenuItem[]) : IMenuItemsAction {
    return {type: MessageType.GET_MENU_ITEMS_RESULT, payload: items };
}

/**
 * @member payload : Check[] the retrieved checks
 */
export interface IChecksAction extends IAction {
    payload:Check[];
}

/**
 * Creates a checks action from a check query result
 * 
 * @param checks : Check[] the result of a check query
 */
export function GetChecksAction(checks: Check[]) : IChecksAction {
    return {type: MessageType.GET_CHECKS_RESULT, payload: checks };
}

/**
 * @member check : Check the check with filled details
 */
export interface ICheckDetailsAction extends IAction {
    check:Check;
}

/**
 * Creates a check details action from a check details query result
 * 
 * @param check : Check the check with filled details
 */
export function CheckDetailsAction(check: Check) : ICheckDetailsAction {
    return {type: MessageType.CHECK_DETAILS, check: check}
}

