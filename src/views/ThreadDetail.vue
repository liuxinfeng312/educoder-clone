<template>
  <div class="thread-detail">
    <v-container>
      <v-card class="mb-4" elevation="2">
        <v-card-title class="headline">---------</v-card-title>
        <v-card-title class="headline">{{ thread.title }}</v-card-title>
        <v-card-subtitle>
          <v-chip small class="mr-2" color="blue" text-color="white">{{ thread.category }}</v-chip>
          <span>作者: {{ thread.user?.username }}</span>
          <span class="ml-4">{{ thread.views }} 浏览</span>
          <span class="ml-4">{{ thread.likes }} 赞</span>
        </v-card-subtitle>
        <v-card-text>
          <p>{{ thread.content }}</p>
          <p class="text--secondary">发布于: {{ formatDate(thread.createdAt) }}</p>
        </v-card-text>
      </v-card>

      <!-- 回复列表 -->
      <v-card class="mb-4" elevation="2">
        <v-card-title class="headline">回复 ({{ responses.length }})</v-card-title>
        <v-card-text>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          <v-list v-if="responses.length > 0">
            <v-list-item v-for="response in responses" :key="response.id">
              <v-list-item-content>
                <v-list-item-title>
                  <v-avatar size="24" class="mr-2">
                    <img :src="response.user?.avatarUrl || 'https://via.placeholder.com/24'" alt="avatar">
                  </v-avatar>
                  {{ response.user?.username }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ response.content }}</v-list-item-subtitle>
                <v-list-item-subtitle class="text--secondary">
                  发布于: {{ formatDate(response.createdAt) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <p v-else>暂无回复</p>
        </v-card-text>
      </v-card>

      <!-- 发表回复 -->
      <v-card class="mb-4" elevation="2">
        <v-card-title class="headline">发表回复</v-card-title>
        <v-card-text>
          <v-form ref="responseForm" v-model="responseValid" lazy-validation>
            <v-textarea
              v-model="newResponse.content"
              label="回复内容"
              rows="3"
              required
              :rules="[v => !!v || '内容不能为空']"
            ></v-textarea>
            <v-btn color="primary" @click="submitResponse" :disabled="!responseValid">提交</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ThreadDetail',
  data() {
    return {
      thread: {},
      responses: [],
      newResponse: {
        content: '',
        userId: null
      },
      valid: true,
      responseValid: true,
      errorMessage: ''
    };
  },
  methods: {
    async fetchThread() {
      const threadId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/threads/${threadId}`);
        this.thread = response.data;
        console.log('获取帖子详情成功:', this.thread);
      } catch (error) {
        console.error('获取帖子详情失败:', error);
        this.errorMessage = '无法加载帖子，请稍后重试';
      }
    },
    async fetchResponses() {
      const threadId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/threads/${threadId}/responses`);
        this.responses = response.data;
        console.log('获取回复列表成功:', this.responses);
      } catch (error) {
        console.error('获取回复列表失败:', error);
        this.errorMessage = '无法加载回复，请稍后重试';
      }
    },
    async submitResponse() {
      if (this.$refs.responseForm.validate()) {
        const userId = localStorage.getItem('loggedInUserId');
        if (!userId) {
          alert('请先登录！');
          this.$router.push('/');
          return;
        }
        const threadId = this.$route.params.id;
        try {
          const response = await axios.post(`http://localhost:8080/api/threads/${threadId}/responses`, {
            content: this.newResponse.content,
            userId: parseInt(userId)
          });
          console.log('发表回复成功:', response.data);
          this.newResponse = { content: '', userId: null };
          this.fetchResponses();
        } catch (error) {
          console.error('发表回复失败:', error);
          alert('发表回复失败，请稍后重试');
        }
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    }
  },
  mounted() {
    this.fetchThread();
    this.fetchResponses();
    const userId = localStorage.getItem('loggedInUserId');
    if (userId) {
      this.newResponse.userId = parseInt(userId);
    }
  }
};
</script>

<style scoped>
.thread-detail {
  padding: 20px;
  background-color: #f5f5f5;
}
.headline {
  color: #1f2a44;
  font-weight: bold;
  font-size: 1.2rem;
}
.error {
  color: red;
}
</style>