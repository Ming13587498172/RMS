<template>
  <div>
    <MainHeader :first="'权限管理'" :second="'角色列表'"></MainHeader>
    <div class="main">
      <el-dialog
        title="添加角色对话框"
        :visible.sync="dialogVisible"
        width="50%"
      >
        <div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="ruleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" prop="roleDesc">
              <el-input v-model="ruleForm.roleDesc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel('ruleForm')">取消</el-button>
              <el-button type="primary" @click="addRole('ruleForm')"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-button type="primary" @click="dialogVisible = true"
        >添加角色</el-button
      >

      <el-table
        :data="rolesList"
        border
        class="main-table"
        stripe
        style="width: 100%"
      >
        <el-table-column label="#" type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <!-- 第一层 -->
              <el-row
                class="main-tag"
                v-for="item in props.row.children"
                :key="item.id"
              >
                <el-col :span="6" class="main-tag-left">
                  <el-tag>{{ item.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18" class="main-tag-right">
                  <!-- 第二层 -->
                  <el-row v-for="ichild in item.children" :key="ichild.id">
                    <el-col :span="5">
                      <el-tag type="success">{{ ichild.authName }}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="19">
                      <!-- 第三层 -->
                      <el-tag
                        closable
                        v-for="icchild in ichild.children"
                        :key="icchild.id"
                        >{{ icchild.authName }}</el-tag
                      >
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
        ></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="id" label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-dialog
              title="编辑角色对话框"
              :visible.sync="editVisible"
              width="50%"
            >
              <div>
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="角色名称" prop="roleName">
                    <el-input
                      v-model="ruleForm.roleName"
                      :placeholder="scope.row.roleName"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="角色描述" prop="roleDesc">
                    <el-input
                      v-model="ruleForm.roleDesc"
                      :placeholder="scope.row.roleDesc"
                      type="email"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="cancel('ruleForm')">取消</el-button>
                    <el-button
                      type="primary"
                      @click="editRole('ruleForm', scope.row.id)"
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
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
              >删除</el-button
            >
            <!-- 设置 -->
            <el-dialog title="分配权限" :visible.sync="setVisible" width="50%">
              <div>
                <el-form label-width="100px" class="demo-ruleForm">
                  <el-tree
                    ref="tree"
                    node-key="id"
                    :data="treeData"
                    default-expand-all
                    show-checkbox
                    :props="{ label: 'authName', children: 'children' }"
                  ></el-tree>
                  <el-form-item>
                    <el-button @click="cancel('powerForm')">取消</el-button>
                    <el-button type="primary" @click="setRole(scope.row.id)"
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
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { roles, addRole, delRole, editRole } from '@/api/roles'
import { rights, setRights } from '@/api/rights'
export default {
  created () {
    this.getRoles()
    this.getRight()
  },
  data () {
    const validatorRoleName = (rule, value, callback) => {
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
    return {
      rolesList: [],
      ruleForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { validator: validatorRoleName, trigger: 'change' }
        ]
      },
      dialogVisible: false,
      editVisible: false,
      setVisible: false,
      treeData: [],
      checkedList: [],
      checkedKey: []
    }
  },
  methods: {
    // 获取角色列表
    async getRoles () {
      try {
        const res = await roles()
        this.rolesList = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 自定义索引
    indexMethod (index) {
      return index + 1
    },
    // 取消
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.editVisible = false
      this.setVisible = false
    },
    // 添加角色
    async addRole (formName) {
      try {
        const res = await addRole({ roleName: this.ruleForm.roleName, roleDesc: this.ruleForm.roleDesc })
        this.$message.success('添加成功')
        this.$refs[formName].resetFields()
        this.dialogVisible = false
        this.getRoles()
      } catch (err) {
        console.log(err)
        this.$message.error('添加失败')
      }
    },
    // 删除角色
    async del (id) {
      try {
        await delRole({ id: id })
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
        this.$message.error('删除失败')
      }
    },
    // 编辑角色信息
    async editRole (formName, id) {
      try {
        const res = await editRole({ id: id, roleName: this.ruleForm.roleName, roleDesc: this.ruleForm.roleDesc })
        console.log(res)
        this.$message.success('编辑成功')
        this.$refs[formName].resetFields()
        this.getRoles()
        this.editVisible = false
      } catch (err) {
        console.log(err)
        this.$message.error('编辑失败')
      }
    },
    // 获取权限列表
    async getRight () {
      try {
        const res = await rights({ type: 'tree' })
        this.treeData = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 分配权限
    async setRole (id) {
      this.checkedList = this.$refs.tree.getCheckedNodes(false, true)
      this.checkedList.forEach(item => {
        this.checkedKey.push(item.id)
      })
      this.checkedKey = this.checkedKey.join(',')
      try {
        await setRights({ roleId: id, rids: this.checkedKey })
        this.$message.success('更新成功')
        this.getRoles()
        this.setVisible = false
      } catch (err) {
        console.log(err)
        this.$message.error('更新失败')
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
.main {
  .main-table {
    margin-top: 20px;
    .el-table-column {
      /deep/ .el-button {
        padding: 7px 15px;
        font-size: 12px;
        border-radius: 3px;
      }
    }
    .el-row {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eee;
      border-top: 1px solid #eee;
      .main-tag-left {
        width: 25%;
      }
      .main-tag-right {
        width: 75%;
      }
    }
    /deep/ .el-table__expanded-cell[class*="cell"] {
      padding: 20px 50px;
      .el-tag {
        margin: 8px;
      }
    }
  }
}
/deep/ .el-tree {
  margin-bottom: 20px;
}
</style>
