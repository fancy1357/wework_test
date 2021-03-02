<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加和搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格展示区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enabled" @change="handleUserStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改用户信息 -->
            <el-tooltip effect="dark" content="修改用户信息" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 删除用户 -->
            <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 配置用户 -->
            <el-tooltip effect="dark" content="配置用户" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <el-pagination @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" :current-page="queryInfo.page" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" @close="handleAddDialogClosed" :visible.sync="addDialogVisible" width="50%" center>
      <!-- 添加用户表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!--  -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="编辑用户" @close="handleEditDialogClosed" :visible.sync="editDialogVisible" width="50%" center>
      <!-- 编辑用户表单区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <!--  -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
  },
  data() {
    var checkMail = (rule, value, callback) => {
      // 邮箱验证正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return callback();
      }

      callback(new Error('请输入合法的邮箱'));
    };

    return {
      queryInfo: {
        query: '',
        page: 1,
        per_page: 2,
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框显示或隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
      },
      // 添加用户的表单规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { max: 16, message: '用户名在16个字符以内', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码在6至16个字符之间', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' },
        ]
      },
      // 控制编辑用户对话框显示或隐藏
      editDialogVisible: false,
      // 编辑用户的表单数据
      editForm: {
      },
      // 编辑用户的表单规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkMail, trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get('/search/users', { params: this.queryInfo });
      // 获取失败
      if (res.status !== 200) return this.$message.error('获取用户列表失败');
      // 获取成功
      this.userList = res.data.items;
      this.total = res.data.total;
    },
    handlePageSizeChange(newSize) {
      this.queryInfo.per_page = newSize;
      this.getUserList();
    },
    handleCurrentPageChange(newPage) {
      this.queryInfo.page = newPage;
      this.getUserList();
    },
    async handleUserStateChange(userInfo) {
      const { data: res } = await this.$axios.patch('/users/' + userInfo.id, { enabled: userInfo.enabled });
      // 更新失败
      if (res.status !== 200) {
        userInfo.enabled = !userInfo.enabled;
        return this.$message.error(res.message);
      }
      this.$message.success(res.message);
    },
    // 监听添加用户对话框的关闭
    handleAddDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听编辑用户对话框的关闭
    handleEditDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 添加用户对话框点击确定按钮
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 发起请求添加用户
        const { data: res } = await this.$axios.post('/users', this.addForm);
        if (res.status !== 201) {
          return this.$message.error(res.message);
        }
        // 添加成功
        this.$message.success(res.message);
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    async showEditDialog(id) {
      this.editDialogVisible = true;
      // 发起请求查询用户
      const { data: res } = await this.$axios.get('/users/' + id);
      if (res.status !== 200) {
        return this.$message.error(res.message);
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 编辑用户对话框点击确定按钮
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起请求更新用户信息
        const { data: res } = await this.$axios.patch('/users/' + this.editForm.id, { email: this.editForm.email });
        if (res.status !== 200) {
          return this.$message.error(res.message);
        }
        // 更新成功
        this.$message.success(res.message);
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    // 删除用户
    async deleteUser(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消');
      }

      // 删除用户
      const { data: res } = await this.$axios.delete('/users/' + id);
      if (res.status !== 204) {
        return this.$message.error(res.message);
      }
      // 删除成功
      this.$message.success(res.message);
      this.getUserList();
    },
  }
}
</script>