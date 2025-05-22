<template>
  <div class="thread-forum">
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <!-- 发帖 -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="headline">----</v-card-title>
            <v-card-title class="headline">发表新帖子</v-card-title>
            <v-card-text>
              <v-form ref="threadForm" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="newThread.title"
                  label="标题"
                  required
                  :rules="[v => !!v || '标题不能为空']"
                ></v-text-field>
                <v-textarea
                  v-model="newThread.content"
                  label="内容"
                  rows="3"
                  required
                  :rules="[v => !!v || '内容不能为空']"
                ></v-textarea>
                <v-text-field
                  v-model="newThread.category"
                  label="分类"
                  required
                  :rules="[v => !!v || '分类不能为空']"
                ></v-text-field>
                <v-btn color="primary" @click="submitThread" :disabled="!valid">发表</v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- 帖子列表 -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="headline">论坛交流</v-card-title>
            <v-card-text>
              <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
              <v-list v-if="threads.length > 0">
                <v-list-item v-for="thread in threads" :key="thread.id" @click="goToThreadDetail(thread.id)">
                  <v-list-item-title class="thread-title">
                    <v-chip small class="mr-2" color="blue" text-color="white">{{ thread.category }}</v-chip>
                    {{ thread.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="thread-meta">
                    <span class="mr-4">{{ thread.views }} 浏览</span>
                    <span class="mr-4">{{ thread.likes }} 赞</span>
                    <span>{{ thread.responses ? thread.responses.length : 0 }} 回复</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="thread-author">
                    <v-avatar size="24" class="mr-2">
                      <img :src="thread.user?.avatarUrl || 'https://via.placeholder.com/24'" alt="avatar">
                    </v-avatar>
                    {{ thread.user?.username }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <p v-else>暂无帖子</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="headline">热门标签</v-card-title>
            <v-card-text>
              <v-chip-group column>
                <v-chip v-for="tag in tags" :key="tag" small>{{ tag }}</v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ThreadForum',
  data() {
    return {
      valid: true,
      threads: [],
      tags: ['编程', '算法', '前端', '后端', '数据库'],
      newThread: {
        title: '',
        content: '',
        category: '',
        userId: null
      },
      errorMessage: ''
    };
  },
  methods: {
    async fetchThreads() {
      try {
        const response = await axios.get('http://localhost:8080/api/threads');
        this.threads = response.data;
        this.errorMessage = '';
        console.log('获取帖子列表成功:', this.threads);
      } catch (error) {
        console.error('获取帖子列表失败:', error);
        this.errorMessage = '无法加载帖子，请稍后重试或联系管理员';
      }
    },
    async submitThread() {
      if (this.$refs.threadForm.validate()) {
        const userId = localStorage.getItem('loggedInUserId');
        if (!userId) {
          alert('请先登录！');
          this.$router.push('/');
          return;
        }
        try {
          const response = await axios.post('http://localhost:8080/api/threads', {
            title: this.newThread.title,
            content: this.newThread.content,
            category: this.newThread.category,
            userId: parseInt(userId)
          });
          console.log('发表帖子成功:', response.data);
          this.newThread = { title: '', content: '', category: '', userId: null };
          this.fetchThreads();
        } catch (error) {
          console.error('发表帖子失败:', error);
          alert('发表帖子失败，请稍后重试');
        }
      }
    },
    goToThreadDetail(threadId) {
      console.log('跳转到帖子详情页，帖子 ID:', threadId);
      this.$router.push(`/thread/${threadId}`);
    }
  },
  mounted() {
    this.fetchThreads();
    const userId = localStorage.getItem('loggedInUserId');
    if (userId) {
      this.newThread.userId = parseInt(userId);
    }
  }
};
</script>

<style scoped>
.thread-forum {
  padding: 20px;
  background-color: #f5f5f5;
}
.headline {
  color: #1f2a44;
  font-weight: bold;
  font-size: 1.2rem;
}
.thread-title {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2a44;
  line-height: 1.5;
}
.thread-meta {
  font-size: 0.8rem;
  color: #888;
  margin-top: 4px;
}
.thread-author {
  margin-top: 4px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}
.error {
  color: red;
}
</style>