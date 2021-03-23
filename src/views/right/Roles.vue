<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.rights" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="deleteRoleRight(scope.row, item1.id)">{{item1.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteRoleRight(scope.row, item2.id)">{{item2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 渲染三级标签 -->
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="deleteRoleRight(scope.row, item3.id)">{{item3.name}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="角色描述" prop="desc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showAllotRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog title="添加角色" @closed="formDialogClosed('addRoleFormRef')" :visible.sync="addRoleDialogVisible" width="50%" center>
      <!-- 添加角色表单区域 -->
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="addRoleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog title="编辑角色" @closed="formDialogClosed('editRoleFormRef')" :visible.sync="editRoleDialogVisible" width="50%" center>
      <!-- 添加角色表单区域 -->
      <el-form :model="editRoleForm" :rules="addRoleFormRules" ref="editRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editRoleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="editRoleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" @closed="allotRightDialogVisibleClosed" :visible.sync="allotRightDialogVisible" width="50%" center>
      <!-- 权限树展示和选择区域 -->
      <el-tree :data="rightList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="treeDefKeys" ref="treeRef">
      </el-tree>

      <!-- 对话框底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      roleList: [],
      // 控制添加角色对话框显示或隐藏
      addRoleDialogVisible: false,
      // 控制编辑角色对话框显示或隐藏
      editRoleDialogVisible: false,
      // 控制分配权限对话框显示或隐藏
      allotRightDialogVisible: false,
      addRoleForm: {
        name: '',
        desc: '',
      },
      editRoleForm: {
        name: '',
        desc: '',
      },
      addRoleFormRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 16, message: '角色名称在2~16个字符之间', trigger: 'blur' },
        ],
      },
      rightList: [],
      treeProps: {
        label: 'name',
        children: 'children',
      },
      treeDefKeys: [],
      curRole: {}
    }
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$axios.get('/roles'
      );

      if (res.status !== 200) return this.$message.error('获取角色列表失败');

      this.roleList = res.data;
    },
    // 删除角色权限
    async deleteRoleRight(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消');
      }

      // 删除权限
      const { data: res } = await this.$axios.delete(`/roles/${role.id}/rights/${rightId
        }`);
      if (res.status !== 200) {
        return this.$message.error(res.message);
      }
      // 删除成功
      this.$message.success(res.message);
      role.rights = res.data;
    },

    showAddRoleDialog() {
      this.addRoleDialogVisible = true;
    },
    showEditRoleDialog(role) {
      this.curRole = role;
      this.editRoleForm = Object.assign({}, role);
      this.editRoleDialogVisible = true;
    },
    addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return;
        // 发起请求添加角色
        const { data: res } = await this.$axios.post('/roles', this.addRoleForm);
        if (res.status !== 201) {
          return this.$message.error(res.message);
        }
        // 添加成功
        this.$message.success(res.message);
        this.getRoleList();
        this.addRoleDialogVisible = false;
      })
    },
    editRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return;
        // 更新角色
        const { data: res } = await this.$axios.put(`/roles/${this.curRole.id}`, this.editRoleForm);
        if (res.status !== 200) {
          return this.$message.error(res.message);
        }
        // 更新成功
        this.$message.success(res.message);
        this.getRoleList();
        this.editRoleDialogVisible = false;
      })
    },
    async deleteRole(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消');
      }

      const { data: res } = await this.$axios.delete(`/roles/${id}`);
      if (res.status !== 200) {
        return this.$message.error(res.message);
      }
      // 删除成功
      this.$message.success(res.message);
      this.getRoleList();
    },
    formDialogClosed(formRef) {
      this.$refs[formRef].resetFields();
    },

    async showAllotRightDialog(role) {
      this.curRole = role;
      const { data: res } = await this.$axios.get('/rights?type=tree');
      if (res.status !== 200) {
        return this.$message.error(res.message);
      }
      this.rightList = res.data;
      if (role.rights) {
        role.rights.forEach(item => {
          this.getLeafKeys(item, this.treeDefKeys);
        });
      }
      this.allotRightDialogVisible = true;
    },
    // 获取角色三级权限的ID，保存到treeDefKeys
    getLeafKeys(node, arr) {
      // 没有子节点
      if (!node.children) {
        arr.push(node.id);
      }
      else {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr);
        });
      }
    },

    allotRightDialogVisibleClosed() {
      this.treeDefKeys = [];
    },
    async allotRight() {
      const rids = this.$refs.treeRef.getCheckedKeys(true);
      const { data: res } = await this.$axios.post(`/roles/${this.curRole.id}/rights`, { right_ids: rids });
      if (res.status !== 200) {
        return this.$message.error(res.message);
      }
      this.$message.success(res.message);
      this.curRole.rights = res.data;
      this.allotRightDialogVisible = false;
    },

  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

/* 垂直居中 */
.vcenter {
  display: flex;
  align-items: center;
}
</style>