<template>
  <div>
    <MainHeader :first="'用户管理'" :second="'用户列表'"></MainHeader>
    <div class="main">
      <div class="main-header">
        <div class="main-header-left">
          <el-input
            placeholder="请输入内容"
            v-model="input"
            clearable
            class="input-with-select"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
        </div>
        <div class="main-header-right">
          <el-dialog
            title="添加用户对话框"
            :visible.sync="dialogVisible"
            width="50%"
            :before-close="handleClose"
          >
            <div>
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input
                    v-model="ruleForm.password"
                    type="password"
                  ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="ruleForm.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" type="mobile">
                  <el-input v-model="ruleForm.mobile"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="cancel('ruleForm')">取消</el-button>
                  <el-button type="primary" @click="addUser('ruleForm')"
                    >确定</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </div>
      </div>
      <el-table
        :data="list.users"
        border
        stripe
        style="width: 100%"
        class="main-table"
      >
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
        ></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              inactive-color="#ff4949"
              @change="newState(scope.row.mg_state, scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="操作">
          <template slot-scope="scope">
            <el-dialog
              title="编辑用户对话框"
              :visible.sync="editVisible"
              width="50%"
              :before-close="handleClose"
            >
              <div>
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="用户名" prop="username">
                    <el-input
                      :placeholder="scope.row.username"
                      :disabled="true"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input
                      v-model="ruleForm.email"
                      :placeholder="scope.row.email"
                      type="email"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile" type="mobile">
                    <el-input
                      v-model="ruleForm.mobile"
                      :placeholder="scope.row.mobile"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="cancel('ruleForm')">取消</el-button>
                    <el-button
                      type="primary"
                      @click="editUser('ruleForm', scope.row.id)"
                      >确定</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editVisible = true"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
            ></el-button>
            <el-dialog
              title="分配角色"
              :visible.sync="setVisible"
              width="50%"
              :before-close="handleClose"
            >
              <div>
                <el-form
                  :model="setForm"
                  ref="setForm"
                  label-width="100px"
                  class="demo-setForm"
                >
                  <el-form-item>
                    <el-descriptions class="margin-top" :column="1">
                      <el-descriptions-item label="当前的用户">{{
                        scope.row.username
                      }}</el-descriptions-item>
                      <el-descriptions-item label="当前的角色">{{
                        scope.row.role_name
                      }}</el-descriptions-item>
                      <el-descriptions-item label="分配新角色">
                        <el-select v-model="value" placeholder="请选择">
                          <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id"
                          >
                          </el-option>
                        </el-select>
                      </el-descriptions-item>
                    </el-descriptions>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="cancel('setForm')">取消</el-button>
                    <el-button
                      type="primary"
                      @click="setUser('setForm', scope.row.id)"
                      >确定</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
            </el-dialog>
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="setVisible = true"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curr"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="list.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { list, state, search, add, edit, del, set } from '@/api/user'
import { roles } from '@/api/roles'
export default {
  created () {
    this.getList()
    this.getRoles()
  },
  data () {
    const validatorUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      if (value.length >= 2 && value.length <= 7) {
        // 校验通过
        callback()
      } else {
        // 校验失败，里面错误对象参数就是报错信息
        callback(new Error('长度在 2 到 7 个字符'))
      }
    }
    const validatorPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      if (value.length >= 2 && value.length <= 7) {
        // 校验通过
        callback()
      } else {
        // 校验失败，里面错误对象参数就是报错信息
        callback(new Error('长度在 2 到 7 个字符'))
      }
    }
    const validatorEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (reg.test(value)) {
        console.log(value)
        // 校验通过
        callback()
      } else {
        // 校验失败，里面错误对象参数就是报错信息
        callback(new Error('邮箱格式不正确'))
      }
    }
    const validatorMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
      if (reg.test(value)) {
        // 校验通过
        callback()
      } else {
        // 校验失败，里面错误对象参数就是报错信息
        callback(new Error('手机格式不正确'))
      }
    }
    return {
      ruleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          // { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: validatorUsername, trigger: 'change' }
        ],
        password: [
          // { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatorPassword, trigger: 'change' }
        ],
        email: [
          // { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validatorEmail, trigger: 'change' }
        ],
        mobile: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatorMobile, trigger: 'change' }
        ]
      },
      dialogVisible: false,
      editVisible: false,
      setForm: {
      },
      setVisible: false,
      input: '',
      options: [],
      value: '',
      rolesList: [],
      page: 1,
      limit: 5,
      list: [],
      curr: 1
    }
  },
  methods: {
    // 根据条件搜索
    async search () {
      console.log(this.input)
      try {
        const res = await search({ query: this.input, pagenum: this.page, pagesize: this.limit })
        this.list = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 添加用户
    async addUser (formName) {
      try {
        await add({ username: this.ruleForm.username, password: this.ruleForm.password, email: this.ruleForm.email, mobile: this.ruleForm.mobile })
        this.$message.success('添加成功')
        this.$refs[formName].resetFields()
        this.dialogVisible = false
      } catch (err) {
        console.log(err)
        this.$message.error('添加失败')
      }
    },
    // 取消
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.editVisible = false
      this.setVisible = false
    },
    // 关闭
    handleClose () {

    },
    // 获取用户数据列表
    async getList () {
      try {
        const res = await list({ pagenum: this.page, pagesize: this.limit })
        this.list = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 条数 ---- 并根据条数展示数据
    handleSizeChange (val) {
      this.limit = val
      this.getList()
    },
    // 页数 ---- 并根据页数展示数据
    handleCurrentChange (val) {
      this.page = val
      this.getList()
    },
    // 修改用户状态
    async newState (val, id) {
      try {
        await state({ uId: id, type: val })
        this.$message.success('修改用户状态成功')
      } catch (err) {
        console.log(err)
        this.$message.error('修改用户状态失败')
      }
    },
    // 编辑
    async editUser (formName, id) {
      try {
        const res = await edit({ id: id, email: this.ruleForm.email, mobile: this.ruleForm.mobile })
        this.$message.success('编辑成功')
        this.$refs[formName].resetFields()
        this.getList()
        this.editVisible = false
      } catch (err) {
        console.log(err)
        this.$message.error('编辑失败')
      }
    },
    // 删除
    async del (id) {
      console.log(id)
      try {
        const res = await del({ id: id })
        this.$message.success('删除成功')
        this.getList()
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
    },
    // 获取角色列表
    async getRoles () {
      try {
        const res = await roles()
        this.rolesList = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 分配新角色
    async setUser (formName, id) {
      try {
        const res = await set({ id: id, rid: this.value })
        this.$message.success('分配成功')
        this.$refs[formName].resetFields()
        this.setVisible = false
        this.getList()
      } catch (err) {
        console.log(err)
        this.$message.error('分配失败')
      }
    }
  },
  computed: {
    // 自定义索引
    indexMethod (index) {
      // 每页条数 * (当前页 - 1) + 1
      return this.limit * (this.page - 1) + 1
    }
  },
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.main {
  .main-header {
    display: flex;
    height: 40px;
    .main-header-left {
      flex: 1;
      margin-right: 20px;
    }
    .main-header-right {
      flex: 2;
    }
  }
  .main-table {
    margin-top: 20px;
    .el-table-column {
      /deep/ .el-button {
        padding: 7px 15px;
        font-size: 12px;
        border-radius: 3px;
      }
    }
  }
  .block {
    margin-top: 16px;
  }
}
</style>
