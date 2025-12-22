<template>
    <div>
        <div class="sub_title">输入框配置</div>
        <el-form
            ref="formRef"
            size="small"
            label-suffix=":"
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
                label="最大输入长度"
                prop="maxlength"
            >
                <el-input-number
                    v-model="formProps.maxlength"
                    :min="1"
                    :max="2000"
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
                type: 'textarea',
                maxlength: 500,
                prefix: '',
                suffix: ''
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
