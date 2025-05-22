<template>
  <div class="course-detail">
    <v-container>
      <!-- 课程标题和描述 -->
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-2">-----</h1>
          <h1 class="text-h4 mb-2">{{ course?.title }}</h1>
          <p class="course-description">{{ course?.description }}</p>
          <v-chip color="primary" class="mb-4">{{ course?.tag }}</v-chip>
          <!-- 教师编辑课程介绍（仅教师可见） -->
          <v-btn v-if="isTeacher" color="primary" @click="editCourseDescription">编辑课程介绍</v-btn>
        </v-col>
      </v-row>

      <!-- 教师编辑课程介绍对话框 -->
      <v-dialog v-model="editDescriptionDialog" max-width="600">
        <v-card>
          <v-card-title class="headline">编辑课程介绍</v-card-title>
          <v-card-text>
            <v-form ref="descriptionForm" v-model="validDescriptionForm" lazy-validation>
              <v-textarea
                v-model="editedDescription"
                label="课程介绍"
                rows="5"
                required
                :rules="[v => !!v || '课程介绍不能为空']"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="editDescriptionDialog = false">取消</v-btn>
            <v-btn color="blue darken-1" text @click="saveCourseDescription" :disabled="!validDescriptionForm">保存</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 视频列表 -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" class="mb-4">
            <v-card-title>课程视频</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="video in videos" :key="video.id">
                  <v-list-item-content>
                    <v-list-item-title>{{ video.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ video.description || '暂无介绍' }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn color="primary" @click="openVideoDialog(video)">观看视频</v-btn>
                    <v-btn color="primary" text @click="downloadVideo(video.videoUrl)">下载视频</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <p v-if="videos.length === 0">暂无课程视频</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 视频播放对话框 -->
      <v-dialog v-model="videoDialog" max-width="800">
        <v-card>
          <v-card-title class="headline">{{ selectedVideo?.title }}</v-card-title>
          <v-card-text>
            <video controls :src="selectedVideoUrl" style="width: 100%; max-height: 500px;" @error="onVideoError">
              <source :src="selectedVideoUrl" type="video/mp4">
              你的浏览器不支持视频播放。
            </video>
            <p v-if="videoError" class="error-text">{{ videoError }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="videoDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 教师发布视频（仅教师可见） -->
      <v-row v-if="isTeacher">
        <v-col cols="12">
          <v-card elevation="2" class="mb-4">
            <v-card-title>发布新视频</v-card-title>
            <v-card-text>
              <v-form ref="videoForm" v-model="validVideoForm" lazy-validation>
                <v-text-field
                  v-model="newVideo.title"
                  label="视频标题"
                  required
                  :rules="[v => !!v || '标题不能为空']"
                />
                <v-textarea
                  v-model="newVideo.description"
                  label="视频介绍"
                  rows="3"
                  placeholder="请输入视频介绍（可选）"
                />
                <v-file-input
                  v-model="newVideo.file"
                  label="上传视频"
                  accept="video/*"
                  required
                  :rules="[v => !!v || '请上传视频文件', v => !v || v.size < 100000000 || '视频文件大小不能超过 100MB！']"
                />
                <v-btn color="primary" @click="submitVideo" :disabled="!validVideoForm">发布视频</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 作业列表 -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="2" class="mb-4">
            <v-card-title>课程作业</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item v-for="assignment in assignments" :key="assignment.id">
                  <v-list-item-content>
                    <v-list-item-title>{{ assignment.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ assignment.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn v-if="isStudent" color="primary" text @click="openSubmissionDialog(assignment)">提交作业</v-btn>
                    <v-btn color="primary" text @click="viewSubmissions(assignment.id)">查看提交</v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <p v-if="assignments.length === 0">暂无课程作业</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 教师发布作业（仅教师可见） -->
      <v-row v-if="isTeacher">
        <v-col cols="12">
          <v-card elevation="2" class="mb-4">
            <v-card-title>发布新作业</v-card-title>
            <v-card-text>
              <v-form ref="assignmentForm" v-model="validAssignmentForm" lazy-validation>
                <v-text-field
                  v-model="newAssignment.title"
                  label="作业标题"
                  required
                  :rules="[v => !!v || '标题不能为空']"
                />
                <v-textarea
                  v-model="newAssignment.description"
                  label="作业描述"
                  rows="3"
                  required
                  :rules="[v => !!v || '描述不能为空']"
                />
                <v-btn color="primary" @click="publishAssignment" :disabled="!validAssignmentForm">发布作业</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- 学生提交作业对话框 -->
      <v-dialog v-model="submissionDialog" max-width="600">
        <v-card>
          <v-card-title class="headline">提交作业</v-card-title>
          <v-card-text>
            <v-form ref="submissionForm" v-model="validSubmissionForm" lazy-validation>
              <v-textarea
                v-model="submissionContent"
                label="作业内容"
                rows="5"
                required
                :rules="[v => !!v || '内容不能为空']"
              />
              <v-file-input
                v-model="submissionFile"
                label="上传文件（可选）"
                accept="*/*"
              />
              <v-btn color="primary" @click="submitAssignmentContent" :disabled="!validSubmissionForm">提交作业</v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="submissionDialog = false">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 查看提交记录对话框 -->
      <v-dialog v-model="viewSubmissionsDialog" max-width="600">
        <v-card>
          <v-card-title class="headline">作业提交记录</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-for="submission in submissions" :key="submission.id">
                <v-list-item-content>
                  <v-list-item-subtitle>
                    <v-avatar size="24" class="mr-2">
                      <img :src="submission.student?.avatarUrl || 'https://via.placeholder.com/24'" alt="avatar">
                    </v-avatar>
                    {{ submission.student?.username }}
                  </v-list-item-subtitle>
                  <v-list-item-title>{{ submission.content }}</v-list-item-title>
                  <v-list-item-subtitle v-if="submission.fileUrl">
                    <a :href="submission.fileUrl" download>下载提交文件</a>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>{{ submission.submittedAt }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <p v-if="submissions.length === 0">暂无提交记录</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="viewSubmissionsDialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CourseDetail',
  data() {
    return {
      course: null,
      videos: [],
      assignments: [],
      submissions: [],
      isTeacher: false,
      isStudent: false,
      validVideoForm: true,
      validAssignmentForm: true,
      validSubmissionForm: true,
      validDescriptionForm: true,
      newVideo: {
        title: '',
        description: '',
        file: null
      },
      newAssignment: {
        title: '',
        description: ''
      },
      submissionDialog: false,
      viewSubmissionsDialog: false,
      editDescriptionDialog: false,
      videoDialog: false,
      selectedVideo: null,
      selectedVideoUrl: '',
      videoError: '',
      submissionContent: '',
      submissionFile: null,
      editedDescription: '',
      currentAssignment: null
    };
  },
  methods: {
    async fetchCourse() {
      const courseId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/${courseId}`);
        this.course = response.data;
        console.log('获取课程详情成功:', this.course);
        this.editedDescription = this.course.description;
      } catch (error) {
        console.error('获取课程详情失败:', error);
        alert('无法加载课程详情，请稍后重试');
      }
    },
    async fetchVideos() {
      const courseId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/${courseId}/videos`);
        this.videos = response.data;
        console.log('获取视频列表成功:', this.videos);
      } catch (error) {
        console.error('获取视频列表失败:', error);
        alert('无法加载视频列表，请稍后重试');
      }
    },
    async fetchAssignments() {
      const courseId = this.$route.params.id;
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/${courseId}/assignments`);
        this.assignments = response.data;
        console.log('获取作业列表成功:', this.assignments);
        await this.checkUserRole();
      } catch (error) {
        console.error('获取作业列表失败:', error);
        alert('无法加载作业列表，请稍后重试');
      }
    },
    openVideoDialog(video) {
      this.selectedVideo = video;
      const backendUrl = 'http://localhost:8080';
      this.selectedVideoUrl = `${backendUrl}${video.videoUrl}`;
      this.videoError = '';
      this.videoDialog = true;
    },
    onVideoError(event) {
      console.error('视频加载失败:', event);
      this.videoError = '无法加载视频，请检查文件是否可用或联系管理员！';
    },
    watchVideo(video) {
      const backendUrl = 'http://localhost:8080';
      const videoUrl = `${backendUrl}${video.videoUrl}`;
      window.open(videoUrl, '_blank');
    },
    async downloadVideo(videoUrl) {
      console.log('尝试下载视频:', videoUrl);
      try {
        const response = await fetch(`http://localhost:8080/api/courses/videos/download?videoUrl=${encodeURIComponent(videoUrl)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, application/octet-stream'
          }
        });
        if (!response.ok) {
          let errorMessage = '下载失败：未知错误';
          try {
            const errorData = await response.json();
            if (response.status === 404) {
              errorMessage = '下载失败：视频文件未找到！错误信息：' + errorData.error;
              alert(errorMessage + '\n请尝试重新上传视频，或者联系管理员检查文件路径！');
            } else if (response.status === 403) {
              errorMessage = '下载失败：文件不可读！错误信息：' + errorData.error;
              alert(errorMessage + '\n请检查文件权限，确保文件可读！');
            } else {
              errorMessage = '下载失败：' + (errorData.error || response.statusText);
              alert(errorMessage);
            }
          } catch (jsonError) {
            errorMessage = '下载失败：' + response.statusText;
            alert(errorMessage + '\n后端返回了错误，但无法解析详细信息，请检查后端日志！');
          }
          console.error(errorMessage);
          return;
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = videoUrl.split('/').pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        console.log('视频下载成功:', videoUrl);
        alert('视频下载成功！');
      } catch (error) {
        console.error('下载视频失败:', error);
        alert('下载视频失败，请检查网络连接或稍后重试！\n错误详情：' + error.message);
      }
    },
    async submitVideo() {
      if (this.$refs.videoForm.validate()) {
        const teacherId = localStorage.getItem('loggedInUserId');
        if (!teacherId) {
          alert('请先登录！');
          this.$router.push('/');
          return;
        }
        const courseId = this.$route.params.id;
        const formData = new FormData();
        formData.append('title', this.newVideo.title);
        formData.append('description', this.newVideo.description);
        formData.append('videoFile', this.newVideo.file);
        formData.append('teacherId', teacherId);
        try {
          const response = await axios.post(`http://localhost:8080/api/courses/${courseId}/videos`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log('发布视频成功:', response.data);
          this.newVideo = { title: '', description: '', file: null };
          this.fetchVideos();
          alert('视频发布成功！');
        } catch (error) {
          console.error('发布视频失败:', error);
          if (error.response && error.response.status === 413) {
            alert('发布视频失败：视频文件过大，请上传小于 100MB 的文件！');
          } else if (error.response && error.response.status === 500) {
            alert('发布视频失败：服务器内部错误，可能是文件保存路径问题，请联系管理员！');
          } else if (error.code === 'ERR_NETWORK') {
            alert('发布视频失败：网络错误，请检查网络连接或稍后重试！');
          } else {
            alert('发布视频失败：' + (error.message || '未知错误，请稍后重试'));
          }
        }
      }
    },
    editCourseDescription() {
      this.editedDescription = this.course.description;
      this.editDescriptionDialog = true;
    },
    async saveCourseDescription() {
      if (this.$refs.descriptionForm.validate()) {
        const courseId = this.$route.params.id;
        try {
          const response = await axios.put(`http://localhost:8080/api/courses/${courseId}`, {
            description: this.editedDescription
          });
          console.log('更新课程介绍成功:', response.data);
          this.course.description = this.editedDescription;
          this.editDescriptionDialog = false;
          alert('课程介绍更新成功！');
        } catch (error) {
          console.error('更新课程介绍失败:', error);
          alert('更新课程介绍失败，请稍后重试');
        }
      }
    },
    openSubmissionDialog(assignment) {
      this.currentAssignment = assignment;
      this.submissionDialog = true;
    },
    async publishAssignment() {
      if (this.$refs.assignmentForm.validate()) {
        const teacherId = localStorage.getItem('loggedInUserId');
        if (!teacherId) {
          alert('请先登录！');
          this.$router.push('/');
          return;
        }
        const courseId = this.$route.params.id;
        try {
          const response = await axios.post(`http://localhost:8080/api/courses/${courseId}/assignments`, {
            title: this.newAssignment.title,
            description: this.newAssignment.description,
            teacherId: teacherId
          });
          console.log('发布作业成功:', response.data);
          this.newAssignment = { title: '', description: '' };
          this.fetchAssignments();
          alert('作业发布成功！');
        } catch (error) {
          console.error('发布作业失败:', error);
          alert('发布作业失败，请稍后重试');
        }
      }
    },
    async submitAssignmentContent() {
      if (this.$refs.submissionForm.validate()) {
        const studentId = localStorage.getItem('loggedInUserId') || 1;
        const courseId = this.$route.params.id;
        const assignmentId = this.currentAssignment.id;
        const formData = new FormData();
        formData.append('content', this.submissionContent);
        if (this.submissionFile) {
          formData.append('file', this.submissionFile);
        }
        formData.append('studentId', studentId);
        try {
          const response = await axios.post(
            `http://localhost:8080/api/courses/${courseId}/assignments/${assignmentId}/submissions`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          console.log('提交作业成功:', response.data);
          this.submissionDialog = false;
          this.submissionContent = '';
          this.submissionFile = null;
          this.fetchAssignments();
          alert('作业提交成功！');
        } catch (error) {
          console.error('提交作业失败:', error);
          alert('提交作业失败，请稍后重试');
        }
      }
    },
    async viewSubmissions(assignmentId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/courses/${this.$route.params.id}/assignments/${assignmentId}/submissions`);
        this.submissions = response.data;
        console.log('获取提交记录成功:', this.submissions);
        this.viewSubmissionsDialog = true;
      } catch (error) {
        console.error('获取提交记录失败:', error);
        alert('无法加载提交记录，请稍后重试');
      }
    },
    async checkUserRole() {
      const userId = localStorage.getItem('loggedInUserId');
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/id/${userId}`);
          const role = response.data.role;
          this.isTeacher = role === 'TEACHER';
          this.isStudent = role === 'STUDENT';
          console.log('用户角色:', role, '是否为教师:', this.isTeacher, '是否为学生:', this.isStudent);
          if (this.isTeacher) {
            this.isStudent = false;
          } else if (this.isStudent) {
            this.isTeacher = false;
          }
        } catch (error) {
          console.error('获取用户角色失败:', error);
          this.isStudent = true;
          this.isTeacher = false;
          console.log('用户角色获取失败，默认角色为学生');
        }
      } else {
        this.isStudent = true;
        this.isTeacher = false;
        console.log('未登录用户，默认角色为学生');
      }
    }
  },
  mounted() {
    this.fetchCourse();
    this.fetchVideos();
    this.fetchAssignments();
    this.checkUserRole();
  }
};
</script>

<style scoped>
.course-detail {
  padding: 20px;
  background-color: #f5f5f5;
}
h1 {
  color: #1f2a44;
  font-weight: bold;
}
.course-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
}
pre {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}
.error-text {
  color: red;
  margin-top: 10px;
}
</style>