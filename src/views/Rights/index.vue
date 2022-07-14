<template>
  <div>
    <MainHeader :first="'权限管理'" :second="'权限列表'"></MainHeader>
    <div class="main">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column
          type="index"
          :index="indexMethod"
          label="#"
        ></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag
              :type="
                scope.row.level === '0'
                  ? ''
                  : scope.row.level === '1'
                  ? 'success'
                  : 'warning'
              "
              disable-transitions
              >等级{{
                scope.row.level === "0"
                  ? "一"
                  : scope.row.level === "1"
                  ? "二"
                  : "三"
              }}</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { rightList } from '@/api/rights'
export default {
  created () {
    this.getRightList()
  },
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    // 获取权限列表
    async getRightList () {
      try {
        const res = await rightList({ type: 'list' })
        this.tableData = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 自定义索引
    indexMethod (index) {
      return index + 1
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
</style>
