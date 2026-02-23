import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
// import { ListDataSymbol } from '../data/ListDataSymbol';
const { ccclass, property } = _decorator;

@ccclass('PrefabManager')
export class PrefabManager extends Component {
    public static instance: PrefabManager = null

    onLoad() {
        PrefabManager.instance = this
    }

    @property(Prefab)
    symbolPrefab: Prefab = null


}

