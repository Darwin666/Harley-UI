<template>
  <div class="h-operation-bar">
    <div v-if="hasTool" class="tool-bar">
      <div v-if="title" class="title">
        <div class="title-prefix"></div>
        <span class="title-text">{{ title }}</span>
      </div>
      <slot name="tool"></slot>
      <div v-if="buttonList && buttonList.length > 0" class="button-group">
        <template
          v-for="(
            { caption, icon, disabled, callback, type, loading, auth }, index
          ) in buttonList"
        >
          <el-button
            :key="index + caption"
            v-auth="auth"
            @click="callback"
            :icon="icon"
            :disabled="disabled"
            :type="type || ''"
            :loading="loading"
            size="small"
          >
            {{ caption }}
          </el-button>
        </template>
      </div>
      <div v-if="linkList && linkList.length > 0" class="link-group">
        <template
          v-for="(
            { caption, icon, disabled, callback, type, loading, auth }, index
          ) in linkList"
        >
          <el-button
            :key="index + caption"
            v-auth="auth"
            @click="callback"
            :icon="icon"
            :disabled="disabled"
            :type="type || ''"
            :loading="loading"
            size="small"
          >
            {{ caption }}
          </el-button>
        </template>
      </div>
    </div>
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "HOperationBar",
  props: {
    title: String,
    buttonList: {
      type: Array,
      caption: [String, Number],
      icon: String,
      disabled: {
        type: Boolean,
        default: false,
      },
      callback: {
        type: Function,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    linkList: {
      type: Array,
      caption: [String, Number],
      icon: String,
      disabled: {
        type: Boolean,
        default: false,
      },
      callback: {
        type: Function,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
  },
  computed: {
    hasTool() {
      return (
        !!this.title ||
        !!this.$slots.tool ||
        (!!this.buttonList && this.buttonList.length > 0) ||
        (!!this.linkList && this.linkList.length > 0)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-operation-bar {
  .tool-bar {
    min-height: 30px;
    margin-bottom: 18px;
    .title {
      height: 30px;
      margin-right: 10px;
      position: relative;
      float: left;
      right: 10px;
      line-height: 29px;
      .title-prefix {
        width: 3px;
        height: 18px;
        margin-left: 10px;
        display: inline-block;
        background: $--color-primary;
        vertical-align: middle;
      }
      .title-text {
        margin-left: 24px;
        font-size: 18px;
        vertical-align: middle;
      }
    }
    .button-group {
      display: inline-block;
    }
    .link-group {
      float: right;
    }
  }
  .container {
    flex: 1;
    overflow: hidden;
  }
}
</style>

<style lang="scss">
.h-operation-bar {
  .container {
    .el-table::before {
      height: 0;
    }
  }
}
</style>
