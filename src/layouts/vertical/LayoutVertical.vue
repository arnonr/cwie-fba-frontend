<template>
  <layout-vertical>
    <router-view />

    <app-breadcrumb slot="breadcrumb" />

    <app-customizer v-if="showCustomizer" slot="customizer" />
  </layout-vertical>
</template>

<script>
import LayoutVertical from "@core/layouts/layout-vertical/LayoutVertical.vue";
import AppCustomizer from "@core/layouts/components/app-customizer/AppCustomizer.vue";
import AppBreadcrumb from "@core/layouts/components/AppBreadcrumb.vue";
import { $themeConfig } from "@themeConfig";

export default {
  components: {
    AppCustomizer,
    LayoutVertical,
    AppBreadcrumb,
  },
  data() {
    return {
      showCustomizer: $themeConfig.layout.customizer,
    };
  },
};
</script>
