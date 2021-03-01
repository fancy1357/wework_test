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
            <el-switch v-model="scope.row.enabled">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 修改用户信息 -->
          <el-tooltip effect="dark" content="修改用户信息" placement="top" :enterable="false">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <!-- 删除用户 -->
          <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
          <!-- 配置用户 -->
          <el-tooltip effect="dark" content="配置用户" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" circle></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.page" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" center>
      <!-- 添加用户表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.corpid"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
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
      // 添加应用的表单规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { max: 16, message: '用户名在16个字符以内', trigger: 'blur' },
        ], password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码在6至16个字符之间', trigger: 'blur' },
        ]
      },
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$axios.get('/search/users', { params: this.queryInfo });
      console.log(res);
      // 获取失败
      if (res.status != 200) return this.$message.error('获取用户列表失败');
      // 获取成功
      this.userList = res.data.items;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.per_page = newSize;
      this.getUserList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getUserList();
    },

  }
}
</script>