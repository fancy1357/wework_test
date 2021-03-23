<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-table :data="rightList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === 1">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level === 2">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level === 3">三级</el-tag>
          </template>

        </el-table-column>

      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  created() {
    this.getRightList();
  },
  data() {
    return {
      rightList: [],
    }
  },
  methods: {
    async getRightList() {
      const { data: res } = await this.$axios.get('/rights?type=list');

      if (res.status !== 200) return this.$message.error('获取权限列表失败');

      this.rightList = res.data;
    }
  }
}
</script>

<style lang="less" scoped>
</style>