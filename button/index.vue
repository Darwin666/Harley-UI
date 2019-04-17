<template>
  <el-button
    class="h-button"
    :type="type"
    :icon="hIcon"
    :disabled="disabled"
    @click="$emit('click')"
    ><img
      v-if="hasImg"
      class="h-button-img"
      :src="require(`@/assets/harley/${action}.png`)"
    /><span class="h-button-caption">{{ hCaption }}</span></el-button
  >
</template>

<script>
export default {
  name: "HButton",
  props: {
    action: {
      type: String,
      validator(value) {
        return (
          ["add", "edit", "delete", "export", "print"].indexOf(value) !== -1
        );
      }
    },
    type: {
      type: String,
      default: "primary"
    },
    caption: String,
    icon: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hCaption: "",
      hIcon: ""
    };
  },
  created() {
    switch (this.action) {
      case "add":
        this.hCaption = "新增";
        this.hIcon = "el-icon-plus";
        break;
      case "edit":
        this.hCaption = "修改";
        this.hIcon = "el-icon-edit";
        break;
      case "delete":
        this.hCaption = "删除";
        this.hIcon = "el-icon-delete";
        break;
      case "export":
        this.hCaption = "导出";
        this.hIcon = "";
        break;
      case "print":
        this.hCaption = "打印";
        this.hIcon = "";
        break;
      default:
        this.hCaption = this.caption;
        this.hIcon = this.icon;
        break;
    }
  },
  computed: {
    hasImg() {
      return this.action === "export" || this.action === "print";
    }
  }
};
</script>
<style lang="scss" scoped>
.h-button {
  padding: 4px 25px;
  .h-button-img {
    vertical-align: middle;
  }
  .h-button-caption {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    vertical-align: middle;
    margin-left: 5px;
  }
}
</style>
