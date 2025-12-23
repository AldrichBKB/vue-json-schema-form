<template>
    <div>
        <div class="sub_title">子表配置</div>
        <el-table
            :data="editorItem.children"
            stripe
            row-key="id"
            style="width: 100%"
        >
            <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
            />
            <el-table-column
                prop="column"
                label="字段名称key"
                width="100"
            />
            <el-table-column
                prop="columnName"
                label="字段描述"
                align="center"
            />
            <el-table-column
                prop="columnType"
                label="字段类型"
                align="center"
            />
            <el-table-column
                fixed="right"
                label="操作"
                align="center"
            >
                <template slot-scope="{ row,$index }">
                    <el-button
                        type="text"
                        size="small"
                        @click="handelEdit(row,$index)"
                    >
                        编辑
                    </el-button>
                    <el-button
                        type="text"
                        size="small"
                        :style="{ color: '#ee0b0b', marginLeft: '8px' }"
                        @click="handelDelete(row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        editorItem: {
            type: Object,
            default: () => ({})
        }
    },

};
</script>

<style scoped lang="scss"></style>
