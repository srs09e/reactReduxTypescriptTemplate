import React from 'react';
import ReactTable from 'react-table';
import '../../node_modules/react-table/react-table.css'
import { CheckMenuItem } from '../types/CheckMenuItem';

/**
 * Menu Item table props
 */
interface IMenuItemTableProps {
    data: CheckMenuItem[];
    voidMenuItem: (menuItem: CheckMenuItem) => void;
}

/**
 * React component for holding menu items
 */
class MenuItemTable extends React.Component<IMenuItemTableProps> {
    render() {
        //Columns with an embedded button to void an item on a given row.
        const columns = [{
            Header: 'Name',
            accessor: 'name',
            Cell: (row: any) => {
                return <div className="Cell-text"> {row.original.name} </div>
            }
        }, {
            Header: 'Price',
            accesor: 'price',
            Cell: (row: any) => {
                return <div className="Cell-text"> {"$" + row.original.price.toFixed(2)} </div>
            }

        }, {
            Header: 'Void',
            id: 'id',
            Cell: (row: any) => {
                return <div className="Cell-text">
                    <button disabled={row.original.voided}
                        onClick={() => { this.props.voidMenuItem(row.original) }}> {row.original.voided ? "VOIDED ITEM" : "VOID"}
                    </button>
                </div>
            }
        }
        ];

        return (
            <ReactTable className="Check-table -striped -highlight"
                data={this.props.data}
                columns={columns}
                showPagination={this.props.data && this.props.data.length >= 20}
            />
        );
    }

}

export default MenuItemTable;