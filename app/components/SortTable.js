
/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

"use strict";

import { Link } from 'react-router';
var FixedDataTable = require('fixed-data-table');
var React = require('react');
import SortHeaderCell from './SortHeaderCell';
const {Table, Column, Cell} = FixedDataTable;

var SortTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function reverseSortDirection(sortDir) {
  return sortDir === SortTypes.DESC ? SortTypes.ASC : SortTypes.DESC;
}

const TextCell = ({rowIndex, data, columnKey, ...props}) => (
  <Cell {...props}>
    <Link to={{ pathname: '/github', query: { user: data[rowIndex]['user_name']} }}>
      {data[rowIndex][columnKey]}
    </Link>
  </Cell>
);

class DataListWrapper {
  constructor(data) {
    this._data = data;
  }

  getSize() {
    return this._indexMap.length;
  }

  getObjectAt(index) {
    return this._data[this._indexMap[index]];
  }
}

class SortTable extends React.Component {
  constructor(props) {
    super(props);

    this.colSortDirs = {}
    this._onSortChange = this._onSortChange.bind(this);
  }


  _onSortChange(columnKey, sortDir) {
    this.colSortDirs = {[columnKey]: sortDir}
    if (this.props.onSortChange) {
      this.props.onSortChange(columnKey, sortDir)
    }
  }

  render() {
    var {dataList, columns} = this.props
    const columnList = columns.map((column, index) => {
      return (
        <Column
          columnKey={column.key}
          header={
            <SortHeaderCell
              onSortChange={this._onSortChange}
              sortDir={this.colSortDirs[column.key]}>
              {column.name}
            </SortHeaderCell>
          }
          cell={<TextCell data={dataList} />}
          width={column.width}
          key={column.key}
        />
      )
    });

    return (
      <Table
        rowHeight={50}
        rowsCount={dataList.length}
        headerHeight={50}
        width={this.props.width}
        height={this.props.height}
        {...this.props}>
        
        {columnList}

      </Table>
    );
  }
}
export default SortTable