<template>
  <el-date-picker
    v-model="hValue"
    ref="datePicker"
    :align="align"
    :clear-icon="clearIcon"
    :clearable="clearable"
    :default-value="defaultValue"
    :default-time="defaultTime"
    :disabled="disabled"
    :editable="editable"
    :end-placeholder="endPlaceholder"
    :format="format"
    :name="name"
    :picker-options="pickerOptions"
    :placeholder="placeholder"
    :popper-class="popperClass"
    :prefix-icon="prefixIcon"
    :range-separator="rangeSeparator"
    :readonly="readonly"
    :size="size"
    :start-placeholder="startPlaceholder"
    :type="type"
    :unlink-panels="unlinkPanels"
    :validate-event="validateEvent"
    :value-format="valueFormat"
    @blur="handleBlur"
    @change="handleChange"
    @focus="handleFocus"
  >
    <slot name="range-separator" slot="range-separator"></slot>
  </el-date-picker>
</template>

<script>
// import Vue from "vue";
// import { DatePicker } from "element-ui";
// Vue.use(DatePicker);

export default {
  name: "HDatePicker",
  props: {
    align: {
      type: String,
      validator(value) {
        return ["left", "center", "right"].indexOf(value) !== -1;
      }
    },
    clearIcon: String,
    clearable: {
      type: Boolean,
      default: true
    },
    defaultValue: Date,
    defaultTime: {
      type: [String, Array],
      validator(value) {
        if (typeof value === "string") {
          return true;
        } else if (value instanceof Array) {
          if (value.length !== 2) {
            return false;
          }
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] !== "string") {
              return false;
            }
          }
          return true;
        }
        return false;
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    endPlaceholder: String,
    format: String,
    name: String,
    pickerOptions: {
      type: Object,
      validator({ disabledDate, firstDayOfWeek, onPick, shortcuts }) {
        if (disabledDate !== undefined && typeof disabledDate !== "function") {
          return false;
        }
        if (
          firstDayOfWeek !== undefined &&
          [1, 2, 3, 4, 5, 6, 7].indexOf(firstDayOfWeek) === -1
        ) {
          return false;
        }
        if (onPick !== undefined && typeof onPick !== "function") {
          return false;
        }
        if (shortcuts !== undefined) {
          if (!(shortcuts instanceof Array)) {
            return false;
          }
          for (let i = 0; i < shortcuts.length; i++) {
            let { text, onClick } = shortcuts[i];
            if (
              !text ||
              typeof text !== "string" ||
              !onClick ||
              typeof onClick !== "function"
            ) {
              return false;
            }
          }
        }
        return true;
      }
    },
    placeholder: String,
    popperClass: String,
    prefixIcon: String,
    rangeSeparator: String,
    readonly: {
      type: Boolean,
      default: false
    },
    shortcuts: {
      type: Array,
      default() {
        return [];
      },
      validator(value) {
        let options = [
          "today",
          "yesterday",
          "weekAgo",
          "monthAgo",
          "yearAgo",
          "lastDay",
          "lastWeek",
          "lastMonth",
          "lastYear"
        ];
        for (let i = 0; i < value.length; i++) {
          if (options.indexOf(value[i]) === -1) {
            return false;
          }
        }
        return true;
      }
    },
    size: {
      type: String,
      validator(value) {
        return ["medium", "small", "mini"].indexOf(value) !== -1;
      }
    },
    startPlaceholder: String,
    type: {
      type: String,
      validator(value) {
        return (
          [
            "date",
            "daterange",
            "datetime",
            "datetimerange",
            "dates",
            "week",
            "month",
            "year"
          ].indexOf(value) !== -1
        );
      }
    },
    unlinkPanels: {
      type: Boolean,
      default: false
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Date, String, Array],
      required: true
    },
    valueFormat: String
  },
  data() {
    return {
      hValue: "",
      clickOutsideFlag: false,
      childHandleClose: null
    };
  },
  created() {
    this.shortcuts.forEach(type => {
      let text;
      let onClick;
      if (this.type === "date" || this.type === "dateTime") {
        switch (type) {
          case "today":
            text = "今天";
            onClick = function(picker) {
              picker.$emit("pick", new Date());
            };
            break;
          case "yesterday":
            text = "昨天";
            onClick = function(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            };
            break;
          case "weekAgo":
            text = "一周前";
            onClick = function(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            };
            break;
          case "monthAgo":
            text = "一个月前";
            onClick = function(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            };
            break;
          case "yearAgo":
            text = "一年前";
            onClick = function(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", date);
            };
            break;
        }
      } else if (this.type === "daterange" || this.type === "datetimerange") {
        switch (type) {
          case "lastDay":
            text = "最近一天";
            onClick = function(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            };
            break;
          case "lastWeek":
            text = "最近一周";
            onClick = function(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            };
            break;
          case "lastMonth":
            text = "最近一个月";
            onClick = function(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            };
            break;
          case "lastYear":
            text = "最近一年";
            onClick = function(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            };
            break;
        }
      }
      if (text) {
        this.pickerOptions.shortcuts.push({
          text,
          onClick
        });
      }
    });
    this.$nextTick(() => {
      this.childHandleClose = this.$refs.datePicker.handleClose;
      this.$refs.datePicker.handleClose = this.handleClose;
    });
    this.hValue = this.value;
  },
  watch: {
    value(val) {
      this.hValue = val;
      this.updateInput();
    },
    hValue(val) {
      if (val === null) {
        this.hValue = "";
      }
      this.updateInput();
    }
  },
  methods: {
    handleBlur(event) {
      this.$emit("blur", event);
    },
    handleChange() {
      if (!this.clickOutsideFlag) {
        this.updateInput();
        let value = this.hValue || "";
        this.$emit("input", value);
        this.$emit("change", value);
      } else {
        this.clickOutsideFlag = false;
        this.hValue = this.value;
      }
    },
    handleFocus(event) {
      this.$emit("focus", event);
    },
    focus() {
      this.$refs.datePicker.focus();
    },
    handleClose() {
      if (this.$refs.datePicker.pickerVisible) {
        this.clickOutsideFlag = true;
        this.childHandleClose();
      }
    },
    updateInput() {
      this.$nextTick(() => {
        this.$refs.datePicker.$refs.reference.$refs.input.value = this.value;
      });
    }
  }
};
</script>
<style lang="scss" scoped></style>
