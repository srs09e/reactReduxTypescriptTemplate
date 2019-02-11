import React from 'react';
import ReactTable from 'react-table';
import '../../node_modules/react-table/react-table.css'
import { Check } from '../types/Check';
import MenuItemTable from './MenuItemTable';

/**
 * Props for the closed check table.
 */
interface IClosedCheckTableProps {
    data: Check[];
    getCheckDetails: (check: Check) => void;
}

/**
 * State of the closed check table.
 */
interface IClosedCheckTableState {
    checksShowDetails: Check[];
}

class ClosedCheckTable extends React.Component<IClosedCheckTableProps, IClosedCheckTableState> {

    constructor(props: any) {
        super(props);
        this.state = { checksShowDetails: [] };
    }

    render() {
        //Table columns, a single column that will hold all data and allow expansion for details. Sorted by default on the updated date.
        const columns = [{
            Header: 'Recently Closed Checks',
            accessor: 'dateUpdatedDate',
            Cell: (row: any) => {
                return <div>
                    <div style={{ display: "inline-flex" }}>
                        <div style={{ display: "block" }}>
                            <p><span className="Information-label">Table :</span> {row.original.table}</p>
                            <p><span className="Information-label">Time Created :</span> {row.original.dateCreatedDate.toLocaleString()}</p>
                            <p><span className="Information-label">Time Closed :</span> {row.original.dateUpdatedDate.toLocaleString()}</p>
                        </div>
                        <div style={{ top: "50%", display: "inline-flex" }}>
                            <button className={this.getShowDetailsBtn(row)} onClick={() => this.showDetails(row)}> </button>
                            <p className="playerTableCellText">Show/Hide Details</p>
                        </div>
                    </div>
                    {this.renderCheckDetails(row)}
                </div>
            }
        }];

        //Sort by default on the updated date. Only show pagination if it becomes full.
        return (
            <ReactTable className="Check-table -striped -highlight"
                data={this.props.data}
                columns={columns}
                showPagination={this.props.data && this.props.data.length >= 20}
                defaultSorted={[
                    {
                        id: "dateUpdatedDate",
                        desc: true
                    }
                ]}
            />
        );
    }

    /**
     * Gets the button state detail of a given row
     * 
     * @param row : any the react table row 
     */
    private getShowDetailsBtn(row: any) : string {
        if (this.state.checksShowDetails.find((value) => value.id == row.original.id)) {
            return "btn removeBtn";
        } else {
            return "btn addBtn"
        }
    }

    /**
     * Toggles the show details state of a given row.
     * @param row : any the table row to toggle.
     */
    private showDetails(row: any) : void {
        var foundIdx = -1;
        //If the state is already showing the details, remove it, otherwise add it.
        if (this.state.checksShowDetails.find((value, index) => {
            if (value.id == row.original.id) {
                foundIdx = index;
                return true;
            }
            return false;
        })) {
            this.state.checksShowDetails.splice(foundIdx, 1)
            this.setState({ checksShowDetails: this.state.checksShowDetails });
        } else {
            this.state.checksShowDetails.push(row.original)
            this.setState({ checksShowDetails: this.state.checksShowDetails });
            this.props.getCheckDetails(row.original);
        }
    }

    /**
     * Returns a jsx element of the details of the check
     * 
     * @param row : row to render details on
     */
    private  renderCheckDetails(row: any) : any {
        if (!this.state.checksShowDetails.find((value) => value.id == row.original.id)) {
            return null;
        }

        return <div>
            <p><span className="Information-label">Total :</span> {this.getTotal(row.original).toFixed(2)} </p>
            <p><span className="Information-label">Tax :</span> {row.original.tax.toFixed(2)} </p>
            <p><span className="Information-label">Tip :</span> {row.original.tip.toFixed(2)} </p>
            <div style={{ paddingTop: 10, paddingLeft: 50, paddingRight: 50, paddingBottom: 10 }}>
                <div style={{ border: "1px solid black" }}>
                    <MenuItemTable data={row.original.orderedItems} voidMenuItem={() => { }} />
                </div>
            </div>
        </div>
    }

    /**
     * Tallys the total cost of the check
     * 
     * @param check : Check check total to tally
     */
    private getTotal(check: Check): number {
        let total = 0;
        if (check.orderedItems) {
            check.orderedItems.forEach((item) => {
                if (!item.voided)
                    total += item.price;
            })
            total += check.tax;
            total += check.tip;
        }
        return total;
    }

}

export default ClosedCheckTable;