import React, { ChangeEvent } from 'react';
import '../../node_modules/react-table/react-table.css'
import { Table } from '../types/Table';
import { Check } from '../types/Check';
import { MenuItem } from '../types/MenuItem';
import { CheckMenuItem } from '../types/CheckMenuItem';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import * as Actions from '../actions/messageAction';
import { GreasySpoonApi } from '../api/averoApi';
import { IAppState } from '../reducers/messageReducer';
import MenuItemTable from './MenuItemTable';
import ClosedCheckTable from './ClosedCheckTable';

/**
 * Props for the check.
 */
interface ICheckOptionsProps {
    table?: Table
    close: () => void
}

/**
 * Properties bound to dispatch methods.
 */
interface ICheckOptionsDispatchProps {
    dispatchChecks: (checks: Check[]) => void;
    dispatchCheckDetails: (check: Check) => void;
}

/**
 * Properties bound to application state.
 */
interface IStateProps {
    menuItems: MenuItem[]
    selectedTable?: Table
}

/**
 * State of check options component
 */
interface ICheckOptionsState {
    menuValue: string;
}

class CheckOptions extends React.Component<ICheckOptionsProps & ICheckOptionsDispatchProps & IStateProps, ICheckOptionsState> {

    constructor(props: any) {
        super(props);
        this.state = { menuValue: this.props.menuItems[0].id };
        this.getCheckDetails();
    }

    render() {
        //If nothing is selected show nothing.
        if (!this.props.selectedTable)
            return null;

        let selectedTable = this.props.selectedTable;
        return (
            <div>
                <div style={{ display: "inline-flex" }}>
                    <div>
                        <p>
                            <span className="Information-label">Table Number :</span> {selectedTable.number}
                        </p>
                        <p>
                            <span className="Information-label">Check Status :</span>
                            <span style={/**Dynamic Style to represent check state*/selectedTable.check && !selectedTable.check.closed ? { backgroundColor: "#ff7777" } : { backgroundColor: "#99ff99" }}>
                                {this.getCheckStatus(selectedTable.check)}
                            </span>
                        </p>
                    </div>
                    <div style={{ padding: 15 }}>
                        <button style={{ height: "100%", width: "100%" }} onClick={() => this.handleCheckButton()}> {selectedTable.check && !selectedTable.check.closed ? "Close Check" : "Open Check"} </button>
                    </div>
                    <div style={{ padding: 15 }}>
                        <select style={{ height: "100%", width: "100%" }} value={this.state.menuValue} onChange={(e) => this.handleMenuChange(e)}>
                            {/**Map the possible menu options to jsx options*/this.props.menuItems.map((item) => <option key={item.id} value={item.id}>{item.name + " $" + item.price}</option>)}
                        </select>
                    </div>
                    <div style={{ padding: 15 }}>
                        <button style={{ height: "100%", width: "100%" }} disabled={!selectedTable.check || selectedTable.check.closed} onClick={() => this.handleAddMenuItem()}>
                            Add Menu Item
                    </button>
                    </div>
                    <div>
                        <p><span className="Information-label">Current Total :</span> {this.tallyTotal(selectedTable).toFixed(2)}</p>
                    </div>
                    <div style={{ position: "absolute", right: 0, padding: 15 }}>
                        <button style={{ height: 45, width: "100%" }} onClick={this.props.close}> Close </button>
                    </div>
                </div>
                <div style={{ border: "1px solid black" }}>
                    <MenuItemTable data={selectedTable.check && selectedTable.check.orderedItems ? selectedTable.check.orderedItems : []}
                        voidMenuItem={(menuItem) => this.voidCurrentCheckMenuItem(menuItem)}
                    />
                </div>
                <div style={{ paddingTop: 50 }}>
                    <div style={{ border: "1px solid black" }}>
                        <ClosedCheckTable data={selectedTable.closedChecks ? selectedTable.closedChecks : []}
                            getCheckDetails={(check) => this.retrieveCheckDetails(check)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    /**
     * Handles adding a menu item to the current check
     */
    private handleAddMenuItem(): void {
        if (this.props.selectedTable && this.props.selectedTable.check) {
            GreasySpoonApi.addMenuItem(this.props.selectedTable.check, this.state.menuValue, () => {
                //Get the check details after refreshing checks adding a menu item
                this.getCheckDetails();
            });
        }
    }

    /**
     * Refreshes the greasy spoon checks.
     */
    private getChecks(): void {
        GreasySpoonApi.getChecks((checks: Check[]) => {
            //console.log(checks);
            this.props.dispatchChecks(checks);
            //Re-retrieve check details
            this.getCheckDetails();
        })
    }

    /**
     * Gets the details of the current check.
     */
    private getCheckDetails(): void {
        if (this.props.selectedTable && this.props.selectedTable.check) {
            this.retrieveCheckDetails(this.props.selectedTable.check);
        }
    }

    /**
     * Gets the details of the passed in check.
     * 
     * @param check : Check to get the details of 
     */
    private retrieveCheckDetails(check: Check): void {
        GreasySpoonApi.getCheckDetails(check, (check) => {
            //console.log("CHECK DETAILS");
            //console.log(check);
            this.props.dispatchCheckDetails(check);
        });
    }

    /**
     * Updates the component state with new selected value.
     * 
     * @param e : ChangEvent<HTMLSelectElement> event with new value
     */
    private handleMenuChange(e: ChangeEvent<HTMLSelectElement>) {
        this.setState({ menuValue: e.target.value });
    }

    /**
     * Returns a string of the check's status
     * 
     * @param check : Check to status of 
     * @returns string The status, Closed, Open, None
     */
    private getCheckStatus(check?: Check): string {
        if (check && check.closed) {
            return "Closed";
        } else if (check) {
            return "Open";
        } else {
            return "None";
        }
    }

    /**
     * Opens a check on the given table if there isn't a check, otherwise closes it.
     */
    private handleCheckButton() {
        if (!this.props.selectedTable)
            return;

        if (this.props.selectedTable.check && !this.props.selectedTable.check.closed) {
            let currentCheck = this.props.selectedTable.check;
            GreasySpoonApi.closeCheck(currentCheck, () => {
                //console.log("CLOSED " + currentCheck);
                //Refresh the check state to reflect change
                this.getChecks();
            });
        } else {
            let checkTable = this.props.selectedTable;
            GreasySpoonApi.createCheck(checkTable, () => {
                //console.log("OPENED " + checkTable);
                //Refresh the check state to reflect change
                this.getChecks();
            });
        }
    }

    /**
     * Voids a menu item on the current check
     * 
     * @param menuItem : CheckMenuItem to void
     */
    private voidCurrentCheckMenuItem(menuItem: CheckMenuItem) {
        if (!this.props.selectedTable)
            return;
        if (this.props.selectedTable.check) {
            this.voidMenuItem(this.props.selectedTable.check, menuItem);
        }
    }

    /**
     * Voids a menu item on the given check.
     * 
     * @param check : Check check to void the item on.
     * @param menuItem : CheckMenuItem menu item to void
     */
    private voidMenuItem(check: Check, menuItem: CheckMenuItem) {
        GreasySpoonApi.voidCheckItem(check, menuItem, () => {
            //console.log("VOIDED " + menuItem + " ON " + check);
            this.getCheckDetails();
        });
    }

    /**
     * Tallys the tables current total
     * 
     * @param table : Table
     */
    private tallyTotal(table: Table): number {
        let total = 0;
        if (table.check && table.check.orderedItems) {
            table.check.orderedItems.forEach((item) => {
                if (!item.voided)
                    total += item.price;
            })
            total += table.check.tax;
            total += table.check.tip;
        }
        return total;
    }

}

function mapStateToProps(state: IAppState, ownProps: ICheckOptionsProps): IStateProps {
    return { menuItems: state.menuItems, selectedTable: state.tables.find((value) => ownProps.table ? value.id == ownProps.table.id : false) };
}

function mapDispatchToProps(dispatch: Dispatch): ICheckOptionsDispatchProps {
    return {
        dispatchChecks: (checks: Check[]) => dispatch(Actions.GetChecksAction(checks)),
        dispatchCheckDetails: (check: Check) => dispatch(Actions.CheckDetailsAction(check))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckOptions);