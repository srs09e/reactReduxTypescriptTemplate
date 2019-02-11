import React from 'react';
import TableHolderComponent from './components/TableHolderComponent';
import TableOptions from './components/TableOptions';
import { Table } from './types/Table';
import { MenuItem } from './types/MenuItem';
import { Check } from './types/Check';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import './App.css';
import { GreasySpoonApi } from './api/averoApi';
import * as Actions from './actions/messageAction';
import { IAppState } from './reducers/messageReducer';
import ClosedCheckTable from './components/ClosedCheckTable';

/**
 * The main state of the application
 */
interface IMainAppState {
  modalOpen: boolean
  selectedTable?: Table
}

/**
 * Props dependent on app state.
 */
interface IMainAppStateProps {
  checks: Check[];
}

/**
 * Props bound to dispatch methods
 */
interface IMainAppDispatchProps {
  dispatchTables: (tables: Table[]) => void;
  dispatchMenuItems: (items: MenuItem[]) => void;
  dispatchChecks: (checks: Check[]) => void;
  dispatchCheckDetails: (check: Check) => void;
}

class App extends React.Component<IMainAppDispatchProps & IMainAppStateProps, IMainAppState> {

  constructor(props: any) {
    super(props);
    this.state = { modalOpen: false, selectedTable: undefined };
    //GreasySpoonApi.deleteAllChecks(() => { console.log("DELETED CHECKS") });
    //Initial values.
    this.getTables();
    this.getMenuItems();
  }

  render() {
    return (
      <div className="App">
        <header className="header">
          The Greasy Spoon
        </header>
        <TableOptions show={this.state.modalOpen} table={this.state.selectedTable} onClose={() => this.closeModal()} />
        <TableHolderComponent onSelectedTable={(table: Table) => this.selectTable(table)} />
        <header className="Closed-header">
          All Closed Checks
        </header>
        <div style={{ padding: 5 }}>
          <ClosedCheckTable getCheckDetails={(check) => this.getCheckDetails(check)} data={this.props.checks} />
        </div>
      </div>
    );
  }

  /**
   * Closes the modal dialog 
   */
  closeModal(): void {
    this.setState({ modalOpen: false });
  }

  /**
   * Opens the modal dialog on the selected table.
   * @param table : Table
   */
  selectTable(table: Table): void {
    this.setState({ modalOpen: true, selectedTable: table });
  }

  /**
   * Gets all tables
   */
  private getTables(): void {
    GreasySpoonApi.getTables((tables: Table[]) => {
      //console.log(tables);
      this.props.dispatchTables(tables);
      this.getChecks();
      //Constantly refresh for other server's checks.
      setInterval(() => this.getChecks(), 5000);
    });
  }

  /**
   * Gets all menu items
   */
  private getMenuItems(): void {
    GreasySpoonApi.getMenuItems((menuItems: MenuItem[]) => {
      //console.log(menuItems);
      this.props.dispatchMenuItems(menuItems);
    });
  }

  /**
   * Gets all checks
   */
  private getChecks(): void {
    GreasySpoonApi.getChecks((checks: Check[]) => {
      //console.log(checks);
      this.props.dispatchChecks(checks);
    })
  }

  /**
   * Gets the details of a given check
   * @param check : Check to get the details of
   */
  private getCheckDetails(check: Check) {
    GreasySpoonApi.getCheckDetails(check, (check) => {
      //console.log("CHECK DETAILS");
      //console.log(check);
      this.props.dispatchCheckDetails(check);
    });
  }
}

function mapStateToProps(state: IAppState): IMainAppStateProps {
  let closedChecks: Check[] = [];
  state.tables.forEach((value) => {
    if (value.closedChecks)
      closedChecks = closedChecks.concat(value.closedChecks);
  });
  return { checks: closedChecks };
}

function mapDispatchToProps(dispatch: Dispatch): IMainAppDispatchProps {
  return {
    dispatchTables: (tables: Table[]) => dispatch(Actions.GetTablesAction(tables)),
    dispatchMenuItems: (items: MenuItem[]) => dispatch(Actions.GetMenuItemsAction(items)),
    dispatchChecks: (checks: Check[]) => dispatch(Actions.GetChecksAction(checks)),
    dispatchCheckDetails: (check: Check) => dispatch(Actions.CheckDetailsAction(check))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);