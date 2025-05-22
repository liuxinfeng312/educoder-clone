<template>
  <div class="post-detail">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title class="headline">{{ post?.title }}</v-card-title>
            <v-card-subtitle class="post-meta">
              <v-chip small class="mr-2" color="blue" text-color="white">{{ post?.category }}</v-chip>
              <span class="mr-4">{{ post?.views }} 浏览</span>
              <span class="mr-4">{{ post?.likes }} 赞</span>
              <span>{{ replies?.length || 0 }} 回复</span>
            </v-card-subtitle>
            <v-card-subtitle class="post-author">
              <v-avatar size="24" class="mr-2">
                <img :src="post?.author?.avatarUrl || 'https://via.placeholder.com/24'" alt="avatar">
              </v-avatar>
              {{ post?.author?.username }}
            </v-card-subtitle>
            <v-card-text>
              <p>{{ post?.content }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 回帖列表 -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title>回复</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="reply in replies" :key="reply.id">
                  <v-list-item-content>
                    <v-list-item-subtitle class="post-author">
                      <v-avatar size="24" class="mr-2">
                        <img :src="reply.author?.avatarUrl || 'https://via.placeholder.com/24'" alt="avatar">
                      </v-avatar>
                      {{ reply.author?.username }}
                    </v-list-item-subtitle>
                    <v-list-item-title>{{ reply.content }}</v-list-item-title>
                    <v-list-item-subtitle>{{ reply.createdAt }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 发表回帖 -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title>发表回复</v-card-title>
            <v-card-text>
              <v-textarea v-model="newReplyContent" label="回复内容" rows="3" required :rules="[v => !!v || '回复内容不能为空']" />
              <v-btn color="primary" @click="submitReply">发表</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 代码点评 -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title>代码点评</v-card-title>
            <v-card-text>
              <v-textarea v-model="codeSnippet" label="代码片段" rows="3" required :rules="[v => !!v || '代码片段不能为空']" />
              <v-textarea v-model="reviewContent" label="点评内容" rows="3" required :rules="[v => !!v || '点评内容不能为空']" />
              <v-btn color="primary" @click="submitCodeReview">提交点评</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 代码点评列表 -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title>代码点评记录</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="review in codeReviews" :key="review.id">
                  <v-list-item-content>
                    <v-list-item-subtitle class="post-author">
                      <v-avatar size="24" class="mr-2">
                        <img :src="review.teacher?.avatarUrl || 'https://via.placeholder.com/24'" alt="avatar">
                      </v-avatar>
                      {{ review.teacher?.username }}
                    </v-list-item-subtitle>
                    <v-list-item-title>
                      <strong>代码片段:</strong>
                      <pre>{{ review.codeSnippet }}</pre>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <strong>点评:</strong> {{ review.reviewContent }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>{{ review.createdAt }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
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
  name: 'PostDetail',
  data() {
    return {
      post: null,
      replies: [],
      codeReviews: [],
      newReplyContent: '',
      codeSnippet: '',
      reviewContent: ''
    };
  },
  methods: {
    async fetchPost() {
      const postId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/forum/posts/${postId}`);
        this.post = response.data;
        console.log('获取帖子详情成功:', this.post);
      } catch (error) {
        console.error('获取帖子详情失败:', error);
        alert('无法加载帖子详情，请稍后重试');
      }
    },
    async fetchReplies() {
      const postId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/forum/posts/${postId}/replies`);
        this.replies = response.data;
        console.log('获取回帖成功:', this.replies);
      } catch (error) {
        console.error('获取回帖失败:', error);
        alert('无法加载回帖，请稍后重试');
      }
    },
    async fetchCodeReviews() {
      const postId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/forum/posts/${postId}/code-reviews`);
        this.codeReviews = response.data;
        console.log('获取代码点评成功:', this.codeReviews);
      } catch (error) {
        console.error('获取代码点评失败:', error);
        alert('无法加载代码点评，请稍后重试');
      }
    },
    async submitReply() {
      if (!this.newReplyContent) {
        alert('回复内容不能为空！');
        return;
      }
      const postId = this.$route.params.id;
      const authorId = 1; // 硬编码默认用户 ID
      try {
        const response = await axios.post(`http://localhost:8080/api/forum/posts/${postId}/replies`, {
          content: this.newReplyContent,
          authorId: authorId
        });
        console.log('发表回帖成功:', response.data);
        this.newReplyContent = '';
        this.fetchReplies(); // 刷新回帖列表
      } catch (error) {
        console.error('发表回帖失败:', error);
        alert('发表回帖失败，请稍后重试');
      }
    },
    async submitCodeReview() {
      if (!this.codeSnippet || !this.reviewContent) {
        alert('代码片段和点评内容不能为空！');
        return;
      }
      const postId = this.$route.params.id;
      const teacherId = 1; // 硬编码默认用户 ID
      try {
        const response = await axios.post(`http://localhost:8080/api/forum/posts/${postId}/code-reviews`, {
          codeSnippet: this.codeSnippet,
          reviewContent: this.reviewContent,
          teacherId: teacherId
        });
        console.log('提交代码点评成功:', response.data);
        this.codeSnippet = '';
        this.reviewContent = '';
        this.fetchCodeReviews(); // 刷新代码点评列表
      } catch (error) {
        console.error('提交代码点评失败:', error);
        alert('提交代码点评失败，请稍后重试');
      }
    }
  },
  mounted() {
    this.fetchPost();
    this.fetchReplies();
    this.fetchCodeReviews();
  }
};
</script>

<style scoped>
.post-detail {
  padding: 20px;
  background-color: #f5f5f5;
}
.headline {
  color: #1f2a44;
  font-weight: bold;
  font-size: 1.2rem;
}
.post-meta {
  font-size: 0.8rem;
  color: #888;
  margin-top: 4px;
}
.post-author {
  margin-top: 4px;
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
}
pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>