<template>
    <div>
        <div class="sub_title">输入框配置</div>
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
                label="最大输入长度"
                prop="maxlength"
            >
                <el-input-number
                    v-model="value.maxlength"
                    :min="1"
                    :max="2000"
                    :precision="0"
                />
            </el-form-item>
            <el-form-item
                label="前缀"
                prop="prefix"
            >
                <el-input v-model="value.prefix"></el-input>
            </el-form-item>
            <el-form-item
                label="后缀"
                prop="suffix"
            >
                <el-input v-model="value.suffix"></el-input>
            </el-form-item>
            <el-form-item
                label="是否是金额"
                prop="isAmount"
            >
                <el-radio-group v-model="value.isAmount">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item
                label="跳转地址"
                prop="jumpPath"
            >
                <el-input v-model="value.jumpPath"></el-input>
            </el-form-item>
            <el-form-item
                label="跳转按钮名称"
                prop="jumpPathBtnName"
            >
                <el-input v-model="value.jumpPathBtnName"></el-input>
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
