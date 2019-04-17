<template>
  <el-breadcrumb separator="/" class="app-breadcrumb">
    <template v-for="({ name, path }, index) in dataSource">
      <el-breadcrumb-item
        v-if="index < dataSource.length - 1 && path"
        :to="{ path }"
        :key="name"
        >{{ name }}</el-breadcrumb-item
      >
      <el-breadcrumb-item v-else :key="name">{{ name }}</el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script>
// import Vue from "vue";
// import { Breadcrumb, BreadcrumbItem } from "element-ui";
// Vue.use(Breadcrumb);
// Vue.use(BreadcrumbItem);

export default {
  name: "HBreadcrumb",
  props: {
    dataSource: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  font-size: 14px;
  line-height: 50px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
