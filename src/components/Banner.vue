<template>
      <v-container fluid class="banner-container">
        <v-row no-gutters class="banner-row">
          <v-col cols="4" class="book-col">
            <v-img src="https://via.placeholder.com/300x400" alt="Book Cover" class="book-image" />
          </v-col>
          <v-col cols="8" class="content-col">
            <div class="banner-content">
              <h1 class="text-h4 banner-title">《软计工程——理论与实践》</h1>
              <h2 class="text-h5 mt-2 banner-subtitle">「101计初核心·教材推荐」</h2>
              <p class="mt-4 banner-text">
                国防科技大学李新宇教授领衔及联袂学科团队联合学科集群中联袂计造<br>
                “101计初”软计工程数次的上课课程实训和实验
              </p>
              <p class="mt-2 banner-isbn">综合教务出版书目：ISBN：978-7-04-061010-9</p>
              <!-- 右上角 Logo -->
              <div class="logo-container">
                <v-img src="https://via.placeholder.com/100" alt="University Logo" width="80" />
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <script>
    export default {
      name: 'AppBanner'
    };
    </script>

    <style scoped>
    .banner-container {
      background: url('https://via.placeholder.com/1200x400/1F2A44') no-repeat center center;
      background-size: cover;
      padding: 0;
      position: relative;
      border-radius: 8px;
    }
    .banner-row {
      background-color: rgba(31, 42, 68, 0.9); /* 半透明背景 */
    }
    .book-col {
      padding: 16px;
    }
    .book-image {
      max-width: 100%;
      height: auto;
    }
    .content-col {
      padding: 24px;
      position: relative;
    }
    .banner-content {
      color: #fff;
    }
    .banner-title {
      font-size: 2rem;
      font-weight: bold;
    }
    .banner-subtitle {
      font-size: 1.5rem;
      color: #FFD700; /* 金色 */
    }
    .banner-text {
      font-size: 1rem;
      line-height: 1.6;
    }
    .banner-isbn {
      font-size: 0.9rem;
      color: #ccc;
    }
    .logo-container {
      position: absolute;
      top: 16px;
      right: 16px;
    }
    </style>