<template>
  <div>
    <el-transfer
      ref="transfer"
      v-model="hValue"
      :data="data"
      :filterable="filterable"
      :filter-placeholder="filterPlaceholder"
      :filter-method="filterMethod"
      :target-order="targetOrder"
      :titles="titles"
      :button-texts="buttonTexts"
      :render-content="renderContent"
      :format="format"
      :props="props"
      :left-default-checked="leftDefaultChecked"
      :right-default-checked="rightDefaultChecked"
      @change="handleChange"
      @left-check-change="handleLeftCheckChange"
      @right-check-change="handleRightCheckChange"
      class="h-transfer"
    >
      <!-- <slot slot-scope="{option}" :data="{option}"></slot> -->
      <slot name="left-footer" slot="left-footer"></slot>
      <slot name="right-footer" slot="right-footer"></slot>
    </el-transfer>
    <div v-if="sortable" class="sortContainer">
      <el-button
        :disabled="upButtonDisabled"
        @click="handleUpButtonClick"
        type="primary"
        class="sortButton"
      >
        <i class="el-icon-arrow-up"></i>
      </el-button>
      <el-button
        :disabled="downButtonDisabled"
        @click="handleDownButtonClick"
        type="primary"
        class="sortButton"
      >
        <i class="el-icon-arrow-down"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
// import { Transfer, Button } from "element-ui";
// Vue.use(Transfer);
// Vue.use(Button);

export default {
  name: "HTransfer",
  props: {
    value: Array,
    data: {
      type: Array,
      key: [String, Number],
      label: [String, Number],
      disabled: Boolean
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterPlaceholder: String,
    filterMethod: Function,
    targetOrder: {
      type: String,
      validator(value) {
        return ["original", "push", "unshift"].indexOf(value) !== -1;
      }
    },
    titles: Array,
    buttonTexts: Array,
    renderContent: Function,
    format: Object,
    props: Object,
    leftDefaultChecked: Array,
    rightDefaultChecked: Array,
    sortable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rightCheckedKeys: [],
      upButtonDisabled: true,
      downButtonDisabled: true
    };
  },
  watch: {
    value() {
      this.checkTransferFooterButtonState();
    },
    rightCheckedKeys() {
      this.checkTransferFooterButtonState();
    }
  },
  computed: {
    hValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    clearQuery() {
      this.$refs.transfer.clearQuery();
    },
    handleChange(val, direction, movedKeys) {
      this.$emit("change", val, direction, movedKeys);
    },
    handleLeftCheckChange(checkedKeys, changedKeys) {
      this.$emit("left-check-change", checkedKeys, changedKeys);
    },
    handleRightCheckChange(checkedKeys, changedKeys) {
      this.rightCheckedKeys = checkedKeys;
      this.$emit("right-check-change", checkedKeys, changedKeys);
    },
    checkTransferFooterButtonState() {
      if (this.rightCheckedKeys.length !== 1) {
        this.upButtonDisabled = true;
        this.downButtonDisabled = true;
      } else {
        this.upButtonDisabled = false;
        this.downButtonDisabled = false;
        let key = this.rightCheckedKeys[0];
        let index = this.hValue.indexOf(key);
        if (index === 0) {
          this.upButtonDisabled = true;
        }
        if (index === this.hValue.length - 1) {
          this.downButtonDisabled = true;
        }
      }
    },
    handleUpButtonClick() {
      if (this.rightCheckedKeys.length !== 1) {
        return;
      }
      let key = this.rightCheckedKeys[0];
      let index = this.hValue.indexOf(key);
      if (index === 0) {
        return;
      }
      let array = [...this.hValue];
      array[index] = array[index - 1];
      array[index - 1] = key;
      this.hValue = array;
    },
    handleDownButtonClick() {
      if (this.rightCheckedKeys.length !== 1) {
        return;
      }
      let key = this.rightCheckedKeys[0];
      let index = this.hValue.indexOf(key);
      if (index === this.hValue.length - 1) {
        return;
      }
      let array = [...this.hValue];
      array[index] = array[index + 1];
      array[index + 1] = key;
      this.hValue = array;
    }
  }
};
</script>
<style lang="scss" scoped>
.h-transfer {
  display: inline-block;
}
.sortContainer {
  display: inline-block;
  vertical-align: middle;
  padding: 0 30px;
  .sortButton {
    display: block;
    margin: 0 auto;
    padding: 10px;
    border-radius: 50%;
    color: #fff;
    font-size: 14px;
    &:first-child {
      margin-bottom: 10px;
    }
    &.is-disabled {
      border: 1px solid #dcdfe6;
      background-color: #f5f7fa;
      color: #c0c4cc;
    }
  }
}
</style>
