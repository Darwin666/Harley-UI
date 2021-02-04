<template>
  <el-input
    v-model="plateEnd"
    @clear="onInputClear"
    :maxlength="7"
    clearable
    :placeholder="placeholder"
    :validate-event="false"
    class="h-car-plate-editor"
  >
    <template slot="prepend">
      <el-popover
        ref="popover"
        v-model="visible"
        @show="onShowPopover"
        @hide="onHidePopover"
        trigger="click"
        placement="bottom-start"
        :disabled="hDisabled"
      >
        <div slot="reference" class="plate-start-area">
          {{ plateStartStr }}
          <i
            class="el-icon-caret-bottom"
            :class="{ 'is-reverse': showStatus }"
          />
        </div>
        <div
          v-for="(row, index) in plateStartList"
          :key="index"
          class="plate-start-row"
        >
          <div
            v-for="item in row"
            :key="item"
            @click="onItemClick(item)"
            class="plate-start-item"
            :class="{ selected: plateStart === item }"
          >
            {{ item }}
          </div>
        </div>
      </el-popover>
    </template>
  </el-input>
</template>

<script>
import { plateStartList } from "./const";

export default {
  name: "HCarPlateEditor",
  inject: {
    elForm: {
      default: "",
    },
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    placeholder: String,
  },
  data() {
    return {
      plateStart: "",
      plateStartList: plateStartList,
      plateEnd: "",
      visible: false,
      showStatus: false,
    };
  },
  computed: {
    hValue: {
      get() {
        return this.value;
      },
      set(val) {
        val = (val || "").toUpperCase();
        this.$emit("input", val);
        this.$emit("change", val);
        if (val) {
          let { result } = this.validate();
          if (result && this.$parent.$options.componentName === "ElFormItem") {
            this.$parent.$emit("el.form.change", val);
          }
        }
      },
    },
    plateStartStr() {
      return this.plateStart || "省";
    },
    hDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
  },
  watch: {
    value() {
      this.analyzeValue();
    },
    plateStart(val) {
      this.hValue = `${val}${this.plateEnd}`;
    },
    plateEnd(val) {
      this.hValue = `${this.plateStart}${val}`;
    },
  },
  created() {
    this.analyzeValue();
  },
  methods: {
    analyzeValue() {
      let startStr = this.value.substr(0, 1);
      let index = 0;
      let startIndex = this.plateStartList.findIndex((row) =>
        row.includes(startStr)
      );
      if (startIndex > -1) {
        index = 1;
      } else {
        startStr = "";
      }
      this.plateStart = startStr;
      this.plateEnd = this.value.substring(index, this.value.length);
    },
    onShowPopover() {
      this.showStatus = true;
      this.$emit("visible-change", true);
    },
    onHidePopover() {
      this.showStatus = false;
      this.analyzeValue();
      this.$emit("visible-change", false);
    },
    onItemClick(plateStart) {
      this.plateStart = plateStart;
      this.visible = false;
    },
    onInputClear() {
      this.hValue = "";
    },
    validate() {
      let result = true;
      let message = "";
      if (!this.plateStart) {
        result = false;
        message = "请选择车牌开头";
      } else if (!/^[A-Z0-9\u4e00-\u9fa5]{6,7}$/.test(this.plateEnd)) {
        result = false;
        message = "请输入正确的车牌号";
      }
      return { result, message };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-car-plate-editor {
  .plate-start-area {
    cursor: pointer;
    width: 70px;
    text-align: center;
    color: $--color-white;
    .el-icon-caret-bottom {
      font-size: 12px;
      transition: transform 0.3s;
      transform: rotateZ(0);
      &.is-reverse {
        transform: rotateZ(-180deg);
      }
    }
  }
}
</style>

<style lang="scss">
@import "~@/styles/element-ui.scss";

.h-car-plate-editor {
  .el-input-group__prepend {
    padding: 0;
    background: $--background-info;
  }
}
.el-form-item {
  &.is-error {
    .h-car-plate-editor {
      .el-input-group__prepend {
        border: 1px solid $--color-warning;
        border-right: 0;
      }
      .el-input__inner {
        border-left: 0;
      }
    }
  }
}
.plate-start-row {
  & + .plate-start-row {
    margin-top: 10px;
  }
  .plate-start-item {
    height: 34px;
    line-height: 32px;
    padding: 0 10px;
    display: inline-block;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    border: 1px solid $--border-color-base;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      color: $--color-primary;
      border-color: $--color-primary;
    }
    &.selected {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      background: $--color-primary;
      color: $--color-white;
      border-color: $--color-primary;
      &:hover {
        color: $--color-white;
      }
    }
    & + .plate-start-item {
      margin-left: 10px;
    }
  }
}
</style>
