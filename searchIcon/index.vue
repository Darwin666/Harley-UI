<template>
  <div class="h-search-icon" @click="$emit('click')">
    <img src="@/assets/harley/search.png" />
  </div>
</template>

<script>
export default {
  name: "HSearchIcon"
};
</script>
<style lang="scss" scoped>
.h-search-icon {
  margin-top: 2px;
}
</style>
