let currentColor = "#000000";
const previewBox = document.getElementById("previewBox"),
  zoomIcon = document.getElementById("zoomIcon");
function hexToRgb(e) {
  return [
    parseInt(e.slice(1, 3), 16),
    parseInt(e.slice(3, 5), 16),
    parseInt(e.slice(5, 7), 16),
  ];
}
function initColorGrid() {
  const e = document.getElementById("colorGrid"),
    t = document.createElement("input");
  (t.type = "color"),
    (t.hidden = !0),
    document.body.appendChild(t),
    (e.innerHTML = ""),
    [
      "#000000",
      "#36454F",
      "#2C3E50",
      "#0D0D0D",
	  "#555D50",
      "#FFFFFF",
      "#0000FF",
      "#008000",
      "#FF8C00",
      "#FFFF00",
      "#FF0000",
      "#FFC0CB",
      "#800080",
      "#A52A2A",
       // 仅在非iOS设备添加diy项
	   ...(isIOS() ? [] : ["diy"])
    ].forEach((o) => {
      const n = document.createElement("div");
      (n.className = "color-item"),
        "diy" === o
          ? ((n.textContent = "DIY"),
            (n.style.border = "2px dashed #999"),
            (n.style.color = "#666"),
            n.addEventListener("click", () => {
              t.click();
            }))
          : ((n.style.backgroundColor = o),
            n.addEventListener("click", () => handleColorSelect(o))),
        (n.style.display = "flex"),
        (n.style.alignItems = "center"),
        (n.style.justifyContent = "center"),
        (n.style.fontWeight = "bold"),
        (n.style.cursor = "pointer"),
        e.appendChild(n);
    }),
    t.addEventListener("input", (t) => {
      const o = t.target.value;
      handleColorSelect(o);
      const n = [...e.children].find((e) => "DIY" === e.textContent);
      n &&
        ((n.style.backgroundColor = o), (n.style.color = getContrastColor(o)));
    });
}
function handleColorSelect(e) {
  (currentColor = e),
    (document.getElementById("previewBox").style.backgroundColor = e),
    document.documentElement.style.setProperty("--current-color", e);
  const t = document.getElementById("colorPicker");
  t && (t.value = e);
}
function getContrastColor(e) {
  return 0.299 * parseInt(e.slice(1, 3), 16) +
    0.587 * parseInt(e.slice(3, 5), 16) +
    0.114 * parseInt(e.slice(5, 7), 16) >
    150
    ? "#000"
    : "#fff";
}
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function initFullscreen() {
  const previewBox = document.getElementById("previewBox");
  const fullscreenTip = document.querySelector(".fullscreen-tip");
  const fullscreenOverlay = document.getElementById("fullscreenOverlay");
  const zoomIcon = document.getElementById("zoomIcon");

// iOS专属处理
  if (isIOS()) {
    let overlay = null;
    
    // 创建全屏遮罩
    const createOverlay = () => {
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9999;
          touch-action: none;
        `;
        overlay.addEventListener("click", () => {
          document.body.removeChild(overlay);
          zoomIcon.style.display = "block"; // 恢复图标
        });
      }
      return overlay;
    };

    previewBox.addEventListener("click", () => {
      const overlay = createOverlay();
      overlay.style.backgroundColor = currentColor;
      document.body.appendChild(overlay);
      zoomIcon.style.display = "none"; // 隐藏全屏图标
    });
    
    return; // 终止后续全屏逻辑
  }
  
  // 统一全屏方法和检测
  const requestFullscreen = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullscreen;
  const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
  const isFullscreen = () => document.fullscreenElement || document.webkitFullscreenElement;

  previewBox.addEventListener("click", () => {
    if (!isFullscreen()) {
	// 同时设置三种背景色保障兼容性
    fullscreenOverlay.style.backgroundColor = currentColor;
    previewBox.style.backgroundColor = currentColor;
    document.documentElement.style.backgroundColor = currentColor;
	
	// 统一颜色设置方法
  const applyBackground = (color) => {
    const rgb = hexToRgb(color);
    // 同时设置 HEX 和 RGB 格式
    previewBox.style.cssText = `
      background: ${color} !important;
      background-color: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}) !important;
      --current-color: ${color} !important;
    `;
  };

  previewBox.addEventListener("click", () => {
    if (!isFullscreen()) {
      applyBackground(currentColor);
      
      // 处理 Firefox 的默认黑色
      if (navigator.userAgent.includes("Firefox")) {
        document.documentElement.style.backgroundColor = currentColor;
        document.body.style.backgroundColor = currentColor;
      }

      requestFullscreen.call(previewBox)
        .then(() => {
          // 二次确认颜色
          applyBackground(currentColor);
        })
    }
  });

    requestFullscreen.call(previewBox)
      .then(() => {
        // 强制刷新样式
        previewBox.style.cssText = `background: ${currentColor} !important`;
      })
      // 设置全屏容器样式
      fullscreenOverlay.style.display = "block";
      fullscreenOverlay.style.backgroundColor = currentColor;

      // 请求全屏（关键修改：全屏 previewBox 自身）
      requestFullscreen.call(previewBox)
        .then(() => {
          // 隐藏页面其他元素
          document.querySelectorAll('body > *:not(#previewBox)').forEach(el => {
            el.classList.add('fullscreen-hide');
          });
        })
        .catch((err) => {
          console.error("全屏失败:", err);
          fullscreenOverlay.style.display = "none";
        });
    }
  });

  // 全屏状态变化处理
  const handleFullscreen = () => {
    if (isFullscreen()) {
      fullscreenTip.style.display = "block";
      fullscreenOverlay.style.display = "block";
    } else {
      fullscreenTip.style.display = "none";
      fullscreenOverlay.style.display = "none";
      // 恢复其他元素显示
      document.querySelectorAll('.fullscreen-hide').forEach(el => {
        el.classList.remove('fullscreen-hide');
      });
    }
  };

  document.addEventListener("fullscreenchange", handleFullscreen);
  document.addEventListener("webkitfullscreenchange", handleFullscreen);

  // 退出全屏
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isFullscreen()) {
      exitFullscreen.call(document);
    }
  });

  document.addEventListener("click", () => {
    if (isFullscreen()) {
      exitFullscreen.call(document);
    }
  });
}
function initResolution() {
  const e = () => {
    const [e, t] = document
      .getElementById("resolutionDropdown")
      .value.split(",");
    (document.getElementById("widthInput").value = e),
      (document.getElementById("heightInput").value = t);
  };
  document.getElementById("resolutionDropdown").addEventListener("change", e),
    e();
}
function initDownload() {
  document.getElementById("downloadBtn").addEventListener("click", () => {
    const e = document.getElementById("widthInput").value,
      t = document.getElementById("heightInput").value,
      o = document.getElementById("colorPicker").value,

      n = document.createElement("canvas");
    (n.width = e), (n.height = t);
    const c = n.getContext("2d");
    (c.fillStyle = o), c.fillRect(0, 0, e, t);
    const l = document.createElement("a");
    (l.download = `PantallaNegra.com_${e}x${t}_${o.replace("#", "")}.png`),
      (l.href = n.toDataURL()),
      l.click();
  });
}
function toggleLanguageMenu() {
  document.getElementById("language-menu").classList.toggle("show");
}
function hideLanguageMenu() {
  document.getElementById("language-menu").classList.toggle("hide");
}
function copyToClipboard(e) {
  navigator.clipboard && navigator.clipboard.writeText
    ? navigator.clipboard
        .writeText(e)
        .then(() => {
          showToast("OK");
        })
        .catch(() => {
          fallbackCopyText(e);
        })
    : fallbackCopyText(e);
}
function fallbackCopyText(e) {
  const t = document.createElement("textarea");
  (t.value = e),
    (t.style.position = "fixed"),
    document.body.appendChild(t),
    t.focus(),
    t.select();
  try {
    showToast(document.execCommand("copy") ? "OK" : "Please copy manually!");
  } catch (e) {
    showToast("Please copy manually!");
  }
  document.body.removeChild(t);
}
function showToast(e) {
  const t = document.getElementById("toast");
  (t.textContent = e),
    (t.style.display = "block"),
    setTimeout(() => {
      t.style.display = "none";
    }, 2e3);
}
function copyText(e) {
  copyToClipboard(document.getElementById(e).textContent);
}
function copyCode(e) {
  copyToClipboard(e);
}
function toggleShareDialog() {
  document.getElementById("share-dialog").classList.toggle("show");
}
function shareToTwitter() {
  const e = encodeURIComponent(window.location.href),
    t = encodeURIComponent(share_title);
  window.open(`https://twitter.com/intent/tweet?url=${e}&text=${t}`, "_blank");
}
function shareToFacebook() {
  const e = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${e}`, "_blank");
}
function shareToLine() {
  const e = encodeURIComponent(window.location.href),
    t = encodeURIComponent(share_title);
  window.open(
    `https://social-plugins.line.me/lineit/share?url=${e}&text=${t}`,
    "_blank",
  );
}
function shareToWhatsApp() {
  const e = encodeURIComponent(window.location.href),
    t = encodeURIComponent(share_title);
  window.open(`https://api.whatsapp.com/send?text=${t}%20${e}`, "_blank");
}
function shareToInstagram() {
  copyUrl();
}
function shareToSnapchat() {
  const e = encodeURIComponent(window.location.href),
    t = encodeURIComponent(share_title);
  window.open(
    `https://www.snapchat.com/scan?attachmentUrl=${e}&text=${t}`,
    "_blank",
  );
}
function shareToGoogle() {
  const e = encodeURIComponent(window.location.href);
  window.open(`https://plus.google.com/share?url=${e}`, "_blank");
}
function shareToTelegram() {
  const e = encodeURIComponent(window.location.href),
    t = encodeURIComponent(share_title);
  window.open(`https://t.me/share/url?url=${e}&text=${t}`, "_blank");
}
function shareByEmail() {
  const e = window.location.href,
    t = encodeURIComponent(share_title),
    o = encodeURIComponent(`${found_message}: ${e}`);
  window.location.href = `mailto:?subject=${t}&body=${o}`;
}
function copyUrl() {
  const e = window.location.href;
  navigator.clipboard
    ? navigator.clipboard
        .writeText(e)
        .then(() => {
          showToast("OK");
        })
        .catch(() => {
          fallbackCopyUrl(e);
        })
    : fallbackCopyUrl(e);
}
function fallbackCopyUrl(e) {
  const t = document.createElement("textarea");
  (t.value = e),
    (t.style.position = "fixed"),
    document.body.appendChild(t),
    t.select();
  try {
    showToast(document.execCommand("copy") ? "OK" : "copy failed");
  } catch (e) {
    showToast("copy failed");
  } finally {
    document.body.removeChild(t);
  }
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toggleBackToTop() {
  const e = document.getElementById("back-to-top"),
    t = window.innerHeight,
    o = document.documentElement.scrollHeight,
    n = document.documentElement.scrollTop || document.body.scrollTop;
  o > t && n > t / 2 ? e.classList.add("show") : e.classList.remove("show");
}
function isPc() {
  var e = navigator.userAgent || navigator.vendor || window.opera;
  return !/windows phone|ipad|iphone|ipod|android|blackberry|mini|windows ce|palm/i.test(
    e,
  );
}
function isNearBottom(e = 240) {
  const t = document.documentElement.scrollHeight;
  return (
    (window.scrollY || document.documentElement.scrollTop) +
      window.innerHeight +
      e >=
    t
  );
}
function loadJS(e, t) {
  const o = document.createElement("script");
  (o.src = e),
    (o.onload = t),
    (o.onerror = function () {
      console.error("JS load failed");
    }),
    document.body.appendChild(o);
}
colorPicker.addEventListener("input", (e) => {
  const t = e.target.value;
  previewBox.style.backgroundColor = t;
  const [o, n, c] = hexToRgb(t),
    l = (0.299 * o + 0.587 * n + 0.114 * c) / 255;
  zoomIcon.style.fill = l < 0.5 ? "#fff" : "#000";
}),
  document.addEventListener("DOMContentLoaded", () => {
    initColorGrid(),
      initFullscreen(),
      initResolution(),
      initDownload(),
      (document.getElementById("colorPicker").value = currentColor),
      document.documentElement.style.setProperty(
        "--current-color",
        currentColor,
      );
  }),
  document.querySelectorAll(".nav-item").forEach((e) => {
    e.addEventListener("click", () => {
      document
        .querySelectorAll(".nav-item")
        .forEach((e) => e.classList.remove("active")),
        e.classList.add("active"),
        document.querySelectorAll(".converter-section").forEach((e) => {
          e.style.display = "none";
        }),
        (document.getElementById(e.getAttribute("data-target")).style.display =
          "block");
    });
  }),
  window.addEventListener("scroll", toggleBackToTop);
