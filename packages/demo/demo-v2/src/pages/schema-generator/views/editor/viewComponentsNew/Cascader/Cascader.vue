<template>
    <div>
        <div class="sub_title">级联选择配置</div>
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
                label="数据label值"
                prop="label"
            >
                <el-input v-model="formProps.label"></el-input>
                <p :style="{ fontSize: '12px' }">
                    指定选项标签为选项对象的某个属性值
                </p>
            </el-form-item>
            <el-form-item
                label="数据value值"
                prop="value"
            >
                <el-input v-model="formProps.value"></el-input>
                <p :style="{ fontSize: '12px' }">
                    指定选项的值为选项对象的某个属性值
                </p>
            </el-form-item>
            <el-form-item
                label="数据children值"
                prop="children"
            >
                <el-input v-model="formProps.children"></el-input>
                <p :style="{ fontSize: '12px' }">
                    指定选项的子选项为选项对象的某个属性值
                </p>
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
                placeholder: '请选择',
                label: 'name',
                value: 'aid',
                children: 'children',
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
