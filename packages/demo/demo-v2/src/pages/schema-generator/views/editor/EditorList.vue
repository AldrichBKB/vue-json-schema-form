<template>
    <div>
        <el-button
            class="add_btn"
            type="primary"
            size="mini"
            @click="visible = true"
        >
            新 增
        </el-button>
        <el-table
            :data="componentList"
            stripe
            row-key="column"
            height="93vh"
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
            :title="typeof subItemIndex === 'number' ? '修改' : '新增'"
            top="5vh"
            width="30%"
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
import emitter from '../../mixins/emitter.js';
import ViewComponents from './viewComponents/genSchema';

export default {
    components: {
        ViewComponents
    },
    mixins: [emitter],
    props: {
        componentList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            visible: false
        };
    },
    methods: {
        handelClose() {
            this.$refs.viewComponentsRef.reset();
        },
        handelSave() {
            const valid = this.$refs.viewComponentsRef.checkForm();
            const formData = this.$refs.viewComponentsRef.getFormData();
            if (valid) {
                this.$emit('add', { ...formData, children: [] });
                this.visible = false;
            }
        },
        handelEdit(editorItem, index) {
            this.dispatch('Editor', 'onSetCurEditorItem', {
                editorItem,
                editorIndex: index,
                isEditorList: true
            });
        },
        handelDelete(row) {
            this.$emit('delete', row);
        }
    }
};
</script>

<style scoped>
.add_btn {
    float: right;
    margin-bottom: 20px;
    margin-right: 10px;
}
</style>
