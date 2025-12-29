<template>
    <div>
        <div class="sub_title">提示内容配置</div>
        <el-form
            ref="formRef"
            size="small"
            label-suffix=":"
            :model="value"
            label-width="auto"
        >
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
                label="内容"
                prop="title"
            >
                <el-input v-model="value.title"></el-input>
            </el-form-item>
            <el-form-item
                label="小字内容"
                prop="description"
            >
                <el-input v-model="value.description"></el-input>
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
            typeOptions: [{
                label: '成功(绿色)',
                value: 'success'
            }, {
                label: '消息(灰色)',
                value: 'info'
            }, {
                label: '警告(黄色)',
                value: 'warning'
            }, {
                label: '错误(红色)',
                value: 'error'
            }]
        };
    },
};
</script>

<style scoped lang="scss"></style>
