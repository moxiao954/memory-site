/**
 * ============================================================
 * 学习日记 · 数据与全局动效脚本（js/main.js）
 * 需求来源：docs/UI视觉升级需求文档.md v2.0
 * ============================================================
 * 【如何添加新记录】
 *   就在本文件下方 timelineData 数组中，按时间顺序（新的放后面）添加一行：
 *
 *   {
 *     time: "2026.08.02",           // 时间（年月日）
 *     title: "学到了什么（一句话）",  // 学了什么（一句话）
 *     desc: "一两句补充说明"          // 一两句补充说明
 *   }
 *
 *   - 学习日记不再包含外部链接，点击卡片直接在站内放大查看完整内容。
 *   - 数组为空时，页面显示"待开始记录"提示，时间线框架仍保留。
 *   - 添加记录后无需修改任何 HTML 文件，刷新页面即可看到。
 * ============================================================
 */

var timelineData = [
  {
    time: "2026.07.14",
    title: "入门 Claude Code，接入 DeepSeek 大模型",
    desc: "学会使用 cc switch 工具把 Claude Code 的模型接口转接到 DeepSeek，开始低成本使用 AI 辅助学习。"
  },
  {
    time: "2026.07.15",
    title: "认识 AI 开发工具生态",
    desc: "学习了 Skills（技能）、MCP 服务器（MCP server）、CLI 工具（command-line interface）等概念，理解了这些工具如何让 AI 帮人干活。"
  },
  {
    time: "2026.08.02",
    title: "搭建个人网站并上传到 GitHub",
    desc: "使用 Claude Code + DeepSeek 从零搭建了现代赛博风格的个人学习分享网站，发布到 GitHub Pages（GitHub Pages）免费托管，正式上线。"
  },
  {
    time: "2026.08.09",
    title: "使用 Codex 大幅调整 UI",
    desc: "通过 Codex 把网站升级为深空星图风格，优化卡片点击放大、背景星星与鼠标网格交互，并同步到 GitHub。"
  },
  {
    time: "2026.08.13",
    title: "完成暖光放映室",
    desc: "搭好个人动画记录站，用卡片画廊展示看过的动画，记录状态、评分、感想和题材标签，并发布到 GitHub。"
  },
  {
    time: "2026.08.14",
    title: "完成向心力演示模型",
    desc: "做出火车轨道物理演示，可调节速度、半径、倾角和质量，实时查看受力分析与公式，并发布到 GitHub。"
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
 * 时间线渲染（暖色单高光版）
 * ============================================================
 * @param {HTMLElement} container 时间线容器元素
 * @param {Object} options
 *   - maxItems : 最多显示最近几条（0 = 全部）
 *   - animated : 是否播放"依次点亮"动画（默认 true）
 *   - compact  : 紧凑模式（首页概览用）
 *   - controls : 是否附带滑条控件（左右箭头 + 进度条，日记页用）
 */
function renderTimeline(container, options) {
  if (!container) return;
  options = options || {};
  var maxItems = options.maxItems || 0;
  var animated = options.animated !== false;
  var compact = !!options.compact;
  var withControls = !!options.controls;

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

  var scrollerId = "tl-scroller-" + Math.random().toString(36).slice(2, 8);

  var html =
    '<div class="tl-scroller">' +
      '<div class="timeline' + (compact ? ' compact' : '') + (animated ? '' : ' no-anim') + '" id="' + scrollerId + '">' +
        '<div class="tl-line"></div>' +
        '<div class="tl-track">';

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var pos = (i % 2 === 0) ? "top" : "bottom";          // 上下交错排布
    var isCurrent = (i === items.length - 1);            // 最后一个节点标记为"最新"
    html +=
      '<div class="tl-node tl-node-' + pos + (isCurrent ? ' tl-node-current' : '') + '">' +
        '<div class="tl-dot"></div>' +
        '<div class="tl-card glass-md">' +
          '<div class="tl-time">' +
            escapeHtml(it.time) +
            (isCurrent ? '<span class="badge badge-green">最新</span>' : '') +
          '</div>' +
          '<div class="tl-title">' + escapeHtml(it.title) + '</div>' +
          '<div class="tl-desc">' + escapeHtml(it.desc) + '</div>' +
        '</div>' +
      '</div>';
  }

  html += '</div></div>';

  // 日记页：附带滑条控件（左右箭头 + 进度条）
  if (withControls) {
    html +=
      '<div class="tl-controls">' +
        '<button class="tl-nav-prev" type="button" aria-label="向左滚动" disabled>' +
          '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>' +
        '</button>' +
        '<div class="tl-progress"><div class="tl-progress-fill"></div></div>' +
        '<button class="tl-nav-next" type="button" aria-label="向右滚动" disabled>' +
          '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>' +
        '</button>' +
      '</div>';
  }

  container.innerHTML = html;

  // ---- 依次点亮动画：每个节点设置递增 animation-delay（ms）后触发 ----
  if (animated) {
    var nodes = container.querySelectorAll(".tl-node");
    for (var k = 0; k < nodes.length; k++) {
      nodes[k].style.animationDelay = (delayMs * k) + "ms";
      nodes[k].classList.add("animate");
    }
  }

  // ---- 滑条控件：绑定滚动同步 ----
  if (withControls) {
    initTimelineControls(container, scrollerId);
  }
}

/**
 * 横向滑条控件：左右箭头 + 进度条，随滚动同步
 */
function initTimelineControls(container, scrollerId) {
  var scroller = document.getElementById(scrollerId);
  if (!scroller) return;

  var prev = container.querySelector(".tl-nav-prev");
  var next = container.querySelector(".tl-nav-next");
  var fill = container.querySelector(".tl-progress-fill");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function update() {
    var max = scroller.scrollWidth - scroller.clientWidth;
    var atLeft = scroller.scrollLeft <= 2;
    var atRight = scroller.scrollLeft >= max - 2;
    prev.disabled = atLeft;
    next.disabled = atRight;
    var pct = max > 0 ? (scroller.scrollLeft / max) * 100 : 0;
    fill.style.width = pct + "%";
  }

  function step(dir) {
    var amount = scroller.clientWidth * 0.72;
    if (reduced) {
      scroller.scrollLeft += dir * amount;
    } else {
      scroller.scrollBy({ left: dir * amount, behavior: "smooth" });
    }
  }

  if (prev) prev.addEventListener("click", function () { step(-1); });
  if (next) next.addEventListener("click", function () { step(1); });
  scroller.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  update();
}

/**
 * ============================================================
 * 微光粒子系统（暖色版）
 * 页面加载时生成 20-26 个粒子，缓慢上升 + 左右摆动
 * 鼠标移动时轻微排斥
 * ============================================================ */
function initParticles() {
  var layer = document.getElementById("particles");
  if (!layer) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var colors = ["rgba(242,211,148,"];                 // 暖金
  var count = 20 + Math.floor(Math.random() * 7); // 20-26

  for (var i = 0; i < count; i++) {
    var p = document.createElement("div");
    p.className = "particle";
    var isBright = Math.random() < 0.12;                 // 约 12% 亮星
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

/** 计算从第一条学习记录所在日到今天的天数 */
function computeLearningDays() {
  if (!timelineData.length) return 0;
  // 找出最早记录的时间（"2026.07.14" → 当年当月当日）
  var earliest = timelineData.slice().sort(function (a, b) {
    return a.time.localeCompare(b.time);
  })[0];
  var parts = String(earliest.time).split(".");
  if (parts.length < 2) return 0;
  var y = parseInt(parts[0], 10);
  var m = parseInt(parts[1], 10);
  var d = parts.length > 2 ? parseInt(parts[2], 10) : 1;
  if (!y || !m || !d) return 0;
  var start = new Date(y, m - 1, d);                       // 当天起算
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
 * 时间线卡片点击放大：FLIP / transform 连贯动画
 * 从原卡片位置平滑放大到弹层目标位置，关闭反向执行
 * ============================================================ */
function openTimelineCard(card) {
  if (document.querySelector(".tl-expand-overlay")) return;

  var body = document.body;
  var origin = card.getBoundingClientRect();              // FLIP 第一步：记录起点

  var overlay = document.createElement("div");
  overlay.className = "tl-expand-overlay";
  body.appendChild(overlay);
  body.classList.add("no-scroll");

  var expanded = document.createElement("div");
  expanded.className = "tl-expand-card glass-lg";
  expanded.innerHTML = card.innerHTML;
  overlay.appendChild(expanded);

  // 先放到最终位置并测量目标尺寸
  var targetW = Math.min(560, window.innerWidth - 48);
  expanded.style.width = targetW + "px";
  var height = expanded.getBoundingClientRect().height;
  var maxH = window.innerHeight - 110;
  var targetH = Math.min(height, maxH);

  var left = origin.left;
  var top = origin.top;
  if (left + targetW > window.innerWidth - 24) left = Math.max(24, window.innerWidth - targetW - 24);
  if (top + targetH > window.innerHeight - 24) top = Math.max(24, window.innerHeight - targetH - 24);

  if (height > maxH) {
    expanded.style.maxHeight = maxH + "px";
  }
  expanded.style.left = left + "px";
  expanded.style.top = top + "px";

  // 强制一次回流，使浏览器应用最终布局
  void expanded.offsetHeight;

  // FLIP 第二步 + 第三步：计算差异，把元素从起点反向移动（Invert）
  var dx = origin.left - left;
  var dy = origin.top - top;
  var scaleX = origin.width / targetW;
  var scaleY = origin.height / targetH;
  expanded.style.transform = "translate(" + dx + "px, " + dy + "px) scale(" + scaleX + ", " + scaleY + ")";

  // FLIP 第四步：移除 inline transform（回落到 CSS 的 transform: none），触发 Play 动画
  requestAnimationFrame(function () {
    expanded.style.transform = "";
    expanded.classList.add("is-open");
  });

  function close() {
    // 反向播放：从最终位置回到起点
    expanded.style.transform = "translate(" + dx + "px, " + dy + "px) scale(" + scaleX + ", " + scaleY + ")";
    expanded.classList.remove("is-open");
    body.classList.remove("no-scroll");
    setTimeout(function () {
      overlay.remove();
    }, 450);
  }

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) close();
  });
  expanded.addEventListener("click", function () {
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
    if (!card) return;
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

/**
 * ============================================================
 * 玻璃高光跟随鼠标：维护 --gx / --gy（低透明度暖色）
 * ============================================================ */
function initGlassSheen() {
  var cards = document.querySelectorAll(".glass-md, .glass-lg");
  for (var i = 0; i < cards.length; i++) {
    (function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        el.style.setProperty("--gx", (x / r.width * 100).toFixed(1) + "%");
        el.style.setProperty("--gy", (y / r.height * 100).toFixed(1) + "%");
      });
    })(cards[i]);
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
  initGlassSheen();
  initTimelineExpand();
});
