<template>
    <div :style="{ height: isDialog ? 'auto' : 'calc(100vh - 74px)' }">
        <div class="schema-content">
            <div class="sub_title">基础配置</div>
            <el-form
                ref="formRef"
                size="small"
                label-width="auto"
                label-suffix=":"
                :model="formData"
                :rules="rules"
            >
                <el-form-item
                    label="字段名称Key"
                    prop="column"
                >
                    <el-input
                        v-model="formData.column"
                        placeholder="请输入"
                        @change="handelColumnChange"
                    />
                </el-form-item>
                <el-form-item
                    label="字段名称描述"
                    prop="columnName"
                >
                    <el-input
                        v-model="formData.columnName"
                        placeholder="请输入"
                        @change="handelColumnChange"
                    />
                </el-form-item>
                <el-form-item
                    label="字段类型"
                    prop="columnType"
                >
                    <el-select
                        v-model="formData.columnType"
                        :style="{ width: '100%' }"
                        filterable
                        placeholder="请选择"
                        @change="
                            () => {
                                handelColumnChange(), handelColumnTypeChange();
                            }
                        "
                    >
                        <el-option
                            v-for="item in columnTypeOptionsCom"
                            :key="item.code"
                            :label="item.code"
                            :value="item.code"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    label="数据地址"
                    prop="dataLink"
                >
                    <el-input
                        v-model="formData.dataLink"
                        type="textarea"
                        autosize
                        placeholder="请输入"
                        @change="handelColumnChange"
                    />
                </el-form-item>
                <el-form-item
                    label="静态数据JSON"
                    prop="columnDatas"
                >
                    <el-input
                        v-model="formData.columnDatas"
                        type="textarea"
                        autosize
                        placeholder="请输入"
                        @change="handelColumnChange"
                    />
                </el-form-item>
                <div v-if="isSubTable">
                    <el-form-item
                        label="字段顺序"
                        prop="sort"
                    >
                        <el-input-number
                            v-model="formData.sort"
                            :min="1"
                            :precision="0"
                        />
                    </el-form-item>
                    <el-form-item
                        label="字段宽度"
                        prop="width"
                    >
                        <el-input-number
                            v-model="formProps.width"
                            :min="1"
                            :precision="0"
                        />
                    </el-form-item>
                    <el-form-item
                        label="字段列是否固定"
                    >
                        <el-select
                            v-model="formProps.fixed"
                            :style="{ width: '100%' }"
                            placeholder="请选择"
                        >
                            <el-option
                                label="不固定"
                                :value="false"
                            />
                            <el-option
                                label="固定左侧"
                                value="left"
                            />
                            <el-option
                                label="固定右侧"
                                value="right"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <div v-if="!isDialog">
                    <el-form-item
                        label="是否是主要内容"
                        prop="point"
                    >
                        <el-radio-group
                            v-model="formData.point"
                            @change="handelColumnChange"
                        >
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="占位"
                        prop="placeholder"
                    >
                        <el-select
                            v-model="formData.placeholder"
                            :style="{ width: '100%' }"
                            placeholder="请选择"
                            @change="handelColumnChange"
                        >
                            <el-option
                                label="占位1/1"
                                :value="24"
                            />
                            <el-option
                                label="占位1/2"
                                :value="12"
                            />
                            <el-option
                                label="占位1/3"
                                :value="8"
                            />
                            <el-option
                                label="占位1/4"
                                :value="6"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item
                    label="展示条件"
                    prop="visibilityRule"
                    @change="handelColumnChange"
                >
                    <el-input
                        v-model="formData.visibilityRule"
                        placeholder="请输入"
                    />
                </el-form-item>
            </el-form>
            <ComponentInput
                v-if="formData.columnType === COLUMNTYPE.INPUT"
                v-model="formProps"
            />
            <ComponentInputNumber
                v-if="formData.columnType === COLUMNTYPE.NUMBER"
                v-model="formProps"
            />
            <ComponentSelect
                v-if="
                    [COLUMNTYPE.SELECT, COLUMNTYPE.DEPARTMENT].includes(
                        editorItem.columnType
                    )
                "
                v-model="formProps"
            />
            <ComponentCascader
                v-if="formData.columnType === COLUMNTYPE.CASCADER"
                v-model="formProps"
            />
            <ComponentDatePicker
                v-if="formData.columnType === COLUMNTYPE.DATE"
                v-model="formProps"
            />
            <ComponentUpload
                v-if="formData.columnType === COLUMNTYPE.ATTACHMENT"
                v-model="formProps"
            />
            <ComponentSubTable
                v-if="formData.columnType === COLUMNTYPE.SUBTABLE"
                :editor-item="editorItem"
                :component-list="localComponentList"
                @change="handelSubTableChange"
                @delete="handelSubTableDelete"
            />
            <ComponentAlert
                v-if="formData.columnType === COLUMNTYPE.ALERT"
                v-model="formProps"
            />
        </div>
        <div
            v-if="!isDialog"
            class="schema_footer"
        >
            <el-button
                size="small"
                type="primary"
                @click="handelColumnSave"
            >
                确 认
            </el-button>
        </div>
    </div>
</template>

<script>
import { getColumnTypeHttp } from '@/api/common';
import { COLUMNTYPE } from './enums/processEnum';
import { deepCopy, flattenTree } from '../common/utils';
import { formDefaults } from '../data';

const ComponentInput = () => import('./Input/Input.vue');
const ComponentInputNumber = () => import('./InputNumber/InputNumber.vue');
const ComponentSelect = () => import('./Select/Select.vue');
const ComponentCascader = () => import('./Cascader/Cascader.vue');
const ComponentDatePicker = () => import('./DatePicker/DatePicker.vue');
const ComponentUpload = () => import('./Upload/Upload.vue');
const ComponentSubTable = () => import('./SubTable/SubTable.vue');
const ComponentAlert = () => import('./Alert/Alert.vue');

export default {
    name: 'ViewComponents',
    components: {
        ComponentInput,
        ComponentInputNumber,
        ComponentSelect,
        ComponentCascader,
        ComponentDatePicker,
        ComponentUpload,
        ComponentSubTable,
        ComponentAlert
    },
    props: {
        isSubTable: {
            type: Boolean,
            default: () => false
        },
        isDialog: {
            type: Boolean,
            default: () => false
        },
        componentList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        const validateColumn = (_rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入'));
            } else {
                const newList = flattenTree(this.localComponentList);
                if (
                    newList.filter(item => item.column === value).length
                    > (this.isSubTable ? 1 : 0)
                ) {
                    callback(new Error('字段名称Key只能唯一'));
                }
                callback();
            }
        };
        return {
            COLUMNTYPE,
            formData: {
                column: '',
                columnName: '',
                columnType: '',
                sort: 0,
                dataLink: '',
                columnDatas: '',
                point: 0,
                placeholder: 12,
                visibilityRule: ''
            },
            rules: {
                column: [
                    {
                        validator: validateColumn,
                        required: true,
                        trigger: 'blur'
                    }
                ],
                columnName: [{ required: true, message: '请输入' }],
                columnType: [{ required: true, message: '请选择' }],
                sort: [{ required: true, message: '请输入' }],
                point: [{ required: true, message: '请选择' }],
                placeholder: [{ required: true, message: '请选择' }]
            },
            columnTypeOptions: [],
            formProps: {
                fixed: this.isSubTable ? false : undefined,
                width: this.isSubTable ? 100 : undefined,
            },
            editorItem: { children: [] },
            localComponentList: []
        };
    },
    computed: {
        columnTypeOptionsCom() {
            if (this.isSubTable) {
                return this.columnTypeOptions.filter(
                    item => item.code !== COLUMNTYPE.SUBTABLE
                );
            }
            return this.columnTypeOptions;
        }
    },
    watch: {
        componentList: {
            deep: true,
            immediate: true,
            handler(val) {
                if (val) {
                    this.localComponentList = val;
                }
            }
        },
    },

    async mounted() {
        const { data } = await getColumnTypeHttp();
        this.columnTypeOptions = data.data;
    },
    methods: {

        setData(row = {}) {
            this.editorItem = deepCopy(row);
            const { props } = deepCopy(row);
            this.formProps = {
                fixed: this.isSubTable ? false : undefined,
                width: this.isSubTable ? 100 : undefined,
                ...formDefaults(this.editorItem.columnType),
                ...(props || {}),
            };
            delete row.props;
            this.formData = deepCopy(row);
        },
        reset() {
            this.formData = {
                column: '',
                columnName: '',
                columnType: '',
                sort: 0,
                dataLink: '',
                columnDatas: '',
                point: 0,
                placeholder: 12,
                visibilityRule: ''
            };
            this.formProps = {};
            this.$refs.formRef.resetFields();
        },
        checkForm() {
            let flag = true;
            this.$refs.formRef.validate((valid) => {
                flag = valid;
            });
            return flag;
        },
        getFormData() {
            return {
                props: JSON.stringify(this.formProps),
                ...this.formData
            };
        },
        handelSubTableChange(column, formData = {}, subItemIndex) {
            const findex = this.localComponentList.findIndex(item => item.column === column);
            if (findex !== -1) {
                // 子表修改
                if (typeof subItemIndex === 'number') {
                    this.$set(this.localComponentList[findex].children, subItemIndex, formData);
                    this.editorItem = this.localComponentList[findex];
                } else {
                    const currentChildren = this.localComponentList[findex].children || [];
                    const newChildren = [
                        ...currentChildren.slice(0, formData.sort - 1),
                        formData,
                        ...currentChildren.slice(formData.sort - 1)
                    ];

                    this.$set(this.localComponentList[findex], 'children', newChildren);
                    this.editorItem = this.localComponentList[findex];
                }
                this.$emit('change', {
                    formProps: this.localComponentList[findex].props || '',
                    formData: this.localComponentList[findex]
                });
                this.$emit('save');
            }
        },
        handelSubTableDelete(column, index) {
            this.$confirm('是否确认删除此字段?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const findex = this.localComponentList.findIndex(item => item.column === column);
                if (findex !== -1) {
                    this.localComponentList[findex].children.splice(index, 1);
                    this.editorItem = this.localComponentList[findex];
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }
            });
        },
        handelColumnTypeChange() {
            this.formProps = {
                ...formDefaults(this.formData.columnType),
                fixed: this.isSubTable ? false : undefined,
                width: this.isSubTable ? 100 : undefined,
            };
        },
        handelColumnChange() {
            this.$emit('change', {
                formProps: this.formProps,
                formData: this.formData
            });
        },
        handelColumnSave() {
            this.$emit('change', {
                formProps: this.formProps,
                formData: this.formData
            });
            this.$emit('save');
        }
    }
};
</script>

<style>
.sub_title {
    font-size: 16px;
    color: #353639;
    font-weight: 600;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
.sub_title::before {
    background: #527bd9;
    content: "";
    display: inline-block;
    width: 3px;
    height: 25px;
    border-radius: 4px;
    margin-right: 8px;
}

.schema-content {
    height: calc(100% - 60px);
    overflow-y: auto;
    overflow-x: hidden;
}
.schema_footer {
    border-top: 1px solid #f5f5f5;
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    width: 100%;
}
</style>
