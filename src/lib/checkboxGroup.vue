<template>
  <el-checkbox-group
    v-model="hValue"
    @change="handleChange"
    :size="size"
    :disabled="disabled"
    :min="min"
    :max="max"
    :text-color="textColor"
    :fill="fill"
    :class="{ vertical: isVertical }"
    class="h-checkbox-group"
  >
    <template v-for="(item, index) in dataSource">
      <template
        v-if="twoStage && item[hProps.children] && item[hProps.children].length"
      >
        <el-popover
          :key="index"
          placement="bottom-start"
          trigger="hover"
          class="el-checkbox"
        >
          <el-checkbox-button
            v-if="type === 'button'"
            slot="reference"
            :label="item[hProps.value]"
            :true-label="item[hProps.trueLabel]"
            :false-label="item[hProps.falseLabel]"
            :disabled="item[hProps.disabled]"
            :name="item[hProps.name]"
          >
            {{ item[hProps.label] }}
          </el-checkbox-button>
          <el-checkbox
            v-else
            slot="reference"
            @change="(checked) => handleParentChange(checked, item)"
            :label="item[hProps.value]"
            :true-label="item[hProps.trueLabel]"
            :false-label="item[hProps.falseLabel]"
            :disabled="item[hProps.disabled]"
            :border="item[hProps.border] || border"
            :name="item[hProps.name]"
            :checked="item[hProps.checked]"
            :indeterminate="getIndeterminate(index)"
          >
            {{ item[hProps.label] }}
          </el-checkbox>
          <h-checkbox-group
            v-model="hValue"
            @change="(val) => handleChildChange(val, item)"
            :data-source="item[hProps.children]"
            :border="border"
            :disabled="disabled"
            :fill="fill"
            :size="size"
            :text-color="textColor"
            :type="type"
            :vertical="vertical"
            :props="props"
          >
            {{ item[hProps.label] }}
          </h-checkbox-group>
        </el-popover>
      </template>
      <template v-else>
        <el-checkbox-button
          v-if="type === 'button'"
          :key="index"
          :label="item[hProps.value]"
          :true-label="item[hProps.trueLabel]"
          :false-label="item[hProps.falseLabel]"
          :disabled="item[hProps.disabled]"
          :name="item[hProps.name]"
        >
          {{ item[hProps.label] }}
        </el-checkbox-button>
        <el-checkbox
          v-else
          :key="index"
          :label="item[hProps.value]"
          :true-label="item[hProps.trueLabel]"
          :false-label="item[hProps.falseLabel]"
          :disabled="item[hProps.disabled]"
          :border="item[hProps.border] || border"
          :name="item[hProps.name]"
          :checked="item[hProps.checked]"
        >
          {{ item[hProps.label] }}
        </el-checkbox>
      </template>
    </template>
  </el-checkbox-group>
</template>

<script>
export default {
  name: "HCheckboxGroup",
  props: {
    border: Boolean,
    dataSource: {
      type: Array,
      label: [String, Number],
      value: [String, Number, Boolean],
      disabled: {
        type: Boolean,
        default: false,
      },
      border: {
        type: Boolean,
        default: false,
      },
      trueLabel: [String, Number],
      falseLabel: [String, Number],
      name: String,
      checked: {
        type: Boolean,
        default: false,
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fill: String,
    max: Number,
    min: Number,
    size: {
      type: String,
      validator(value) {
        return ["medium", "small", "mini"].indexOf(value) !== -1;
      },
    },
    textColor: String,
    type: {
      type: String,
      default: "normal",
      validator(value) {
        return ["normal", "button"].indexOf(value) !== -1;
      },
    },
    value: {
      type: Array,
      required: true,
      default() {
        return [];
      },
    },
    vertical: {
      type: Boolean,
      default: false,
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
  computed: {
    hValue: {
      get() {
        return this.value || [];
      },
      set(value = []) {
        this.$emit("input", value);
      },
    },
    isVertical() {
      return this.vertical && this.type === "normal";
    },
    hProps() {
      return {
        label: "label",
        value: "value",
        disabled: "disabled",
        border: "border",
        size: "size",
        name: "name",
        trueLabel: "trueLabel",
        checked: "checked",
        falseLabel: "falseLabel",
        indeterminate: "indeterminate",
        children: "children",
        ...this.props,
      };
    },
  },
  methods: {
    handleChange(value) {
      if (!this.twoStage) {
        this.$emit("change", value);
      }
    },
    handleParentChange(checked, data) {
      let values = [...this.hValue];
      let valueKey = this.hProps.value;
      let value = data[valueKey];
      let index = values.indexOf(value);
      if (checked) {
        if (index === -1) {
          values.push(value);
        }
        data[this.hProps.children].forEach((item) => {
          let subValue = item[valueKey];
          if (!values.includes(subValue)) {
            values.push(subValue);
          }
        });
      } else {
        if (index > -1) {
          values.splice(index, 1);
        }
        data[this.hProps.children].forEach((item) => {
          let subIndex = values.indexOf(item[valueKey]);
          if (subIndex > -1) {
            values.splice(subIndex, 1);
          }
        });
      }
      this.hValue = values;
      this.$emit("change", values);
    },
    handleChildChange(values, data) {
      let children = data[this.hProps.children];
      let valueKey = this.hProps.value;
      let value = data[valueKey];
      let index = values.indexOf(value);
      let preChecked = index > -1;
      let checked =
        children.findIndex((item) => !values.includes(item[valueKey])) === -1;
      if (!preChecked && checked) {
        values.push(value);
      } else if (preChecked && !checked) {
        values.splice(index, 1);
      }
      this.hValue = values;
      this.$emit("change", values);
    },
    getIndeterminate(index) {
      let data = this.dataSource[index];
      let subValues = [];
      let children = data[this.hProps.children];
      this.hValue.forEach((value) => {
        let index = children.findIndex(
          (item) => item[this.hProps.value] === value
        );
        if (index > -1) {
          subValues.push(value);
        }
      });
      return subValues.length !== 0 && subValues.length !== children.length;
    },
  },
};
</script>

<style lang="scss" scoped>
.h-checkbox-group {
  height: 40px;
  line-height: 40px;
  display: inline-block;
}
.vertical {
  display: inline-block;
  flex-direction: column;
  width: fit-content;
  label {
    display: block;
    margin-left: 0 !important;
    & + label {
      margin-top: 10px;
    }
  }
}
</style>

<style lang="scss">
.h-checkbox-group {
  .el-checkbox-button {
    & + .el-checkbox-button {
      margin-left: 8px;
    }
    .el-checkbox-button__inner {
      border: 0;
      border-radius: 4px;
    }
    &.is-checked {
      .el-checkbox-button__inner {
        box-shadow: unset;
      }
    }
  }
}
</style>
