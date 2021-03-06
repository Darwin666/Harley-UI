<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    @show="onShowPopover"
    @hide="onHidePopover"
    placement="bottom-start"
    trigger="click"
    class="h-select-tree"
    :disabled="disabled"
  >
    <el-scrollbar>
      <el-tree
        v-if="multiple"
        ref="hSelectTree"
        @check="onCheckNode"
        :style="`min-width:${treeWidth};max-height:300px;`"
        :data="dataSource"
        :props="hProps"
        :expand-on-click-node="false"
        default-expand-all
        :node-key="hProps.value"
        show-checkbox
        check-strictly
        :default-checked-keys="hValue"
      ></el-tree>
      <el-tree
        v-else
        @node-click="handleTreeClickNode"
        highlight-current
        :style="`min-width:${treeWidth};max-height:300px;`"
        :data="dataSource"
        :props="hProps"
        :expand-on-click-node="false"
        default-expand-all
        :node-key="hProps.value"
        :current-node-key="hValue"
      ></el-tree>
    </el-scrollbar>
    <el-input
      v-if="type === 'normal'"
      slot="reference"
      ref="input"
      @blur="handleInputBlur"
      @focus="handleInputFocus"
      @clear="handleInputClear"
      :value="label"
      :title="label"
      clearable
      readonly
      :style="`width: ${width}px`"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{ 'is-focus': showStatus }"
    >
      <slot slot="prefix" name="prefix"></slot>
      <i
        slot="suffix"
        class="icon el-icon-arrow-up"
        :class="{ 'is-reverse': showStatus }"
      ></i>
    </el-input>
    <el-button
      v-else-if="type === 'text'"
      slot="reference"
      :title="label"
      :disabled="disabled"
      type="text"
    >
      {{ label }}
      <i
        class="icon el-icon-arrow-up"
        :class="{ 'is-reverse': showStatus }"
      ></i>
    </el-button>
  </el-popover>
</template>

<script>
export default {
  name: "HSelectTree",
  props: {
    // 接收绑定参数
    value: [String, Number, Array],
    multiple: {
      type: Boolean,
      default: false,
    },
    // 输入框宽度
    width: String,
    // 选项数据
    dataSource: {
      type: Array,
      required: true,
    },
    // 输入框占位符
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => {},
    },
    type: {
      type: String,
      default: "normal",
      validator(value) {
        return ["normal", "text"].indexOf(value) !== -1;
      },
    },
  },
  data() {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: "auto",
      // 选中节点
      nodeModel: null,
    };
  },
  computed: {
    hValue: {
      get() {
        let value = null;
        if (this.multiple) {
          value = [];
          if (this.value instanceof Array) {
            this.value.forEach((key) => {
              if (this.checkValueExisting(key)) {
                value.push(key);
              }
            });
          }
        } else {
          value = "";
          if (this.checkValueExisting(this.value)) {
            value = this.value;
          }
        }
        return value;
      },
      set(value) {
        this.$emit("input", value);
        this.$emit("change", value, this.nodeModel);
        if (this.$parent.$options.componentName === "ElFormItem") {
          this.$parent.$emit("el.form.change", value);
        }
      },
    },
    label() {
      return this.multiple
        ? this.getLabelModels(this.hValue)
        : this.getLabelModel(this.hValue);
    },
    hProps() {
      return {
        label: "label",
        value: "value",
        children: "children",
        disabled: "disabled",
        isLeaf: "isLeaf",
        ...this.props,
      };
    },
  },
  watch: {
    value(val) {
      if (this.multiple) {
        this.$refs.hSelectTree.setCheckedKeys(val);
      }
    },
  },
  created() {
    if (this.type === "normal") {
      // 获取输入框宽度同步至树状菜单宽度
      this.$nextTick(() => {
        this.treeWidth = `${
          (this.width || this.$refs.input.$refs.input.clientWidth) - 24
        }px`;
      });
    }
  },
  methods: {
    checkValueExisting(value, list = this.dataSource) {
      if (list instanceof Array) {
        let index = list.findIndex(
          (item) => item[this.hProps.value] === value,
          this
        );
        if (index > -1) {
          return true;
        }
        for (let i = 0; i < list.length; i++) {
          if (
            this.checkValueExisting(value, list[i][this.hProps.children] || [])
          ) {
            return true;
          }
        }
      }
      return false;
    },
    // 单击节点
    handleTreeClickNode(node) {
      this.nodeModel = node;
      this.hValue = node[this.hProps.value];
      this.$refs.popover.showPopper = false;
    },
    onCheckNode(node, { checkedKeys, checkedNodes }) {
      this.nodeModel = checkedNodes;
      this.hValue = checkedKeys;
    },
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
    // 获取value对应的label
    getLabelModel(value) {
      let stark = [];
      stark = stark.concat(this.dataSource);
      while (stark.length) {
        const temp = stark.shift();
        if (temp[this.hProps.value] === value) {
          return temp[this.hProps.label];
        }
        if (temp[this.hProps.children]) {
          stark = stark.concat(temp[this.hProps.children]);
        }
      }
      return "";
    },
    getLabelModels(value) {
      let label = "";
      let stark = [];
      stark = stark.concat(this.dataSource);
      while (stark.length) {
        const temp = stark.shift();
        if (value.indexOf(temp[this.hProps.value]) !== -1) {
          let tempLable = temp[this.hProps.label] || "";
          label += label ? `,${tempLable}` : tempLable;
        }
        if (temp[this.hProps.children]) {
          stark = stark.concat(temp[this.hProps.children]);
        }
      }
      return label;
    },
    handleInputBlur(event) {
      this.$emit("blur", event);
    },
    handleInputFocus(event) {
      this.$emit("focus", event);
    },
    handleInputClear() {
      this.$emit("clear");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-select-tree {
  .el-tree {
    max-height: 350px;
  }
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
  .el-button {
    height: auto;
    width: auto;
    padding: 0;
    margin: 0;
    span {
      .icon {
        margin-left: 5px;
      }
    }
  }
}
</style>

<style lang="scss">
.h-select-tree {
  .el-input {
    .el-input__inner {
      cursor: pointer;
    }
    outline: none;
    :focus {
      outline: none;
    }
  }
  .el-button {
    span {
      float: left;
      color: #ffffff;
    }
  }
  .el-scrollbar {
    overflow-y: scroll;
    &::-webkit-scrollbar {
      z-index: 11;
      width: 6px;
    }
    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-corner {
      background: #fff;
    }
    &::-webkit-scrollbar-thumb {
      // border-radius: 5px;
      width: 6px;
      background-color: #eee;
      &:hover {
        background-color: #ccc;
      }
    }
    &::-webkit-scrollbar-track-piece {
      background: #fff;
      width: 6px;
    }
  }
}
</style>
