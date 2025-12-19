<template>
    <el-form
        ref="formRef"
        size="small"
        :model="formData"
        label-width="auto"
    >
        <el-form-item label="活动名称">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
    </el-form>
</template>

<script >
export default {
    data() {
        return {
            formData: {}
        };
    },
};
</script>

<style scoped lang='scss'>

</style>
