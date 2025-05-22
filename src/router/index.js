import { createRouter, createWebHistory } from 'vue-router';
import AppHome from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: AppHome
  },
  {
    path: '/ai-practice',
    name: 'AIPractice',
    component: () => import('../views/AIPractice.vue')
  },
  {
    path: '/featured-courses',
    name: 'FeaturedCourses',
    component: () => import('../views/FeaturedCourses.vue')
  },
  {
    path: '/discussion-forum',
    name: 'DiscussionForum',
    component: () => import('../views/DiscussionForum.vue')
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: () => import('../views/UserProfile.vue')
  },
  {
    path: '/discussion-forum/:id',
    name: 'PostDetail',
    component: () => import('../views/PostDetail.vue')
  },
  {
    path: '/document-collaboration',
    name: 'DocumentCollaboration',
    component: () => import('../views/DocumentCollaboration.vue')
  },
  {
    path: '/course/:id',
    name: 'CourseDetail',
    component: () => import('../views/CourseDetail.vue')
  },
  {
    path: '/problem/:category',
    name: 'ProblemDetail',
    component: () => import('../views/ProblemDetail.vue'),
    props: true // 允许将路由参数作为 props 传递给组件
  },
  {
    path: '/problem/:problemId',
    name: 'ProblemDetail',
    component: () => import('../views/ProblemDetail.vue'),
    props: true
},
  {
    path: '/submission/:submissionId',
    name: 'SubmissionResult',
    component: () => import('../views/SubmissionResult.vue'),
    props: true // 允许将路由参数作为 props 传递给组件
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;