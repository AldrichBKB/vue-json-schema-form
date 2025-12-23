<template>
    <div>
        <div class="sub_title">日期选择配置</div>
        <el-form
            ref="formRef"
            size="small"
            label-suffix=":"
            :model="value"
            label-width="auto"
        >
            <el-form-item
                label="占位符"
                prop="placeholder"
            >
                <el-input v-model="value.placeholder"></el-input>
            </el-form-item>
            <el-form-item
                label="类型"
                prop="type"
            >
                <el-select v-model="value.type">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                label="数据值格式"
                prop="value-format"
            >
                <el-input v-model="value['value-format']"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            typeOptions: [
                {
                    label: '日',
                    value: 'date',
                },
                {
                    label: '月',
                    value: 'month',
                },
                {
                    label: '年',
                    value: 'year',
                },
                {
                    label: '日期范围',
                    value: 'daterange',
                },
                {
                    label: '日期时间',
                    value: 'datetime',
                },
                {
                    label: '日期时间范围',
                    value: 'datetimerange',
                },
            ]
        };
    },

};
</script>

<style scoped lang="scss"></style>
