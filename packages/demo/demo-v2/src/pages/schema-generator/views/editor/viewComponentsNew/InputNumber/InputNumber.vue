<template>
    <div>
        <div class="sub_title">数字输入框配置</div>
        <el-form
            ref="formRef"
            size="small"
            :model="formProps"
            label-width="auto"
        >
            <el-form-item
                label="占位符"
                prop="placeholder"
            >
                <el-input v-model="formProps.placeholder"></el-input>
            </el-form-item>
            <el-form-item
                label="最大数"
                prop="max"
            >
                <el-input-number
                    v-model="formProps.max"
                    :precision="0"
                />
            </el-form-item>
            <el-form-item
                label="最小数"
                prop="min"
            >
                <el-input-number
                    v-model="formProps.min"
                    :precision="0"
                />
            </el-form-item>
            <el-form-item
                label="精度"
                prop="precision"
            >
                <el-input-number
                    v-model="formProps.precision"
                    :min="0"
                    :precision="0"
                />
            </el-form-item>
            <el-form-item
                label="前缀"
                prop="prefix"
            >
                <el-input v-model="formProps.prefix"></el-input>
            </el-form-item>
            <el-form-item
                label="后缀"
                prop="suffix"
            >
                <el-input v-model="formProps.suffix"></el-input>
            </el-form-item>
            <el-form-item
                label="是否是金额"
                prop="isAmount"
            >
                <el-radio-group v-model="formProps.isAmount">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
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
    computed: {
        formProps() {
            const DEFAULTS = {
                placeholder: '请输入',
                max: undefined,
                min: undefined,
                precision: 0,
                prefix: '',
                suffix: '',
                isAmount: false
            };
            const values = this.value || {};
            return {
                ...DEFAULTS,
                ...values
            };
        }
    }
};
</script>

<style scoped lang="scss"></style>
