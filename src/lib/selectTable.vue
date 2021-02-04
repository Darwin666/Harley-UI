<template>
  <el-popover
    ref="popover"
    @show="onShowPopover"
    @hide="onHidePopover"
    placement="bottom-start"
    trigger="click"
    class="h-select-table"
    :disabled="disabled"
  >
    <slot name="head"></slot>
    <slot v-if="custom" slot="custom" name="custom"></slot>
    <el-input
      v-else
      slot="reference"
      ref="input"
      @blur="handleInputBlur"
      @focus="handleInputFocus"
      @clear="handleInputClear"
      :value="hLabel"
      :title="hLabel"
      clearable
      readonly
      :style="`width: ${width}px`"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{ 'is-focus': showStatus }"
    >
      <i
        slot="suffix"
        class="icon el-icon-arrow-up"
        :class="{ 'is-reverse': showStatus }"
      ></i>
    </el-input>
    <h-table
      ref="table"
      v-loading="loading"
      @size-change="handleSizeChange"
      @current-change="handlePaginationCurrentChange"
      @row-click="handleRowClick"
      :data="data"
      :columns="columns"
      :row-key="hProps.value"
      :show-pagination="showPagination"
      :page-size="pageSize"
      :current-page="currentPage"
      :total="total"
      :current-row-key="hValue"
      highlight-current-row
      size="small"
      small
    >
      <template
        v-for="{ slotName } in columns"
        :slot="slotName"
        slot-scope="scope"
      >
        <slot
          v-if="slotName"
          :name="slotName"
          :row="scope.row"
          :column="scope.column"
          :$index="scope.$index"
        ></slot>
      </template>
      <slot></slot>
    </h-table>
  </el-popover>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    custom: {
      type: Boolean,
      default: false,
    },
    // 占位符
    placeholder: String,
    // 默认标题
    defaultLabel: {
      type: String,
      default: "",
    },
    // 属性名称map
    props: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 输入框宽度
    width: {
      type: [String, Number],
      default: 200,
    },
    // 加载中状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 表格数据源
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    // 表格列
    columns: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否展示分页组件
    showPagination: {
      type: Boolean,
      default: false,
    },
    // 分页-每页数量
    pageSize: {
      type: Number,
      default: 10,
    },
    // 分页-数据总数
    total: Number,
    // 分页-当前页码
    currentPage: Number,
  },
  data() {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 已选行数据
      row: null,
    };
  },
  computed: {
    hValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
        this.$emit("change", val, this.row);
        if (this.$parent.$options.componentName === "ElFormItem") {
          this.$parent.$emit("el.form.change", val);
        }
      },
    },
    hProps() {
      return {
        value: "value",
        label: "label",
        ...this.props,
      };
    },
    hLabel() {
      return this.hValue === ""
        ? ""
        : this.row
        ? this.row[this.hProps.label] || ""
        : this.defaultLabel;
    },
  },
  methods: {
    // 显示时触发
    onShowPopover() {
      this.showStatus = true;
      if (this.type === "normal") {
        this.$refs.input.focus();
      }
      this.$emit("visible-change", true);
    },
    // 隐藏时触发
    onHidePopover() {
      this.showStatus = false;
      this.$emit("visible-change", false);
    },
    handleSizeChange(pageSize) {
      this.$emit("size-change", pageSize);
    },
    handlePaginationCurrentChange(currentPage) {
      this.$emit("pagination-current-change", currentPage);
    },
    handleRowClick(row) {
      this.row = row;
      this.hValue = row[this.hProps.value];
      this.$refs.popover.showPopper = false;
    },
    handleInputBlur(event) {
      this.$emit("blur", event);
    },
    handleInputFocus(event) {
      this.$emit("focus", event);
    },
    handleInputClear() {
      this.row = null;
      this.hValue = "";
      this.$emit("clear");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-select-table {
  display: inline-block;
  .el-input {
    &.is-focus {
      .el-input__inner {
        border: 1px $--color-primary solid;
      }
    }
    .icon {
      width: 25px;
      height: 100%;
      color: #999999;
      &::after {
        content: "";
        height: 100%;
        width: 0;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .icon {
    font-size: 14px;
    transition: transform 0.3s;
    transform: rotateZ(180deg);
    cursor: pointer;
  }
  .icon.is-reverse {
    transform: rotateZ(0);
  }
}
</style>

<style lang="scss">
.h-select-table {
  .el-input {
    .el-input__inner {
      cursor: pointer;
    }
    outline: none;
    :focus {
      outline: none;
    }
  }
}
</style>
