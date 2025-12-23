<template>
    <div>
        <div class="sub_title">上传配置</div>
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
                label="最大上传数"
                prop="limit"
            >
                <el-input-number
                    v-model="value.limit"
                    :precision="0"
                    :min="1"
                />
            </el-form-item>
            <el-form-item
                label="接受文件上传类型"

                prop="accept"
            >
                <el-input
                    v-model="value.accept"
                    type="textarea"
                    autosize
                />
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
