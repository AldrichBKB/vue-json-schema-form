<template>
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
</template>

<script>
import { getColumnTypeHttp } from '@/api/common';

export default {
    data() {
        return {
            formData: {
                column: '',
                columnName: '',
                columnType: '',
                dataLink: '',
                point: 0,
                placeholder: 12,
                visibilityRule: '',
            },
            rules: {
                column: [{ required: true, message: '请输入' }],
                columnName: [{ required: true, message: '请输入' }],
                columnType: [{ required: true, message: '请选择' }],
                point: [{ required: true, message: '请选择' }],
                placeholder: [{ required: true, message: '请选择' }]
            },
            columnTypeOptions: []
        };
    },
    async mounted() {
        const { data } = await getColumnTypeHttp();
        this.columnTypeOptions = data.data;
    },
    methods: {
        setData(editorItem = {}) {
            this.formData = editorItem;
        }
    }
};
</script>

<style scoped lang="scss"></style>
