import { Table } from '../types/Table';
import { MenuItem } from '../types/MenuItem';
import * as Actions from '../actions/messageAction';
import { MessageType } from '../actions/messages';

/**
 * All data is contained within the tables, outside of the possible menu item options.
 */
export interface IAppState {
    tables: Table[];
    menuItems: MenuItem[];
}

const initState: IAppState = {
    tables: [],
    menuItems: []
}

export default (state = initState, action: Actions.IAction) => {
    switch (action.type) {
        case MessageType.GET_TABLES_RESULT: {
            //Set the table states for the initial table pull
            let tableAction = action as Actions.ITablesAction;
            return Object.assign({}, state, { tables: tableAction.payload });
        }
        case MessageType.GET_MENU_ITEMS_RESULT: {
            //Set the menu item states for the inital menu item pull
            let menuItemAction = action as Actions.IMenuItemsAction;
            return Object.assign({}, state, { menuItems: menuItemAction.payload });
        }
        case MessageType.GET_CHECKS_RESULT: {
            let checksAction = action as Actions.IChecksAction;
            let checks = checksAction.payload;
            //If checks is empty, someone has recently cleared the checks and need to reset each table.
            if (checks.length == 0) {
                state.tables = state.tables.map((value) => {
                    value.check = undefined;
                    value.closedChecks = [];
                    return value;
                });
            }

            //Otherwise for each check find the table it belongs to, and push to the appropriate spot.
            checks.forEach((check) => {
                let tableIndx = state.tables.findIndex((value) => {
                    return value.id == check.tableId;
                });
                if (tableIndx > -1) {
                    let table = state.tables[tableIndx];
                    //Setting this value makes determining it later easier.
                    check.table = table.number;
                    if (check.closed) {
                        //If a check is closed, but its been recently closed (ie the table still thinks its the open check) clear the table's check value.
                        if (table.check && table.check.id == check.id) {
                            table.check = undefined;
                        }
                        let existingCheck = table.closedChecks.find((value) => value.id == check.id);
                        //If the check exists on the table already, just update it to not lose details.
                        if (existingCheck) {
                            Object.assign(existingCheck, check);
                        } else {
                            table.closedChecks.push(check);
                        }
                    //Otherwise its an active open check for the table.
                    } else if (table.check && table.check.id == check.id) {
                        Object.assign(table.check, check);
                    } else {
                        table.check = check;
                    }
                    state.tables[tableIndx] = Object.assign({}, state.tables[tableIndx]);
                }
            });
            return Object.assign({}, state);
        }
        case MessageType.CHECK_DETAILS: {
            let checksAction = action as Actions.ICheckDetailsAction;
            let check = checksAction.check;

            //Ordered Item list arrives without name and price populated. Build from our base list.
            check.orderedItems.forEach((value) => {
                let menuItem = state.menuItems.find((menuItem) => menuItem.id == value.itemId);
                if (menuItem) {
                    value.name = menuItem.name;
                    value.price = menuItem.price;
                }
            });

            let tableIndx = state.tables.findIndex((value) => {
                return value.id == check.tableId;
            });
            if (tableIndx > -1) {
                let table = state.tables[tableIndx];
                check.table = table.number;
                //If the check is closed, it *should* already be on in our closed check list, just update the value.
                if (check.closed) {
                    let checkIndx = table.closedChecks.findIndex((value) => {
                        return value.id == check.id;
                    });
                    if (checkIndx > -1) {
                        table.closedChecks[checkIndx] = check;
                    }
                //Otherwise its the active check.
                } else {
                    table.check = check;
                }
                state.tables[tableIndx] = Object.assign({}, state.tables[tableIndx]);
            }
            return Object.assign({}, state);
        }
        default:
            return state
    }
}