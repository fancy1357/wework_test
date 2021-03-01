<template>
  <el-container>

    <el-header>
      <div>
        <span>Wework Test</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? 'auto' : '200px'">
        <div class="collapse-button" @click="toggleCollapse">
          <span>|||</span>
        </div>
        <el-menu router unique-opened :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" :collapse-transition="false">
          <el-submenu class="menu" :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ menu.menu_name }}</span>
            </template>
            <el-menu-item :index="item.path" v-for="item in menu.items" :key="item.id">
              <i class="el-icon-caret-right"></i><span>{{item.item_name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      isCollapse: false,
      activePath: '',
    };
  },
  created() {
    this.getMenuList();
    this.activePath = this.$route.path;
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
    async getMenuList() {
      const { data: res } = await this.$axios.get('/menus');
      /* 请求错误 */
      if (res.status != 200) return this.$message.error({ message: res.message, duration: 1000 });
      /* 请求成功 */
      console.log(res);
      this.menuList = res.data;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    width: 200px;
    height: 100%;
  }
}

.el-aside {
  background-color: #333744;
  text-align: left;

  .el-menu {
    border-right: none;
  }

  .el-menu-item {
    text-align: center;
  }

  .collapse-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
}

.el-main {
  background-color: #eaedf1;
}
</style>


