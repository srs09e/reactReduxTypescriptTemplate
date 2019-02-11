import React from 'react';
import { IAppState } from '../reducers/messageReducer';
import { Table } from '../types/Table';
import { connect } from 'react-redux';

/**
 * Props for the table holder
 */
interface ITableHolderProps {
  onSelectedTable: (table:Table) => void;
}

/**
 * Props for the table state dependent on the main app state.
 */
interface ITableStateProps {
  tables: Table[];
}

class TableHolderComponent extends React.Component<ITableHolderProps & ITableStateProps> {
  render() {
    return (
      <div className="Table-holder">
        {this.renderTableSelection()}
      </div>
    );
  }

  /**
   * Helper method that dynamically creates a table selector for each table.
   */
  renderTableSelection() : any{
    return <div>
      {this.props.tables.map((table: Table) => {
        return <div className="Table-icon-holder" key={table.id} onClick={() => this.props.onSelectedTable(table)}>
          <div className="Table-icon" style={table.check && !table.check.closed ? {backgroundColor:"#ff7777"} : {backgroundColor:"#99ff99"}} >
            <div className="Table-text" >
              {table.number}
            </div>
          </div>
        </div>
      })}
    </div>
  }
}

function mapStateToProps(state: IAppState): ITableStateProps {
  return { tables: state.tables };
}

export default connect(mapStateToProps)(TableHolderComponent);