/**
 * ============================================================
 * 学习日记 · 数据与全局动效脚本（js/main.js）
 * 规范来源：ui设计_现代赛博版_v3.txt
 * ============================================================
 * 【如何添加新记录】
 *   就在本文件下方 timelineData 数组中，按时间顺序（新的放后面）添加一行：
 *
 *   {
 *     time: "2026.08",              // 时间（年月）
 *     title: "学到了什么（一句话）",  // 学了什么（一句话）
 *     desc: "一两句补充说明",         // 一两句补充说明
 *     link: ""                       // 可选：对应的文章或项目网址
 *   }
 *
 *   - link 留空时，该节点不显示链接。
 *   - 数组为空时，页面显示"待开始记录"提示，时间线框架仍保留。
 *   - 添加记录后无需修改任何 HTML 文件，刷新页面即可看到。
 * ============================================================
 */

var timelineData = [
  {
    time: "2026.07",
    title: "入门 Claude Code，接入 DeepSeek 大模型",
    desc: "学会使用 cc switch 工具把 Claude Code 的模型接口转接到 DeepSeek，开始低成本使用 AI 辅助学习。",
    link: ""
  },
  {
    time: "2026.07",
    title: "认识 AI 开发工具生态",
    desc: "学习了 Skills（技能）、MCP 服务器（MCP server）、CLI 工具（command-line interface）等概念，理解了这些工具如何让 AI 帮人干活。",
    link: ""
  },
  {
    time: "2026.08",
    title: "搭建个人网站并上传到 GitHub",
    desc: "使用 Claude Code + DeepSeek 从零搭建了现代赛博风格的个人学习分享网站，发布到 GitHub Pages（GitHub Pages）免费托管，正式上线。",
    link: "https://moxiao954.github.io/memory-site/"
  },
  {
    time: "2026.08",
    title: "使用 Codex 大幅调整 UI",
    desc: "通过 Codex 把网站升级为深空星图风格，优化卡片点击放大、背景星星与鼠标网格交互，并同步到 GitHub。",
    link: "https://moxiao954.github.io/memory-site/"
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
 * ============================================================
 * 时间线渲染（V3 现代极简版）
 * ============================================================
 * @param {HTMLElement} container 时间线容器元素
 * @param {Object} options
 *   - maxItems : 最多显示最近几条（0 = 全部）
 *   - animated : 是否播放"依次点亮"动画（默认 true）
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

  // ---- 空数据：保留时间线框架 + "待开始记录"提示 ----
  if (items.length === 0) {
    container.innerHTML =
      '<div class="timeline' + (compact ? ' compact' : '') + ' no-anim">' +
        '<div class="tl-line"></div>' +
        '<div class="tl-empty">' +
          '<div class="tl-empty-title">待开始记录</div>' +
          '<p>这里还没有学习记录。打开 js/main.js，按顶部注释添加第一条吧。</p>' +
        '</div>' +
      '</div>';
    return;
  }

  // ---- 计算点亮动画延迟：总时长不超过 2 秒（ms 单位） ----
  var totalMs = Math.min(2000, 350 * items.length);
  var delayMs = items.length > 1 ? totalMs / (items.length - 1) : 0;

  var html =
    '<div class="timeline' + (compact ? ' compact' : '') + (animated ? '' : ' no-anim') + '">' +
      '<div class="tl-line"></div>' +
      '<div class="tl-track">';

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var pos = (i % 2 === 0) ? "top" : "bottom";          // 上下交错排布
    var isCurrent = (i === items.length - 1);            // 最后一个节点标记为"最新"
    var linkHtml = it.link
      ? '<a class="tl-link" href="' + escapeHtml(it.link) + '" target="_blank" rel="noopener">了解更多 →</a>'
      : "";
    html +=
      '<div class="tl-node tl-node-' + pos + (isCurrent ? ' tl-node-current' : '') + '">' +
        '<div class="tl-dot"></div>' +
        '<div class="tl-card">' +
          '<div class="tl-time">' +
            escapeHtml(it.time) +
            (isCurrent ? '<span class="badge badge-green">最新</span>' : '') +
          '</div>' +
          '<div class="tl-title">' + escapeHtml(it.title) + '</div>' +
          '<div class="tl-desc">' + escapeHtml(it.desc) + '</div>' +
          linkHtml +
        '</div>' +
      '</div>';
  }

  html += '</div></div>';
  container.innerHTML = html;

  // ---- 依次点亮动画：每个节点设置递增 animation-delay（ms）后触发 ----
  if (animated) {
    var nodes = container.querySelectorAll(".tl-node");
    for (var k = 0; k < nodes.length; k++) {
      nodes[k].style.animationDelay = (delayMs * k) + "ms";
      nodes[k].classList.add("animate");
    }
  }
}

/**
 * ============================================================
 * 微光粒子系统（V3 现代版）
 * 页面加载时生成 30-40 个青/紫/白粒子，缓慢上升 + 左右摆动
 * 鼠标移动时轻微排斥
 * ============================================================ */
function initParticles() {
  var layer = document.getElementById("particles");
  if (!layer) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var colors = [
    "rgba(0,229,255,",   // 青
    "rgba(168,85,247,",  // 紫
    "rgba(255,255,255,"  // 白
  ];
  var count = 40 + Math.floor(Math.random() * 11); // 40-50

  for (var i = 0; i < count; i++) {
    var p = document.createElement("div");
    p.className = "particle";
    var isBright = Math.random() < 0.2;                  // 约 20% 亮星
    var size = isBright
      ? 3 + Math.floor(Math.random() * 2)                // 3-4px
      : 1 + Math.floor(Math.random() * 3);               // 1-3px
    var color = colors[Math.floor(Math.random() * colors.length)];
    var opacity = (0.3 + Math.random() * 0.35).toFixed(2);
    var left = Math.random() * 100;                      // 百分比，保证随视口缩放
    var dur = 12 + Math.random() * 8;                    // 12-20s
    var delay = -Math.random() * 20;                     // 负延迟：画面一开始就分布满屏
    var twinkleDur = (isBright ? 1.8 + Math.random() * 1.4 : 2.8 + Math.random() * 2.2);
    p.style.width = p.style.height = size + "px";
    p.style.background = color + opacity + ")";
    p.style.opacity = "1";
    p.style.left = left + "%";
    p.style.top = (Math.random() * 100) + "%";
    if (isBright) p.className = "particle particle-bright";
    p.style.setProperty("--push-x", "0px");
    p.style.setProperty("--push-y", "0px");
    p.style.animation =
      "particle-float " + dur.toFixed(1) + "s linear " + delay.toFixed(1) + "s infinite, " +
      "particle-twinkle " + twinkleDur.toFixed(1) + "s ease-in-out " + (-Math.random() * twinkleDur).toFixed(1) + "s infinite";
    layer.appendChild(p);
  }

  // 鼠标移动：粒子轻微排斥
  var particles = Array.prototype.slice.call(layer.children);
  var repelRadius = 90;
  var rafPending = false;
  window.addEventListener("mousemove", function (e) {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      var mx = e.clientX, my = e.clientY;
      for (var j = 0; j < particles.length; j++) {
        var el = particles[j];
        var rect = el.getBoundingClientRect();
        var px = rect.left + rect.width / 2;
        var py = rect.top + rect.height / 2;
        var dx = px - mx, dy = py - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < repelRadius && dist > 0) {
          var force = (repelRadius - dist) / repelRadius; // 越近推力越大
          el.style.setProperty("--push-x", ((dx / dist) * force * 12).toFixed(2) + "px");
          el.style.setProperty("--push-y", ((dy / dist) * force * 12).toFixed(2) + "px");
        } else {
          el.style.setProperty("--push-x", "0px");
          el.style.setProperty("--push-y", "0px");
        }
      }
    });
  });
}

/**
 * ============================================================
 * 数字计数动画（V3 .stat-item）
 * 从 0 滚动到目标值，1.5s ease-out
 * ============================================================ */
function animateCount(el, target) {
  if (!el) return;
  var start = null;
  var duration = 1500;
  function step(ts) {
    if (start === null) start = ts;
    var p = Math.min((ts - start) / duration, 1);
    var eased = 1 - Math.pow(1 - p, 3);                   // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/** 计算从第一条学习记录所在月到今天的天数 */
function computeLearningDays() {
  if (!timelineData.length) return 0;
  // 找出最早记录的时间（"2026.07" → 当年当月）
  var earliest = timelineData.slice().sort(function (a, b) {
    return a.time.localeCompare(b.time);
  })[0];
  var parts = String(earliest.time).split(".");
  if (parts.length < 2) return 0;
  var y = parseInt(parts[0], 10);
  var m = parseInt(parts[1], 10);
  if (!y || !m) return 0;
  var start = new Date(y, m - 1, 1);                       // 当月 1 号起算
  var now = new Date();
  return Math.max(1, Math.floor((now - start) / 86400000));
}

/** 启动页面上所有 .stat-num[data-count] 的计数动画 */
function initCounters() {
  // 自动计算学习天数（首页统计）
  var days = computeLearningDays();
  var auto = document.querySelectorAll(".stat-num[data-auto-days]");
  for (var a = 0; a < auto.length; a++) {
    auto[a].setAttribute("data-count", String(days));
  }

  var nums = document.querySelectorAll(".stat-num[data-count]");
  for (var i = 0; i < nums.length; i++) {
    (function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      animateCount(el, target);
    })(nums[i]);
  }
}

/**
 * ============================================================
 * 磁性按钮（可选）：按钮跟随鼠标轻微偏移（最大 4px）
 * ============================================================ */
function initMagnetic() {
  var items = document.querySelectorAll(".magnetic");
  for (var i = 0; i < items.length; i++) {
    (function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        el.style.setProperty("--mx", (dx * 0.1).toFixed(2) + "px");
        el.style.setProperty("--my", (dy * 0.1).toFixed(2) + "px");
      });
      el.addEventListener("mouseleave", function () {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      });
    })(items[i]);
  }
}

/**
 * ============================================================
 * 导航滚动状态：滚动后加深导航背景
 * ============================================================ */
function initNavScroll() {
  var nav = document.querySelector(".site-nav");
  if (!nav) return;
  function update() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/**
 * ============================================================
 * 鼠标网格：默认隐藏，光标附近网格淡入
 * ============================================================ */
function initCursorGrid() {
  var layer = document.createElement("div");
  layer.id = "cursor-grid";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  var rafPending = false;
  window.addEventListener("mousemove", function (e) {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () {
      rafPending = false;
      layer.style.setProperty("--cx", e.clientX + "px");
      layer.style.setProperty("--cy", e.clientY + "px");
      layer.classList.add("is-active");
    });
  }, { passive: true });

  document.addEventListener("mouseleave", function () {
    layer.classList.remove("is-active");
  });
}

/**
 * ============================================================
 * 时间线卡片点击放大：从原位置放大到遮罩层，完整显示内容
 * ============================================================ */
function openTimelineCard(card) {
  if (document.querySelector(".tl-expand-overlay")) return;
  var origin = card.getBoundingClientRect();
  var body = document.body;

  var overlay = document.createElement("div");
  overlay.className = "tl-expand-overlay";
  body.appendChild(overlay);
  body.classList.add("no-scroll");

  var expanded = document.createElement("div");
  expanded.className = "tl-expand-card";
  expanded.innerHTML = card.innerHTML;
  overlay.appendChild(expanded);

  var targetW = Math.min(760, window.innerWidth - 96);
  expanded.style.width = origin.width + "px";
  expanded.style.left = origin.left + "px";
  expanded.style.top = origin.top + "px";
  expanded.style.opacity = "0";

  requestAnimationFrame(function () {
    expanded.style.width = targetW + "px";
    var height = expanded.getBoundingClientRect().height;
    var maxH = window.innerHeight - 110;
    var targetH = Math.min(height, maxH);
    var left = Math.max(24, Math.round((window.innerWidth - targetW) / 2));
    var top = Math.max(24, Math.round((window.innerHeight - targetH) / 2));

    if (height > maxH) {
      expanded.style.maxHeight = maxH + "px";
      expanded.style.overflowY = "auto";
    }
    expanded.style.left = left + "px";
    expanded.style.top = top + "px";
    expanded.style.opacity = "1";
    expanded.classList.add("is-open");
  });

  function close() {
    expanded.style.left = origin.left + "px";
    expanded.style.top = origin.top + "px";
    expanded.style.width = origin.width + "px";
    expanded.style.opacity = "0";
    expanded.classList.remove("is-open");
    body.classList.remove("no-scroll");
    setTimeout(function () {
      overlay.remove();
    }, 360);
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  expanded.addEventListener("click", function (e) {
    if (e.target.closest("a")) return;
    close();
  });
  document.addEventListener("keydown", function onKey(e) {
    if (e.key === "Escape") {
      document.removeEventListener("keydown", onKey);
      close();
    }
  });
}

function initTimelineExpand() {
  document.addEventListener("click", function (e) {
    var card = e.target.closest(".tl-card");
    if (!card || e.target.closest("a")) return;
    openTimelineCard(card);
  });
}

/**
 * ============================================================
 * 滚动入场：模块进入视口时一次性渐显
 * ============================================================ */
function initScrollReveal() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var targets = document.querySelectorAll(
    ".timeline, .projects-grid, .about-left, .about-right"
  );
  if (!targets.length) return;

  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add("is-visible");
        observer.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

  for (var k = 0; k < targets.length; k++) {
    targets[k].classList.add("reveal");
    observer.observe(targets[k]);
  }
}

/**
 * ============================================================
 * 页面进入动画：给 .page-main 添加 .loaded，触发子元素 stagger 进入
 * ============================================================ */
function initPageReveal() {
  var main = document.querySelector(".page-main");
  if (main) {
    requestAnimationFrame(function () {
      main.classList.add("loaded");
    });
  }
}

/* ---- 页面加载完成后统一启动 ---- */
document.addEventListener("DOMContentLoaded", function () {
  initPageReveal();
  initParticles();
  initCounters();
  initMagnetic();
  initNavScroll();
  initScrollReveal();
  initCursorGrid();
  initTimelineExpand();
});
