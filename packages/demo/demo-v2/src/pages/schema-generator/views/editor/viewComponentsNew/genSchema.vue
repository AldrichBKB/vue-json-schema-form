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
                placeholder="请选择"
            >
                <el-option
                    v-for="item in columnTypeOptions"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                />
            </el-select>
        </el-form-item>
    </el-form>
</template>

<script >
import { getColumnTypeHttp } from '@/api/common';

export default {
    data() {
        return {
            formData: {},
            rules: {
                column: [
                    { required: true, message: '请输入' },
                ],
                columnName: [
                    { required: true, message: '请输入' },
                ],
                columnType: [
                    { required: true, message: '请选择' },
                ],
            },
            columnTypeOptions: []
        };
    },
    async mounted() {
        const { data } = await getColumnTypeHttp();
        this.columnTypeOptions = data.data;
    }
};
</script>

<style scoped lang='scss'>

</style>
