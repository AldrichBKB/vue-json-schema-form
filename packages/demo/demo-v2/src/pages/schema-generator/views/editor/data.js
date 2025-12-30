/**
 * Created by Liu.Jun on 2020/4/28 15:36.
 */
import { COLUMNTYPE } from './viewComponents/enums/processEnum';

export function vm2Api(vmData) {
    return vmData.map(item => ({
        name: item.componentPack.propsSchema.id,
        value: item.componentValue
    }));
}

function getComponentMap(configTools) {
    const componentList = configTools.reduce(
        (preVal, curVal) => [...preVal, ...curVal.componentList],
        []
    );

    // 注册组件结构
    return componentList.reduce((preVal, componentItem) => {
        preVal[componentItem.componentPack.propsSchema.id] = componentItem;
        return preVal;
    }, {});
}

export function api2VmToolItem(configTools, apiData) {
    const componentMap = getComponentMap(configTools);
    try {
        const apiJson = apiData === String(apiData) ? JSON.parse(apiData) : apiData;
        return apiJson.map(({ name, value }) => ({
            ...componentMap[name],
            componentValue: value
        }));
    } catch (e) {
        // 数据解析失败不处理
        return [];
    }
}

export function formDefaults(columnType) {
    if (columnType === COLUMNTYPE.INPUT) {
        return {
            placeholder: '请输入',
            type: 'textarea',
            maxlength: 500,
            prefix: '',
            suffix: '',
            jumpPathBtnName: '详情'
        };
    }
    if (columnType === COLUMNTYPE.NUMBER) {
        return {
            placeholder: '请输入',
            max: undefined,
            min: undefined,
            precision: 0,
            prefix: '',
            suffix: '',
            controls: false,
            isAmount: false
        };
    }
    if ([COLUMNTYPE.SELECT, COLUMNTYPE.DEPARTMENT].includes(
        columnType
    )) {
        return {
            placeholder: '请选择',
            multiple: false,
        };
    }
    if (columnType === COLUMNTYPE.CASCADER) {
        return {
            placeholder: '请选择',
            label: 'name',
            value: 'aid',
            children: 'children',
        };
    }
    if (columnType === COLUMNTYPE.DATE) {
        return {
            placeholder: '请选择',
            type: 'date',
            'value-format': 'yyyy-MM-dd'
        };
    }
    if (columnType === COLUMNTYPE.ATTACHMENT) {
        return {
            placeholder: '请上传',
            limit: 20,
            accept: '.jpeg,.jpg,.png,.bmp,.tiff,.heic,.heif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.zip,.7z,.rar'
        };
    }
    if (columnType === COLUMNTYPE.ALERT) {
        return {
            type: 'warning',
            closable: false,
            showIcon: true
        };
    }
    if (columnType === COLUMNTYPE.SUBTABLE) {
        return {
            height: undefined,
            rowKey: 'treeId'
        };
    }
    return {};

}
