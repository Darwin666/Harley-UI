<template>
  <div class="h-block">
    <div v-if="title" class="h-block-title">
      <div class="h-block-title-area">
        <div class="h-block-title-line"></div>
        <i v-if="icon" :class="icon" class="h-block-title-icon"></i>
        {{ title }}
      </div>
      <slot name="title-append"></slot>
    </div>
    <div class="h-block-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HBlock",
  props: {
    title: String,
    icon: String,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-block {
  padding: 32px;
  border-radius: 4px;
  background: #fff;
  &.flex-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    .h-block-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
  & + .h-block {
    margin-top: 15px;
  }
  .h-block-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .h-block-title-area {
      display: flex;
      align-items: center;
      font-size: 20px;
      font-weight: 550;
      .h-block-title-line {
        width: 5px;
        height: 20px;
        margin-right: 10px;
        display: inline-block;
        background: $--color-primary;
      }
      .h-block-title-icon {
        font-size: 20px;
        margin-right: 10px;
      }
    }
    & + .h-block-content {
      padding: 32px 0 0;
    }
  }
}
</style>

<style lang="scss">
.h-block {
  .h-block {
    padding: 12px;
  }
}
</style>
