let currentColor = '#FFFFFF';

// 获取元素
const previewBox = document.getElementById('previewBox');
const zoomIcon = document.getElementById('zoomIcon'); // 或使用 querySelector('.zoom-icon')

// 监听颜色选择器的变化（假设 colorPicker 是你的颜色选择器元素）
colorPicker.addEventListener('input', (e) => {
  const selectedColor = e.target.value;
  previewBox.style.backgroundColor = selectedColor;

  // 计算亮度
  const [r, g, b] = hexToRgb(selectedColor);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
 zoomIcon.style.fill = brightness < 0.5 ? '#fff' : '#000';
});

// Hex转RGB函数
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// 初始化颜色方块
function initColorGrid() {
    // 颜色列表（原9色 + 新增3色 + DIY）
    const colors = [
        '#000000', '#FFFFFF', '#808080', '#007AFF',
        '#4CD964', '#FFCC00', '#FF2D55', '#FF3B30',
        '#AF52DE', '#FF6B6B', '#4D96FF', '#A52A2A',
		'#90EE90', '#FF9966' 
		 // 新增的3个颜色
        'diy' // 自定义色块标识
    ];

    const colorGrid = document.getElementById('colorGrid');
    const customColorInput = document.createElement('input'); // 创建隐藏的颜色选择器
    customColorInput.type = 'color';
    customColorInput.hidden = true;
    document.body.appendChild(customColorInput);

    // 清空旧内容
    colorGrid.innerHTML = '';
    
    colors.forEach(color => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        
        if (color === 'diy') {
            // DIY色块特殊处理
            colorItem.textContent = 'DIY';
            colorItem.style.border = '2px dashed #999';
            colorItem.style.color = '#666';
            colorItem.addEventListener('click', () => {
                customColorInput.click(); // 触发颜色选择
            });
        } else {
            // 常规色块
            colorItem.style.backgroundColor = color;
            colorItem.addEventListener('click', () => handleColorSelect(color));
        }

        // 公共样式
        colorItem.style.display = 'flex';
        colorItem.style.alignItems = 'center';
        colorItem.style.justifyContent = 'center';
        colorItem.style.fontWeight = 'bold';
        colorItem.style.cursor = 'pointer';

        colorGrid.appendChild(colorItem);
    });

    // 监听自定义颜色选择
    customColorInput.addEventListener('input', (e) => {
        const selectedColor = e.target.value;
        handleColorSelect(selectedColor);
        
        // 更新DIY色块显示
        const diyBlock = [...colorGrid.children].find(item => item.textContent === 'DIY');
        if (diyBlock) {
            diyBlock.style.backgroundColor = selectedColor;
            diyBlock.style.color = getContrastColor(selectedColor); // 自动计算对比色
        }
    });
}

// 颜色处理函数（保持你原有的逻辑）
function handleColorSelect(color) {
    currentColor = color;
    document.getElementById('previewBox').style.backgroundColor = color;
    document.documentElement.style.setProperty('--current-color', color);
    
    // 同步到颜色选择器（如果有）
    const colorPicker = document.getElementById('colorPicker');
    if (colorPicker) colorPicker.value = color;
}

// 计算文字对比色
function getContrastColor(hex) {
    const r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#000' : '#fff';
}


// 修复全屏逻辑
function initFullscreen() {
    const zoomBtn = document.getElementById('zoomBtn');
    const fullscreenTip = document.querySelector('.fullscreen-tip');

    zoomBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            // 设置全屏背景色
            document.documentElement.style.setProperty('--current-color', currentColor);
            
            // 请求全屏并直接设置背景
            document.documentElement.requestFullscreen()
                .then(() => {
                    document.documentElement.style.backgroundColor = currentColor;
                })
                .catch(err => {
                    console.error('全屏请求失败:', err);
                });
        }
    });

    // 全屏状态变化处理
    document.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement) {
            fullscreenTip.style.display = 'block';
            document.documentElement.style.backgroundColor = currentColor;
        } else {
            fullscreenTip.style.display = 'none';
            document.documentElement.style.backgroundColor = '';
        }
    });

    // ESC键处理
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.fullscreenElement) {
            document.exitFullscreen();
        }
    });
	
	// 监听鼠标单击事件，单击时退出全屏
	document.addEventListener('click', function() {
		if (document.fullscreenElement) {
			document.exitFullscreen();
		}
	});
}

// 分辨率管理
function initResolution() {
    const updateResolution = () => {
        const [width, height] = document.getElementById('resolutionDropdown').value.split(',');
        document.getElementById('widthInput').value = width;
        document.getElementById('heightInput').value = height;
    };

    document.getElementById('resolutionDropdown').addEventListener('change', updateResolution);
    updateResolution();
}

// 下载功能
function initDownload() {
    document.getElementById('downloadBtn').addEventListener('click', () => {
        const width = document.getElementById('widthInput').value;
        const height = document.getElementById('heightInput').value;
        const color = document.getElementById('colorPicker').value;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);

        const link = document.createElement('a');
        link.download = `background_${width}x${height}_${color.replace('#','')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    initColorGrid();
    initFullscreen();
    initResolution();
    initDownload();
    document.getElementById('colorPicker').value = currentColor;
    document.documentElement.style.setProperty('--current-color', currentColor);
});

function toggleLanguageMenu() {
  const menu = document.getElementById("language-menu");
  menu.classList.toggle("show");
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast("OK");
      })
      .catch(() => {
        fallbackCopyText(text);
      });
  } else {
    fallbackCopyText(text);
  }
}
function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showToast("OK");
    } else {
      showToast("Please copy manually!");
    }
  } catch (err) {
    showToast("Please copy manually!");
  }
  document.body.removeChild(textArea);
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}
function copyText(elementId) {
  const text = document.getElementById(elementId).textContent;
  copyToClipboard(text);
}
function copyCode(code) {
  copyToClipboard(code);
}
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    document.querySelectorAll(".converter-section").forEach((sec) => {
      sec.style.display = "none";
    });
    document.getElementById(item.getAttribute("data-target")).style.display =
      "block";
  });
});
function toggleShareDialog() {
  const dialog = document.getElementById("share-dialog");
  dialog.classList.toggle("show");
}
function shareToTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    "Free online tool to convert timestamp to date",
  );
  window.open(
    `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    "_blank",
  );
}
function shareToFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
}
function shareToLine() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    "Free online tool to convert timestamp to date",
  );
  window.open(
    `https://social-plugins.line.me/lineit/share?url=${url}&text=${text}`,
    "_blank",
  );
}
function shareToWhatsApp() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    "Free online tool to convert timestamp to date",
  );
  window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, "_blank");
}
function shareToInstagram() {
  copyUrl();
}
function shareToSnapchat() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    "Free online tool to convert timestamp to date",
  );
  window.open(
    `https://www.snapchat.com/scan?attachmentUrl=${url}&text=${text}`,
    "_blank",
  );
}
function shareToGoogle() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://plus.google.com/share?url=${url}`, "_blank");
}
function shareToTelegram() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(
    "Free online tool to convert timestamp to date",
  );
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
}
function shareByEmail() {
  const url = window.location.href;
  const subject = encodeURIComponent(
    "Free online tool to convert timestamp to date",
  );
  const body = encodeURIComponent(
    `I found a super useful timestamp converter :${url}`,
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}
function copyUrl() {
  const url = window.location.href;
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showToast("OK");
      })
      .catch(() => {
        fallbackCopyUrl(url);
      });
  } else {
    fallbackCopyUrl(url);
  }
}
function fallbackCopyUrl(url) {
  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.style.position = "fixed";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    const success = document.execCommand("copy");
    if (success) {
      showToast("OK");
    } else {
      showToast("copy failed");
    }
  } catch (err) {
    showToast("copy failed");
  } finally {
    document.body.removeChild(textarea);
  }
}
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function toggleBackToTop() {
  const backToTop = document.getElementById("back-to-top");
  const screenHeight = window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;
  if (pageHeight > screenHeight && scrollTop > screenHeight / 2) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}
function isPc() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  var isMobile =
    /windows phone|ipad|iphone|ipod|android|blackberry|mini|windows ce|palm/i.test(
      userAgent,
    );
  return !isMobile;
}
window.addEventListener("scroll", toggleBackToTop);