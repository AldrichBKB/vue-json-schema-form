<template>
    <div>
        <div class="sub_title">选择框配置</div>
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
                label="是否多选"
                prop="multiple"
            >
                <el-radio-group v-model="value.multiple">
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
};
</script>

<style scoped lang="scss"></style>
