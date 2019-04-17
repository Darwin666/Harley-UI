<template>
  <el-checkbox-group
    v-model="hValue"
    :size="size"
    :disabled="disabled"
    :min="min"
    :max="max"
    :text-color="textColor"
    :fill="fill"
    :class="{ vertical: isVertical, 'h-checkbox-group': true }"
    @change="handleChange"
  >
    <template v-for="(item, index) in dataSource">
      <el-checkbox-button
        v-if="type === 'button'"
        :key="index"
        :label="item.value"
        :true-label="item.trueLabel"
        :false-label="item.falseLabel"
        :disabled="item.disabled"
        :name="item.name"
        >{{ item.label }}</el-checkbox-button
      >
      <el-checkbox
        v-else
        :key="index"
        :label="item.value"
        :true-label="item.trueLabel"
        :false-label="item.falseLabel"
        :disabled="item.disabled"
        :border="item.border || border"
        :size="item.size"
        :name="item.name"
        :checked="item.checked"
        :indeterminate="item.indeterminate"
        >{{ item.label }}</el-checkbox
      >
    </template>
  </el-checkbox-group>
</template>

<script>
// import Vue from "vue";
// import { Checkbox, CheckboxGroup, CheckboxButton } from "element-ui";
// Vue.use(Checkbox);
// Vue.use(CheckboxGroup);
// Vue.use(CheckboxButton);

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
        default: false
      },
      border: {
        type: Boolean,
        default: false
      },
      trueLabel: [String, Number],
      falseLabel: [String, Number],
      size: {
        type: String,
        validator(value) {
          return ["medium", "small", "mini"].indexOf(value) !== -1;
        }
      },
      name: String,
      checked: {
        type: Boolean,
        default: false
      },
      indeterminate: {
        type: Boolean,
        default: false
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fill: String,
    max: Number,
    min: Number,
    size: {
      type: String,
      validator(value) {
        return ["medium", "small", "mini"].indexOf(value) !== -1;
      }
    },
    textColor: String,
    type: {
      type: String,
      default: "normal",
      validator(value) {
        return ["normal", "button"].indexOf(value) !== -1;
      }
    },
    value: {
      type: Array,
      required: true
    },
    vertical: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default() {
        return {};
      }
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
        ...this.props
      };
    }
  },
  methods: {
    handleChange(value) {
      this.$emit("change", value);
    }
  }
};
</script>

<style lang="scss" scoped>
.h-checkbox-group {
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
