<template>
  <el-radio-group
    v-model="hValue"
    :size="size"
    :disabled="disabled"
    :text-color="textColor"
    :fill="fill"
    @change="handleChange"
  >
    <template v-for="(item, index) in dataSource">
      <el-radio-button
        v-if="type === 'button'"
        :key="index"
        :label="item[hProps.value]"
        :disabled="item[hProps.disabled]"
        :name="item[hProps.name]"
        >{{ item[hProps.label] }}</el-radio-button
      >
      <el-radio
        v-else
        :key="index"
        :label="item[hProps.value]"
        :disabled="item[hProps.disabled]"
        :border="item[hProps.border] || border"
        :size="item[hProps.size]"
        :name="item[hProps.name]"
        :class="{ vertical }"
        >{{ item[hProps.label] }}</el-radio
      >
    </template>
  </el-radio-group>
</template>

<script>
// import Vue from "vue";
// import { Radio, RadioGroup, RadioButton } from "element-ui";
// Vue.use(Radio);
// Vue.use(RadioGroup);
// Vue.use(RadioButton);

export default {
  name: "HRadioGroup",
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
      size: {
        type: String,
        validator(value) {
          return ["medium", "small", "mini"].indexOf(value) !== -1;
        }
      },
      name: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    fill: String,
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
      type: [String, Number, Boolean],
      required: true
    },
    vertical: Boolean,
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
    hProps() {
      return {
        label: "label",
        value: "value",
        disabled: "disabled",
        border: "border",
        size: "size",
        name: "name",
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
.vertical {
  display: block;
  margin-left: 0 !important;
  & + .vertical {
    margin-top: 10px;
  }
}
</style>
