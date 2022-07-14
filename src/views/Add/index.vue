<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-back"
      size="mini"
      @click="$router.go('-1')"
    ></el-button>
    <div class="main">
      <el-alert title="添加商品信息" type="info" show-icon :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :active="active" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-tabs tab-position="left" @tab-click="count">
        <el-tab-pane label="基本信息">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="ruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="ruleForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="ruleForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="ruleForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="cat">
              <el-cascader
                ref="demoCascader"
                v-model="value"
                @change="now"
                :options="options"
              ></el-cascader>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数">
          <el-form label-width="100px" class="demo-ruleForm">
            <el-form-item
              :label="item.attr_name"
              prop="name"
              v-for="(item, index) in canList"
              :key="index"
            >
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  :label="item"
                  v-for="(item, index) in item.attr_vals.split(' ')"
                  :key="index"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品属性">
          <el-form :model="form" label-width="100px" class="demo-ruleForm">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in shuList"
              :key="index"
            >
              <el-input
                v-model="form.attr_vals"
                :placeholder="item.attr_vals"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品图片">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple
            :before-upload="handlePreview"
            :on-success="upload"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容">
          <quill-editor
            class="text"
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
            @change="onEditorChange($event)"
            style="height: 400px; width: 1200px; margin-top: 30px"
          >
          </quill-editor>
          <el-button type="primary" @click="add">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { categories, can, shu, upload } from '@/api/categories'
import { addGoods } from '@/api/goods'
export default {
  created () {
    this.getCategories()
    this.getCan()
    this.getShu()
  },
  data () {
    return {
      active: 0,
      ruleForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: ''
      },
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'change' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'change' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'change' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'change' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'change' }
        ]
      },
      options: [],
      value: '',
      canList: [],
      checkList: [],
      shuList: [],
      form: {
        attr_vals: ''
      },
      file: {},
      content: '',
      editorOption: {},
      goods_cat: '',
      attrs: []
    }
  },
  methods: {
    // tab标签 联动 步骤条
    count (tab) {
      this.active = Number(tab.paneName)
    },
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
    // 商品参数
    async getCan () {
      try {
        const res = await can({ id: 6, sel: 'many' })
        this.canList = res.data.data
        this.canList.forEach(item => {
          const a = item.attr_vals.split(' ')
          this.checkList.push(...a)
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 商品属性
    async getShu () {
      try {
        const res = await shu({ id: 6, sel: 'only' })
        this.shuList = res.data.data
      } catch (err) {
        console.log(err)
      }
    },
    // 上传回调
    handlePreview (file) {
      this.file = file
    },
    // 图片上传
    async upload () {
      try {
        const res = await upload({ file: this.file })
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取选择器的值
    now () {
      const idArr = []
      const obj = this.$refs.demoCascader.getCheckedNodes()
      obj[0].pathNodes.forEach(item => {
        idArr.push(item.data.cat_id)
      })
      this.goods_cat = idArr.join(',')
    },
    // 添加商品
    async add () {
      this.canList.forEach(item => {
        const data = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.attrs.push(data)
      })
      try {
        const res = await addGoods({ goods_name: this.ruleForm.goods_name, goods_cat: this.goods_cat, goods_price: this.ruleForm.goods_price, goods_number: this.ruleForm.goods_number, goods_weight: this.ruleForm.goods_weight, goods_introduce: this.content, pics: [], attrs: this.attrs })
        this.$message.success('创建成功')
        console.log(res)
      } catch (err) {
        console.log(err)
        this.$message.error('创建失败')
      }
    },
    // 以下为富文本编辑器事件
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange ({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      this.content = html
    }
  },
  computed: {},
  watch: {},
  filters: {},
  components: {}
}
</script>

<style scoped lang='less'>
.el-alert {
  justify-content: center;
}
.el-tabs {
  margin-top: 20px;
}
.text {
  width: unset !important;
  margin-top: unset !important;
}
/deep/ .ql-container {
  height: 60%;
}
</style>
