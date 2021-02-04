<template>
  <div class="h-navigation" :style="{ top: `${top}px`, right: `${right}px` }">
    <div class="line"></div>
    <div class="anchors">
      <div
        v-for="{ id, label } in anchors"
        :key="id"
        @click="toAnchor(id)"
        class="anchor"
        :class="{ current: current === id }"
      >
        {{ label }}
        <div class="circle"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HNavigation",
  props: {
    anchors: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      current: "",
      screenHeight: 0,
      right: 0,
      top: 0,
      layoutEle: null,
    };
  },
  mounted() {
    this.layoutEle = document.getElementsByClassName("avue-layout")[0];
    this.resize();
    this.scroll();
    window.addEventListener("resize", this.resize, false);
    this.layoutEle.addEventListener("scroll", this.scroll, false);
  },
  destroyed() {
    window.removeEventListener("resize", this.resize, false);
    this.layoutEle.removeEventListener("scroll", this.scroll, false);
  },
  methods: {
    resize() {
      let main = document.getElementById("avue-view");
      this.right = (this.layoutEle.clientWidth - main.clientWidth) / 2 - 100;
      this.top = (this.layoutEle.clientHeight - this.$el.clientHeight) / 2;
    },
    scroll() {
      if (!this.anchors.length) {
        return;
      }
      let current = "";
      for (let i = 0; i < this.anchors.length; i++) {
        let { id = "" } = this.anchors[i];
        let ele = document.querySelector(`#${id}`);
        if (
          i === 0 ||
          (ele && ele.offsetTop - this.layoutEle.scrollTop <= 100)
        ) {
          current = id;
        }
      }
      this.current = current;
    },
    toAnchor(id) {
      document.querySelector(`#${id}`).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/element-ui.scss";

.h-navigation {
  position: absolute;
  display: flex;
  z-index: 100;
  .line {
    width: 1px;
    background: #0000000f;
  }
  .anchors {
    .anchor {
      position: relative;
      margin: 15px 0 15px 15px;
      font-size: 14px;
      cursor: pointer;
      .circle {
        position: absolute;
        width: 6px;
        height: 6px;
        top: 5px;
        left: -20px;
        border: 1px solid transparent;
        border-radius: 100%;
      }
      &.current {
        color: $--color-primary;
        .circle {
          border-color: $--color-primary;
        }
      }
    }
  }
}
</style>
