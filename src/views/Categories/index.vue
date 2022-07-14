<template>
  <div>
    <MainHeader :first="'用户管理'" :second="'用户列表'"></MainHeader>
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
            <el-form-item label="分类名称" prop="roleName">
              <el-input v-model="ruleForm.roleName"></el-input>
            </el-form-item>
            <el-form-item label="父级分类" prop="roleDesc">
              <div class="block">
                <el-cascader
                  :options="options"
                  :props="{ checkStrictly: true }"
                  clearable
                  ref="cascader"
                  v-model="value"
                  @change="onChange($event)"
                ></el-cascader>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button @click="cancel('ruleForm')">取消</el-button>
              <el-button type="primary" @click="addFen(ruleForm)"
                >确定</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-button type="primary" @click="dialogVisible = true"
        >添加分类</el-button
      >
      <el-table
        :data="tableData"
        class="main-table"
        row-key="cat_id"
        border
        lazy
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
        ></el-table-column>
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <i class="el-icon-success" style="color: green"></i>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.cat_level === 0
                  ? ''
                  : scope.row.cat_level === 1
                  ? 'success'
                  : 'warning'
              "
              disable-transitions
              >等级{{
                scope.row.cat_level === 0
                  ? "一"
                  : scope.row.cat_level === 1
                  ? "二"
                  : "三"
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button type="primary" size="mini" icon="el-icon-edit"
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
import { getFen, addFen, delFen } from '@/api/categories'
export default {
  created () {
    this.getFen()
    this.selectFen()
  },
  data () {
    return {
      tableData: [],
      page: 1,
      limit: 5,
      list: [],
      curr: 1,
      ruleForm: {
        roleName: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'change' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
        ]
      },
      dialogVisible: false,
      options: [],
      value: '',
      level: 0,
      cat_pid: '',
      cat_name: null
    }
  },
  methods: {
    // 获取列表数据
    async getFen () {
      try {
        const res = await getFen({ pagenum: this.page, pagesize: this.limit })
        this.tableData = res.data.data.result
        this.list = res.data.data
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 条数 ---- 并根据条数展示数据
    handleSizeChange (val) {
      this.limit = val
      this.getFen()
    },
    // 页数 ---- 并根据页数展示数据
    handleCurrentChange (val) {
      this.page = val
      this.getFen()
    },
    // 联级选择器
    houseObj (val) {
      val.forEach(item => {
        item.label = item.cat_name
        item.value = item.cat_id
        if (item.children) {
          this.houseObj(item.children)
        }
      })
    },
    // 获取选择器数据
    async selectFen () {
      try {
        const res = await getFen({ type: 2 })
        this.options = res.data.data
        this.houseObj(this.options)
        console.log(this.options)
      } catch (err) {
        console.log(err)
      }
    },
    // 取消
    cancel (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 选择器 选中值的所有信息
    onChange () {
      const a = this.$refs.cascader.getCheckedNodes()
      this.level = a[0].level
    },
    // 添加
    async addFen (val) {
      if (this.value.length === 0) this.cat_pid = 0
      if (this.value.length > 1) {
        this.cat_pid = this.value[this.value.length - 1]
      } else {
        this.cat_pid = this.value[0]
      }
      try {
        await addFen({ cat_pid: this.cat_pid, cat_name: val.roleName, cat_level: this.level })
        this.$message.success('创建成功')
        this.dialogVisible = false
      } catch (err) {
        console.log(err)
        this.$message.error('创建失败')
      }
    },
    // 删除
    async del (val) {
      console.log(val.cat_id)
      const id = Number(val.cat_id)
      try {
        const res = await delFen(id)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    }
  },
  computed: {
    // 自定义索引
    indexMethod () {
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
.main-table {
  margin-top: 20px;
}
.block {
  margin-top: 20px;
}
</style>
