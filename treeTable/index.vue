<template>
  <el-table
    ref="table"
    :data="hData"
    :height="height"
    :max-height="maxHeight"
    :border="border"
    :size="size"
    :fit="fit"
    :highlight-current-row="highlightCurrentRow"
    :current-row-key="currentRowKey"
    :row-class-name="rowClassName"
    :row-style="getRowStyle"
    :cell-class-name="cellClassName"
    :cell-style="cellStyle"
    :header-row-class-name="headerRowClassName"
    :header-row-style="headerRowStyle"
    :header-cell-class-name="headerCellClassName"
    :header-cell-style="headerCellStyle"
    :row-key="rowKey"
    :empty-text="emptyText"
    :tooltip-effect="tooltipEffect"
    :show-header="showHeader"
    :show-summary="showSummary"
    :sum-text="sumText"
    :summary-method="summaryMethod"
    :span-method="spanMethod"
    class="h-tree-table"
    @cell-mouse-enter="handleCellMouseEnter"
    @cell-mouse-leave="handleCellMouseLeave"
    @cell-click="handleCellClick"
    @cell-dblclick="handleCellDblclick"
    @row-click="handleRowClick"
    @row-contextmenu="handleRowContextmenu"
    @row-dblclick="handleRowDblclick"
    @header-click="handleHeaderClick"
    @header-contextmenu="handleHeaderContextmenu"
    @current-change="handleCurrentChange"
    @header-dragend="handleHeaderDragend"
  >
    <template v-for="(column, index) in columns">
      <el-table-column
        v-if="index === 0"
        :key="index"
        :prop="column.value"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :resizable="column.resizable || false"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :align="column.align"
        :header-align="column.headerAlign || 'center'"
        :class-name="column.className"
        :label-class-name="column.labelClassName"
      >
        <template slot="header" slot-scope="scope">
          <el-checkbox
            v-if="multiple"
            :value="selected"
            @change="selectAll"
            :indeterminate="indeterminate"
          ></el-checkbox>
          {{ scope.column.label }}
        </template>
        <template slot-scope="scope">
          <i
            :class="getExpandColumnClass(scope.row)"
            :style="getExpandColumnStyle(scope.row)"
            class="arrow-icon"
            @click="toggleExpanded(scope.$index)"
          ></i>
          <el-checkbox
            v-if="multiple"
            :value="hData[scope.$index]._select"
            @change="value => select(value, scope.$index)"
            :indeterminate="hData[scope.$index]._indeterminate"
          ></el-checkbox>
          {{ scope.row[column.value] }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="index !== 0 && !column.hide"
        :key="index"
        :prop="column.value"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :resizable="column.resizable || false"
        :formatter="column.formatter"
        :show-overflow-tooltip="column.showOverflowTooltip"
        :align="column.align"
        :header-align="column.headerAlign || 'center'"
        :class-name="column.className"
        :label-class-name="column.labelClassName"
      ></el-table-column>
    </template>
    <slot></slot>
    <slot name="append" slot="append"></slot>
    <div slot="empty" class="empty-content">
      <span>暂无数据</span>
    </div>
  </el-table>
</template>

<script>
// import Vue from "vue";
// import { Table, TableColumn } from "element-ui";
// Vue.use(Table);
// Vue.use(TableColumn);

export default {
  name: "HTreeTable",
  props: {
    data: Array,
    height: {
      type: [String, Number],
      default: "100%"
    },
    maxHeight: [String, Number],
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
    defaultExpandRowKeys: {
      type: Array,
      default() {
        return [];
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
    columns: Array,
    props: {
      type: Object,
      default() {
        return {};
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    defaultSelectRowKeys: {
      type: Array,
      default() {
        return [];
      }
    },
    multipleStrictly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hData: [],
      selected: false,
      indeterminate: false,
      selectRowKeys: [],
      expandRowKeys: []
    };
  },
  created() {
    this.selectRowKeys = this.defaultSelectRowKeys;
  },
  computed: {
    hProps() {
      return {
        id: "id",
        pId: "pId",
        children: "children",
        ...this.props
      };
    }
  },
  watch: {
    data(val) {
      this.hData = this.treeToArray(val);
    },
    defaultExpandRowKeys(val) {
      this.expandRowKeys = val;
    },
    selectRowKeys(val) {
      this.$emit("selection-change", val);
    }
  },
  methods: {
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
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("current-change", currentRow, oldCurrentRow);
    },
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      this.$emit("header-dragend", newWidth, oldWidth, column, event);
    },
    clearSelection() {
      this.selectAll(false);
    },
    toggleRowSelection(row, selected) {
      let index = this.hData.findIndex(item => {
        return item[this.hProps.id] === row[this.hProps.id];
      });
      this.select(selected, index);
    },
    toggleAllSelection() {
      this.selectAll(true);
    },
    toggleRowExpansion(row, expand) {
      let realRow = this.hData.find(item => {
        return item[this.hProps.id] === row[this.hProps.id];
      });
      if (realRow) {
        realRow._expand = expand;
      }
    },
    setCurrentRow(row) {
      this.$refs.table.setCurrentRow(row);
    },
    doLayout() {
      this.$refs.table.doLayout();
    },
    treeToArray(treeData = [], parent = null, level = 0) {
      let arrayData = [];
      treeData.forEach(data => {
        let item = {
          ...data,
          _parent: parent,
          _level: level,
          _expand:
            this.defaultExpandAll ||
            this.defaultExpandRowKeys.indexOf(data[this.hProps.id]) > -1,
          _select: this.selectRowKeys.indexOf(data[this.hProps.id]) > -1,
          _indeterminate: false
        };
        item[this.hProps.children] = [];
        if (parent) {
          parent.children.push(item);
        }
        arrayData.push(item);
        arrayData = arrayData.concat(
          this.treeToArray(data[this.hProps.children], item, level + 1)
        );
      });
      return arrayData;
    },
    getExpandColumnClass(row) {
      let className = "";
      if (row.children && row.children.length > 0) {
        if (row._expand) {
          className = "el-icon-caret-bottom";
        } else {
          className = "el-icon-caret-right";
        }
      }
      return className;
    },
    getExpandColumnStyle(row) {
      let offset = row._level * 20;
      return {
        height: "14px",
        width: "14px",
        "margin-left": offset + "px",
        display: "inline-block",
        "margin-right": "5px"
      };
    },
    getRowStyle({ row }) {
      let style = "";
      if (typeof this.rowStyle === "function") {
        style = this.rowStyle({ row });
      } else if (typeof this.rowStyle === "object") {
        style = { ...this.rowStyle };
      }
      const show = row._parent
        ? row._parent._expand && row._parent._show
        : true;
      row._show = show;
      if (typeof style === "string") {
        style += show ? ";animation: treeTableShow 0.5s;" : ";display:none;";
      } else if (typeof style === "object") {
        if (show) {
          style.animation = "treeTableShow 0.5s";
        } else {
          style.display = "none";
        }
      }
      return style;
    },
    toggleExpanded(rowIndex) {
      let row = this.hData[rowIndex];
      row._expand = !row._expand;
      let key = row[this.hProps.id];
      if (row._expand) {
        this.expandRowKeys.push(key);
      } else {
        let index = this.expandRowKeys.indexOf(key);
        this.expandRowKeys.splice(index, 1);
      }
      this.$emit("expand-change", { ...row }, [...this.expandRowKeys]);
    },
    selectAll(value) {
      this.selected = value;
      this.indeterminate = false;
      this.selectRowKeys = [];
      this.hData.forEach(item => {
        item._select = value;
        item._indeterminate = false;
        if (value) {
          this.selectRowKeys.push(item[this.props.id]);
        }
      });
      this.$emit("select-all", this.selectRowKeys);
    },
    select(value, rowIndex) {
      let row = this.hData[rowIndex];
      if (row._select !== value) {
        row._select = value;
        row._indeterminate = false;
      }

      // 联动勾选父级
      if (!this.multipleStrictly) {
        if (row._parent) {
          this.toggleParentSelected(row._parent);
        } else {
          this.toggleAllSelected();
        }
      }

      // 保存本级
      let key = row[this.hProps.id];
      if (row._select) {
        this.selectRowKeys.push(key);
      } else {
        let index = this.selectRowKeys.indexOf(key);
        this.selectRowKeys.splice(index, 1);
      }

      // 联动勾选子级
      if (!this.multipleStrictly) {
        row[this.hProps.children].forEach(item => {
          this.toggleChildSelected(value, item);
        });
      }

      this.$emit("select", this.selectRowKeys, row);
    },
    toggleParentSelected(row) {
      let selectIndex = row[this.hProps.children].findIndex(
        item => item._select
      );
      let unselectIndex = row[this.hProps.children].findIndex(
        item => !item._select
      );
      let indeterminateIndex = row[this.hProps.children].findIndex(
        item => item._indeterminate
      );
      if (indeterminateIndex > -1 || (selectIndex > -1 && unselectIndex > -1)) {
        // 部分选中
        row._select = false;
        row._indeterminate = true;
      } else if (selectIndex === -1) {
        // 全部没选中
        row._select = false;
        row._indeterminate = false;
      } else if (unselectIndex === -1) {
        // 全部选中
        row._select = true;
        row._indeterminate = false;
      }
      // 联动勾选父级
      if (row._parent) {
        this.toggleParentSelected(row._parent);
      } else {
        this.toggleAllSelected();
      }
      // 保存本级
      let key = row[this.hProps.id];
      if (row._select) {
        this.selectRowKeys.push(key);
      } else {
        let index = this.selectRowKeys.indexOf(key);
        this.selectRowKeys.splice(index, 1);
      }
    },
    toggleChildSelected(value, row) {
      if (row._select !== value) {
        row._select = value;
        row._indeterminate = false;
      }
      // 保存本级
      let key = row[this.hProps.id];
      if (row._select) {
        this.selectRowKeys.push(key);
      } else {
        let index = this.selectRowKeys.indexOf(key);
        this.selectRowKeys.splice(index, 1);
      }
      // 联动勾选子级
      row[this.hProps.children].forEach(item => {
        this.toggleChildSelected(value, item);
      });
    },
    toggleAllSelected() {
      let selectIndex = this.hData.findIndex(
        item => !item._parent && item._select
      );
      let unselectIndex = this.hData.findIndex(
        item => !item._parent && !item._select
      );
      let indeterminateIndex = this.hData.findIndex(
        item => !item._parent && item._indeterminate
      );
      if (indeterminateIndex > -1 || (selectIndex > -1 && unselectIndex > -1)) {
        // 部分选中
        this.selected = false;
        this.indeterminate = true;
      } else if (selectIndex === -1) {
        // 全部没选中
        this.selected = false;
        this.indeterminate = false;
      } else if (unselectIndex === -1) {
        // 全部选中
        this.selected = true;
        this.indeterminate = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.h-tree-table {
  &.el-table {
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
  .arrow-icon {
    color: #999999;
  }
}
</style>

<style lang="scss">
.h-tree-table {
  &.el-table {
    .el-table__header-wrapper {
      .el-checkbox {
        margin-right: 2px;
      }
    }
    .el-table__body-wrapper {
      flex: 1;
      height: 100% !important;
      .el-checkbox {
        margin-left: 4px;
        margin-right: 2px;
      }
    }
  }
}
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
