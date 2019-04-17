<template>
  <div class="h-block">
    <div v-if="title" class="h-block-title">
      <div class="h-block-title-prefix">
        <slot name="title-prefix"></slot>
      </div>
      <span class="h-block-title-text">{{ title }}</span>
      <div class="h-block-title-suffix">
        <slot name="title-suffix"></slot>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "HBlock",
  props: {
    title: String
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.h-block {
  margin: 10px 10px 0 10px;
  background: #ffffff;
  border: $blockBorder;
  border-radius: $blockBorderRadius;
  box-shadow: $blockBoxShadow;
  .h-block-title {
    height: 36px;
    line-height: 36px;
    position: relative;
    .h-block-title-prefix {
      width: 3px;
      height: 18px;
      margin-left: 10px;
      display: inline-block;
      background: #359fe5;
      vertical-align: middle;
    }
    .h-block-title-text {
      margin-left: 10px;
      font-size: 18px;
      vertical-align: middle;
    }
    .h-block-title-suffix {
      position: absolute;
      top: 0;
      right: 10px;
    }
  }
}
</style>
