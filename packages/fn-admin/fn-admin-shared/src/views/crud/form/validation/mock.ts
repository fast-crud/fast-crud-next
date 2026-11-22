import mockUtil from "../../../../mock/base"

const values = ["ops@example.com", "dev@example.com", "qa@example.com", "team@example.com", "oncall@example.com"]

export default mockUtil.buildMock({
  name: "FnAdminDemoFormValidation",
  idGenerator: 0,
  copyTimes: 11,
  list: values.map((email, index) => ({ name: "值班联系人 " + (index + 1), email })),
})
