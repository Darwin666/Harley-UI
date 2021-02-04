<template>
  <el-radio-group
    v-model="hValue"
    :size="size"
    :disabled="hDisabled"
    :text-color="textColor"
    :fill="fill"
    class="h-radio-group"
  >
    <template v-for="(item, index) in dataSource">
      <template
        v-if="twoStage && item[hProps.children] && item[hProps.children].length"
      >
        <el-popover :key="index" placement="bottom-start" trigger="hover">
          <el-radio-button
            v-if="type === 'button' || type === 'textButton'"
            slot="reference"
            @click.native.prevent="
              handleClick(item[hProps.value], item[hProps.disabled])
            "
            :label="item[hProps.value]"
            :disabled="item[hProps.disabled]"
            :name="item[hProps.name]"
            :class="{
              indeterminate: item[hProps.children].find(
                (item) => item[hProps.value] === hValue
              ),
              'text-button': type === 'textButton',
            }"
          >
            {{ item[hProps.label] }}
          </el-radio-button>
          <el-radio
            v-else
            slot="reference"
            :key="index"
            @click.native.prevent="
              handleClick(item[hProps.value], item[hProps.disabled])
            "
            :label="item[hProps.value]"
            :disabled="item[hProps.disabled]"
            :border="item[hProps.border] || border"
            :size="item[hProps.size]"
            :name="item[hProps.name]"
            :class="{ vertical }"
          >
            {{ item[hProps.label] }}
          </el-radio>
          <h-radio-group
            v-model="hValue"
            :data-source="item[hProps.children]"
            :border="border"
            :disabled="disabled"
            :fill="fill"
            :size="size"
            :text-color="textColor"
            :type="type"
            :vertical="vertical"
            :props="props"
            :two-stage="twoStage"
            class="h-radio-group-two-stage"
          >
            {{ item[hProps.label] }}
          </h-radio-group>
        </el-popover>
      </template>
      <template v-else>
        <el-radio-button
          v-if="type === 'button' || type === 'textButton'"
          :key="index"
          @click.native.prevent="
            handleClick(item[hProps.value]), item[hProps.disabled]
          "
          :label="item[hProps.value]"
          :disabled="item[hProps.disabled]"
          :name="item[hProps.name]"
          :class="{ 'text-button': type === 'textButton' }"
        >
          {{ item[hProps.label] }}
        </el-radio-button>
        <el-radio
          v-else
          :key="index"
          @click.native.prevent="
            handleClick(item[hProps.value]), item[hProps.disabled]
          "
          :label="item[hProps.value]"
          :disabled="item[hProps.disabled]"
          :border="item[hProps.border] || border"
          :size="item[hProps.size]"
          :name="item[hProps.name]"
          :class="{ vertical }"
        >
          {{ item[hProps.label] }}
        </el-radio>
      </template>
    </template>
  </el-radio-group>
</template>

<script>
export default {
  name: "HRadioGroup",
  inject: {
    elForm: {
      default: "",
    },
  },
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
      size: {
        type: String,
        validator(value) {
          return ["medium", "small", "mini"].indexOf(value) !== -1;
        },
      },
      name: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    fill: String,
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
        return ["normal", "button", "textButton"].indexOf(value) !== -1;
      },
    },
    value: {
      type: [String, Number, Boolean],
    },
    vertical: Boolean,
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
    clearable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hValue: {
      get() {
        return this.value;
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
        border: "border",
        size: "size",
        name: "name",
        children: "children",
        ...this.props,
      };
    },
    hDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
  },
  methods: {
    handleClick(value, disabled) {
      if (this.hDisabled || disabled) {
        return;
      }
      let oldValue = this.hValue;
      let newValue = this.clearable && this.hValue === value ? "" : value;
      this.hValue = newValue;
      if (oldValue !== newValue) {
        this.$emit("change", newValue);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.h-radio-group {
  user-select: none;
  &.el-radio-group {
    vertical-align: unset;
  }
}
.vertical {
  display: block;
  margin-left: 0 !important;
  & + .vertical {
    margin-top: 10px;
  }
}
</style>

<style lang="scss">
@import "~@/styles/element-ui.scss";

.h-radio-group {
  .el-radio-button {
    & + .el-radio-button {
      margin-left: 8px;
    }
    &.text-button {
      & + .text-button {
        margin-left: 0;
      }
      .el-radio-button__inner {
        color: $--color-text-regular;
        background: unset;
        transition: unset;
        &:hover {
          background: unset;
          color: $--color-text-secondary;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
      &.is-active {
        .el-radio-button__inner {
          color: $--color-white;
          background: $--background-primary;
          transition: unset;
        }
      }
    }
    .el-radio-button__inner {
      vertical-align: unset;
      border-radius: 4px;
      border: 0;
    }
    .el-radio-button__orig-radio:checked {
      & + .el-radio-button__inner {
        box-shadow: unset;
      }
    }
  }
  label:focus {
    box-shadow: unset !important;
    .el-radio__inner {
      box-shadow: unset !important;
    }
  }
}
.h-radio-group-two-stage {
  &.el-radio-group {
    .el-radio-button__inner {
      border: 0;
      border-radius: 4px;
    }
  }
}
</style>
