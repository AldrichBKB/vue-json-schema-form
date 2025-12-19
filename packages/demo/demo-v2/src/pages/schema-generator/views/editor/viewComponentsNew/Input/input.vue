<template>
    <div>
        <div class="sub_title">输入框配置</div>
        <el-form
            ref="formRef"
            size="small"
            :model="formData"
            label-width="auto"
        >
            <el-form-item
                label="占位符"
                prop="placeholder"
            >
                <el-input v-model="formData.placeholder"></el-input>
            </el-form-item>
            <el-form-item
                label="最大输入长度"
                prop="maxlength"
            >
                <el-input v-model="formData.maxlength"></el-input>
            </el-form-item>
            <el-form-item
                label="前缀"
                prop="prefix"
            >
                <el-input v-model="formData.prefix"></el-input>
            </el-form-item>
            <el-form-item
                label="后缀"
                prop="suffix"
            >
                <el-input v-model="formData.suffix"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script >
export default {
    data() {
        return {
            formData: {
                placeholder: '请输入',
                maxlength: 500,
                prefix: '',
                suffix: ''
            }
        };
    },
};
</script>

<style scoped lang='scss'>

</style>
