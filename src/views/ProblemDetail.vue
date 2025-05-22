<template>
  <div class="problem-detail">
    <v-container>
      <v-row>
        <!-- 左侧：题目描述 -->
        <v-col cols="12" md="6">
          <v-card class="problem-card" elevation="2">
            <v-card-title class="headline">{{ problem.title }}</v-card-title>
            <v-card-text>
              <p><strong>描述：</strong></p>
              <p>{{ problem.description }}</p>
              <p><strong>测试用例输入：</strong></p>
              <pre>{{ problem.testCaseInput }}</pre>
              <p><strong>测试用例输出：</strong></p>
              <pre>{{ problem.testCaseOutput }}</pre>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- 右侧：代码编辑器 -->
        <v-col cols="12" md="6">
          <v-card class="code-card" elevation="2">
            <v-card-title class="headline">代码编辑</v-card-title>
            <v-card-text>
              <!-- 语言选择 -->
              <v-select
                v-model="selectedLanguage"
                :items="languages"
                label="选择语言"
                outlined
                dense
                @change="updateCodeTemplate"
              ></v-select>

              <!-- CodeMirror 6 编辑器 -->
              <div ref="editor" class="code-editor"></div>

              <!-- 提交按钮 -->
              <v-btn color="primary" class="mt-4 mr-2" @click="submitCode">提交代码</v-btn>
              <v-btn color="secondary" class="mt-4" @click="resetCode">重置代码</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { defaultKeymap } from '@codemirror/commands';
import axios from 'axios';

export default {
  name: 'ProblemDetail',
  props: {
    problemId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      problem: {
        problemId: null,
        title: '加载中...',
        description: '',
        testCaseInput: '',
        testCaseOutput: ''
      },
      languages: [
        { text: 'Python', value: 'python' },
        { text: 'JavaScript', value: 'javascript' }
      ],
      selectedLanguage: 'python',
      codeTemplates: {
        python: 'def twoSum(nums, target):\n    # 你的代码\n    pass',
        javascript: 'function twoSum(nums, target) {\n    // 你的代码\n}'
      },
      code: '',
      editorView: null
    };
  },
  mounted() {
    console.log('ProblemDetail 加载，problemId:', this.problemId);
    this.updateCodeTemplate();
    this.loadProblem();
    this.initEditor();
  },
  beforeDestroy() {
    if (this.editorView) {
      this.editorView.destroy();
    }
  },
  methods: {
    async loadProblem() {
      try {
        const response = await axios.get(`http://localhost:8080/api/problems/${this.problemId}`);
        console.log('题目数据:', response.data);
        this.problem = response.data;
      } catch (error) {
        console.error('加载题目失败:', error);
        this.problem.title = '加载失败';
        this.problem.description = '无法加载题目，请检查网络或后端服务';
      }
    },
    initEditor() {
      const startState = EditorState.create({
        doc: this.code,
        extensions: [
          lineNumbers(),
          this.selectedLanguage === 'python' ? python() : javascript(),
          oneDark,
          keymap.of(defaultKeymap),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              this.code = update.state.doc.toString();
            }
          })
        ]
      });

      this.editorView = new EditorView({
        state: startState,
        parent: this.$refs.editor
      });
    },
    updateCodeTemplate() {
      this.code = this.codeTemplates[this.selectedLanguage];
      if (this.editorView) {
        this.editorView.destroy();
      }
      this.initEditor();
    },
    resetCode() {
      this.code = this.codeTemplates[this.selectedLanguage];
      if (this.editorView) {
        this.editorView.destroy();
      }
      this.initEditor();
    },
    async submitCode() {
      try {
        const studentId = localStorage.getItem('loggedInUserId');
        if (!studentId) {
          alert('请先登录！');
          this.$router.push('/');
          return;
        }
        const response = await axios.post('http://localhost:8080/api/submissions', null, {
          params: {
            studentId: studentId,
            problemId: this.problemId,
            code: this.code
          }
        });
        console.log('提交成功:', response.data);
        alert('提交成功！结果：' + response.data.result);
        this.$router.push({
          name: 'SubmissionResult',
          params: { submissionId: response.data.id },
          query: {
            status: response.data.result,
            message: response.data.result === '通过' ? '答案正确！' : '答案错误，请检查你的代码！',
            output: response.data.result === '通过' ? this.problem.testCaseOutput : '无'
          }
        });
      } catch (error) {
        console.error('提交代码失败:', error);
        if (error.response) {
          alert('提交代码失败：' + (error.response.data || '服务器错误，请检查后端服务'));
        } else {
          alert('提交代码失败：网络错误，请检查网络连接');
        }
      }
    }
  }
};
</script>

<style scoped>
.problem-detail {
  padding: 20px;
  background-color: #f5f5f5;
}
.problem-card, .code-card {
  background-color: #fff;
  border-radius: 8px;
}
.headline {
  color: #1f2a44;
  font-weight: bold;
}
pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
.code-editor {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  height: 400px;
}
</style>