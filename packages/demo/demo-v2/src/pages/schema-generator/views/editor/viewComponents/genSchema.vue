<template>
    <div class="schema-warpper">
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
                    />
                </el-form-item>
                <el-form-item
                    label="字段名称描述"
                    prop="columnName"
                >
                    <el-input
                        v-model="formData.columnName"
                        placeholder="请输入"
                    />
                </el-form-item>
                <el-form-item
                    label="字段类型"
                    prop="columnType"
                >
                    <el-select
                        v-model="formData.columnType"
                        :style="{ width: '100%' }"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in columnTypeOptions"
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
                    />
                </el-form-item>
                <el-form-item
                    label="是否是主要内容"
                    prop="point"
                >
                    <el-radio-group v-model="formData.point">
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
                    >
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
        </div>
        <div
            v-if="editorItem && Object.keys(editorItem).length"
            class="schema_footer"
        >
            <el-button
                size="small"
                @click="handelCancel"
            >
                取 消
            </el-button>
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
import { deepCopy } from '../common/utils';
import { formDefaults } from '../data';

const ComponentInput = () => import('./Input/Input.vue');
const ComponentInputNumber = () => import('./InputNumber/InputNumber.vue');
const ComponentSelect = () => import('./Select/Select.vue');
const ComponentCascader = () => import('./Cascader/Cascader.vue');
const ComponentDatePicker = () => import('./DatePicker/DatePicker.vue');
const ComponentUpload = () => import('./Upload/Upload.vue');

export default {
    components: {
        ComponentInput,
        ComponentInputNumber,
        ComponentSelect,
        ComponentCascader,
        ComponentDatePicker,
        ComponentUpload
    },
    data() {
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
                column: [{ required: true, message: '请输入' }],
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
    async mounted() {
        const { data } = await getColumnTypeHttp();
        this.columnTypeOptions = data.data;
    },
    methods: {
        setData(row = {}) {
            this.editorItem = deepCopy(row);
            const { props } = deepCopy(row);
            this.formProps = { ...formDefaults(this.editorItem.columnType), ...props || {} };
            delete row.props;
            this.formData = row;
        },
        handelSave() {
            // this.$emit('save', {
            //     formProps: this.formProps,
            //     formData: this.formData
            // });

            console.log({
                formProps: this.formProps,
                formData: this.formData
            });
        },
        handelCancel() {
            const row = deepCopy(this.editorItem);
            const { props } = deepCopy(row);
            this.formProps = props || {};
            delete row.props;
            this.formData = row;
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
.schema-warpper {
    height: calc(100vh - 74px);
}
.schema-content {
    height: calc(100% - 60px);
    overflow-y: auto;
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
