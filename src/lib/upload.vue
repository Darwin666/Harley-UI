<template>
  <div class="h-upload">
    <el-upload
      v-if="uploadable || againUpload"
      :action="hAction"
      :headers="hHeaders"
      :multiple="multiple"
      :show-file-list="false"
      :accept="accept"
      :list-type="listType"
      :before-upload="handleBeforeUpload"
      :on-success="handleOnSuccess"
      :on-error="handleOnError"
      :disabled="hDisabled"
      :drag="drag"
      class="h-upload-content"
    >
      <slot></slot>
      <slot name="trigger"></slot>
      <span v-if="showTips" slot="tip" class="h-upload-tips">{{ tip }}</span>
    </el-upload>
    <template v-else-if="!fileList.length">无</template>
    <template v-if="showFileList">
      <div
        v-for="({ url, icon, name }, index) in fileList"
        :key="url"
        class="file-item"
        :class="{ 'is-disabled': hDisabled }"
      >
        <img v-oss :src="icon" />
        <span>{{ name }}</span>
        <i class="el-icon-circle-check" />
        <i @click="handleOnRemove(index)" class="el-icon-circle-close" />
        <span @click="download(url)" class="el-button el-button--text">
          下载
        </span>
      </div>
    </template>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { deepClone } from "@/util/util";

export default {
  name: "HUpload",
  inject: {
    elForm: {
      default: "",
    },
  },
  props: {
    value: [String, Array],
    drag: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
    },
    headers: {
      type: Object,
      default() {
        return {};
      },
    },
    multiple: Boolean,
    limit: {
      type: Number,
      default: 10,
    },
    showFileList: {
      type: Boolean,
      default: false,
    },
    accept: String,
    beforeUpload: Function,
    onSuccess: Function,
    onError: Function,
    onRemove: Function,
    listType: {
      type: String,
      validator(value) {
        return ["text", "picture", "picture-card"].indexOf(value) !== -1;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showLoading: {
      type: Boolean,
      default: false,
    },
    againUpload: {
      type: Boolean,
      default: false,
    },
    tip: String,
  },
  data() {
    return {
      loading: null,
    };
  },
  computed: {
    hAction() {
      return this.action || this.$harleyAction;
    },
    hHeaders() {
      let {clientId, clientSecret, tokenHeader} = this.$harleyWebsite;
      let {tenantId, token} = this.$harleyStore.getters;
      let headers = {
        Authorization: `Basic ${Base64.encode(
          `${clientId}:${clientSecret}`
        )}`,
        "Tenant-Id": tenantId,
        "User-Type": "web",
        ...this.headers,
      };
      headers[tokenHeader] = "bearer " + token;
      return headers;
    },
    hDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    uploadable() {
      return (
        !this.hDisabled &&
        ((!this.multiple && !this.value) ||
          (this.multiple && this.value.length < this.limit))
      );
    },
    showTips() {
      return this.tip && this.uploadable;
    },
    fileList() {
      let list = [];
      if (this.multiple) {
        list = [...this.value];
      } else if (this.value) {
        list = [this.value];
      }
      const u = list.filter((l) => l);
      return Array.from(u, (url) => {
        return this.getFile(url);
      });
    },
  },
  watch: {
    value(val) {
      if (this.$parent.$options.componentName === "ElFormItem") {
        this.$parent.$emit("el.form.change", val);
      }
    },
  },
  methods: {
    handleBeforeUpload(file) {
      let result = true;
      if (this.beforeUpload) {
        result = this.beforeUpload(file);
        if (result === false) {
          return false;
        }
      }
      if (this.showLoading) {
        this.loading = this.$loading({
          lock: true,
          text: "正在上传",
          spinner: "el-icon-loading",
        });
      }
      if (result !== true) {
        return Promise.resolve(result);
      }
    },
    handleOnSuccess(response, file) {
      if (this.showLoading && this.loading) {
        this.loading.close();
        this.loading = null;
      }
      let value = response.data.link;
      if (this.multiple && this.value) {
        value = [...this.value, value];
      }
      this.$emit("input", value);
      if (this.onSuccess) {
        this.$nextTick(() => {
          this.onSuccess(response, file, this.fileList);
        });
      }
    },
    handleOnError(err, file, fileList) {
      this.$message.error("系统错误，请稍后重试。");
      if (this.showLoading && this.loading) {
        this.loading.close();
        this.loading = null;
      }
      if (this.onError) {
        this.onError(err, file, this.fileList);
      }
    },
    handleOnRemove(index) {
      let file = deepClone(this.fileList[index]);
      let value;
      if (this.multiple) {
        value = [...this.value];
        value.splice(index, 1);
      } else {
        value = "";
      }
      this.$emit("input", value);
      if (this.onRemove) {
        this.$nextTick(() => {
          this.onRemove(file, this.fileList);
        });
      }
    },
    getFile(url) {
      let name = "";
      let type = "";
      let icon = "";
      let index = url.lastIndexOf("/");
      if (index > -1) {
        name = url.substring(index + 1, url.length);
      }
      if (name.split(".").length > 2) {
        index = name.indexOf(".");
        if (index === 32) {
          name = name.substring(index + 1, name.length);
        }
      }
      index = name.lastIndexOf(".");
      if (index > -1) {
        type = name.substring(index + 1, name.length);
      }
      if (["doc", "jpeg", "pdf", "png"].includes(type)) {
        icon = `/attachment/attachment_format_${type}.png`;
      } else if ("jpg" === type) {
        icon = `/attachment/attachment_format_jpeg.png`;
      } else {
        icon = `/attachment/attachment_format_other.png`;
      }
      return { url, name, icon };
    },
    download(url) {
      window.open(url, "_blank");
    },
  },
};
</script>

<style lang="scss">
@import "~@/styles/element-ui.scss";
.h-upload {
  .h-upload-content {
    height: 100%;
    width: 100%;
    & + .file-item {
      margin-top: 4px;
    }
    .h-upload-tips {
      margin-left: 10px;
      font-size: 12px;
      color: #909399;
    }
  }
  .file-item {
    padding: 12px 18px;
    background: #f7f8fa;
    line-height: 22px;
    display: flex;
    align-items: center;
    img {
      width: 14px;
      margin-right: 8px;
    }
    span {
      flex: 1;
    }
    .el-icon-circle-check {
      font-size: 16px;
      color: #70cd44;
    }
    .el-icon-circle-close {
      font-size: 16px;
      color: #a3a3a3;
      display: none;
      cursor: pointer;
      &:hover {
        color: #757575;
      }
    }
    .el-button {
      margin-left: 20px;
      padding: 0;
      display: none;
    }
    &:hover {
      .el-icon-circle-check {
        display: none;
      }
      .el-icon-circle-close {
        display: inline-block;
      }
    }
    &.is-disabled {
      span {
        flex: unset;
      }
      i {
        display: none;
      }
      &:hover {
        i {
          display: none;
        }
        .el-button {
          display: inline-block;
        }
      }
    }
    & + .file-item {
      margin-top: 4px;
    }
  }
}
</style>
