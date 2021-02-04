<template>
  <h-block class="h-advanced-search">
    <el-form :label-width="labelWidth" inline size="medium">
      <div class="search-form">
        <div class="simple-search">
          <slot name="simple-search"></slot>
        </div>
        <div>
          <el-form-item class="search-tool">
            <el-button @click="advanced = !advanced" type="text">
              高级查询
              <i v-if="advanced" class="el-icon-arrow-down"></i>
              <i v-else class="el-icon-arrow-right"></i>
            </el-button>
          </el-form-item>
          <el-form-item class="search-tool">
            <el-button @click="onSearch" type="primary" size="medium">
              查询
            </el-button>
            <el-button @click="reset" type="info" size="medium">
              重置
            </el-button>
          </el-form-item>
        </div>
      </div>
      <div v-show="advanced" class="advanced-search">
        <slot name="advanced-search"></slot>
      </div>
    </el-form>
    <div v-if="conditions.length" class="search-conditions">
      检索条件：
      <el-tag
        v-for="{ key, value } in conditions"
        :key="key"
        @close="cancelCondition(key)"
        type="info"
        closable
      >
        {{ getConditionText(key, value) }}
      </el-tag>
    </div>
  </h-block>
</template>

<script>
export default {
  name: "HAdvancedSearch",
  props: {
    labelWidth: {
      type: String,
      default: "120px",
    },
    content: Function,
    getConditions: Function,
    getConditionText: Function,
  },
  data() {
    return {
      conditions: [],
      advanced: false,
    };
  },
  watch: {
    type() {
      this.advanced = false;
    },
    "$route.name"() {
      this.advanced = false;
      this.conditions = [];
    },
  },
  methods: {
    onSearch() {
      if (this.getConditions) {
        this.conditions = this.getConditions();
      }
      this.$emit("search");
    },
    reset() {
      this.conditions = [];
      this.$emit("reset");
    },
    cancelCondition(key) {
      let index = this.conditions.findIndex((item) => item.key === key);
      if (index > -1) {
        this.conditions.splice(index, 1);
        this.$emit("cancel-condition", key);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.h-advanced-search {
  .search-form {
    display: flex;
    justify-content: space-between;
    .simple-search {
      flex: 1;
    }
  }
}
</style>

<style lang="scss">
@import "~@/styles/element-ui.scss";

.h-advanced-search {
  &.h-block {
    padding: 14px 30px 24px;
  }
  .el-form {
    .el-form-item {
      margin-bottom: 0;
      margin-top: 10px;
    }
    .el-date-editor--daterange {
      width: 300px;
    }
    .el-input {
      width: 180px;
    }
  }
  .search-conditions {
    font-size: 14px;
    color: $--color-text-regular;
    .el-tag {
      height: 24px;
      margin-top: 10px;
      line-height: 22px;
      font-size: 12px;
      color: #798ba6;
      background: rgba(228, 231, 238, 0.4);
      border-radius: 4px;
      border: 1px solid #e4e7ee;
      .el-tag__close {
        opacity: 0.45;
      }
      & + .el-tag {
        margin-left: 10px;
      }
    }
  }
}
</style>
