<template>
  <div>
    <MainHeader :first="'订单管理'" :second="'订单列表'"></MainHeader>
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
        <div class="main-header-right"></div>
      </div>
      <el-table
        :data="tableData.goods"
        class="main-table"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
        ></el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" effect="dark">{{
              scope.row.pay_status === "0" ? "未支付" : "已支付"
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | date }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-dialog
              title="修改货物地址"
              :visible.sync="dialogVisible"
              width="50%"
            >
              <el-cascader
                v-model="value"
                :options="cityOptions"
                @change="handleChange"
              ></el-cascader>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="edit(scope.row)"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="dialogVisible = true"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curr"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { orders } from '@/api/orders'
import cityOptions from '@/js/city-data2017-element.js'
export default {
  created () {
    this.getOrders()
  },
  data () {
    return {
      input: '',
      tableData: [],
      page: 1,
      limit: 10,
      curr: 1,
      dialogVisible: false,
      value: '',
      cityOptions: cityOptions
    }
  },
  methods: {
    // 获取列表
    async getOrders () {
      try {
        const res = await orders({ pagenum: this.page, pagesize: this.limit })
        this.tableData = res.data.data
        console.log(this.tableData)
      } catch (err) {
        console.log(err)
      }
    },
    // 搜索
    search () { },
    // 条数 ---- 并根据条数展示数据
    handleSizeChange (val) {
      this.limit = val
      this.getOrders()
    },
    // 页数 ---- 并根据页数展示数据
    handleCurrentChange (val) {
      this.page = val
      this.getOrders()
    },
    // 编辑
    edit (val) {
      console.log(val)
    },
    handleChange (value) {
      console.log(value)
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
    /deep/ .el-dialog {
      box-shadow: unset;
    }
  }
  .block {
    margin-top: 16px;
  }
}
</style>
