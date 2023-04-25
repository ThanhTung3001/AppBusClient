import React, { useRef, useState, useEffect } from 'react';
import TreeView from 'devextreme-react/tree-view';
import Sortable from 'devextreme-react/sortable';

import service from './data.js';
import { GetWithToken, PutWithToken } from '../../../../app/api/apiMethod.js';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const TreeListView = ({ data }) => {



    const [menu, setMenu] = useState([]);
    const menus = useSelector(state => state.menu.menu);
    const AppToken = useSelector(state => state.user.token);
    const dispatch = useDispatch();

    const GetMenu = () => {
        GetWithToken({ url: `/api/Menu`, token: AppToken })
            .then(rs => {
                if (rs.status == 200) {
                    var mapperItem = rs.data.data.map((e, index) => {

                        var items = [];
                        if (e.children.length > 0) {
                            //   var items = [];
                            items = e.children.map((item, index) => {
                                return {
                                    id: item.id.toString(),
                                    name: item.name,
                                    icon: item.icon,
                                    isDirectory: item.children.length > 0,
                                    expanded: true,
                                    items: []
                                }
                            })
                        }
                        return {
                            id: e.id.toString(),
                            name: e.name,
                            icon: e.icon,
                            isDirectory: e.children.length > 0,
                            expanded: true,
                            items: items
                        }
                    });
                    // console.log('====================================');
                    console.log(mapperItem);
                    // console.log('====================================');
                    setMenu(mapperItem);
                }
            })
    }
    const initMenu = () => {
        if (menu.length == 0) {
            GetMenu();
        }
    }
    useEffect(() => {

        initMenu();
    }, [])

    const handlerUpdatePosition = ({ idStart, idEnd }) => {
        PutWithToken({ url: `/api/Menu/Position?menuId=${idStart}&parrentId=${idEnd}`, token: AppToken })
            .then(rs => {
                if (rs.status == 200) {
                    GetMenu();
                    toast.success('Cập nhật menu thành công');
                } else {
                    toast.error('Cập nhật menu thất bại');
                }
            })
    }


    const treeViewDriveCRef = useRef();
    const treeViewDriveDRef = useRef();


    function treeViewDriveC() {

        return treeViewDriveCRef.current;
    }

    function treeViewDriveD() {
        return this.treeViewDriveDRef.current.instance;
    }

    function onDragChange(e) {
        // console.log('====================================');
        // console.log(e);
        // console.log('====================================');
        // if (e.fromComponent === e.toComponent) {
        //     const fromNode = this.findNode(this.getTreeView(e.fromData), e.fromIndex);
        //     const toNode = this.findNode(this.getTreeView(e.toData), this.calculateToIndex(e));
        //     if (toNode !== null && this.isChildNode(fromNode, toNode)) {
        //         e.cancel = true;
        //     }
        // }
    }

    function onDragEnd(e) {

        const fromTreeView = getTreeView(e.fromData);
        const toTreeView = getTreeView(e.toData);

        console.log('====================================');
        console.log(treeViewDriveCRef.current.instance.element().querySelectorAll('.dx-treeview-node'));
        console.log('====================================');
        var idFrom = (treeViewDriveCRef.current.instance.element().querySelectorAll('.dx-treeview-node')[e.fromIndex].getAttribute('data-item-id'));
        var idTo = 0;

        try {
            idTo = (treeViewDriveCRef.current.instance.element().querySelectorAll('.dx-treeview-node')[calculateToIndex(e)].getAttribute('data-item-id'));
        } catch (error) {
            idTo = (treeViewDriveCRef.current.instance.element().querySelectorAll('.dx-treeview-node')[calculateToIndex(e) - 1].getAttribute('data-item-id'));
        }

        console.log({ idFrom, idTo });
        if (idFrom != idTo) {
            handlerUpdatePosition({ idStart: idFrom, idEnd: idTo });
        }

        // handlerUpdatePosition({ idStart: idFrom, idEnd: idTo });
    }

    function getTreeView(driveName) {
        return driveName === 'menu'
            ? treeViewDriveC
            : treeViewDriveD;
    }

    function getStateFieldName(driveName) {
        return driveName === 'driveC'
            ? 'itemsDriveC'
            : 'itemsDriveD';
    }

    function calculateToIndex(e) {
        if (e.fromComponent !== e.toComponent || e.dropInsideItem) {
            return e.toIndex;
        }

        return e.fromIndex >= e.toIndex
            ? e.toIndex
            : e.toIndex + 1;
    }

    function findNode(treeView, index) {
        const nodeElement = treeView.element().querySelectorAll('.dx-treeview-node')[index];
        if (nodeElement) {
            return this.findNodeById(treeView.getNodes(), nodeElement.getAttribute('data-item-id'));
        }
        return null;
    }

    function findNodeById(nodes, id) {
        for (let i = 0; i < nodes.length; i += 1) {
            if (nodes[i].itemData.id === id) {
                return nodes[i];
            }
            if (nodes[i].children) {
                const node = this.findNodeById(nodes[i].children, id);
                if (node != null) {
                    return node;
                }
            }
        }
        return null;
    }

    function moveNode(fromNode, toNode, fromItems, toItems, isDropInsideItem) {
        const fromNodeContainingArray = this.getNodeContainingArray(fromNode, fromItems);
        const fromIndex = fromNodeContainingArray.findIndex((item) => item.id === fromNode.itemData.id);
        fromNodeContainingArray.splice(fromIndex, 1);

        if (isDropInsideItem) {
            toNode.itemData.items.splice(toNode.itemData.items.length, 0, fromNode.itemData);
        } else {
            const toNodeContainingArray = this.getNodeContainingArray(toNode, toItems);
            const toIndex = toNode === null
                ? toNodeContainingArray.length
                : toNodeContainingArray.findIndex((item) => item.id === toNode.itemData.id);
            toNodeContainingArray.splice(toIndex, 0, fromNode.itemData);
        }
    }

    function getNodeContainingArray(node, rootArray) {
        return node === null || node.parent === null
            ? rootArray
            : node.parent.itemData.items;
    }

    function isChildNode(parentNode, childNode) {
        let { parent } = childNode;
        while (parent !== null) {
            if (parent.itemData.id === parentNode.itemData.id) {
                return true;
            }
            parent = parent.parent;
        }
        return false;
    }

    function getTopVisibleNode(component) {
        const treeViewElement = component.element();
        const treeViewTopPosition = treeViewElement.getBoundingClientRect().top;
        const nodes = treeViewElement.querySelectorAll('.dx-treeview-node');
        for (let i = 0; i < nodes.length; i += 1) {
            const nodeTopPosition = nodes[i].getBoundingClientRect().top;
            if (nodeTopPosition >= treeViewTopPosition) {
                return nodes[i];
            }
        }

        return null;
    }
    const handleSelectionChanged = (e) => {
        console.log(e.node.key);
    };
    return (
        <div className="form">
            <div className="drive-panel">
                <div className="drive-header dx-treeview-item"><div className="dx-treeview-item-content"><i className="dx-icon dx-icon-activefolder"></i><span>Menu</span></div></div>
                <Sortable
                    filter=".dx-treeview-item"
                    group="shared"
                    data="menu"
                    allowDropInsideItem={true}
                    allowReordering={true}
                    onDragChange={onDragChange}
                    onDragEnd={onDragEnd}>
                    <TreeView
                        id="menu"
                        expandNodesRecursive={false}
                        dataStructure="tree"
                        ref={treeViewDriveCRef}
                        items={menu}
                        width={250}
                        height={380}
                        displayExpr="name"
                        onSelectionChanged={handleSelectionChanged}
                    />
                </Sortable>
            </div>

        </div>
    );
}

export default TreeListView;
