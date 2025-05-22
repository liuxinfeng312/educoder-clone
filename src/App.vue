<template>
      <v-app>
        <TopNav />
        <v-row no-gutters>
          <v-col cols="2">
            <SideNav />
          </v-col>
          <v-col cols="10">
            <router-view />
          </v-col>
        </v-row>
      </v-app>
    </template>

    <script>
    import TopNav from '@/components/TopNav.vue';
    import SideNav from '@/components/SideNav.vue';

    export default {
      name: 'App',
      components: {
        TopNav,
        SideNav
      }
    };
    </script>