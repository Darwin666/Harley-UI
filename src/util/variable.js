const variable =  {
  action: "",
  clientId: "",
  clientSecret: "",
  tenantId: "",
  tokenHeader: "",
  token: "",

  init: function (option = {}) {
    this.action = option.action || "";
    this.clientId = option.clientId || "";
    this.clientSecret = option.clientSecret || "";
    this.tenantId = option.tenantId || "";
    this.tokenHeader = option.tokenHeader || "";
    this.token = option.token || "";
  },
};
export default variable;
