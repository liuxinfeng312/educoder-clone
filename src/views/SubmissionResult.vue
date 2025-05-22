<template>
  <div class="submission-result">
    <v-container>
      <h1 class="text-h4 mb-6">提交结果</h1>
      <v-card elevation="2">
        <v-card-title>结果详情</v-card-title>
        <v-card-text>
          <p><strong>提交 ID：</strong> {{ submissionId }}</p>
          <p><strong>状态：</strong> {{ result.status }}</p>
          <p v-if="result.message"><strong>信息：</strong> {{ result.message }}</p>
          <p v-if="result.output"><strong>输出：</strong> {{ result.output }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" to="/ai-practice">返回练习</v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'SubmissionResult',
  props: {
    submissionId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      result: {
        status: '通过',
        message: '答案正确！',
        output: '[0, 1]'
      }
    };
  },
  mounted() {
    // 模拟从后端加载提交结果
    // 实际中可以使用 axios.get(`/api/submission/${this.submissionId}`) 获取结果
    console.log(`加载提交结果，ID: ${this.submissionId}`);
  }
};
</script>

<style scoped>
.submission-result {
  padding: 20px;
  background-color: #f5f5f5;
}
h1 {
  color: #1f2a44;
  font-weight: bold;
}
</style>