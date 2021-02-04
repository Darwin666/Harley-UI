<template>
  <div class="h-image-upload">
    <div v-if="multiple" class="h-image-upload-multiple">
      <div class="arrow">
        <i
          @click="onScrollLeft"
          class="iconfont jiuwu-fanhui"
          :class="{ 'scroll-disabled': scrollLeftDisabled }"
        />
      </div>
      <div ref="imageArea" class="image-area">
        <div ref="imageList" class="image-list">
          <template v-if="value && value.length">
            <div
              v-for="(item, index) in value"
              :key="item"
              class="image-block"
              :style="imageStyle"
            >
              <el-image
                :ref="`image${index}`"
                :src="item"
                :preview-src-list="getOwnList(index)"
                fit="fill"
              ></el-image>
              <div v-if="!hDisabled" class="opeartion-bar">
                <div @click="viewImage(`image${index}`)" class="opeartion-item">
                  <i class="el-icon-zoom-in" />
                </div>
                <div @click="deleteImage(item)" class="opeartion-item">
                  <i class="el-icon-delete" />
                </div>
              </div>
            </div>
          </template>
          <div
            v-else-if="hDisabled"
            class="image-block no-picture"
            :style="imageStyle"
          >
            <div class="no-picture-content">尚未上传</div>
          </div>
          <h-upload
            v-if="!hDisabled && (!value || value.length < limit)"
            v-model="hValue"
            :action="action"
            :headers="headers"
            :multiple="multiple"
            :accept="accept"
            list-type="picture-card"
            :before-upload="handleBeforeUpload"
            :on-success="handleOnSuccess"
            :on-error="handleOnError"
            class="image-block"
            :show-loading="showLoading"
            :class="{ 'show-background': !!background }"
            :style="imageStyle"
          >
            <div class="upload-placeholder">
              <i class="el-icon-plus"></i>
              <div>{{ placeholder }}</div>
            </div>
          </h-upload>
        </div>
      </div>
      <div class="arrow right-arrow">
        <i
          @click="onScrollRight"
          class="iconfont jiuwu-fanhui"
          :class="{ 'scroll-disabled': scrollRightDisabled }"
        />
      </div>
    </div>
    <template v-else>
      <div v-if="value && value.length" class="image-block" :style="imageStyle">
        <el-image
          ref="image"
          :src="value"
          :preview-src-list="[value]"
          fit="fill"
        ></el-image>
        <div v-if="!hDisabled" class="opeartion-bar">
          <div @click="viewImage('image')" class="opeartion-item">
            <i class="el-icon-zoom-in" />
          </div>
          <div @click="deleteImage(value)" class="opeartion-item">
            <i class="el-icon-delete" />
          </div>
        </div>
      </div>
      <template v-else-if="hDisabled">
        <div v-if="background" class="image-block" :style="imageStyle">
          <el-image :src="background" fit="fill"></el-image>
        </div>
        <div v-else class="image-block no-picture" :style="imageStyle">
          <div class="no-picture-content">
            <i class="el-icon-picture" />
            <div>尚未上传</div>
          </div>
        </div>
      </template>
      <h-upload
        v-else-if="!value"
        v-model="hValue"
        :action="action"
        :headers="headers"
        :multiple="multiple"
        :accept="accept"
        list-type="picture-card"
        :before-upload="handleBeforeUpload"
        :on-success="handleOnSuccess"
        :on-error="handleOnError"
        class="image-block"
        :style="imageStyle"
        :show-loading="showLoading"
        :class="{ 'show-background': !!background }"
      >
        <div class="upload-placeholder">
          <i class="el-icon-plus"></i>
          <div>{{ placeholder }}</div>
        </div>
      </h-upload>
    </template>
  </div>
</template>

<script>
import { beforeUpload, file2Base64 } from "@/util/file";

import HUpload from "./upload";

export default {
  name: "HImageUpload",
  components: { HUpload },
  inject: {
    elForm: {
      default: "",
    },
  },
  props: {
    value: [String, Array],
    action: String,
    headers: Object,
    disabled: {
      type: Boolean,
      default: false,
    },
    beforeUpload: Function,
    onSuccess: Function,
    onError: Function,
    onRemove: Function,
    toBase64Flag: {
      type: Boolean,
      default: false,
    },
    showLoading: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 10,
    },
    imageWidth: Number,
    imageHeight: Number,
    validateEvent: {
      type: Boolean,
      default: true,
    },
    background: String,
    typeList: {
      type: Array,
      default() {
        return ["jpg", "jpeg", "gif", "png", "bmp"];
      },
    },
    placeholder: {
      type: String,
      default: "上传图片",
    },
    compressFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      areaWidth: 0,
      scrollLeft: 0,
    };
  },
  computed: {
    hValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
    imageStyle() {
      let style = {};
      if (this.imageWidth) {
        style.width = `${this.imageWidth}px`;
      }
      if (this.imageHeight) {
        style.height = `${this.imageHeight}px`;
      }
      if (this.background && !this.hDisabled) {
        style.background = `url("${this.background}") center`;
      }
      return style;
    },
    hDisabled() {
      return this.disabled || (this.elForm || {}).disabled;
    },
    listWidth() {
      let length = this.value ? this.value.length : 0;
      if (!length) {
        length = 1;
      } else if (!this.hDisabled && length < this.limit) {
        length++;
      }
      return length * 73 + (length - 1) * 8;
    },
    scrollLeftDisabled() {
      return this.scrollLeft <= 0;
    },
    scrollRightDisabled() {
      return this.scrollLeft >= this.listWidth - this.areaWidth;
    },
    accept() {
      let accept = this.typeList.join(", .");
      if (accept.length) {
        accept = "." + accept;
      }
      return accept;
    },
  },
  watch: {
    multiple() {
      this.checkValueType();
    },
    value(val) {
      if (
        this.validateEvent &&
        this.$parent.$options.componentName === "ElFormItem"
      ) {
        this.$parent.$emit("el.form.change", val);
      }
      this.checkValueType();
    },
  },
  created() {
    this.checkValueType();
  },
  mounted() {
    this.getAreaWidth();
    window.addEventListener("resize", this.getAreaWidth, false);
  },
  destroyed() {
    window.removeEventListener("resize", this.getAreaWidth, false);
  },
  methods: {
    getOwnList(index) {
      let list = [];
      if (Array.isArray(this.value)) {
        list = this.value.slice(index).concat(this.value.slice(0, index));
      }
      return list;
    },
    getAreaWidth() {
      if (this.$el) {
        this.areaWidth = this.$el.clientWidth - 58;
      }
    },
    onScrollLeft() {
      let targetLeft =
        this.$refs.imageArea.scrollLeft - this.$refs.imageArea.clientWidth;
      // if (targetLeft <script 0) {
      //   targetLeft = 0;
      // }
      this.scrollLeft = targetLeft;

      let scrollTimer = setInterval(() => {
        let diff = this.$refs.imageArea.scrollLeft - targetLeft;
        if (diff > 5) {
          this.$refs.imageArea.scrollLeft -= 5;
        } else if (diff > 0) {
          this.$refs.imageArea.scrollLeft = targetLeft;
        } else {
          clearInterval(scrollTimer);
        }
      }, 10);
    },
    onScrollRight() {
      let targetLeft = this.$refs.imageArea.scrollLeft + this.areaWidth;
      if (targetLeft > this.listWidth - this.areaWidth) {
        targetLeft = this.listWidth - this.areaWidth;
      }
      this.scrollLeft = targetLeft;

      let scrollTimer = setInterval(() => {
        let diff = targetLeft - this.$refs.imageArea.scrollLeft;
        if (diff > 5) {
          this.$refs.imageArea.scrollLeft += 5;
        } else {
          this.$refs.imageArea.scrollLeft = targetLeft;
          clearInterval(scrollTimer);
        }
      }, 10);
    },
    viewImage(refName) {
      if (refName === "image") {
        this.$refs[refName].clickHandler();
      } else {
        this.$refs[refName][0].clickHandler();
      }
    },
    deleteImage(src) {
      if (!this.multiple) {
        this.hValue = "";
        if (this.onRemove) {
          this.onRemove([]);
        }
      } else {
        let srcArray = [];
        this.value.forEach((item) => {
          if (item !== src) {
            srcArray.push(item);
          }
        });
        this.hValue = srcArray;
        if (this.onRemove) {
          this.onRemove(srcArray);
        }
      }
    },
    handleBeforeUpload(file) {
      let { name, type, size } = file;
      // 文件类型校验
      let dotIndex = name.lastIndexOf(".");
      if (dotIndex === -1) {
        this.$message({
          type: "error",
          message: `请上传正确格式的图片。支持格式：${this.typeList.join("/")}`,
        });
        return false;
      } else {
        let suffix = name.substring(dotIndex + 1);
        if (this.typeList.indexOf(suffix.toLowerCase()) === -1) {
          this.$message({
            type: "error",
            message: `请上传正确格式的图片。支持格式：${this.typeList.join(
              "/"
            )}`,
          });
          return false;
        }
      }
      // 单个大小校验 (0 < size < 10mb)
      if (size === 0) {
        this.$message({
          type: "error",
          message: "文件不能为空！",
        });
        return false;
      }
      if (size > 10485760) {
        this.$message({
          type: "error",
          message: "单个图片不能超过10MB！",
        });
        return false;
      }
      let result = beforeUpload(
        file,
        this.beforeUpload,
        this.toBase64Flag,
        this.compressFlag
      );
      if (result === false) {
        return false;
      }
      if (result !== true) {
        return Promise.resolve(result);
      }
    },
    handleOnSuccess(response, file, fileList) {
      if (this.onSuccess) {
        this.onSuccess(response, file, fileList);
      }
    },
    handleOnError(err, file, fileList) {
      if (this.onError) {
        this.onError(err, file, fileList);
      }
    },
    checkValueType() {
      if (this.multiple && !Array.isArray(this.value)) {
        console.error(
          "图片上传组件属性错误：multiple为true时，value类型为Array"
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-image-upload {
  display: inline-block;
  .h-image-upload-multiple {
    display: flex;
    .arrow {
      line-height: 44px;
      &.right-arrow {
        transform: rotate(180deg);
      }
      .jiuwu-fanhui {
        width: 18px;
        color: $--color-text-regular;
        cursor: pointer;
        &.scroll-disabled {
          cursor: not-allowed;
          opacity: 0.29;
        }
      }
    }
    .image-area {
      position: relative;
      overflow: hidden;
      .image-list {
        width: fit-content;
        // display: flex;
        .image-block {
          width: 178px;
          height: 108px;
          float: left;
          margin: 0 8px 8px 0;
          // & + .image-block {
          // }
          &:hover {
            .opeartion-bar {
              display: flex;
              justify-content: space-around;
              align-items: center;
            }
          }
          &.no-picture {
            font-size: 12px;
            .no-picture-content {
              width: 100%;
            }
          }
        }
      }
    }
  }
  .image-block {
    position: relative;
    width: 178px;
    height: 108px;
    display: inline-block;
    color: #999999;
    .el-image {
      width: 100%;
      height: 100%;
      border-radius: 4px;
    }
    .upload-placeholder {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      line-height: 1;
      i {
        margin-bottom: 10px;
        font-size: 22px;
      }
    }
    .opeartion-bar {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      display: none;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      .opeartion-item {
        width: 30px;
        height: 30px;
        font-size: 20px;
        color: $--color-white;
        cursor: pointer;
        line-height: 30px;
        &:hover {
          background: #ffffff4d;
        }
      }
    }
    &:hover {
      .opeartion-bar {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
  .no-picture {
    position: relative;
    border-radius: 4px;
    background: #f4f4f4;
    .no-picture-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #c6c6c6;
      line-height: 1;
      text-align: center;
      i {
        margin-bottom: 5px;
        font-size: 30px;
      }
    }
  }
}
</style>
<style lang="scss">
@import "~@/styles/element-ui.scss";

.h-image-upload {
  .image-block {
    &.h-upload {
      &.show-background {
        .el-upload {
          background: transparent !important;
        }
      }
      .el-upload {
        position: relative;
        width: 100%;
        height: 100%;
        &.el-upload--picture-card {
          background: #fbfcfd;
          border: 1px dashed #b6bcd6;
          border-radius: 4px;
          &:hover {
            border-color: $--button-color-active;
            background: #fff7f2;
            .el-icon-plus {
              color: $--button-color-active;
            }
          }
          &:focus {
            border-color: $--button-color-active;
            background: #fff7f2;
            .el-icon-plus {
              color: $--button-color-active;
            }
          }
        }
      }
    }
  }
}
</style>
