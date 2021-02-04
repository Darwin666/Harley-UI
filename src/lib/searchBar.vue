<template>
  <div class="h-search-bar">
    <el-form
      @submit.native="$emit('search')"
      :model="model"
      :style="formStyle"
      inline
      size="small"
    >
      <slot></slot>
      <div class="el-form-item button-area">
        <el-button @click="$emit('search')" type="primary" size="small">
          查询
        </el-button>
        <el-button @click="$emit('reset')" type="primary" size="small">
          重置
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "HSearchBar",
  props: {
    model: {
      type: Object,
      required: false,
    },
    formStyle: String,
  },
};
</script>

<style lang="scss" scoped>
.h-search-bar {
  overflow: hidden;
  .el-form {
    .button-area {
      margin-right: 0;
      float: right;
      vertical-align: bottom;
    }
  }
}
</style>

<style lang="scss">
.h-search-bar {
  .el-form {
    .el-form-item {
      margin-right: 30px;
      .el-form-item__label {
        width: fit-content !important;
      }
      .el-date-editor--daterange {
        width: 300px;
      }
    }
  }
}
</style>
