<template>
  <v-navigation-drawer permanent color="#1F2A44" dark width="200">
    <v-list>
      <v-list-item @click="navigateToAIPractice">
        <v-list-item-title class="nav-item">AI题库实战</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="nav-item">代码技能训练</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="nav-item">计算机基础</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="nav-item">新基建+</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="nav-item">计算机竞赛</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="nav-item">大模型</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="nav-item">人工智能</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title class="nav-item">更多</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SideNav',
  methods: {
    navigateToAIPractice() {
      console.log('Navigating to AI Practice page from SideNav');
      this.$router.push('/ai-practice');
    }
  }
};
</script>

<style scoped>
.nav-item {
  font-size: 1rem;
  padding: 8px 16px;
  color: #fff !important;
}
</style>