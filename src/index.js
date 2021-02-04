import variable from "@/util/variable";

import HAdvancedSearch from "./lib/advancedSearch.vue";
import HBlock from "./lib/block.vue";
import HCarPlate from "./lib/carPlate.vue";
import HCarPlateColorRadio from "./lib/carPlateColorRadio.vue";
import HCarPlateNoEditor from "./lib/carPlateNoEditor/index.vue";
import HCheckboxGroup from "./lib/checkboxGroup.vue";
import HImageUpload from "./lib/imageUpload.vue";
import HInputNumber from "./lib/inputNumber.vue";
import HNavigation from "./lib/navigation.vue";
import HOperationBar from "./lib/operationBar.vue";
import HPanel from "./lib/panel.vue";
import HRadioGroup from "./lib/radioGroup.vue";
import HSearchBar from "./lib/searchBar.vue";
import HSearchCondition from "./lib/searchCondition.vue";
import HSelect from "./lib/select.vue";
import HSelectTable from "./lib/selectTable.vue";
import HSelectTree from "./lib/selectTree.vue";
import HSmsCodeInput from "./lib/smsCodeInput.vue";
import HTable from "./lib/table.vue";
import HTipBoard from "./lib/tipBoard.vue";
import HUpload from "./lib/upload.vue";

const Harley = {
  install: function (Vue, options = {}) {
    Vue.prototype.$harleyAction = options.action || "";
    Vue.prototype.$harleyWebsite = options.website || {};
    Vue.prototype.$harleyStore = options.store || {};

    Vue.component("HAdvancedSearch", HAdvancedSearch);
    Vue.component("HBlock", HBlock);
    Vue.component("HCarPlate", HCarPlate);
    Vue.component("HCarPlateColorRadio", HCarPlateColorRadio);
    Vue.component("HCarPlateNoEditor", HCarPlateNoEditor);
    Vue.component("HCheckboxGroup", HCheckboxGroup);
    Vue.component("HImageUpload", HImageUpload);
    Vue.component("HInputNumber", HInputNumber);
    Vue.component("HNavigation", HNavigation);
    Vue.component("HNavigation", HNavigation);
    Vue.component("HOperationBar", HOperationBar);
    Vue.component("HPanel", HPanel);
    Vue.component("HRadioGroup", HRadioGroup);
    Vue.component("HSearchBar", HSearchBar);
    Vue.component("HSearchCondition", HSearchCondition);
    Vue.component("HSelect", HSelect);
    Vue.component("HSelectTable", HSelectTable);
    Vue.component("HSelectTree", HSelectTree);
    Vue.component("HSmsCodeInput", HSmsCodeInput);
    Vue.component("HTable", HTable);
    Vue.component("HTipBoard", HTipBoard);
    Vue.component("HUpload", HUpload);
  },
};

export default Harley;
