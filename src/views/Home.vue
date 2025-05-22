<template>
    <v-container fluid>
      <AppBanner />
      <v-row justify="center" class="mt-4">
        <v-col cols="12" class="text-center">
          <h1 class="text-h5">大型智能的智能化教学、实验、科研支撑标杆</h1>
          <p class="text-subtitle-1 grey--text">
            Large Model-enabled Platform for Intelligent Teaching, Learning, Experiment and Research Activities
          </p>
        </v-col>
      </v-row>
    </v-container>
  </template>

  <script>
  import AppBanner from '@/components/Banner.vue'; // 更新导入

  export default {
    name: 'AppHome', // 修改为多词名称
    components: {
      AppBanner // 更新组件名称
    }
  };
  </script>