<template>
    <div
        :class="{
            [$style.viewBox]: true,
            [$style.active]: editorItem.isEdit,
            js_viewComponentWrap: true
        }"
        @click="handleClickView"
    >
        <!-- <span :class="$style.formProperty"> {{ attrs.curNodePath }}</span> -->

        <p :class="$style.formProperty">
            {{ editorItem.column }}
        </p>
        <el-form
            ref="formRef"
            label-width="140px"
            size="small"
            label-suffix=":"
            :model="formValue"
            :style="{ marginTop: '10px' }"
        >
            <el-form-item
                :style="{ margin: '0px' }"
                :label="editorItem.columnName"
            >
                <el-input
                    v-if="editorItem.columnType === COLUMNTYPE.INPUT"
                    v-model="formValue[editorItem.column]"
                    v-bind="attrs"
                    autosize
                >
                </el-input>
                <el-input-number
                    v-if="editorItem.columnType === COLUMNTYPE.NUMBER"
                    v-model="formValue[editorItem.column]"
                    v-bind="attrs"
                    autosize
                >
                </el-input-number>
                <el-select
                    v-if="
                        [COLUMNTYPE.SELECT, COLUMNTYPE.DEPARTMENT].includes(
                            editorItem.columnType
                        )
                    "
                    v-model="formValue[editorItem.column]"
                    v-bind="attrs"
                    @focus="handleClickView"
                >
                </el-select>
                <el-cascader
                    v-if="editorItem.columnType === COLUMNTYPE.CASCADER"
                    v-model="formValue[editorItem.column]"
                    v-bind="attrs"
                />
                <el-date-picker
                    v-if="editorItem.columnType === COLUMNTYPE.DATE"
                    v-model="formValue[editorItem.column]"
                    v-bind="attrs"
                />
                <el-upload
                    v-if="editorItem.columnType === COLUMNTYPE.ATTACHMENT"
                    v-model="formValue[editorItem.column]"
                    v-bind="attrs"
                >
                    <el-button
                        size="small"
                        type="primary"
                    >
                        点击上传
                    </el-button>
                </el-upload>
                <el-alert
                    v-if="editorItem.columnType === COLUMNTYPE.ALERT"
                    show-icon
                    :closable="false"
                    v-bind="attrs"
                />
            </el-form-item>
        </el-form>

        <el-table
            v-if="editorItem.columnType === COLUMNTYPE.SUBTABLE"
            ref="tableRef"
            :data="[{}]"
            stripe
            default-expand-all
            v-bind="attrs"
            @row-drag-start="syncScroll"
            @row-drag-end="syncScroll"
        >
            <el-table-column
                v-for="(sitem, sindex) in columnSort(editorItem.children)"
                :key="sindex"
                align="center"
                :prop="sitem.column"
                :label="sitem.columnName"
                :width="columnPropsCom(sitem.props).width || 240"
                :fixed="columnPropsCom(sitem.props).fixed"
            >
                <template slot-scope="{ row }">
                    <el-input
                        v-if="sitem.columnType === COLUMNTYPE.INPUT"
                        v-model="row[sitem.column]"
                        size="small"
                        v-bind="attrs"
                        autosize
                    >
                    </el-input>
                    <el-input-number
                        v-if="sitem.columnType === COLUMNTYPE.NUMBER"
                        v-model="row[sitem.column]"
                        size="small"
                        v-bind="attrs"
                        autosize
                    >
                    </el-input-number>
                    <el-select
                        v-if="
                            [COLUMNTYPE.SELECT, COLUMNTYPE.DEPARTMENT].includes(
                                sitem.columnType
                            )
                        "
                        v-model="row[sitem.column]"
                        size="small"
                        v-bind="attrs"
                    >
                    </el-select>
                    <el-cascader
                        v-if="sitem.columnType === COLUMNTYPE.CASCADER"
                        v-model="row[sitem.column]"
                        size="small"
                        v-bind="attrs"
                    />
                    <el-date-picker
                        v-if="sitem.columnType === COLUMNTYPE.DATE"
                        v-model="row[sitem.column]"
                        v-bind="attrs"
                    />
                    <el-upload
                        v-if="sitem.columnType === COLUMNTYPE.ATTACHMENT"
                        v-model="row[sitem.column]"
                        size="small"
                        v-bind="attrs"
                    >
                        <el-button
                            size="small"
                            type="primary"
                        >
                            点击上传
                        </el-button>
                    </el-upload>
                </template>
            </el-table-column>
        </el-table>

        <NestedEditor
            v-if="showNestedEditor(editorItem)"
            :child-component-list="editorItem.childList"
            :drag-options="dragOptions"
            :form-data="formData"
            :form-props="formProps"
        >
        </NestedEditor>
    </div>
</template>

<script>
import emitter from '../../../mixins/emitter.js';
import NestedEditor from './NestedEditor';

import { COLUMNTYPE } from '../viewComponents/enums/processEnum';

export default {
    name: 'ViewComponentWrap',
    components: {
        NestedEditor
    },
    mixins: [emitter],
    props: {
        showNestedEditor: {
            type: Function,
            default: () => {}
        },
        editorItem: {
            type: Object,
            default: () => ({})
        },
        dragOptions: {
            type: Object,
            default: () => ({})
        },
        formData: {
            type: Object,
            default: () => ({})
        },
        formProps: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            COLUMNTYPE,
            formValue: {}
        };
    },
    computed: {
        attrs() {
            return this.editorItem && this.editorItem.props
                ? JSON.parse(this.editorItem.props)
                : {};
        },
        columnPropsCom() {
            return val => (val ? JSON.parse(val) : {});
        },
        columnSort() {
            return arr => Object.entries(arr)
                .map(([key, value]) => ({ key, ...value }))
                .sort((a, b) => a.sort - b.sort) || [];
        }
    },
    beforeDestroy() {
        this.hideEditForm();
    },
    methods: {
        syncScroll() {
            // 获取主表格的滚动容器
            const mainBodyWrapper = this.$refs.tableRef.$el.querySelector(
                '.el-table__body-wrapper'
            );

            // 获取固定列的滚动容器
            const fixedLeft = this.$refs.tableRef.$el.querySelector(
                '.el-table__fixed .el-table__body-wrapper'
            );
            const fixedRight = this.$refs.tableRef.$el.querySelector(
                '.el-table__fixed-right .el-table__body-wrapper'
            );

            // 同步滚动位置
            if (fixedLeft && mainBodyWrapper) {
                fixedLeft.scrollTop = mainBodyWrapper.scrollTop;
            }
            if (fixedRight && mainBodyWrapper) {
                fixedRight.scrollTop = mainBodyWrapper.scrollTop;
            }
        },
        // 点击只能打开，并且打开状态下只能执行一次
        handleClickView(e) {
            if (e) {
                // 阻止浏览器默认事件
                e.stopPropagation();
            }
            if (!this.editorItem.isEdit) {
                this.showEditForm();
            } else {
                // 设置当前选中tab
                this.setCurEditorItem(this.editorItem);
            }
        },

        // 显示编辑form
        showEditForm() {
            this.editorItem.isEdit = true;
            // 打开时才注册一个关闭事件，关闭弹窗时移除事件
            this.closeHandle = (event) => {
                // 点击的自己兄弟view关闭自己
                const $el = this.$el;
                const isChildEle = this.$el.contains(event.target);
                const parentWrapEle = event.target.closest(
                    '.js_viewComponentWrap'
                );

                // 点击非自身的item 关闭自己，或者点击了自己的子item 关闭自己
                if (
                    (!isChildEle && parentWrapEle)
                    || (isChildEle
                    && $el !== parentWrapEle
                    && $el.contains(parentWrapEle))
                ) {
                    this.hideEditForm();
                }
            };

            // 点击其它弹窗关闭这里
            document.addEventListener('click', this.closeHandle, true);

            this.setCurEditorItem(this.editorItem);
        },
        hideEditForm() {
            this.editorItem.isEdit = false;
            document.removeEventListener('click', this.closeHandle, true);
            this.setCurEditorItem(null);
        },

        setCurEditorItem(editorItem) {
            this.dispatch('Editor', 'onSetCurEditorItem', {
                editorItem
            });
        }
    }
};
</script>

<style module>
@import "demo-common/css/variable.css";
.viewBox {
    position: relative;
    margin-bottom: 10px;
    padding: 20px;
    cursor: move;
    outline: none;
    border: 1px dashed #bbb;
    overflow: hidden;
    background-color: #ffffff;
    @nest :global .draggableSlot :local & {
        cursor: no-drop;
    }
    &:after {
        pointer-events: none;
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        transition: box-shadow 0.3s ease;
        z-index: 2;
    }

    &.active {
        border: 1px dashed transparent;
        &:after {
            box-shadow: 0 0 2px 1px var(--color-primary) inset;
        }
    }
}
.formProperty {
    position: absolute;
    padding: 10px;
    top: 0;
    right: 0;
    font-size: 13px;
}

.editBar {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 26px;
    border-top-left-radius: 8px;
    background: var(--color-primary);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    & > .toolBarBtn {
        -webkit-appearance: none;
        appearance: none;
        padding: 0;
        margin: 0;
        outline: none;
        border: none;
        cursor: pointer;
        display: block;
        width: 26px;
        line-height: 30px;
        text-align: center;
        background-color: transparent;
        font-size: 16px;
        color: #ffffff;
        &[disabled] {
            display: none;
        }
        &:hover {
            opacity: 0.6;
        }
    }
}
</style>

<style>
.el-textarea .el-input__count {
    bottom: 1px;
    line-height: 30px;
}
.el-select,
.el-input-number,
.el-cascader,
.el-date-editor {
    width: 100% !important;
}
.el-alert .el-alert__icon {
    font-size: 16px;
    width: 16px;
}
.el-alert .el-alert__description {
    margin: 0;
    line-height: normal;
}
</style>
