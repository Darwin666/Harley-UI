<template>
  <div class="h-car-plate-color-radio">
    <div>
      <template v-for="item in colorListFirst">
        <div
          :key="item.label"
          @click="hValue = item.label"
          :class="`${item.class} ${hValue === item.label ? 'selected' : ''}`"
          class="color-item"
        >
          <template>{{ item.label }}</template>
        </div>
      </template>
    </div>
    <div>
      <template v-for="item in colorListSecond">
        <div
          :key="item.label"
          @click="hValue = item.label"
          :class="`${item.class} ${hValue === item.label ? 'selected' : ''}`"
          class="color-item"
        >
          <template>{{ item.label }}</template>
        </div>
      </template>
    </div>
    <div>
      <template v-for="item in colorListThird">
        <div
          :key="item.label"
          @click="hValue = item.label"
          :class="`${item.class} ${hValue === item.label ? 'selected' : ''}`"
          class="color-item"
        >
          <template>{{ item.label }}</template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "HCarPlateColorRadio",
  props: {
    value: String,
  },
  data() {
    return {
      colorListFirst: [
        { label: "蓝色", class: "color-blue" },
        { label: "绿色", class: "color-green" },
        { label: "其他", class: "color-other" },
      ],
      colorListSecond: [
        { label: "黄色", class: "color-yellow" },
        { label: "黄绿色", class: "color-yellow-green" },
      ],
      colorListThird: [
        { label: "黑色", class: "color-black" },
        { label: "白色", class: "color-white" },
      ],
    };
  },
  computed: {
    hValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
        this.$emit("change", val);
        if (this.$parent.$options.componentName === "ElFormItem") {
          this.$parent.$emit("el.form.change", val);
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-car-plate-color-radio {
  display: flex;
  user-select: none;
  .color-item {
    width: 152px;
    line-height: 64px;
    text-align: center;
    cursor: pointer;
    border: 1px solid transparent;
    vertical-align: middle;
    color: #2c2c2c;
    &:hover {
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    &.selected {
      border: 1px solid $--color-primary;
      box-shadow: 1px 4px 14px 0px rgba(0, 0, 0, 0.13);
      border-radius: 2px;
    }
    &.color-blue {
      background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/blue.png");
      background-repeat: no-repeat;
      background-position: center;
      color: $--color-white;
    }
    &.color-yellow {
      background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/yellow.png");
      background-repeat: no-repeat;
      background-position: center;
    }
    &.color-black {
      background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/black.png");
      background-repeat: no-repeat;
      background-position: center;
      color: $--color-white;
    }
    &.color-green {
      background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/green.png");
      background-repeat: no-repeat;
      background-position: center;
      color: $--color-white;
    }
    &.color-yellow-green {
      background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/greenYellow.png");
      background-repeat: no-repeat;
      background-position: center;
    }
    &.color-white {
      background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/white.png");
      background-repeat: no-repeat;
      background-position: center;
    }
    &.color-other {
      background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/other.png");
      background-repeat: no-repeat;
      background-position: center;
      color: $--color-white;
    }
  }
}
</style>
