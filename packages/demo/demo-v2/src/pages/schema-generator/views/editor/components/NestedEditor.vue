<template>
    <draggable
        ref="draggable"
        :list="childComponentList"
        v-bind="dragOptions"
        :class="[$style.dragArea, $style.formItemWrap]"
        @change="handleDragChange"
    >
        <div
            v-for="item in childComponentList"
            :key="item.id"
            :class="{
                draggableItem: true,
                w100: showNestedEditor(item),
                [$style.formItem]: true
            }"
            :style="
                item.placeholder
                    ? {
                        width: item.placeholder
                            ? `calc(${100 / (24 / item.placeholder)}%)`
                            : 'calc(50%)',
                        flexBasis: item.placeholder
                            ? `calc(${100 / (24 / item.placeholder)}%)`
                            : 'calc(50%)'
                    }
                    : {}
            "
        >
            <ViewComponentWrap
                :form-data="formData"
                :editor-item="item"
                :drag-options="dragOptions"
                :show-nested-editor="showNestedEditor"
                :form-props="formProps"
                @onOperate="handleItemOperate"
            >
            </ViewComponentWrap>
        </div>
    </draggable>
</template>

<script>
import Draggable from 'vuedraggable';

// 避免循环依赖导致undefined
const ViewComponentWrap = () => import('./ViewComponentWrap');

export default {
    name: 'NestedEditor',
    components: {
        Draggable,
        ViewComponentWrap
    },
    props: {
        dragOptions: {
            type: Object,
            default: () => ({})
        },
        formData: {
            type: Object,
            default: () => ({})
        },
        childComponentList: {
            type: Array,
            default: () => []
        },
        formProps: {
            type: Object,
            default: () => {}
        }
    },

    methods: {
        showNestedEditor(editorItem) {
            return (
                editorItem.childList
            );
        },
        handleDragChange(...args) {
            console.log(args);
        }
    }
};
</script>

<style module>
@import "demo-common/css/variable.css";
:global {
    .ghostItem {
        opacity: 0.6;
        background-color: color(var(--color-primary) a(0.4)) !important;
        box-shadow: 0 0 1px 0 var(--color-primary);
        &.draggableToolItem {
            margin-top: 0;
            width: 100%;
            max-width: 100%;
            margin-bottom: 10px;
            height: 130px;
            line-height: 130px;
        }
    }
    .el-form--label-left,
    .el-form--label-right {
        .draggableToolItem {
            height: 100px;
            line-height: 100px;
        }
    }

    /* inline 布局 */
    .el-form--inline {
        :local .formItem {
            display: inline-block;
            margin-right: 10px;
            vertical-align: top;
        }
        .draggableToolItem {
            width: auto;
            max-width: none;
            padding: 0 20px;
            display: inline-block;
            margin-right: 10px;
            vertical-align: top;
        }
        .w100 {
            width: 100%;
        }
        .formFooter_item-editor {
            width: auto;
            max-width: none;
        }
    }

    /* column 布局 */
    .layoutColumn {
        .w100 {
            width: 100% !important;
        }
        :local {
            .formItemWrap {
                :global {
                    .el-form-item {
                        width: 100% !important;
                        flex-basis: 100% !important;
                    }
                }
            }
        }
        :local .formItem {
            display: inline-block;
            vertical-align: top;
        }
        .draggableToolItem {
            display: inline-block;
            vertical-align: top;
            border: none;
        }
        &.layoutColumn-1 {
            :local .formItem {
                width: 100%;
            }
            .draggableToolItem {
                width: 100%;
            }
        }
        &.layoutColumn-2 {
            :local .formItem {
                width: 50%;
            }
            .draggableToolItem {
                width: 49.6%;
            }
        }
        &.layoutColumn-3 {
            :local .formItem {
                width: 33.333%;
            }
            .draggableToolItem {
                width: 33%;
            }
        }
    }
}

.dragArea {
    width: 100%;
    box-sizing: border-box;
    font-size: 0;
    background-color: #f5f5f5;
    height: 100%;
    padding: 15px;
    overflow: auto;
    .dragArea {
        &:empty {
            padding: 20px;
            &:after {
                display: block;
                text-align: center;
                font-size: 12px;
                content: "拖入子组件";
            }
        }
    }
    :global {
        .fieldGroupWrap_box {
            display: none !important;
        }
        .emptyBox {
            min-height: 350px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .viewEmpty_IconBox {
            color: color(var(--checkbox-color) a(0.7));
            font-size: 50px;
            text-align: center;
        }
        .el-image {
            vertical-align: top;
        }
    }
}
</style>
