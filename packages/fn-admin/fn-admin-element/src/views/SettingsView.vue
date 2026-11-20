<template><div class="view-page settings-page"><div class="page-intro"><div><p class="eyebrow">SETTINGS</p><h2>系统设置</h2><p>管理当前演示控制台的显示选项。</p></div></div><el-card shadow="never"><el-form label-position="top" class="settings-form"><el-form-item label="工作区名称"><el-input model-value="Fn Admin Console" /></el-form-item><el-form-item label="默认分页大小"><el-select model-value="10"><el-option label="10 条" value="10" /><el-option label="20 条" value="20" /><el-option label="50 条" value="50" /></el-select></el-form-item><el-form-item><el-button type="primary">保存设置</el-button></el-form-item></el-form></el-card></div></template>
<script setup lang="ts"></script>
<style lang="less">
.view-page {
  width: 100%;
  margin: 0;
  padding: 24px;

  .page-intro { margin-bottom: 24px; }
  .eyebrow { margin: 0 0 6px; color: #e1782d; font-size: 11px; letter-spacing: .14em; }
  h2 { margin: 0 0 6px; color: #19273a; font-size: 25px; }
  .page-intro p:last-child { margin: 0; color: #758397; }
  .settings-form { max-width: 460px; }
  .settings-form .el-select { width: 100%; }
}
</style>
