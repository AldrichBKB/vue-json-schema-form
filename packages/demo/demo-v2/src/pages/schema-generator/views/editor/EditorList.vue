<template>
    <div>
        <el-table
            :data="componentList"
            stripe
            row-key="column"
            height="98vh"
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
import emitter from '../../mixins/emitter.js';

export default {
    mixins: [emitter],
    props: {
        componentList: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        handelEdit(editorItem, index) {
            this.dispatch('Editor', 'onSetCurEditorItem', {
                editorItem,
                editorIndex: index,
                isEditorList: true
            });
        },
        handelDelete() {}
    }
};
</script>

<style></style>
