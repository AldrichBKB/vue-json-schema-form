<template>
    <div>
        <div class="sub_title">上传配置</div>
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
                label="最大上传数"
                prop="limit"
            >
                <el-input-number
                    v-model="formProps.limit"
                    :precision="0"
                    :min="1"
                />
            </el-form-item>
            <el-form-item
                label="接受文件上传类型"

                prop="accept"
            >
                <el-input
                    v-model="formProps.accept"
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

    computed: {
        formProps() {
            const DEFAULTS = {
                placeholder: '请上传',
                limit: 20,
                accept: '.jpeg,.jpg,.png,.bmp,.tiff,.heic,.heif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.zip,.7z,.rar'
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
