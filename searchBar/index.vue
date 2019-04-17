<template>
  <h-block>
    <el-form
      :model="model"
      :label-width="labelWidth"
      :style="formStyle"
      inline
      class="searchForm"
    >
      <slot></slot>
      <el-form-item class="searchTool">
        <el-button type="primary" @click="$emit('search')">搜索</el-button>
        <el-button @click="$emit('reset')">重置</el-button>
      </el-form-item>
    </el-form>
  </h-block>
</template>

<script>
import HBlock from "@/harley-ui/block";
export default {
  name: "HSearchBar",
  props: {
    model: {
      type: Object,
      required: true
    },
    labelWidth: {
      type: String,
      default: "120px"
    },
    formStyle: String
  },
  components: {
    HBlock
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/index.scss";
.searchForm {
  margin-top: 10px;
  overflow: hidden;
}
.searchTool {
  float: right;
}
</style>
