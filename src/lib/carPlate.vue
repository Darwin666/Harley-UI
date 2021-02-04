<template>
  <div :class="colorClass" class="h-car-plate">
    <template>{{ no }}</template>
  </div>
</template>

<script>
export default {
  name: "HCarPlate",
  props: {
    color: String,
    no: String,
  },
  data() {
    return {
      colorList: [
        { label: "蓝色", class: "color-blue" },
        { label: "黄色", class: "color-yellow" },
        { label: "黑色", class: "color-black" },
        { label: "白色", class: "color-white" },
        { label: "绿色", class: "color-green" },
        { label: "黄绿色", class: "color-yellow-green" },
        { label: "其他", class: "color-other" },
      ],
    };
  },
  computed: {
    colorClass() {
      let color = this.colorList.find((item) => item.label === this.color);
      return color ? color.class : "";
    },
    plateStart() {
      return this.no.substr(0, 2);
    },
    plateEnd() {
      return this.no.substr(2, 6);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-car-plate {
  min-width: 98px;
  height: 34px;
  padding: 0 10px;
  display: inline-block;
  line-height: 34px;
  text-align: center;
  user-select: none;
  background-size: 100% 100%;
  font-size: 16px;
  color: #2c2c2c;
  &.color-blue {
    background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/blue.png");
    color: $--color-white;
  }
  &.color-yellow {
    background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/yellow.png");
  }
  &.color-black {
    background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/black.png");
    color: $--color-white;
  }
  &.color-white {
    background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/white.png");
  }
  &.color-green {
    background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/green.png");
    color: $--color-white;
  }
  &.color-yellow-green {
    background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/greenYellow.png");
  }
  &.color-other {
    background-image: url("https://95-static.oss-cn-beijing.aliyuncs.com/bladeX/web/common/carPlate/other.png");
    color: $--color-white;
  }
}
</style>
