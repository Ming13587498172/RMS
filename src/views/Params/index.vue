<template>
  <div>
    <MainHeader :first="'用户管理'" :second="'用户列表'"></MainHeader>
    <div class="main">
      <!-- 警告条 -->
      <el-alert
        title="注意：只允许第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 头部选择器 -->
      <el-form label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品分类" prop="cat">
          <el-cascader
            v-model="value"
            @visible-change="now($event)"
            :options="options"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <el-tabs value="first" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <el-dialog
            title="添加动态参数"
            :visible.sync="dialogVisible"
            width="50%"
          >
            <div>
              <el-form
                :model="ruleForm"
                :rules="addRules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="参数名称" prop="addName">
                  <el-input v-model="ruleForm.addName"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="cancel('ruleForm')">取消</el-button>
                  <el-button
                    type="primary"
                    @click="addCan('ruleForm', ruleForm, 'many')"
                    >确定</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <el-button
            type="primary"
            size="mini"
            :disabled="value !== '' ? false : true"
            @click="dialogVisible = true"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="second">
          <el-dialog
            title="添加静态属性"
            :visible.sync="shuVisible"
            width="50%"
          >
            <div>
              <el-form
                :model="addForm"
                :rules="addRules"
                ref="addForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="参数名称" prop="addName">
                  <el-input v-model="addForm.addName"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="cancel('addForm')">取消</el-button>
                  <el-button
                    type="primary"
                    @click="addCan('addForm', addForm, 'only')"
                    >确定</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
          </el-dialog>
          <el-button
            type="primary"
            size="mini"
            :disabled="value !== '' ? false : true"
            @click="shuVisible = true"
            >添加属性</el-button
          >
        </el-tab-pane>
      </el-tabs>
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="tabs">
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals.split(' ')"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput"
                >+ New Tag</el-button
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
        ></el-table-column>
        <el-table-column prop="attr_name" label="分类名称"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-dialog
              title="修改动态参数"
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
                  <el-form-item label="参数名称" prop="roleName">
                    <el-input
                      v-model="ruleForm.roleName"
                      :placeholder="scope.row.attr_name"
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button @click="cancel('ruleForm')">取消</el-button>
                    <el-button
                      type="primary"
                      @click="editName('ruleForm', scope.row)"
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
              @click="del(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { categories, can, shu, add, edit, del } from '@/api/categories'
export default {
  created () {
    this.getCategories()
  },
  data () {
    return {
      value: '',
      options: [],
      tableData: [],
      index: 0,
      inputVisible: false,
      inputValue: '',
      ruleForm: {
        roleName: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'change' }
        ]
      },
      editVisible: false,
      addForm: {
        addName: ''
      },
      addRules: {
        addName: [
          { required: true, message: '请输入参数名称', trigger: 'change' },
          { min: 2, max: 7, message: '长度在 2 到 7 个字符', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      shuVisible: false,
      callback: false,
      paneName: ''
    }
  },
  methods: {
    // 联级选择器
    houseObj (val) {
      val.forEach(item => {
        item.label = item.cat_name
        if (item.children) {
          this.houseObj(item.children)
        }
      })
    },
    // 获取列表数据
    async getCategories () {
      try {
        const res = await categories()
        this.options = res.data.data
        this.houseObj(this.options)
      } catch (err) {
        console.log(err)
      }
    },
    // 下拉菜单隐藏时
    now (callback) {
      this.callback = !callback
    },
    // tab切换
    handleClick (tab) {
      this.paneName = tab.paneName
      if (this.callback) {
        if (tab.paneName === 'second') {
          this.getShu()
        } else {
          this.getCan()
        }
      } else {
        this.$message.error('请选择三级分类')
      }
    },
    // 参数
    async getCan () {
      try {
        const res = await can({ id: 1998, sel: 'many' })
        this.tableData = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 自定义索引
    indexMethod (index) {
      return index + 1
    },
    // 删除
    async del (val) {
      try {
        await del({ id: val.cat_id, attrid: val.attr_id })
      } catch (err) {
        console.log(err)
      }
    },
    // 显示tag输入框
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 失去焦点或回车  添加tag
    async handleInputConfirm (val) {
      const inputValue = this.inputValue
      if (inputValue) {
        this.tableData.forEach(item => {
          if (item.attr_id === val.attr_id) {
            const a = val.attr_vals.split(' ')
            a.push(inputValue)
            val.attr_vals = a.join(' ')
          }
        })
        try {
          await add({ id: val.attr_id, attr_name: val.attr_name, attr_sel: 'many', attr_vals: val.attr_vals })
          this.$message.success('创建成功')
        } catch (err) {
          console.log(err)
          this.$message.error('创建失败')
        }
      }
      this.inputVisible = false
      this.inputValue = ''
      console.log(val)
    },
    // 取消
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.editVisible = false
      this.dialogVisible = false
      this.shuVisible = false
    },
    // 更新
    async editName (formName, val) {
      try {
        await edit({ id: val.attr_id, attr_name: val.attr_name, attr_sel: 'many' })
        this.$message.success('更新成功')
        this.cancel(formName)
      } catch (err) {
        console.log(err)
        this.$message.error('更新失败')
      }
    },
    // 添加动态参数
    async addCan (formName, val, sel) {
      console.log(formName)
      try {
        await add({ id: 1998, attr_name: val.addName, attr_sel: sel })
        this.$message.success('添加成功')
        this.$refs[formName].resetFields()
        if (sel === 'many') {
          this.getCan()
          this.dialogVisible = false
        } else {
          this.getShu()
          this.shuVisible = false
        }
      } catch (err) {
        console.log(err)
        this.$message.error('添加失败')
      }
    },
    // 获取静态属性列表
    async getShu () {
      try {
        const res = await shu({ id: 1998, sel: 'only' })
        this.tableData = res.data.data
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {},
  watch: {
    // 监听选择器是否有值
    value () {
      this.getCan()
      this.getShu()
    }
  },
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.el-alert {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 20px;
}
/deep/ .tabs {
  padding: 20px 50px;
}
.el-tag {
  margin: 7px;
}
</style>
