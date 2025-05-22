<template>
  <div class="discussion-forum">
    <v-container>
      <!-- 左侧内容 -->
      <v-row>
        <v-col cols="12" md="8">
          <!-- 发帖 -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="headline">发表新帖子</v-card-title>
            <v-card-text>
              <v-form ref="postForm" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="newPost.title"
                  label="标题"
                  required
                  :rules="[v => !!v || '标题不能为空']"
                ></v-text-field>
                <v-textarea
                  v-model="newPost.content"
                  label="内容"
                  rows="3"
                  required
                  :rules="[v => !!v || '内容不能为空']"
                ></v-textarea>
                <v-text-field
                  v-model="newPost.category"
                  label="分类"
                  required
                  :rules="[v => !!v || '分类不能为空']"
                ></v-text-field>
                <v-btn color="primary" @click="submitPost" :disabled="!valid">发表</v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- 最新问题 -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="headline">论坛交流</v-card-title>
            <v-card-text>
              <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
              <v-list v-if="posts.length > 0">
                <v-list-item v-for="post in posts" :key="post.id" @click="goToPostDetail(post.id)">
                  <v-list-item-title class="post-title">
                    <v-chip small class="mr-2" color="blue" text-color="white">{{ post.category }}</v-chip>
                    {{ post.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="post-meta">
                    <span class="mr-4">{{ post.views }} 浏览</span>
                    <span class="mr-4">{{ post.likes }} 赞</span>
                    <span>{{ post.replies ? post.replies.length : 0 }} 回复</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="post-author">
                    <v-avatar size="24" class="mr-2">
                      <img :src="post.author?.avatarUrl || 'https://via.placeholder.com/24'" alt="avatar">
                    </v-avatar>
                    {{ post.author?.username }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <p v-else>暂无帖子</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 右侧侧边栏 -->
        <v-col cols="12" md="4">
          <!-- 文档协作入口 -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="headline">文档协作</v-card-title>
            <v-card-text>
              <v-btn color="primary" @click="$router.push('/document-collaboration')">进入文档协作</v-btn>
            </v-card-text>
          </v-card>

          <!-- 推广 banner -->
          <v-card class="mb-4 banner-card" elevation="2">
            <v-card-text class="banner-content">
              <h3 class="banner-title">“强基计划”高阶算法青训营</h3>
              <v-btn color="primary" class="mt-2">了解详情</v-btn>
              <v-btn color="primary" outlined class="mt-2 ml-2">免费体验</v-btn>
            </v-card-text>
          </v-card>

          <!-- 热门标签 -->
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
  name: 'DiscussionForum',
  data() {
    return {
      valid: true,
      posts: [],
      tags: [
        'AngularJS', 'Python编程', 'Bootstrap', '其它',
        '云计算建模平台', 'C++编程', 'C#', 'Java', 'Ansible'
      ],
      newPost: {
        title: '',
        content: '',
        category: '',
        authorId: null
      },
      errorMessage: ''
    };
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get('http://localhost:8080/api/forum/posts');
        this.posts = response.data;
        console.log('获取帖子列表成功:', this.posts);
      } catch (error) {
        console.error('获取帖子列表失败:', error);
        if (error.response) {
          this.errorMessage = '无法加载帖子列表：' + (error.response.data || '服务器错误，请检查后端服务');
        } else {
          this.errorMessage = '无法加载帖子列表：网络错误，请检查网络连接';
        }
      }
    },
    async submitPost() {
      if (this.$refs.postForm.validate()) {
        const authorId = localStorage.getItem('loggedInUserId');
        if (!authorId) {
          alert('请先登录！');
          this.$router.push('/');
          return;
        }
        try {
          const response = await axios.post('http://localhost:8080/api/forum/posts', {
            title: this.newPost.title,
            content: this.newPost.content,
            category: this.newPost.category,
            authorId: parseInt(authorId)
          });
          console.log('发表帖子成功:', response.data);
          this.newPost = { title: '', content: '', category: '', authorId: null };
          this.fetchPosts(); // 刷新帖子列表
        } catch (error) {
          console.error('发表帖子失败:', error);
          alert('发表帖子失败，请稍后重试');
        }
      }
    },
    goToPostDetail(postId) {
      console.log('跳转到帖子详情页，帖子 ID:', postId);
      this.$router.push(`/discussion-forum/${postId}`);
    }
  },
  mounted() {
    this.fetchPosts();
    const authorId = localStorage.getItem('loggedInUserId');
    if (authorId) {
      this.newPost.authorId = parseInt(authorId);
    }
  }
};
</script>

<style scoped>
.discussion-forum {
  padding: 20px;
  background-color: #f5f5f5;
}
.headline {
  color: #1f2a44;
  font-weight: bold;
  font-size: 1.2rem;
}
.post-title {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2a44;
  line-height: 1.5;
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
.banner-card {
  background: linear-gradient(135deg, #ff6f61 0%, #ff9f7f 100%);
  color: #fff;
  text-align: center;
}
.banner-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error {
  color: red;
}
</style>