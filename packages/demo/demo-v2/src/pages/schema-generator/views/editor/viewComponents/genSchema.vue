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
                <el-form-item
                    v-if="!isDialog"
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
                    v-if="!isDialog"
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
                :component-list="componentList"
                @change="handelSubTableChange"
            />
        </div>
        <div
            v-if="editorItem && Object.keys(editorItem).length"
            class="schema_footer"
        >
            <el-button
                size="small"
                type="primary"
                @click="handelSave"
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

export default {
    components: {
        ComponentInput,
        ComponentInputNumber,
        ComponentSelect,
        ComponentCascader,
        ComponentDatePicker,
        ComponentUpload,
        ComponentSubTable
    },
    props: {
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
                const newList = flattenTree(this.componentList);
                if (
                    newList.filter(item => item.column === value).length
                    > (this.isDialog ? 0 : 1)
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
                point: [{ required: true, message: '请选择' }],
                placeholder: [{ required: true, message: '请选择' }]
            },
            columnTypeOptions: [],
            formProps: {},
            editorItem: {}
        };
    },
    computed: {
        columnTypeOptionsCom() {
            if (this.isDialog) {
                return this.columnTypeOptions.filter(
                    item => item.code !== COLUMNTYPE.SUBTABLE
                );
            }
            return this.columnTypeOptions;
        }
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
                ...formDefaults(this.editorItem.columnType),
                ...(props || {})
            };
            delete row.props;
            this.formData = row;
        },
        reset() {
            this.formData = {
                column: '',
                columnName: '',
                columnType: '',
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
        handelSubTableChange() {

        },
        handelColumnTypeChange() {
            this.formProps = {
                ...formDefaults(this.formData.columnType)
            };
        },
        handelColumnChange() {
            this.$emit('change', {
                formProps: this.formProps,
                formData: this.formData
            });
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
