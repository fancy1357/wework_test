<template>
  <div class="login_container">
    Home page
    <el-button type="primary" @click="logout">注销</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login');
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.login_container {
  background-color: rgb(25, 94, 150);
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: #ddd;
    background-color: #fff;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;

    .align_right {
      display: flex;
      justify-content: flex-end;
    }

    button {
      position: absolute;
      left: 50%;
      transform: translate(-50%, 50%);
      width: 50%;
    }
  }
}
</style>
