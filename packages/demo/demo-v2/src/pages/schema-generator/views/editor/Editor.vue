<template>
    <div v-loading="loading">
        <div :class="[$style.container]">
            <div
                :class="{
                    [$style.contentWrap]: true,
                    [$style.closeToolbar]: closeToolbar
                }"
            >
                <div :class="$style.toolBarWrap">
                    <div :class="$style.toolsBar">
                        <EditorList
                            :component-list="componentList"
                            @add="handelColumnAdd"
                            @delete="handelColumnDelete"
                        />
                    </div>
                    <span
                        :class="$style.leftCaret"
                        @click="closeToolbar = !closeToolbar"
                    >
                        <i class="el-icon-caret-right"></i>
                    </span>
                </div>

                <div :class="[$style.contentBox]">
                    <el-form
                        style="height: 100%"
                        :model="rootFormData"
                        v-bind="formProps"
                        class="genFromComponent"
                        label-width="auto"
                        :class="{
                            layoutColumn: !formProps.inline,
                            [`layoutColumn-${formProps.layoutColumn}`]: !formProps.inline,
                            formInlineFooter: formProps.inlineFooter,
                            formInline: formProps.inline
                        }"
                    >
                        <NestedEditor
                            :child-component-list="componentList"
                            :drag-options="dragOptions"
                            :form-data="rootFormData"
                            :form-props="formProps"
                        >
                        </NestedEditor>
                    </el-form>
                    <div
                        v-if="componentList.length === 0"
                        :class="$style.tipBox"
                    >
                        <p>拖拽左侧栏的组件进行添加</p>
                    </div>
                </div>
                <div :class="$style.rightForm">
                    <el-tabs v-model="activeName">
                        <el-tab-pane
                            label="组件配置"
                            name="compConfig"
                        >
                            <ViewComponents
                                ref="viewComponentsRef"
                                :component-list="componentList"
                                @change="handelColumnChange"
                                @save="handelColumnSave"
                            />
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getColumnPageHttp, editColumnHttp } from '@/api/common';
import { deepCopy } from './common/utils';

import NestedEditor from './components/NestedEditor.vue';
import ViewComponents from './viewComponents/genSchema.vue';
import EditorList from './EditorList.vue';


export default {
    name: 'Editor',
    components: {
        ViewComponents,
        NestedEditor,
        EditorList
    },
    provide() {
        return {
            genFormProvide: {
                fallbackLabel: true
            }
        };
    },
    data() {
        return {
            closeToolbar: false,
            loading: false,
            rootFormData: {},
            curEditorItem: null, // 选中的formItem
            componentList: [],
            formConfig: {},
            activeName: 'compConfig',
        };
    },

    computed: {
        formProps() {
            if (this.curEditorItem && this.curEditorItem.props) {
                return typeof this.curEditorItem.props === 'string' ? JSON.parse(this.curEditorItem.props) : this.curEditorItem.props;
            }
            return {};
        },
        formFooter() {
            return this.formConfig.formFooter || {};
        },
        dragOptions() {
            return {
                animation: 300,
                group: 'listComponentsGroup',
                disabled: false,
                ghostClass: 'ghostItem',
                filter: this.$style.disabled,
                draggable: '.draggableItem',
                tag: 'div',
                swapThreshold: 0.3
            };
        }
    },

    mounted() {
        window.document.body.classList.add('page-decorate-design');
    },
    destroyed() {
        window.document.body.classList.remove('page-decorate-design');
    },
    created() {
        this.$on('onSetCurEditorItem', ({ editorItem, isEditorList = false, editorIndex }) => {
            if (isEditorList) {
                this.componentList[editorIndex].isEdit = true;
                this.componentList.forEach((item, index) => {
                    if (index !== editorIndex) {
                        item.isEdit = false;
                    }
                });
            } else {
                this.componentList.forEach((item) => {
                    if (editorItem && editorItem.column !== item.column) {
                        item.isEdit = false;
                    }
                });
            }

            const newEditorItem = deepCopy(editorItem || {});
            if (newEditorItem && newEditorItem.props) {
                newEditorItem.props = typeof newEditorItem.props === 'string' ? JSON.parse(newEditorItem.props) : newEditorItem.props;
            } else {
                newEditorItem.props = {};
            }
            this.curEditorItem = newEditorItem;
            this.$refs.viewComponentsRef.setData(this.curEditorItem);
        });
        this.getColumnPage();
    },

    methods: {
        async handelColumnSave(msg = '流程保存成功') {
            this.loading = true;
            try {
                let newComponentList = this.componentList;
                newComponentList = newComponentList.map((item, index) => ({
                    ...item,
                    sort: index
                }));
                const { data } = await editColumnHttp({ formCode: 'FORM_PROJECT_INTERNAL_ACCEPTANCE', content: newComponentList });
                if (data.code === 200) {
                    this.$message.success(msg);
                } else {
                    this.$message.error(data.msg);
                }

            } finally {
                this.loading = false;
            }
        },
        handelColumnAdd(columnInfo) {
            const currentList = deepCopy(this.componentList);
            const newList = [
                ...currentList.slice(0, columnInfo.sort - 1),
                columnInfo,
                ...currentList.slice(columnInfo.sort - 1)
            ];
            this.componentList = newList;
            this.handelColumnSave();
        },
        handelColumnDelete(columnInfo) {
            this.$confirm('是否确认删除此字段?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const findex = this.componentList.findIndex(item => item.column === columnInfo.column);
                this.componentList.splice(findex, 1);
                this.handelColumnSave('字段删除成功');
            });
        },
        handelColumnChange(columnInfo) {
            const { formData, formProps } = columnInfo;
            this.componentList.forEach((item, index) => {
                if (formData && formData.column === item.column) {
                    this.$set(this.componentList, index, {
                        ...formData,
                        props: JSON.stringify(formProps)
                    });
                }
            });
        },
        async getColumnPage() {
            this.loading = true;
            try {
                const { data } = await getColumnPageHttp({
                    // formCode: 'FORM_PROJECT_INTERNAL_ACCEPTANCE',
                    // formCode: 'FORM_SALES_ORDER_ADD',
                    // formCode: 'FORM_SCM_BOM_ADD',
                    formCode: 'FORM_PROJECT_INTERNAL_ACCEPTANCE',
                    pageDto: { page: 1, pageSize: 999 }
                });

                if (data.code === 200) {
                    const columnList = data.data;
                    this.componentList = columnList.map(item => ({
                        ...item,
                        isEdit: false
                    }));
                }
            } finally {
                this.loading = false;
            }

        },


    },


};
</script>

<style>
body.page-decorate-design {
    overflow: hidden;
}
.flip-list-move {
    transition: transform 0.3s;
}
.no-move {
    transition: transform 0s;
}
</style>
<style module>
@import "demo-common/css/variable.css";
:root {
    --tool-bar-width: 340px;
    --right-form-width: 380px;
    --drag-area-width: auto;
}
/*预览模式 同步样式重置*/
.container {
    position: relative;
    box-sizing: border-box;
    height: calc(100vh);
    transition: 0.2s ease;
}
.hasTools {
    padding-left: var(--tool-bar-width);
    :global .el-icon-caret-right {
        transform: rotate(180deg);
    }
}
/*tools*/
.toolBarWrap,
.rightForm {
    position: absolute;
    top: 0;
    bottom: 0;
    background: var(--color-white);
    box-shadow: 0 0 0 1px rgba(171 171 171, 0.3);
    z-index: 2;
}

.rightForm,
.toolsBar {
    overflow: auto;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
}

.toolBarWrap {
    padding-top: 10px;
    width: var(--tool-bar-width);
    left: 0;
    overflow: visible;
}
.toolsBar {
    height: 100%;
}
.leftCaret {
    cursor: pointer;
    position: absolute;
    display: flex;
    width: 18px;
    height: 38px;
    align-items: center;
    justify-content: center;
    top: 50vh;
    right: 0;
    z-index: 3;
    background: #ffffff;
    box-shadow: 0 0 4px 0 color(var(--color-black) a(0.2));
    border-radius: 2px 0 0 2px;
    :global .el-icon-caret-right {
        transition: all 0.3s ease;
        transform: rotate(180deg);
    }
    &:hover {
        box-shadow: 0 0 4px 0 color(var(--color-black) a(0.4));
        opacity: 1;
    }
}
.rightForm {
    box-sizing: border-box;
    padding: 10px;
    right: 0;
    width: var(--right-form-width);
}
.configForm {
    padding: 0 20px;
    & > h3 {
        font-size: 15px;
        font-weight: bold;
    }
}

/*content area*/
.contentWrap {
    position: relative;
    overflow: auto;
    height: 100%;
    padding-left: var(--tool-bar-width);
    padding-right: var(--right-form-width);
    &::-webkit-scrollbar {
        width: 6px;
        height: 10px;
    }
    &::-webkit-scrollbar-track {
        background-color: var(--background-color-base);
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: var(--color-text-placeholder);
    }
}
.closeToolbar {
    padding-left: 0;
    .toolBarWrap {
        left: calc(0 - var(--tool-bar-width));
        .leftCaret {
            right: -18px;
        }
        :global {
            .el-icon-caret-right {
                transform: rotate(0);
            }
        }
    }
}
.contentBox {
    position: relative;
    padding: 0;
    height: 100%;
}
.tipBox {
    pointer-events: none;
    top: 20px;
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center;
    margin: 30vh 0;
    p {
        margin: 20px 0;
        font-size: 16px;
    }
}
</style>
