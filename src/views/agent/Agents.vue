<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>应用管理</el-breadcrumb-item>
      <el-breadcrumb-item>应用列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加和搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getAgentList">
            <el-button slot="append" icon="el-icon-search" @click="getAgentList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加应用</el-button>
        </el-col>
      </el-row>

      <!-- 表格展示区域 -->
      <el-table :data="agentList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="agentname" label="应用名称"></el-table-column>
        <el-table-column prop="agentid" label="应用ID"></el-table-column>
        <el-table-column prop="corpid" label="企业ID"></el-table-column>
        <el-table-column prop="secret" label="应用Secret" width="350px"></el-table-column>
        <!-- <el-table-column slot-scope="scope">
          <el-switch v-model="scope.row.">
          </el-switch>
        </el-table-column> -->
        <el-table-column prop="agentname" label="操作">
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
          <el-tooltip effect="dark" content="配置应用" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-setting" circle></el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.page" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.per_page" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加应用的对话框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" center>
      <!-- 添加应用表单区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="应用名称" prop="agentname">
          <el-input v-model="addForm.agentname"></el-input>
        </el-form-item>
        <el-form-item label="应用ID" prop="agentid">
          <el-input v-model="addForm.agentid"></el-input>
        </el-form-item>
        <el-form-item label="企业ID" prop="corpid">
          <el-input v-model="addForm.corpid"></el-input>
        </el-form-item>
        <el-form-item label="Secret" prop="secret">
          <el-input v-model="addForm.secret"></el-input>
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
    this.getAgentList();
  },
  data() {
    return {
      queryInfo: {
        query: '',
        page: 1,
        per_page: 2,
      },
      agentList: [],
      total: 0,
      // 控制添加应用对话框显示或隐藏
      addDialogVisible: false,
      // 添加应用的表单数据
      addForm: {
        agentname: '',
        agentid: '',
        corpid: '',
        secret: '',
      },
      // 添加应用的表单规则
      addFormRules: {
        agentname: [
          { required: true, message: '请输入应用名称', trigger: 'blur' }, 
          { max: 16, message: '应用名称在16个字符以内', trigger: 'blur' },
        ],
        agentid: [
          { required: true, message: '请输入应用ID', trigger: 'blur' }],
        corpid: [
          { required: true, message: '请输入企业ID', trigger: 'blur' }],
        secret: [
          { required: true, message: '请输入应用Secret', trigger: 'blur' }],
      },
    }
  },
  methods: {
    async getAgentList() {
      const { data: res } = await this.$axios.get('/search/agents', { params: this.queryInfo });
      // 获取失败
      if (res.status != 200) return this.$message.error('获取应用列表失败');
      // 获取成功
      this.agentList = res.data.items;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.per_page = newSize;
      this.getAgentList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage;
      this.getAgentList();
    },

  }
}
</script>