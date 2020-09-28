<template>
  <ul>
    <li v-for="domain in domains" :key="domain.name">
      <a target="_blank" :href=getUrl(domain.domain)>{{domain.name}}</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    domains: {
      type: Array,
    },
  },
  methods: {
    getUrl: (domain) => `http://${domain}`,
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
