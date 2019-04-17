<template>
  <div class="h-table-container">
    <el-table
      ref="hTable"
      :data="data"
      :height="height"
      :max-height="maxHeight"
      :border="border"
      :size="size"
      :fit="fit"
      :highlight-current-row="highlightCurrentRow"
      :current-row-key="currentRowKey"
      :row-class-name="getRowClassName"
      :row-style="rowStyle"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      :header-row-class-name="headerRowClassName"
      :header-row-style="headerRowStyle"
      :header-cell-class-name="headerCellClassName"
      :header-cell-style="headerCellStyle"
      :row-key="rowKey"
      :empty-text="emptyText"
      :default-expand-all="defaultExpandAll"
      :expand-row-keys="expandRowKeys"
      :default-sort="defaultSort"
      :tooltip-effect="tooltipEffect"
      :show-header="showHeader"
      :show-summary="showSummary"
      :sum-text="sumText"
      :summary-method="summaryMethod"
      :span-method="spanMethod"
      :select-on-indeterminate="selectOnIndeterminate"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="handleCellMouseEnter"
      @cell-mouse-leave="handleCellMouseLeave"
      @cell-click="handleCellClick"
      @cell-dblclick="handleCellDblclick"
      @row-click="handleRowClick"
      @row-contextmenu="handleRowContextmenu"
      @row-dblclick="handleRowDblclick"
      @header-click="handleHeaderClick"
      @header-contextmenu="handleHeaderContextmenu"
      @sort-change="handleSortChange"
      @filter-change="handleFilterChange"
      @current-change="handleTableCurrentChange"
      @header-dragend="handleHeaderDragend"
      @expand-change="handleExpandChange"
    >
      <slot></slot>
      <slot name="append" slot="append"></slot>
      <div slot="empty" class="empty-content">
        <span>暂无数据</span>
      </div>
    </el-table>
    <el-pagination
      v-if="showPagination"
      :small="small"
      :background="background"
      :page-size="pageSize"
      :total="total"
      :page-count="pageCount"
      :pager-count="pagerCount"
      :current-page="currentPage"
      :layout="layout"
      :page-sizes="pageSizes"
      :popper-class="popperClass"
      :prev-text="prevText"
      :next-text="nextText"
      :disabled="disabled"
      @size-change="handleSizeChange"
      @current-change="handlePaginationCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
    >
      <slot name="pagination"></slot>
    </el-pagination>
  </div>
</template>

<script>
// import Vue from "vue";
// import { Table, TableColumn, Pagination } from "element-ui";
// Vue.use(Table);
// Vue.use(TableColumn);
// Vue.use(Pagination);

export default {
  name: "HTable",
  props: {
    data: Array,
    height: {
      type: [String, Number],
      default: "100%"
    },
    maxHeight: [String, Number],
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      validator(value) {
        return ["medium", "small", "mini"].indexOf(value) !== -1;
      }
    },
    fit: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    currentRowKey: [String, Number],
    rowClassName: {
      type: [Function, String]
    },
    rowStyle: [Function, Object],
    cellClassName: [Function, String],
    cellStyle: [Function, Object],
    headerRowClassName: [Function, String],
    headerRowStyle: [Function, Object],
    headerCellClassName: [Function, String],
    headerCellStyle: [Function, Object],
    rowKey: [Function, String],
    emptyText: String,
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    expandRowKeys: Array,
    defaultSort: {
      type: Object,
      validator(value) {
        return ["ascending", "descending"].indexOf(value.order) !== -1;
      }
    },
    tooltipEffect: {
      type: String,
      validator(value) {
        return ["dark", "light"].indexOf(value.order) !== -1;
      }
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: String,
    summaryMethod: Function,
    spanMethod: Function,
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    background: {
      type: Boolean,
      default: false
    },
    pageSize: Number,
    total: Number,
    pageCount: Number,
    pagerCount: Number,
    currentPage: Number,
    layout: {
      type: String,
      default: "jumper, prev, pager, next, sizes, total",
      validator(value) {
        let options = [
          "sizes",
          "prev",
          "pager",
          "next",
          "jumper",
          "->",
          "total",
          "slot"
        ];
        let layoutArr = value.split(",");
        for (let i = 0; i < layoutArr.length; i++) {
          if (options.indexOf(layoutArr[i].trim()) === -1) {
            return false;
          }
        }
        return true;
      }
    },
    pageSizes: {
      type: Array,
      validator(value) {
        for (let i = 0; i < value.length; i++) {
          if (typeof value[i] !== "number") {
            return false;
          }
        }
        return true;
      }
    },
    popperClass: String,
    prevText: String,
    nextText: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getRowClassName() {
      if (this.rowClassName) {
        return this.rowClassName;
      } else if (this.stripe) {
        return ({ rowIndex }) => {
          if (rowIndex % 2 === 1) {
            return "stripe-row";
          }
        };
      }
      return "";
    }
  },
  methods: {
    handleSelect(selection, row) {
      this.$emit("select", selection, row);
    },
    handleSelectAll(selection) {
      this.$emit("select-all", selection);
    },
    handleSelectionChange(selection) {
      let selectedKeys = null;
      if (this.rowKey) {
        selectedKeys = [];
        selection.forEach(item => {
          selectedKeys.push(item[this.rowKey]);
        });
      }
      this.$emit("selection-change", selection, selectedKeys);
    },
    handleCellMouseEnter(row, column, cell, event) {
      this.$emit("cell-mouse-enter", row, column, cell, event);
    },
    handleCellMouseLeave(row, column, cell, event) {
      this.$emit("cell-mouse-leave", row, column, cell, event);
    },
    handleCellClick(row, column, cell, event) {
      this.$emit("cell-click", row, column, cell, event);
    },
    handleCellDblclick(row, column, cell, event) {
      this.$emit("cell-dblclick", row, column, cell, event);
    },
    handleRowClick(row, event, column) {
      this.$emit("row-click", row, event, column);
    },
    handleRowContextmenu(row, event) {
      this.$emit("row-contextmenu", row, event);
    },
    handleRowDblclick(row, event) {
      this.$emit("row-dblclick", row, event);
    },
    handleHeaderClick(column, event) {
      this.$emit("header-click", column, event);
    },
    handleHeaderContextmenu(column, event) {
      this.$emit("header-contextmenu", column, event);
    },
    handleSortChange({ column, prop, order }) {
      this.$emit("sort-change", { column, prop, order });
    },
    handleFilterChange(filters) {
      this.$emit("filter-change", filters);
    },
    handleTableCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("table-current-change", currentRow, oldCurrentRow);
    },
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      this.$emit("header-dragend", newWidth, oldWidth, column, event);
    },
    handleExpandChange(row, expandedRows) {
      this.$emit("expand-change", row, expandedRows);
    },
    clearSelection() {
      this.$refs.hTable.clearSelection();
    },
    toggleRowSelection(row, selected) {
      this.$refs.hTable.toggleRowSelection(row, selected);
    },
    toggleAllSelection() {
      this.$refs.hTable.toggleAllSelection();
    },
    toggleRowExpansion(row, expanded) {
      this.$refs.hTable.toggleRowExpansion(row, expanded);
    },
    setCurrentRow(row) {
      this.$refs.hTable.setCurrentRow(row);
    },
    clearSort() {
      this.$refs.hTable.clearSort();
    },
    clearFilter(columnKey) {
      this.$refs.hTable.clearFilter(columnKey);
    },
    doLayout() {
      this.$refs.hTable.doLayout();
    },
    sort(prop, order) {
      this.$refs.hTable.sort(prop, order);
    },
    handleSizeChange(pageSize) {
      this.$emit("size-change", pageSize);
    },
    handlePaginationCurrentChange(currentPage) {
      this.$emit("pagination-current-change", currentPage);
    },
    handlePrevClick(currentPage) {
      this.$emit("prev-click", currentPage);
    },
    handleNextClick(currentPage) {
      this.$emit("next-click", currentPage);
    }
  }
};
</script>

<style lang="scss" scoped>
.h-table-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    .empty-content {
      background: url(~@/assets/mode/emptyTips.png);
      background-repeat: no-repeat;
      background-position-x: 50%;
      background-position-y: 50%;
      height: 200px;
      text-align: center;
      vertical-align: middle;
      line-height: 150px;
      color: #909399;
      font-size: 14px;
    }
  }
  .el-pagination {
    padding-top: 10px;
    text-align: center;
  }
}
</style>

<style lang="scss">
.h-table-container {
  .el-table {
    .el-table__body-wrapper {
      flex: 1;
    }
    .stripe-row {
      background: #f3f3f3;
    }
  }
}
</style>
