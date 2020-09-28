<template>
  <div class="extension">
    <h1 class="extension__title">Test extension</h1>
    <domains-list v-if="domains.length > 0" :domains="domains" class="extension__list" />
  </div>
</template>

<script>
import DomainsList from '@/components/DomainsList.vue';

export default {
  name: 'App',
  components: { DomainsList },
  data: () => ({
    domains: [],
  }),
  mounted() {
    const port = chrome.extension.connect({ name: 'Sample Communication' });
    port.postMessage({ action: 'getData' });
    port.onMessage.addListener((response) => {
      this.domains = response;
    });
  },
};
</script>

<style>
  html {
    width: 400px;
    height: 400px;
  }
  .extension {
    display: flex;
    flex-direction: column;
    padding: 1rem;
  }
</style>
