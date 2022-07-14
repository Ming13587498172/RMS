<template>
  <el-container class="container">
    <el-header>
      <h2>
        <i class="el-icon-orange"></i>
        EveryOne-后台管理系统
      </h2>
      <el-button type="primary" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-radio-group v-model="isCollapse">
          <el-button
            type="primary"
            :icon="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
            :style="isCollapse ? { width: 64 + 'px' } : { width: 200 + 'px' }"
            class="dong"
            @click="isCollapse = !isCollapse"
          ></el-button>
        </el-radio-group>
        <el-menu
          background-color="#373d41"
          text-color="#fff"
          unique-opened
          :collapse="isCollapse"
        >
          <el-submenu
            v-for="(item, index) in menus"
            :key="item.id"
            :index="item.id + '-' + index"
          >
            <template #title>
              <i
                class="el-icon-user-solid"
                v-if="item.authName === '用户管理'"
              ></i>
              <i
                class="el-icon-s-cooperation"
                v-else-if="item.authName === '权限管理'"
              ></i>
              <i
                class="el-icon-s-goods"
                v-else-if="item.authName === '商品管理'"
              ></i>
              <i
                class="el-icon-s-order"
                v-else-if="item.authName === '订单管理'"
              ></i>
              <i class="el-icon-s-marketing" v-else></i>
              {{ item.authName }}
            </template>
            <el-menu-item
              v-for="(child, index) in item.children"
              :key="child.id"
              :index="child.id + '-' + index"
              @click="$router.push(child.path)"
            >
              <i class="el-icon-menu"></i>
              {{ child.authName }}
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
import { menus } from '@/api/menu'
export default {
  created () {
    this.getMenus()
  },
  data () {
    return {
      menus: [],
      isCollapse: false
    }
  },
  methods: {
    async getMenus () {
      try {
        const res = await menus()
        this.menus = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    async logout () {
      try {
        await this.$confirm('是否退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message.success('退出成功')
        this.$router.push('/login')
        this.$store.commit('setUser', {})
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.dong {
  font-size: 26px;
  padding: 6px 0;
  border-radius: 0;
  border: none;
  background-color: rgba(255, 91, 184, 0.7);
}
.el-submenu__title i {
  margin-right: 20px !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.container {
  height: 100vh;
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      color: #fff;
      line-height: 60px;
    }
    .el-button {
      background: #fff;
      border: 1px solid #dcdfe6;
      color: #606266;
    }
  }
  .el-aside {
    background-color: #373d41;
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>

<style>
.main {
  padding: 20px;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 10px;
}
</style>
