<template>
  <div class="ai-practice">
    <v-container>
      <!-- 标题 -->
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-6">---</h1>
       
          <h1 class="text-h4 mb-6">AI 练习</h1>
        </v-col>
      </v-row>

      <!-- 教师发布题目（仅教师可见） -->
      <v-row v-if="isTeacher">
        <v-col cols="12">
          <v-card elevation="2" class="mb-4">
            <v-card-title>发布新题目</v-card-title>
            <v-card-text>
              <v-form ref="problemForm" v-model="validProblemForm" lazy-validation>
                <v-text-field
                  v-model="newProblem.title"
                  label="题目标题"
                  required
                  :rules="[v => !!v || '标题不能为空']"
                />
                <v-textarea
                  v-model="newProblem.description"
                  label="题目描述"
                  rows="3"
                  required
                  :rules="[v => !!v || '描述不能为空']"
                />
                <v-textarea
                  v-model="newProblem.testCaseInput"
                  label="测试用例输入"
                  rows="2"
                  required
                  :rules="[v => !!v || '测试用例输入不能为空']"
                />
                <v-textarea
                  v-model="newProblem.testCaseOutput"
                  label="测试用例输出"
                  rows="2"
                  required
                  :rules="[v => !!v || '测试用例输出不能为空']"
                />
                <v-btn color="primary" @click="publishProblem" :disabled="!validProblemForm">发布题目</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 题目列表 -->
      <v-row>
        <v-col cols="12">
          <v-card class="stats-card" elevation="2">
            <v-card-text>
              <v-list>
                <v-list-item v-for="problem in problems" :key="problem.problemId">
                  <v-list-item-content>
                    <v-list-item-title>{{ problem.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ problem.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn color="primary" @click="goToProblem(problem.problemId)">做题</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <p v-if="problems.length === 0">暂无题目</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 排行榜 -->
      <v-row>
        <v-col cols="12">
          <h2 class="text-h5 mb-4">排行榜</h2>
          <v-card class="ranking-card" elevation="2">
            <v-card-text>
              <v-row class="ranking-header">
                <v-col cols="2">项目名称</v-col>
                <v-col cols="2">做对题数</v-col>
                <v-col cols="2">正确率</v-col>
                <v-col cols="2">简单</v-col>
                <v-col cols="2">简单数</v-col>
                <v-col cols="2">累计耗时</v-col>
              </v-row>
              <v-row v-for="user in ranking" :key="user.id" class="ranking-row">
                <v-col cols="2">{{ user.name }}</v-col>
                <v-col cols="2">{{ user.correct }}</v-col>
                <v-col cols="2">{{ user.accuracy }}%</v-col>
                <v-col cols="2">简单</v-col>
                <v-col cols="2">{{ user.score }}</v-col>
                <v-col cols="2">-</v-col>
              </v-row>
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
  name: 'AIPractice',
  data() {
    return {
      ranking: [
        { id: 1, name: 'sule', correct: 85, accuracy: 47, score: 90589 },
        { id: 2, name: '朱雀 云归', correct: 153, accuracy: 56, score: 63493 },
        { id: 3, name: 'wen', correct: 105, accuracy: 58, score: 50048 },
        { id: 4, name: '浩冉', correct: 163, accuracy: 72, score: 38470 },
        { id: 5, name: 'ETO', correct: 136, accuracy: 72, score: 41272 }
      ],
      isTeacher: false,
      validProblemForm: true,
      newProblem: {
        title: '',
        description: '',
        testCaseInput: '',
        testCaseOutput: ''
      },
      problems: []
    };
  },
  methods: {
    goToProblem(problemId) {
      console.log('跳转到题目详情，problemId:', problemId);
      this.$router.push({ name: 'ProblemDetail', params: { problemId: problemId } })
        .then(() => {
          console.log('跳转成功');
        })
        .catch(err => {
          console.error('跳转失败:', err);
        });
    },
    async fetchProblems() {
      try {
        const response = await axios.get('http://localhost:8080/api/problems');
        this.problems = response.data;
        console.log('获取题目列表成功:', this.problems);
      } catch (error) {
        console.error('获取题目列表失败:', error);
        if (error.response) {
          alert('无法加载题目列表：' + (error.response.data || '服务器错误，请检查后端服务'));
        } else {
          alert('无法加载题目列表：网络错误，请检查网络连接');
        }
      }
    },
    async publishProblem() {
      if (this.$refs.problemForm.validate()) {
        const teacherId = localStorage.getItem('loggedInUserId');
        if (!teacherId) {
          alert('请先登录！');
          this.$router.push('/');
          return;
        }
        try {
          const response = await axios.post('http://localhost:8080/api/problems', null, {
            params: {
              title: this.newProblem.title,
              description: this.newProblem.description,
              testCaseInput: this.newProblem.testCaseInput,
              testCaseOutput: this.newProblem.testCaseOutput,
              teacherId: teacherId
            }
          });
          console.log('发布题目成功:', response.data);
          this.newProblem = { title: '', description: '', testCaseInput: '', testCaseOutput: '' };
          this.fetchProblems();
          alert('题目发布成功！');
        } catch (error) {
          console.error('发布题目失败:', error);
          alert('发布题目失败，请稍后重试');
        }
      }
    },
    async checkUserRole() {
      const userId = localStorage.getItem('loggedInUserId');
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/id/${userId}`);
          const role = response.data.role;
          this.isTeacher = role === 'TEACHER';
          console.log('用户角色:', role, '是否为教师:', this.isTeacher);
        } catch (error) {
          console.error('获取用户角色失败:', error);
          this.isTeacher = false;
          console.log('用户角色获取失败，默认角色为学生');
        }
      } else {
        this.isTeacher = false;
        console.log('未登录用户，默认角色为学生');
      }
    }
  },
  mounted() {
    this.checkUserRole();
    this.fetchProblems();
  }
};
</script>

<style scoped>
.ai-practice {
  padding: 20px;
  background-color: #f5f5f5;
}
h1, h2 {
  color: #1f2a44;
  font-weight: bold;
}
.stats-card, .ranking-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
}
.stat-item {
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s;
}
.stat-item:hover {
  background-color: #e0f7fa;
}
.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2a44;
  margin-bottom: 0;
}
.stats-row {
  margin-bottom: 20px;
}
.ranking-header {
  font-weight: bold;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
.ranking-row {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.ranking-row:last-child {
  border-bottom: none;
}
</style>