<template>
  <h-block class="operation-bar">
    <div v-if="hasTool" class="tool-bar">
      <div v-if="title" class="title">
        <div class="title-prefix"></div>
        <span class="title-text">{{ title }}</span>
      </div>
      <slot name="tool"></slot>
      <div v-if="buttonList && buttonList.length > 0" class="button-group">
        <template
          v-for="({ caption, icon, disabled, callback, action, type },
          index) in buttonList"
        >
          <h-button
            :key="index + caption"
            :action="action"
            :caption="caption"
            :icon="icon"
            :disabled="disabled"
            :type="type || 'primary'"
            @click="callback"
          ></h-button>
        </template>
      </div>
      <div v-if="linkList && linkList.length > 0" class="link-group">
        <template
          v-for="({ caption, icon, disabled, callback, action, type },
          index) in linkList"
        >
          <h-button
            :key="index + caption"
            :action="action"
            :caption="caption"
            :icon="icon"
            :disabled="disabled"
            :type="type || 'primary'"
            @click="callback"
          ></h-button>
        </template>
      </div>
    </div>
    <div class="container" :class="{ 'no-tool': !hasTool }">
      <slot></slot>
    </div>
  </h-block>
</template>

<script>
// import Vue from "vue";
// import { Button } from "element-ui";
// Vue.use(Button);
import HBlock from "@/harley-ui/block";
import HButton from "@/harley-ui/button";

export default {
  name: "HOperationBar",
  components: {
    HBlock,
    HButton
  },
  props: {
    title: String,
    buttonList: {
      type: Array,
      caption: [String, Number],
      icon: String,
      disabled: {
        type: Boolean,
        default: false
      },
      callback: {
        type: Function,
        required: true
      },
      action: {
        type: String,
        validator(value) {
          return ["add", "edit", "delete"].indexOf(value) !== -1;
        }
      }
    },
    linkList: {
      type: Array,
      caption: [String, Number],
      icon: String,
      disabled: {
        type: Boolean,
        default: false
      },
      callback: {
        type: Function,
        required: true
      },
      action: {
        type: String,
        validator(value) {
          return ["export", "print"].indexOf(value) !== -1;
        }
      }
    }
  },
  computed: {
    hasTool() {
      return (
        !!this.title ||
        !!this.$slots.tool ||
        (!!this.buttonList && this.buttonList.length > 0) ||
        (!!this.linkList && this.linkList.length > 0)
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.operation-bar {
  height: 100%;
  display: flex;
  flex-direction: column;
  .tool-bar {
    min-height: 30px;
    padding: 10px;
    overflow: hidden;
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
        background: #359fe5;
        vertical-align: middle;
      }
      .title-text {
        margin-left: 10px;
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
    padding: 0 10px 10px 10px;
    flex: 1;
    overflow: hidden;
    .el-table::before {
      height: 0;
    }
    &.no-tool {
      padding: 10px;
    }
  }
}
</style>
