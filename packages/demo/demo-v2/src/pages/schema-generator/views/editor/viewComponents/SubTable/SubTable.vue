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
                @click="visible = true"
            >
                新 增
            </el-button>
        </div>

        <el-form
            ref="formRef"
            size="small"
            label-suffix=":"
            :model="value"
            label-width="auto"
        >
            <el-form-item
                label="子表高度"
                prop="height"
            >
                <el-input-number
                    v-model="value.height"
                    :precision="0"
                />
            </el-form-item>
            <el-form-item
                label="唯一键名"
                prop="multiple"
            >
                <el-input v-model="value.rowKey"></el-input>
            </el-form-item>
        </el-form>

        <el-table
            :data="editorItem.children"
            stripe
            row-key="column"
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
                        @click="handelDelete(row, $index)"
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
                    is-sub-table
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
import { deepCopy } from '../../common/utils';

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
        value: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            visible: false,
            subItemIndex: null
        };
    },
    methods: {
        handelEdit(row, index) {
            const loaclRow = deepCopy(row);
            this.visible = true;
            this.subItemIndex = index;
            this.$nextTick(() => {
                this.$refs.viewComponentsRef.setData({
                    ...loaclRow,
                    props:
                        typeof loaclRow.props === 'string'
                            ? JSON.parse(loaclRow.props)
                            : loaclRow.props
                });
            });
        },
        handelDelete(index) {
            this.$emit('delete', this.editorItem.column, index);
        },
        handelSave() {
            const valid = this.$refs.viewComponentsRef.checkForm();
            const formData = this.$refs.viewComponentsRef.getFormData();
            if (valid) {
                this.$emit(
                    'change',
                    this.editorItem.column,
                    { ...formData, parentColumn: this.editorItem.column },
                    this.subItemIndex
                );
                this.visible = false;
            }
        },
        handelClose() {
            this.subItemIndex = null;
            this.$refs.viewComponentsRef.reset();
        }
    }
};
</script>
