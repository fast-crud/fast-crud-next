# 在 Django 项目中接入 FnCrud

给已有 Django 项目添加一个「任务管理」页面。Django 保存数据并检查权限，Vue 页面用 FnCrud 完成搜索、分页和增删改。首次接入时，先确认 Django 返回 JSON，再配置 Vite 代理，最后打开页面。

| 地址 | 用途 |
| --- | --- |
| `http://127.0.0.1:8000/admin/` | 登录本地 Django 管理站点 |
| `http://127.0.0.1:8000/api/demo-tasks/` | 确认 Django 返回 JSON |
| `http://127.0.0.1:5180/` | 打开 Vue 任务管理页面 |
| `http://127.0.0.1:5180/api/demo-tasks/` | 确认 Vite 将 API 请求转发给 Django |

## 1. 让 Django 返回任务列表

以下命令在已有 Django 项目的 `manage.py` 所在目录执行。使用项目自己的 Python 虚拟环境。示例使用默认的 Django Admin、会话、认证和 CSRF 中间件。

```sh
python manage.py startapp demo_tasks
```

将 `"demo_tasks"` 加到项目设置的 `INSTALLED_APPS`。创建下列模型。

```python
# demo_tasks/models.py
from django.db import models


class DemoTask(models.Model):
    name = models.CharField(max_length=100)
```

把以下视图放入 `demo_tasks/views.py`。接口仅面向已登录的工作人员。实际业务按项目的角色和数据归属校验权限。

```python
# demo_tasks/views.py
import json

from django.http import HttpResponse, JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods

from .models import DemoTask


def read_name(request):
    try:
        data = json.loads(request.body)
    except ValueError:
        return None
    value = data.get("name") if isinstance(data, dict) else None
    if isinstance(value, str) and 1 <= len(value.strip()) <= 100:
        return value.strip()
    return None


@require_http_methods(["GET", "POST"])
def tasks(request):
    if not request.user.is_active or not request.user.is_staff:
        return JsonResponse({"detail": "请先登录有权限的账号"}, status=403)

    if request.method == "POST":
        name = read_name(request)
        if name is None:
            return JsonResponse({"detail": "任务名称需为 1 到 100 个字符"}, status=400)
        task = DemoTask.objects.create(name=name)
        return JsonResponse({"id": task.pk, "name": task.name}, status=201)

    try:
        offset = max(0, int(request.GET.get("offset", 0)))
        limit = max(1, min(100, int(request.GET.get("limit", 10))))
    except ValueError:
        return JsonResponse({"detail": "分页参数必须为整数"}, status=400)

    rows = DemoTask.objects.filter(name__icontains=request.GET.get("name", ""))
    return JsonResponse({
        "records": list(rows.order_by("id").values("id", "name")[offset:offset + limit]),
        "total": rows.count(),
        "csrfToken": get_token(request),
    })


@require_http_methods(["PUT", "DELETE"])
def task_detail(request, task_id):
    if not request.user.is_active or not request.user.is_staff:
        return JsonResponse({"detail": "请先登录有权限的账号"}, status=403)

    task = DemoTask.objects.filter(pk=task_id).first()
    if task is None:
        return JsonResponse({"detail": "任务已不存在"}, status=404)

    if request.method == "DELETE":
        task.delete()
        return HttpResponse(status=204)

    name = read_name(request)
    if name is None:
        return JsonResponse({"detail": "任务名称需为 1 到 100 个字符"}, status=400)
    task.name = name
    task.save(update_fields=["name"])
    return JsonResponse({"id": task.pk, "name": task.name})
```

在项目根 URL 配置中保留已有路由，追加以下两个 `path(...)`。项目已有的 `path("admin/", admin.site.urls)` 用于登录。

```python
from django.urls import path
from demo_tasks import views as task_views

urlpatterns += [
    path("api/demo-tasks/", task_views.tasks),
    path("api/demo-tasks/<int:task_id>/", task_views.task_detail),
]
```

```sh
python manage.py makemigrations demo_tasks
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 127.0.0.1:8000
```

已有工作人员账号时可跳过 `createsuperuser`。浏览器先打开 Django 管理站点登录，再访问任务列表接口。首次应读到 `records: []`、`total: 0` 和 `csrfToken`。保留登录会话，接下来的 Vue 页面会用到它。

## 2. 准备 Vue 和 Vite

FnCrud 当前通过源码工作区接入。将 Vue 应用放到 Fast Crud Next 仓库的 `packages/` 下，Django 项目继续放在原来的目录。同一工作区已有 Vue 应用时，可以在该应用合并下列依赖和 Vite 设置。

在 Fast Crud Next 仓库根目录执行以下命令。使用 Node.js 22.12+ 和 pnpm。

```sh
pnpm install --frozen-lockfile
pnpm create vite packages/django-frontend --template vue-ts --no-interactive
cd packages/django-frontend
pnpm add "@fast-crud/fast-crud-next@workspace:*"
pnpm add -D @vitejs/plugin-vue-jsx less
```

将 Vue 应用的 `vite.config.ts` 替换为下面的配置。`changeOrigin: false` 保留浏览器请求的 Host，使 Django 可按收到的同源 Origin 校验写请求。

```ts
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue(), vueJsx()],
  server: {
    host: '127.0.0.1',
    port: 5180,
    strictPort: true,
    proxy: {
      '/api/demo-tasks': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: false,
      },
    },
  },
})
```

在 Vue 应用目录运行 `pnpm dev`，然后访问 `http://127.0.0.1:5180/api/demo-tasks/`。能看到同样的 JSON 就说明代理已接通。登录和应用都使用 `127.0.0.1`，保持浏览器发送同一个主机上的会话 Cookie。

## 3. 编写第一个 CRUD 页面

用下面的代码替换 Vue 应用中的 `src/App.vue`。创建 Vite 项目时生成的 `src/main.ts` 负责把 `App.vue` 挂载到页面。

```vue
<script setup lang="tsx">
import { markRaw, reactive, ref } from 'vue'
import {
  FnConfigProvider,
  FnCrud,
  FnInput,
  type FnCrudExpose,
  type FnCrudState,
  useFnCrud,
} from '@fast-crud/fast-crud-next'

interface Task {
  id: number
  name: string
}

interface TaskPage {
  records: Task[]
  total: number
  csrfToken: string
}

const endpoint = '/api/demo-tasks/'
let csrfToken = ''

async function send(path: string, method: string, payload?: { name: string }) {
  const headers = new Headers()
  if (method !== 'GET') headers.set('X-CSRFToken', csrfToken)
  if (payload) headers.set('Content-Type', 'application/json')

  const response = await fetch(path, {
    method,
    headers,
    credentials: 'same-origin',
    body: payload ? JSON.stringify(payload) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.detail ?? `任务请求失败（HTTP ${response.status}）`)
  }
  return response
}

const state = reactive<FnCrudState<Task>>({
  id: 'django-demo-tasks',
  heading: { title: '任务管理' },
  table: { rowKey: 'id' },
  rowHandle: { width: 160 },
  columns: {
    id: { key: 'id', title: '编号', cell: { width: 100 } },
    name: {
      key: 'name',
      title: '任务名称',
      search: {
        component: { name: markRaw(FnInput), vModel: 'modelValue' },
      },
      form: {
        rules: [{ required: true, message: '请输入任务名称' }],
      },
    },
  },
  request: {
    pageRequest: async ({ page, query }) => {
      const params = new URLSearchParams({
        offset: String(page.offset),
        limit: String(page.limit),
        name: String(query.name ?? '').trim(),
      })
      const result: TaskPage = await (await send(`${endpoint}?${params}`, 'GET')).json()
      csrfToken = result.csrfToken
      return { records: result.records, total: result.total }
    },
    addRequest: form => send(endpoint, 'POST', { name: String(form.name ?? '') }),
    editRequest: form => send(`${endpoint}${form.id}/`, 'PUT', { name: String(form.name ?? '') }),
    delRequest: id => send(`${endpoint}${id}/`, 'DELETE'),
  },
})

const crudRef = ref<FnCrudExpose<Task>>()
useFnCrud({ state, crudRef })
</script>

<template>
  <FnConfigProvider>
    <FnCrud ref="crudRef" v-bind="state" />
  </FnConfigProvider>
</template>
```

FnCrud 会在页面挂载后调用 `pageRequest`，在增删改成功后再次查询列表。`rowKey` 将表格行与 Django 主键对应起来。编辑开始时，表单会获得行数据中的 `id`，所以可以将编号列留在表格上而不将它加入可编辑字段。列表接口返回的 `total` 要先按搜索条件过滤，再统计全部匹配记录。关于页码、偏移量与排序，见 [请求 API](../api/requests.md)。

## 4. 在浏览器验收

打开 `http://127.0.0.1:5180/`，按下面的顺序操作。

1. 页面显示「任务管理」和空列表。开发者工具的网络面板能看到 `GET /api/demo-tasks/` 成功。
2. 点击「新增」，填写「整理文档」并提交。页面出现一行任务。
3. 点击该行「编辑」，改名后搜索新名称。清空搜索条件后可再次浏览全部任务。
4. 刷新页面，确认任务仍存在。点击「删除」并确认，删除后列表为空。

| 看到的现象 | 从哪里排查 |
| --- | --- |
| 页面报找不到 FnCrud 包 | 确认前端在 `packages/` 下，`package.json` 声明了 `workspace:*`，并且在当前工作区执行过安装。 |
| 页面报找不到 Less 或无法解析 TSX | 确认已安装 `less` 和 `@vitejs/plugin-vue-jsx`，并在 Vite 配置中启用了 JSX 插件。 |
| 接口返回 HTML 或 404 | 先直接访问 Django 的 API，再对照 Vite 代理和路径末尾的 `/`。 |
| GET 返回 403 | 在同一浏览器用 `127.0.0.1:8000/admin/` 登录，确认账号处于启用状态且具有工作人员权限。 |
| GET 成功，写操作返回 403 | 检查列表结果中的 `csrfToken`、写请求的 `X-CSRFToken` 和会话 Cookie。登录后刷新 Vue 页可取得新 token。 |
| 弹窗或通知无法使用 | 确认 `FnConfigProvider` 在组件树中包住了 `FnCrud`。 |
| 列表有数据，页数不对 | 检查 `total` 是否是过滤后、分页前的总条数。 |

## 部署时的路径

Vite 的 `server.proxy` 用于本地开发。部署时运行 `pnpm exec vite build` 生成 Vue 静态产物，用同一个站点域名提供页面，并将 `/api/demo-tasks/` 转发给 Django。这样页面中的相对 API 地址可继续使用。部署环境沿用项目的认证和 HTTPS 设置。

参考 [Django 的 CSRF 请求说明](https://docs.djangoproject.com/en/5.2/howto/csrf/)、[Vite 的代理配置](https://vite.dev/config/server-options#server-proxy)和 [pnpm 的工作区协议](https://pnpm.io/workspaces#workspace-protocol-workspace)。
