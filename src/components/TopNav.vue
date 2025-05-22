<template>
  <v-app-bar app color="#1F2A44" dark flat>
    <v-toolbar-title class="nav-title">首页</v-toolbar-title>
    <v-spacer />
    <v-btn text class="nav-btn">教学管理</v-btn>
    <v-btn text class="nav-btn">开发项目</v-btn>
    <v-btn text class="nav-btn">竞赛组织</v-btn>
    <v-btn text class="nav-btn">毕业设计</v-btn>
    <v-btn text class="nav-btn">编程问题</v-btn>
    <v-btn text class="nav-btn" @click="navigateToDiscussionForum">交流论坛</v-btn>
    <v-btn text class="nav-btn" @click="navigateToFeaturedCourses">精选课程</v-btn>
    <v-btn text class="nav-btn" @click="navigateToUserProfile">个人资料</v-btn>
    <v-btn text class="nav-btn" @click="showLoginDialog = true" v-if="!loggedInUser">登录/注册</v-btn>
    <v-spacer />
    <div v-if="loggedInUser" class="user-section">
      <span class="username" @click="navigateToUserProfile" style="cursor: pointer;">{{ loggedInUser }}</span>
      <v-btn text class="nav-btn" @click="logout">退出</v-btn>
    </div>
    <v-btn icon class="nav-icon">
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn icon class="nav-icon">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="showLoginDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">登录</v-card-title>
        <v-card-text>
          <v-form ref="loginForm" v-model="valid" lazy-validation>
            <v-text-field v-model="username" label="用户名" required :rules="usernameRules" />
            <v-text-field v-model="password" label="密码" type="password" required :rules="passwordRules" />
          </v-form>
          <v-btn text @click="showRegisterDialog = true; showLoginDialog = false">还没有账号？注册</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="showLoginDialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="login">登录</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showRegisterDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">注册</v-card-title>
        <v-card-text>
          <v-form ref="registerForm" v-model="validRegister" lazy-validation>
            <v-text-field v-model="registerUsername" label="用户名" required :rules="usernameRules" />
            <v-text-field v-model="registerPassword" label="密码" type="password" required :rules="passwordRules" />
            <v-select v-model="registerRole" :items="roles" label="角色" required :rules="[v => !!v || '请选择角色']" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="showRegisterDialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="register">注册</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app-bar>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TopNav',
  data() {
    return {
      showLoginDialog: false,
      showRegisterDialog: false,
      valid: true,
      validRegister: true,
      username: '',
      password: '',
      registerUsername: '',
      registerPassword: '',
      registerRole: '',
      roles: ['STUDENT', 'TEACHER', 'ADMIN'],
      usernameRules: [v => !!v || '用户名不能为空'],
      passwordRules: [v => !!v || '密码不能为空'],
      loggedInUser: null
    };
  },
  methods: {
    login() {
      if (this.$refs.loginForm.validate()) {
        console.log('发送登录请求:', { username: this.username, password: this.password });
        axios.post('http://localhost:8080/api/users/login', {
          username: this.username,
          password: this.password
        })
          .then(response => {
            console.log('登录响应:', response.data);
            if (response.data && response.data.user) {
              this.loggedInUser = response.data.user.username;
              localStorage.setItem('loggedInUser', this.loggedInUser);
              localStorage.setItem('loggedInUserId', response.data.user.id);
              console.log('登录成功，存储 loggedInUser:', this.loggedInUser, 'loggedInUserId:', response.data.user.id);
              alert('登录成功！用户角色：' + response.data.user.role);
              this.showLoginDialog = false;
            } else {
              alert('登录失败，请检查用户名或密码！');
            }
          })
          .catch(error => {
            console.error('登录失败:', error);
            let errorMessage = '登录失败，错误未知';
            if (error.response) {
              errorMessage = `登录失败，状态码: ${error.response.status}, 错误: ${JSON.stringify(error.response.data || '无详细错误信息')}`;
            } else if (error.request) {
              errorMessage = '登录失败，服务器无响应，请检查网络连接或后端服务是否运行';
            } else {
              errorMessage = `登录失败，错误: ${error.message}`;
            }
            alert(errorMessage);
          });
      }
    },
    register() {
      if (this.$refs.registerForm.validate()) {
        console.log('发送注册请求:', {
          username: this.registerUsername,
          password: this.registerPassword,
          role: this.registerRole
        });
        axios.post('http://localhost:8080/api/users/register', {
          username: this.registerUsername,
          password: this.registerPassword,
          role: this.registerRole
        })
          .then(response => {
            console.log('注册响应:', response.data);
            alert(response.data.message);
            this.showRegisterDialog = false;
            this.showLoginDialog = true;
          })
          .catch(error => {
            console.error('注册失败:', error);
            let errorMessage = '注册失败，错误未知';
            if (error.response) {
              errorMessage = `注册失败，状态码: ${error.response.status}, 错误: ${JSON.stringify(error.response.data || '无详细错误信息')}`;
            } else if (error.request) {
              errorMessage = '注册失败，服务器无响应，请检查网络连接或后端服务是否运行';
            } else {
              errorMessage = `注册失败，错误: ${error.message}`;
            }
            alert(errorMessage);
          });
      }
    },
    logout() {
      console.log('用户退出登录，清除 loggedInUser');
      this.loggedInUser = null;
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('loggedInUserId');
      alert('已退出登录');
      this.$router.push('/');
    },
    navigateToFeaturedCourses() {
      console.log('跳转到精选课程页面');
      this.$router.push('/featured-courses');
    },
    navigateToDiscussionForum() {
      console.log('跳转到交流论坛页面');
      this.$router.push('/discussion-forum');
    },
    navigateToUserProfile() {
      console.log('跳转到用户个人资料页面');
      this.$router.push('/user-profile');
    }
  },
  mounted() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.loggedInUser = storedUser;
      console.log('从 localStorage 加载 loggedInUser:', this.loggedInUser);
    }
  }
};
</script>

<style scoped>
.nav-title { font-size: 1.2rem; font-weight: bold; }
.nav-btn { color: #fff !important; margin: 0 8px; font-size: 0.9rem; }
.nav-icon { margin: 0 4px; }
.user-section {
  display: flex;
  align-items: center;
  margin-right: 16px;
}
.username {
  color: #fff;
  font-size: 1rem;
  margin-right: 8px;
}
</style>