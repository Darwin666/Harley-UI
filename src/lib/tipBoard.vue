<template>
  <div class="h-tip-board">
    <div class="tip-title">{{ title }}</div>
    <div class="tip-main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HTipBoard",
  props: {
    title: String,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";
.h-tip-board {
  background: #edf8ff;
  border-radius: 4px;
  padding: 20px 0;
  color: $--color-text-regular;
  .tip-title {
    margin: 0 30px;
    padding-bottom: 5px;
    font-size: 16px;
    font-weight: 550;
  }
  .tip-main {
    margin: 0 30px;
    line-height: 22px;
  }
}
</style>
