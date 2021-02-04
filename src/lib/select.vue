<template>
  <el-select
    ref="select"
    v-model="hValue"
    @blur="handleBlur"
    @change="handleChange"
    @clear="handleClear"
    @focus="handleFocus"
    @remove-tag="handleRemoveTag"
    @visible-change="handleVisibleChange"
    :allow-create="allowCreate"
    :autocomplete="autocomplete"
    :automatic-dropdown="automaticDropdown"
    :clearable="clearable"
    :collapse-tags="collapseTags"
    :default-first-option="defaultFirstOption"
    :disabled="disabled"
    :filter-method="filterMethod"
    :filterable="filterable"
    :loading="loading"
    :loading-text="loadingText"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :name="name"
    :no-match-text="noMatchText"
    :no-data-text="noDataText"
    :placeholder="placeholder"
    :popper-class="popperClass"
    :popper-append-to-body="popperAppendToBody"
    :remote="remote"
    :remote-method="remoteMethod"
    :reserve-keyword="reserveKeyword"
    :size="size"
    :value-key="valueKey"
  >
    <slot slot="prefix" name="prefix"></slot>
    <template v-for="(item, index) in dataSource">
      <el-option-group
        v-if="isGroup"
        :key="index"
        :label="item[hProps.label]"
        :disabled="item[hProps.disabled]"
      >
        <el-option
          v-for="(option, subIndex) in item[hProps.options]"
          :key="subIndex"
          :label="option[hProps.label]"
          :value="option[hProps.value]"
          :disabled="option[hProps.disabled]"
        ></el-option>
      </el-option-group>
      <el-option
        v-else
        :key="index"
        :label="item[hProps.label]"
        :value="item[hProps.value]"
        :disabled="item[hProps.disabled]"
      ></el-option>
    </template>
  </el-select>
</template>

<script>
export default {
  name: "HSelect",
  props: {
    allowCreate: {
      type: Boolean,
      default: false,
    },
    autocomplete: String,
    automaticDropdown: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: true,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    dataSource: Array,
    defaultFirstOption: {
      type: Boolean,
      default: false,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    filterMethod: Function,
    filterable: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: String,
    multiple: {
      type: Boolean,
      default: false,
    },
    multipleLimit: Number,
    name: String,
    noMatchText: String,
    noDataText: String,
    placeholder: String,
    popperClass: String,
    popperAppendToBody: {
      type: Boolean,
      default: true,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    remoteMethod: Function,
    reserveKeyword: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      validator(value) {
        return ["medium", "small", "mini"].indexOf(value) !== -1;
      },
    },
    value: {
      type: [String, Number, Array, Boolean],
    },
    valueKey: String,
    props: {
      type: Object,
      default() {
        return {};
      },
    },
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
      },
    },
    hProps() {
      return {
        label: "label",
        value: "value",
        disabled: "disabled",
        options: "options",
        ...this.props,
      };
    },
  },
  methods: {
    checkValueExisting(value) {
      if (this.dataSource instanceof Array) {
        let index = this.dataSource.findIndex(
          (item) => item[this.hProps.value] === value,
          this
        );
        return index > -1;
      }
      return false;
    },
    handleBlur(event) {
      this.$emit("blur", event);
    },
    handleChange(value) {
      this.$emit("change", value);
    },
    handleClear() {
      this.$emit("clear");
    },
    handleFocus(event) {
      this.$emit("focus", event);
    },
    handleRemoveTag(tag) {
      this.$emit("remove-tag", tag);
    },
    handleVisibleChange(visible) {
      this.$emit("visible-change", visible);
    },
    focus() {
      this.$refs.select.focus();
    },
    blue() {
      this.$refs.select.blue();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select {
  width: 100%;
}
</style>
