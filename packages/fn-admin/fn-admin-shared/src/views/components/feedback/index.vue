<script setup lang="tsx">
import { FnButton, useFnUiServices } from "@fast-crud/fast-crud-next";
import { adminText } from "../../../preferences";

const { message, notification } = useFnUiServices();
const examples = [
  { type: "info", label: ["信息", "Info"], title: ["有新的版本可用", "Update available"], description: ["刷新页面即可使用新版本。", "Refresh the page to use the latest version."] },
  { type: "success", label: ["成功", "Success"], title: ["偏好已保存", "Preferences saved"], description: ["下次访问时会自动应用这些设置。", "Your settings will apply on your next visit."] },
  { type: "warning", label: ["警告", "Warning"], title: ["有未保存的修改", "Unsaved changes"], description: ["离开页面前请保存修改。", "Save your changes before leaving the page."] },
  { type: "error", label: ["错误", "Error"], title: ["加载失败", "Loading failed"], description: ["请检查网络连接后重试。", "Check your network connection and try again."] },
] as const;

type Example = typeof examples[number];

function showMessage({ type, title }: Example): void {
  message[type]?.(adminText(...title));
}

function showNotification({ type, title, description }: Example, duration?: number): void {
  notification[type]?.({ message: adminText(...title), description: adminText(...description), duration });
}

function showStack(): void {
  for (const example of examples.slice(0, 3)) {
    showNotification(example, 10000);
  }
}
</script>

<template>
  <div class="feedback-demo">
    <section class="feedback-demo__card">
      <h2>Message</h2>
      <p>{{ adminText("短消息从顶部居中弹出，3 秒后自动消失。", "Brief messages appear at the top center and disappear after 3 seconds.") }}</p>
      <div class="feedback-demo__actions">
        <FnButton v-for="example in examples" :key="example.type" type="default" :text="adminText(...example.label)" :click="() => showMessage(example)" />
      </div>
    </section>

    <section class="feedback-demo__card">
      <h2>Notification</h2>
      <p>{{ adminText("通知在右上角堆叠。试试关闭中间一条，看看下方的卡片如何补位。", "Notifications stack in the upper right. Close the middle card to see the stack move up.") }}</p>
      <div class="feedback-demo__actions">
        <FnButton v-for="example in examples" :key="example.type" type="default" :text="adminText(...example.label)" :click="() => showNotification(example)" />
        <FnButton :text="adminText('显示三条通知', 'Show three notifications')" :click="showStack" />
        <FnButton type="default" :text="adminText('清空通知', 'Clear notifications')" :click="() => notification.destroy?.()" />
      </div>
    </section>
  </div>
</template>

<style lang="less">
.feedback-demo {
  display: grid;
  gap: 16px;
  align-content: start;
  color: var(--fn-color-text);

  &__card {
    padding: 20px;
    border: 1px solid var(--fn-color-border-secondary);
    border-radius: var(--fn-border-radius);
    background: var(--fn-color-bg-container);

    h2 {
      margin: 0;
      font-size: 18px;
      line-height: 1.4;
    }

    p {
      margin: 6px 0 16px;
      color: var(--fn-color-text-secondary);
      line-height: 1.5;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
