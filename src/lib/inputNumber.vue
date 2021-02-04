<template>
  <div class="h-input-number">
    <el-input-number
      ref="input"
      v-model="hValue"
      @input.native="onInput"
      :min="min"
      :max="max"
      :step="step"
      :step-strictly="stepStrictly"
      :precision="precision"
      :size="size"
      :disabled="disabled"
      :controls="controls"
      :controls-position="controlsPosition"
      :name="name"
      :label="label"
      :placeholder="placeholder"
    ></el-input-number>
    <span
      v-if="unit"
      class="number-unit"
      :style="{ 'line-height': unitLineHeight }"
    >
      {{ unit }}
    </span>
  </div>
</template>

<script>
export default {
  name: "HInputNumber",
  props: {
    value: [Number, String],
    unit: String,
    min: Number,
    max: Number,
    step: Number,
    stepStrictly: {
      type: Boolean,
      default: false,
    },
    precision: Number,
    size: {
      type: String,
      validator(value) {
        return ["large", "small"].indexOf(value) !== -1;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    controlsPosition: {
      type: String,
      default: "right",
      validator(value) {
        return ["right"].indexOf(value) !== -1;
      },
    },
    name: String,
    label: String,
    placeholder: String,
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
    unitLineHeight() {
      let lineHeight = "";
      switch (this.size) {
        case "medium":
          lineHeight = "36px";
          break;
        case "small":
          lineHeight = "32px";
          break;
        case "mini":
          lineHeight = "26px";
          break;
      }
      return lineHeight;
    },
  },
  methods: {
    onInput(e) {
      let val = e.target.value;
      if (typeof this.precision === "number") {
        let arr = (val + "").split(".");
        if (arr.length > 1 && arr[1].length > this.precision) {
          this.hValue = arr[0] + "." + arr[1].substr(0, 2);
        }
      }
    },
    focus() {
      this.$refs.input.focus();
    },
  },
};
</script>

<style lang="scss" scoped>
.h-input-number {
  display: flex;
  .el-input-number {
    height: fit-content;
    flex: 1;
  }
  .number-unit {
    margin: 0 10px;
    line-height: inherit;
  }
}
</style>

<style lang="scss">
.h-input-number {
  .el-input-number {
    &.is-controls-right {
      span {
        right: 1px !important;
        background: #f5f7fa;
        color: #606266 !important;
        border-radius: 0 4px 0 0 !important;
        border-left: 1px solid #dcdfe6 !important;
        border-left: 1px solid #dcdfe6 !important;
      }
      .el-input-number__increase {
        border-bottom: 1px solid #dcdfe6 !important;
      }
    }
  }
}
</style>
