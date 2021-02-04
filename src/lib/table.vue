<template>
  <div class="h-table-container">
    <el-table
      ref="hTable"
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
      :data="data"
      :height="height"
      :max-height="maxHeight"
      :border="border"
      :size="size"
      :fit="fit"
      :stripe="stripe"
      :highlight-current-row="highlightCurrentRow"
      :current-row-key="currentRowKey"
      :row-class-name="rowClassName"
      :row-style="rowStyle"
      :cell-class-name="cellClassName"
      :cell-style="cellStyle"
      :header-row-class-name="headerRowClassName"
      :header-row-style="headerRowStyle"
      :header-cell-class-name="headerCellClassName"
      :header-cell-style="headerCellStyle"
      :row-key="rowKey"
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
      :class="
        ({
          'hide-select-all': !allSelectable,
          'hide-body': !showBody,
        },
        emptyClass)
      "
    >
      <el-table-column
        v-if="multiple"
        type="selection"
        header-align="center"
        align="center"
        width="80"
        :selectable="selectable"
        :resizable="false"
        :reserve-selection="reserveSelection"
      ></el-table-column>
      <el-table-column
        v-if="showIndex"
        type="index"
        label="序号"
        header-align="center"
        align="center"
        width="80"
        :resizable="false"
        show-overflow-tooltip
      ></el-table-column>
      <!-- <slot name="left"></slot> -->
      <template v-for="(column, index) in columns">
        <el-table-column
          v-if="!column.hide"
          :key="`${index}${column.label}`"
          :prop="column.value"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :resizable="column.resizable || false"
          :show-overflow-tooltip="
            'showOverflowTooltip' in column ? column.showOverflowTooltip : false
          "
          :align="column.align || 'left'"
          :header-align="column.headerAlign || 'left'"
          :class-name="column.className"
          :label-class-name="column.labelClassName"
        >
          <template slot="header" slot-scope="scope">
            <template v-if="column.headerSlotName">
              <slot
                :name="column.headerSlotName"
                :column="scope.column"
                :$index="scope.$index"
              ></slot>
            </template>
            <template v-else>{{ column.label }}</template>
          </template>
          <template slot-scope="scope">
            <slot
              v-if="hasColumnSlotName(column.slotName)"
              :name="column.slotName"
              :row="scope.row"
              :column="scope.column"
              :$index="scope.$index"
            ></slot>
            <template v-else>{{ getColumnValue(column, scope.row) }}</template>
          </template>
        </el-table-column>
      </template>
      <slot></slot>
      <slot slot="append" name="append"></slot>
      <div slot="empty">
        <img v-oss src="/common/noData.png" class="empty-img" />
      </div>
    </el-table>
    <el-pagination
      v-if="showPagination && isCurrent"
      @size-change="handleSizeChange"
      @current-change="handlePaginationCurrentChange"
      @prev-click="handlePrevClick"
      @next-click="handleNextClick"
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
    >
      <slot name="pagination"></slot>
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "HTable",
  props: {
    data: Array,
    height: [String, Number],
    // height: {
    //   type: [String, Number],
    //   default: "100%"
    // },
    maxHeight: [String, Number],
    stripe: {
      type: Boolean,
      default: true,
    },
    border: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      validator(value) {
        return ["medium", "small", "mini"].indexOf(value) !== -1;
      },
    },
    fit: {
      type: Boolean,
      default: true,
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    showBody: {
      type: Boolean,
      default: true,
    },
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    currentRowKey: [String, Number],
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
      default: false,
    },
    expandRowKeys: Array,
    defaultSort: {
      type: Object,
      validator(value) {
        return ["ascending", "descending"].indexOf(value.order) !== -1;
      },
    },
    tooltipEffect: {
      type: String,
      validator(value) {
        return ["dark", "light"].indexOf(value.order) !== -1;
      },
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    sumText: String,
    summaryMethod: Function,
    spanMethod: Function,
    selectOnIndeterminate: {
      type: Boolean,
      default: true,
    },
    showPagination: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    background: {
      type: Boolean,
      default: true,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
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
          "slot",
        ];
        let layoutArr = value.split(",");
        for (let i = 0; i < layoutArr.length; i++) {
          if (options.indexOf(layoutArr[i].trim()) === -1) {
            return false;
          }
        }
        return true;
      },
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
      },
    },
    popperClass: String,
    prevText: String,
    nextText: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    columns: Array,
    multiple: {
      type: Boolean,
      default: false,
    },
    showIndex: {
      type: Boolean,
      default: false,
    },
    selectable: Function,
    reserveSelection: {
      type: Boolean,
      default: false,
    },
    allSelectable: {
      type: Boolean,
      default: true,
    },

    // empty图片class，empty图片滚动时唯一class
    emptyClass: {
      type: String,
      default: "",
    },
    // 是否需要对empty图片进行滚动监听
    isScrollEmpty: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isCurrent: true,
    };
  },
  watch: {
    data() {
      this.$nextTick(() => {
        this.emptyScroll();
        let newCurrent = Math.ceil(this.total / this.pageSize);
        if (newCurrent < this.currentPage && !this.data.length && this.total) {
          this.$emit(
            "pagination-current-change",
            Math.ceil(this.total / this.pageSize)
          );
        }
      });
    },
    currentPage(a, b) {
      this.isCurrent = false;
      this.$nextTick(() => {
        this.isCurrent = true;
      });
    },
  },
  mounted() {
    const selectEl = document.querySelector(
      `${this.emptyClass ? "." + this.emptyClass : ""} .el-table__body-wrapper`
    );

    selectEl.addEventListener("scroll", this.emptyScroll, true);
  },
  methods: {
    emptyScroll() {
      const className = this.emptyClass ? `.${this.emptyClass}` : "";

      if (
        document.querySelector(`${className} .empty-img`) &&
        this.isScrollEmpty
      ) {
        const scrollLeft = document.querySelector(
          `${
            this.emptyClass ? "." + this.emptyClass : ""
          } .el-table__body-wrapper`
        ).scrollLeft;
        document.querySelector(
          `${className} .empty-img`
        ).style.left = `calc( 50% + ${scrollLeft}px - 60px)`;
      }
    },
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
        selection.forEach((item) => {
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
    },
    hasColumnSlotName(name) {
      return !!name && name !== "append" && name !== "pagination";
    },
    getColumnValue(column, row) {
      let { value, valueFormatter } = column;
      if (valueFormatter && typeof valueFormatter === "function") {
        return valueFormatter(row) || "--";
      } else {
        return row[value] || "--";
      }
    },
    rowClassName({ row, rowIndex }) {
      if (rowIndex % 2 !== 0) {
        return "stripe-color";
      }
      return "";
    },
  },
};
</script>

<style lang="scss" scoped>
.h-table-container {
  // height: 100%;
  display: flex;
  flex-direction: column;
  .el-table {
    flex: 1;
  }
  .stripe-color {
    background-color: #f8f8fc;
  }
  .el-pagination {
    margin-top: 20px;
    text-align: right;
  }
}
</style>

<style lang="scss">
@import "~@/styles/element-ui.scss";

.h-table-container {
  .el-table {
    th,
    .el-table td {
      padding: 10px 0;
    }
    // .el-table__body tr:hover td {
    //   background: rgba(0, 0, 0, 0.02);
    // }
    .el-table__body tr.current-row > td {
      background-color: mix($--color-white, $--color-primary, 80%);
    }
    &.hide-body {
      .el-table__body-wrapper {
        display: none;
      }
    }
    .el-table__empty-text {
      width: auto;
      padding: 20px 0;
      img {
        width: 120px;
      }
    }
    .el-table__header-wrapper {
      border-radius: 4px 4px 0px 0px;
      th {
        background: $--table-header !important;
        font-weight: 550;
        color: $--color-text-primary;
      }
    }
    .el-table__body-wrapper {
      flex: 1;
      td {
        color: $--color-text-regular;
      }
    }
    .stripe-row {
      background: #f3f3f3;
    }
    .el-button--text {
      padding: 0;
    }
    &.hide-select-all {
      thead {
        .el-checkbox {
          display: none;
        }
      }
    }
  }
  .el-table__empty-block {
    img {
      position: absolute;
      left: calc(50% - 60px);
    }
    div {
      height: 170px;
    }
  }
}
</style>
