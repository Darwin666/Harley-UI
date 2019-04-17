<template>
  <div class="h-tabs-container" :class="{ 'h-tabs-container_mini': isMini }">
    <el-tabs
      ref="tabs"
      v-model="hValue"
      :type="type"
      :stretch="stretch"
      :before-leave="beforeLeave"
      class="h-tabs"
      @tab-click="handleTabClick"
    >
      <slot></slot>
    </el-tabs>
    <div
      v-if="showArrow"
      class="h-tabs-arrow"
      :style="{ left: leftOffset + 'px' }"
    >
      <span class="bot"></span>
      <span class="top"></span>
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
// import { Tabs } from "element-ui";
// Vue.use(Tabs);
export default {
  name: "HTabs",
  data() {
    return {
      leftOffset: 0
    };
  },
  props: {
    value: String,
    type: {
      type: String,
      default: "card",
      validator(value) {
        return ["card", "border-card"].indexOf(value) !== -1;
      }
    },
    size: {
      type: String,
      default: "normal",
      validator(value) {
        return ["normal", "mini"].indexOf(value) !== -1;
      }
    },
    showArrow: {
      type: Boolean,
      default: false
    },
    stretch: {
      type: Boolean,
      default: false
    },
    beforeLeave: Function
  },
  mounted() {
    this.$nextTick(() => {
      this.resetArrowPosition();
    });
  },
  computed: {
    hValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    isMini() {
      return this.size === "mini";
    }
  },
  methods: {
    handleTabClick(tab) {
      this.resetArrowPosition(tab.index);
      this.$emit("tab-click", tab);
    },
    resetArrowPosition(curentIndex = 0) {
      let tabs = this.$refs.tabs.$refs.nav.$refs.tabs || [];
      let totalWidth = 0;
      let offset = 0;
      for (let i = 0; i < tabs.length && i <= curentIndex; i++) {
        let tab = tabs[i];
        totalWidth += tab.clientWidth;
        offset = tab.clientWidth / 2 + 10;
      }
      totalWidth += 10 * curentIndex;
      this.leftOffset = totalWidth - offset;
    }
  }
};
</script>
<style lang="scss" scoped>
.h-tabs-container {
  position: relative;
  .h-tabs-arrow {
    position: absolute;
    top: 40px;
    z-index: 10;
    span {
      width: 0;
      height: 0;
      font-size: 0;
      overflow: hidden;
      position: absolute;
      border-style: dashed dashed solid;
    }
    span.bot {
      top: 0;
      border-color: transparent transparent #d9e2e8;
      border-width: 0 8px 8px;
    }
    span.top {
      top: 2px;
      border-color: transparent transparent #ffffff;
      border-width: 0 8px 8px;
    }
  }
  &.h-tabs-container_mini {
    .h-tabs-arrow {
      top: 32px;
    }
  }
}
</style>

<style lang="scss">
@import "@/styles/index.scss";
.h-tabs-container {
  .h-tabs {
    &.el-tabs--card,
    &.el-tabs--border-card {
      & > .el-tabs__header {
        height: 38px;
        margin-bottom: 0;
        border: 0;
        .el-tabs__nav {
          border: 0;
        }
        .el-tabs__item {
          height: 38px;
          line-height: 38px;
          border: 0;
          color: #ffffff;
          background: #359fe5;
          :hover {
            color: #ffffff;
          }
          &.is-active {
            background: #0474be;
          }
          & + .el-tabs__item {
            margin-left: 10px;
          }
        }
      }
      & > .el-tabs__content {
        .el-tab-pane {
          margin: 10px 0;
          & > .h-block {
            margin: 0;
          }
        }
      }
    }
    &.el-tabs--border-card {
      border: 0;
      background: transparent;
      box-shadow: none;
      & > .el-tabs__header {
        background: transparent;
      }
      & > .el-tabs__content {
        padding: 0;
        .el-tab-pane {
          background: #ffffff;
          border: $blockBorder;
          border-radius: $blockBorderRadius;
          box-shadow: $blockBoxShadow;
          & > .h-block {
            border: 0;
            box-shadow: none;
          }
        }
      }
    }
  }
  &.h-tabs-container_mini {
    .h-tabs {
      &.el-tabs--card,
      &.el-tabs--border-card {
        & > .el-tabs__header {
          height: 30px;
          .el-tabs__item {
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
  }
}
</style>
