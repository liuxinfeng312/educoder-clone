<template>
  <div class="user-profile">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">用户信息编辑</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title>编辑个人信息</v-card-title>
            <v-card-text>
              <!-- 头像预览和上传 -->
              <v-row class="mb-4">
                <v-col cols="12">
                  <v-avatar size="100" class="mb-2">
                    <img :src="userInfo.avatar || 'https://via.placeholder.com/100'" alt="头像">
                  </v-avatar>
                  <v-file-input
                    v-model="avatarFile"
                    label="上传新头像"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    @change="handleAvatarUpload"
                  />
                </v-col>
              </v-row>
              <!-- 个人信息表单 -->
              <v-form ref="profileForm" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="userInfo.username"
                  label="用户名"
                  required
                  :rules="usernameRules"
                  disabled
                />
                <v-text-field
                  v-model="userInfo.nickname"
                  label="昵称"
                  :rules="nicknameRules"
                />
                <v-text-field
                  v-model="userInfo.email"
                  label="邮箱"
                  :rules="emailRules"
                />
                <v-text-field
                  v-model="userInfo.password"
                  label="新密码（可选）"
                  type="password"
                  :rules="passwordRules"
                />
                <v-select
                  v-model="userInfo.role"
                  :items="roles"
                  label="角色"
                  required
                  :rules="[v => !!v || '请选择角色']"
                  disabled
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="primary" @click="updateProfile" :disabled="!valid">保存</v-btn>
              <v-btn color="grey" text @click="$router.push('/')">取消</v-btn>
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
  name: 'UserProfile',
  data() {
    return {
      valid: true,
      userInfo: {
        username: '',
        nickname: '',
        email: '',
        password: '',
        role: '',
        avatar: ''
      },
      avatarFile: null,
      roles: ['STUDENT', 'TEACHER', 'ADMIN'],
      usernameRules: [v => !!v || '用户名不能为空'],
      nicknameRules: [v => true], // 允许昵称为空
      emailRules: [
        v => true, // 允许邮箱为空
        v => !v || /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
      ],
      passwordRules: [
        v => !v || v.length >= 6 || '密码长度至少为6位'
      ]
    };
  },
  methods: {
    fetchUserInfo() {
      // 直接使用 localStorage 中的用户名，或者默认用户
      const username = localStorage.getItem('loggedInUser') || 'testuser';
      this.userInfo.username = username;
      console.log('发送获取用户请求，用户名:', username);
      axios.get(`http://localhost:8080/api/users/${username}`)
        .then(response => {
          console.log('获取用户信息成功:', response.data);
          if (response.data) {
            this.userInfo = {
              username: response.data.username,
              nickname: response.data.nickname || '未设置',
              email: response.data.email || '未设置',
              password: '',
              role: response.data.role,
              avatar: response.data.avatarUrl || ''
            };
          }
        })
        .catch(error => {
          console.error('获取用户信息失败:', error);
          alert('无法加载用户信息，请稍后重试');
        });
    },
    handleAvatarUpload(file) {
      if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        console.log('发送上传头像请求，文件名:', file.name);
        axios.post('http://localhost:8080/api/users/upload-avatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            console.log('上传头像成功:', response.data);
            this.userInfo.avatar = response.data.avatarUrl;
            alert('头像上传成功！');
          })
          .catch(error => {
            console.error('头像上传失败:', error);
            alert('头像上传失败，请稍后重试');
          });
      }
    },
    updateProfile() {
      if (this.$refs.profileForm.validate()) {
        console.log('发送更新用户请求:', this.userInfo);
        axios.put(`http://localhost:8080/api/users/${this.userInfo.username}`, {
          username: this.userInfo.username,
          nickname: this.userInfo.nickname === '未设置' ? '' : this.userInfo.nickname,
          email: this.userInfo.email === '未设置' ? '' : this.userInfo.email,
          password: this.userInfo.password,
          role: this.userInfo.role,
          avatarUrl: this.userInfo.avatar
        })
          .then(response => {
            console.log('更新用户信息成功:', response.data);
            alert('个人信息更新成功！');
            this.$router.push('/');
          })
          .catch(error => {
            console.error('更新用户信息失败:', error);
            alert('更新失败，错误: ' + (error.response ? error.response.data : error.message));
          });
      }
    }
  },
  mounted() {
    this.fetchUserInfo();
  }
};
</script>

<style scoped>
.user-profile {
  padding: 20px;
  background-color: #f5f5f5;
}
h1 {
  color: #1f2a44;
  font-weight: bold;
}
</style>