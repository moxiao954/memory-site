/**
 * ============================================================
 * 学习轨迹 · 数据与渲染脚本（js/timeline.js）
 * ============================================================
 * 【如何添加新记录】
 *   就在本文件下方 timelineData 数组中，按时间顺序（新的放后面）添加一行：
 *
 *   {
 *     time: "2026.08",              // 时间（年月）
 *     title: "搭建个人网站",          // 学了什么（一句话）
 *     desc: "学习网页基础",           // 一两句补充说明
 *     link: ""                       // 可选：对应的文章或项目网址
 *   }
 *
 *   - link 留空时，该节点不显示链接。
 *   - 删除示例节点（title 带“示例”二字的那条）后，页面显示“待开始记录”提示，
 *     时间线框架仍保留。
 *   - 添加记录后无需修改任何 HTML 文件，刷新页面即可看到。
 * ============================================================
 */

var timelineData = [
  {
    time: "2026.08",
    title: "搭建个人学习分享网站（示例）",
    desc: "这是示例节点，用来演示时间线效果。正式开始记录时，请删除本条。",
    link: ""
  }
];

/** 简单转义，防止数据中的特殊字符破坏页面结构 */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * 渲染时间线
 * @param {HTMLElement} container 时间线容器元素
 * @param {Object} options
 *   - maxItems : 最多显示最近几条（0 = 全部）
 *   - animated : 是否播放“从左到右依次点亮”动画（默认 true）
 *   - compact  : 紧凑模式（首页概览用）
 */
function renderTimeline(container, options) {
  if (!container) return;
  options = options || {};
  var maxItems = options.maxItems || 0;
  var animated = options.animated !== false;
  var compact = !!options.compact;

  // 数据按时间升序排序（最早在左、最近在右）
  var items = timelineData.slice().sort(function (a, b) {
    return a.time.localeCompare(b.time);
  });

  // 限制条数时，保留最近的 N 条
  if (maxItems > 0 && items.length > maxItems) {
    items = items.slice(items.length - maxItems);
  }

  container.innerHTML = "";

  // ---- 空数据：保留时间线框架 + “待开始记录”提示 ----
  if (items.length === 0) {
    container.innerHTML =
      '<div class="timeline' + (compact ? ' compact' : '') + ' no-anim">' +
        '<div class="tl-line"></div>' +
        '<div class="tl-empty">' +
          '<div class="tl-empty-title">待开始记录</div>' +
          '<p>这里还没有学习记录。打开 js/timeline.js，按顶部注释添加第一条吧。</p>' +
        '</div>' +
      '</div>';
    return;
  }

  // ---- 计算点亮动画延迟：总时长不超过 2 秒 ----
  var totalMs = Math.min(2000, 300 * items.length);
  var delayMs = items.length > 1 ? totalMs / (items.length - 1) : 0;

  var html =
    '<div class="timeline' + (compact ? ' compact' : '') + (animated ? '' : ' no-anim') + '">' +
      '<div class="tl-line"></div>' +
      '<div class="tl-track">';

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var pos = (i % 2 === 0) ? "top" : "bottom"; // 上下交错排布
    var linkHtml = it.link
      ? '<a class="tl-link" href="' + escapeHtml(it.link) + '" target="_blank" rel="noopener">查看产出 →</a>'
      : "";
    html +=
      '<div class="tl-node tl-node-' + pos + '">' +
        '<div class="tl-dot"></div>' +
        '<div class="tl-card">' +
          '<div class="tl-time">' + escapeHtml(it.time) + '</div>' +
          '<div class="tl-title">' + escapeHtml(it.title) + '</div>' +
          '<div class="tl-desc">' + escapeHtml(it.desc) + '</div>' +
          linkHtml +
        '</div>' +
      '</div>';
  }

  html += '</div></div>';
  container.innerHTML = html;

  // ---- 依次点亮动画：每个节点设置递增 animation-delay 后触发 ----
  if (animated) {
    var nodes = container.querySelectorAll(".tl-node");
    for (var k = 0; k < nodes.length; k++) {
      nodes[k].style.animationDelay = (delayMs * k).toFixed(3) + "s";
      nodes[k].classList.add("animate");
    }
  }
}
