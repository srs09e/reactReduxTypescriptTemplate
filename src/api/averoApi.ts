import { Table } from "../types/Table";
import { MenuItem } from "../types/MenuItem";
import { CheckMenuItem } from "../types/CheckMenuItem";
import { Check } from "../types/Check";

/**
 * Static api with greasy spoon endpoints.
 */
export class GreasySpoonApi {
    private static baseUri: string = "https://check-api.herokuapp.com";

    //This wouldn't be here in a full prod app
    private static token: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhNzhjOWUzLTkyNmItNDVkNi1iNzYwLTA5ZTlhZjdiMGVmMyIsIm5hbWUiOiJTZWFuIFNtaXRoIn0.nkCUKM5xxLD22ccn7W0DQS8uZ0cSmoGb_OuRjIgSdCE";

    /**
     * Retrieves every table at the greasy spoon.
     * 
     * @param okCallBack : (table: Table[]) => void method that will be called with table array as parameter
     */
    public static getTables(okCallBack: (table: Table[]) => void): void {
        const request = new XMLHttpRequest(); 
        request.open("GET", this.baseUri + "/tables", true);
        this.addToken(request);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200) {
                let tables : Table[] = JSON.parse(request.responseText)
                tables.forEach((value) => value.closedChecks = []);
                okCallBack(tables);
            }
        }
    }

    /**
     * Retrieves every menu item at the greasy spoon.
     * 
     * @param okCallBack : (menuItems: MenuItem[]) => void method that will be called with menuitem array as parameter
     */
    public static getMenuItems(okCallBack: (menuItems: MenuItem[]) => void): void {
        const request = new XMLHttpRequest(); 
        request.open("GET", this.baseUri + "/items", true);
        this.addToken(request);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200)
                okCallBack(JSON.parse(request.responseText));
        }
    }

    /**
     * Retrieves every check at the greasy spoon.
     * 
     * @param okCallBack : (checks: Check[]) => void): void method that will be called with every check as parameter
     */
    public static getChecks(okCallBack: (checks: Check[]) => void): void {
        const request = new XMLHttpRequest(); 
        request.open("GET", this.baseUri + "/checks", true);
        this.addToken(request);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200) {
                //For each check, created a date object to represent date strings
                let dateArray : Check[] = JSON.parse(request.responseText);
                dateArray.forEach((val) => {
                    val.dateCreatedDate = new Date(val.dateCreated);
                    val.dateUpdatedDate = new Date(val.dateUpdated);
                })
                okCallBack(dateArray);
            }
        }
    }

    /**
     * Creates a check for the given table.
     * 
     * @param table : Table table to create the check for.
     * @param okCallBack : () => void method that will be called on successful completion.
     */
    public static createCheck(table: Table, okCallBack: () => void): void {
        const request = new XMLHttpRequest(); 
        request.open("POST", this.baseUri + "/checks", true);
        this.addToken(request);
        request.send(JSON.stringify({ tableId: table.id }));
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200)
                okCallBack();
        }
    }

    /**
     * Retrieves details for a given check.
     * 
     * @param check : Check check to get details for
     * @param okCallBack : (check: Check) => void method that will be called with detailed check as a parameter
     */
    public static getCheckDetails(check: Check, okCallBack: (check: Check) => void): void {
        const request = new XMLHttpRequest();
        request.open("GET", this.baseUri + "/checks/" + check.id, true);
        this.addToken(request);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200) {
                let incCheck : Check = JSON.parse(request.responseText);
                incCheck.dateCreatedDate = new Date(incCheck.dateCreated);
                incCheck.dateUpdatedDate = new Date(incCheck.dateUpdated);
                okCallBack(incCheck);
            }
        }
    }

    /**
     * Adds a menu item to a given check.
     * 
     * @param check : Check check to add the menu item to.
     * @param menuItemId : string Id of the menu item to add
     * @param okCallBack : () => void method to be called on successful completion of adding item
     */
    public static addMenuItem(check: Check, menuItemId: string, okCallBack: () => void): void {
        const request = new XMLHttpRequest();
        request.open("PUT", this.baseUri + "/checks/" + check.id + "/addItem", true);
        this.addToken(request);
        request.send(JSON.stringify({ itemId: menuItemId }));
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200)
                okCallBack();
        }
    }

    /**
     * Voids a menu item on a given check.
     * 
     * @param check : Check check to void check item from.
     * @param menuItem : CheckMenuItem the menu item on the check being voided
     * @param okCallBack : () => void method to be called on successful completion of voiding item
     */
    public static voidCheckItem(check: Check, menuItem: CheckMenuItem, okCallBack: () => void): void {
        const request = new XMLHttpRequest();
        request.open("PUT", this.baseUri + "/checks/" + check.id + "/voidItem", true);
        this.addToken(request);
        request.send(JSON.stringify({ orderedItemId: menuItem.id }));
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200)
                okCallBack();
        }
    }

    /**
     * Closes a given check.
     * 
     * @param check : Check check to close.
     * @param okCallBack : () => void method to be called on successful completion of closing check
     */
    public static closeCheck(check: Check, okCallBack: () => void): void {
        const request = new XMLHttpRequest();
        request.open("PUT", this.baseUri + "/checks/" + check.id + "/close", true);
        this.addToken(request);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200)
                okCallBack();
        }
    }

    /**
     * Deletes all checks.
     * 
     * @param okCallBack : () => void method to be called on successful completion of deleting checks
     */
    public static deleteAllChecks(okCallBack: () => void) {
        const request = new XMLHttpRequest();
        request.open("DELETE", this.baseUri + "/checks", true);
        this.addToken(request);
        request.send();
        request.onreadystatechange = () => {
            if (request.readyState == request.DONE && request.status == 200)
                okCallBack();
        }
    }

    /**
     * Adds a token to a request.
     * 
     * @param request : XMLHttpRequest request to add to.
     */
    private static addToken(request: XMLHttpRequest) : void {
        request.setRequestHeader('Content-Type', 'application/json; charset=utf-8'); 
        request.setRequestHeader('Authorization', this.token);
    }
}