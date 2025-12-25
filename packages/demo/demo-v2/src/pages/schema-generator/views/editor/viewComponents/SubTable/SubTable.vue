<template>
    <div>
        <div
            :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }"
        >
            <div class="sub_title">
                <span>子表配置</span>
            </div>
            <el-button
                :style="{ marginBottom: '20px' }"
                size="mini"
                type="primary"
                @click="handelAdd"
            >
                新 增
            </el-button>
        </div>

        <el-table
            :data="editorItem.children"
            stripe
            row-key="id"
            style="width: 100%"
        >
            <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
            />
            <el-table-column
                prop="column"
                label="字段名称key"
                width="100"
            />
            <el-table-column
                prop="columnName"
                label="字段描述"
                align="center"
            />
            <el-table-column
                prop="columnType"
                label="字段类型"
                align="center"
            />
            <el-table-column
                fixed="right"
                label="操作"
                align="center"
            >
                <template slot-scope="{ row, $index }">
                    <el-button
                        type="text"
                        size="small"
                        @click="handelEdit(row, $index)"
                    >
                        编辑
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        :style="{ color: '#ee0b0b', marginLeft: '8px' }"
                        @click="handelDelete(row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="subItemAid ? '修改' : '新增'"
            top="5vh"
            center
            append-to-body
            :visible="visible"
            @close="handelClose"
        >
            <div
                :style="{
                    maxHeight: '70vh',
                    overflowY: 'auto'
                }"
            >
                <ViewComponents
                    ref="viewComponentsRef"
                    :component-list="componentList"
                    is-dialog
                />
            </div>
            <div slot="footer">
                <el-button
                    size="mini"
                    @click="visible = false"
                >
                    取 消
                </el-button>
                <el-button
                    type="primary"
                    size="mini"
                    @click="handelSave"
                >
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
const ViewComponents = () => import('../genSchema.vue');

export default {
    components: {
        ViewComponents
    },
    props: {
        editorItem: {
            type: Object,
            default: () => ({})
        },
        componentList: {
            type: Array,
            default: () => []
        },
    },
    data() {
        return {
            visible: false,
            subItemAid: null
        };
    },
    methods: {
        handelAdd() {
            this.visible = true;
        },
        handelSave() {
            const valid = this.$refs.viewComponentsRef.checkForm();
            if (valid) {
                this.$refs.viewComponentsRef.getFormData();
            }
        },
        handelClose() {
            this.$refs.viewComponentsRef.reset();
        }
    }
};
</script>
