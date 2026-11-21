import components from "./components";
import actionbar from "./crud/actionbar";
import formDialog from "./crud/form-dialog";
import type zh from "../zh";

export default {
  components,
  crud: { actionbar, formDialog },
} satisfies typeof zh;
