import React from 'react';
import { Table } from '../types/Table';
import CheckOptions from './CheckOptions';

/**
 * Props for the table options
 */
interface ITableOptionsProps {
  show: boolean;
  onClose: any;
  table?: Table;
}

/**
 * Modal react component for the options pop up when dealing with a table's checks
 */
class TableOptions extends React.Component<ITableOptionsProps> {
  render() {
    // Render nothing if the "show" prop is false
    if (!this.props.show) {
      return null;
    }

    return (
      <div className="Modal-backdrop">
        <div className="Modal-main">
          <div>
            <CheckOptions table={this.props.table} close={this.props.onClose} />
          </div>
        </div>
      </div>
    );
  }
}

export default TableOptions;