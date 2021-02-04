<template>
  <div class="h-panel">
    <div class="panel-title">
      <div class="title-content">
        {{ title }}
      </div>
      <slot name="title-append"></slot>
    </div>
    <div class="panel-main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HPanel",
  props: {
    title: String,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";
.h-panel {
  .panel-title {
    min-height: 45px;
    padding: 2px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px #eaeaed solid;
    .title-content {
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
    }
  }
  .panel-main {
    padding: 16px 0;
  }
}
</style>
