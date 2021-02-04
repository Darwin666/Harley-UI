<template>
  <div class="h-search-condition">
    <div class="condition-component" :class="{ advanced: !advanced }">
      <h-checkbox-group
        v-if="multiple"
        v-model="checkboxValue"
        @change="handleChange"
        :data-source="dataSource"
        :props="hProps"
        :two-stage="twoStage"
      ></h-checkbox-group>
      <h-radio-group
        v-else
        v-model="radioValue"
        @change="handleChange"
        :data-source="dataSource"
        :props="hProps"
        type="textButton"
        :two-stage="twoStage"
      ></h-radio-group>
    </div>
    <div class="condition-operation">
      <el-checkbox v-model="multiple" label="多选" border></el-checkbox>
      <el-button @click="toggleAdvanced" type="text">
        更多
        <i :class="advanced ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </el-button>
    </div>
  </div>
</template>

<script>
import HCheckboxGroup from "./checkboxGroup";
import HRadioGroup from "./radioGroup";

export default {
  name: "HSearchCondition",
  components: { HCheckboxGroup, HRadioGroup },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
    props: {
      type: Object,
      default() {
        return {};
      },
    },
    twoStage: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      multiple: false,
      advanced: false,
    };
  },
  computed: {
    hValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    checkboxValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    radioValue: {
      get() {
        if (this.value.length) {
          return this.value[0];
        }
        return "";
      },
      set(val) {
        this.$emit("input", [val]);
      },
    },
    hProps() {
      return {
        label: "label",
        value: "value",
        children: "children",
        ...this.props,
      };
    },
  },
  watch: {
    multiple(val) {
      if (!val && this.value.length > 1) {
        this.$emit("input", []);
        this.$emit("change", []);
      }
    },
  },
  methods: {
    handleChange(val) {
      this.$emit("change", val);
    },
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
  },
};
</script>

<style lang="scss" scoped>
.h-search-condition {
  display: flex;
  .condition-component {
    flex: 1;
    &.advanced {
      overflow: hidden;
      height: 34px;
    }
  }
}
</style>

<style lang="scss">
.h-search-condition {
  .condition-component {
    .el-radio-group {
      .el-radio-button__inner {
        border: 0;
        border-radius: 4px;
      }
    }
  }
}
</style>
