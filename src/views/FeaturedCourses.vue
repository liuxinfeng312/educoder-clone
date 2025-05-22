<template>
  <div class="featured-courses">
    <v-container>
      <!-- 标题和筛选 -->
      <v-row class="mb-4">
        <v-col cols="12">
          <h1 class="text-h4 mb-4">-----</h1>
          <h1 class="text-h4 mb-4">精选课程</h1>
          <v-tabs
            v-model="selectedCategory"
            background-color="transparent"
            color="primary"
            class="category-tabs"
          >
            <v-tab
              v-for="category in categories"
              :key="category"
              @click="filterCourses(category)"
            >
              {{ category }}
            </v-tab>
          </v-tabs>
        </v-col>
      </v-row>
      <!-- 课程卡片列表 -->
      <v-row>
        <v-col
          v-for="course in filteredCourses"
          :key="course.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            class="course-card"
            elevation="2"
            @click="goToCourse(course.id)"
          >
            <v-img
              :src="course.image"
              height="120px"
              class="course-image"
            ></v-img>
            <v-card-title class="course-title">
              {{ course.title }}
            </v-card-title>
            <v-card-text>
              <p class="course-description">
                {{ course.description }}
              </p>
              <v-chip
                small
                color="primary"
                class="course-tag"
              >
                {{ course.tag }}
              </v-chip>
              <p class="course-stats mt-2">
                <v-icon small class="mr-1">mdi-account-group</v-icon>
                {{ course.students }}人学习
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                @click.stop="goToCourse(course.id)"
              >
                开始学习
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FeaturedCourses',
  data() {
    return {
      selectedCategory: 0,
      categories: ['全部', '基础', '进阶', '实战'],
      courses: [],
      filteredCourses: []
    };
  },
  methods: {
    async fetchCourses() {
      try {
        const response = await axios.get('http://localhost:8080/api/courses');
        this.courses = response.data;
        this.filteredCourses = this.courses;
        console.log('获取课程列表成功:', this.courses);
      } catch (error) {
        console.error('获取课程列表失败:', error);
        alert('无法加载课程列表，请稍后重试');
      }
    },
    filterCourses(category) {
      if (category === '全部') {
        this.filteredCourses = this.courses;
      } else {
        this.filteredCourses = this.courses.filter(course => course.category === category);
      }
    },
    goToCourse(courseId) {
      console.log('Navigating to course:', courseId);
      this.$router.push(`/course/${courseId}`);
    }
  },
  created() {
    this.fetchCourses();
  }
};
</script>

<style scoped>
.featured-courses {
  padding: 20px;
  background-color: #f5f5f5;
}
h1 {
  color: #1f2a44;
  font-weight: bold;
}
.category-tabs {
  border-bottom: 1px solid #e0e0e0;
}
.course-card {
  background-color: #fff;
  border-radius: 8px;
  transition: transform 0.2s;
}
.course-card:hover {
  transform: translateY(-5px);
}
.course-image {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.course-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2a44;
  line-height: 1.4;
}
.course-description {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.course-tag {
  margin-top: 8px;
}
.course-stats {
  font-size: 0.8rem;
  color: #888;
}
</style>