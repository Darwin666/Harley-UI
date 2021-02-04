<template>
  <div class="h-sms-code-input">
    <el-input
      v-for="(item, index) in valueArr"
      :key="index"
      :ref="`input${index}`"
      v-model="valueArr[index]"
      @input="(val) => onInput(val, index)"
      @focus="onFocus"
      @keyup.left.native="doLeft(index)"
      @keyup.right.native="doRight(index)"
      @keyup.native="(event) => onKeyUp(event, index)"
      size="medium"
      :maxlength="1"
    ></el-input>
  </div>
</template>

<script>
export default {
  name: "HSmsCodeInput",
  props: {
    value: String,
  },
  data() {
    return {
      valueArr: [],
    };
  },
  watch: {
    value(val) {
      if (!val) {
        this.init();
      }
    },
    valueArr(val) {
      this.$emit("input", val.join(""));
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.valueArr = Array.from({ length: 6 }, () => "");
    },
    onInput(val, index) {
      val = val.replace(/[^\d]/g, "");
      this.$set(this.valueArr, index, val);
    },
    onKeyUp(event, index) {
      let keyCode = event.keyCode;
      if (
        (keyCode >= 48 && keyCode <= 57) ||
        (keyCode >= 96 && keyCode <= 105)
      ) {
        this.$nextTick(() => {
          if (this.valueArr[index]) {
            this.doRight(index);
          }
        });
      }
    },
    onFocus(event) {
      event.currentTarget.select();
    },
    doLeft(index) {
      if (index) {
        this.$refs[`input${index - 1}`][0].focus();
      }
    },
    doRight(index) {
      if (index < 5) {
        this.$refs[`input${index + 1}`][0].focus();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.h-sms-code-input {
  .el-input {
    width: 36px;
    height: 36px;
    & + .el-input {
      margin-left: 14px;
    }
  }
}
</style>

<style lang="scss">
@import "~@/styles/element-ui.scss";

.h-sms-code-input {
  .el-input {
    input {
      padding: 0;
      text-align: center;
      font-size: 18px;
      color: $--color-text-primary;
    }
  }
}
</style>
