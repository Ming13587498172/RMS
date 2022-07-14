<template>
  <div>
    <MainHeader :first="'商品管理'" :second="'商品列表'"></MainHeader>
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
          <el-button type="primary" @click="$router.push({ name: 'add' })"
            >添加用户</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData.goods"
        border
        stripe
        style="width: 100%"
        class="main-table"
      >
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
          width="50"
        ></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间"> </el-table-column>
        <el-table-column label="操作" width="200">
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
              @click="del(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curr"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { goods, delGoods } from '@/api/goods'
export default {
  created () {
    this.getGoods()
  },
  data () {
    return {
      input: '',
      tableData: [],
      page: 1,
      limit: 5,
      curr: 1
    }
  },
  methods: {
    // 获取商品列表
    async getGoods () {
      try {
        const res = await goods({ pagenum: this.page, pagesize: this.limit })
        this.tableData = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 条数 ---- 并根据条数展示数据
    handleSizeChange (val) {
      this.limit = val
      this.getGoods()
    },
    // 页数 ---- 并根据页数展示数据
    handleCurrentChange (val) {
      this.page = val
      this.getGoods()
    },
    // 根据搜索条件展现数据
    async search () {
      try {
        const res = await goods({ query: this.input, pagenum: this.page, pagesize: this.limit })
        this.tableData = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 删除商品
    async del (id) {
      try {
        await delGoods({ id: id })
        this.$message.success('删除商品成功')
      } catch (err) {
        console.log(err)
        this.$message.error('删除商品失败')
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
  }
  .block {
    margin-top: 16px;
  }
}
</style>
