const $siteList = $(".siteList");
const $lastLi = $("li.last");
const $asideLeft = $(".asideLeft")[0];
const $cover = $(".headerLeft").find(".cover")[0];

const myNav = JSON.parse(localStorage.getItem("myNav"));

let hashMap = myNav || [
  { logo: "M", url: "https://developer.mozilla.org/zh-CN/" },
  { logo: "X", url: "https://xiedaimala.com/" },
  { logo: "Z", url: "https://www.zhihu.com/" }
];

const simplifyUrl = url => {
  return url
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .replace(/\/.*/, "");
};

const slide = () => {
  const $liSite = Array.from($(".site"));
  console.log($liSite);
  $liSite.forEach(item => {
    item.addEventListener(
      "touchstart",
      function(event) {
        if (event.targetTouches.length === 1) {
          let touch = event.targetTouches[0];
          let startX = touch.pageX;
          let disX;
          console.log(startX);
          item.addEventListener("touchmove", move);
          function move(event) {
            event.preventDefault();
            var touch2 = event.targetTouches[0];
            var moveX = touch2.pageX;
            disX = moveX - startX;
            // console.log(disX);
          }
          item.addEventListener("touchend", end);
          function end(event) {
            item.removeEventListener("touchmove", move);
            item.removeEventListener("touchend", end);
            let $logoWrapper = $(item).find(".logoWrapper")[0];
            let $close = $(item).find(".close")[0];
            if (disX < 0) {
              $logoWrapper.style.display = "none";
              $close.style.display = "flex";
            } else if (disX > 0) {
              $logoWrapper.style.display = "flex";
              $close.style.display = "none";
            }
          }
        }
      },
      false
    );
  });
};

const render = () => {
  $siteList.find("li:not(.last)").remove();
  hashMap.forEach((item, index) => {
    const $li = $(
      `<li>
          <div class="site">
            <div class="logoWrapper">
              <div class="logo"> 
                ${item.logo}
              </div>
            </div>
            <div class="close">
              <svg class="icon">
                <use xlink:href="#icon-remove"></use>
              </svg>
            </div>
            <div class="closePC">
              <svg class="icon">
                <use xlink:href="#icon-tag-remove"></use>
              </svg>
            </div>
            <div class="text">${simplifyUrl(item.url)}</div>
          </div>
      </li>`
    ).insertBefore($lastLi);
    // console.log($siteList);
    // console.log(typeof $siteList);
    slide();
    $(".logoWrapper").on("click", () => {
      window.open(item.url);
    });
    $(".close").on("click", function(event) {
      // event.stopPropagation();
      hashMap.splice(index, 1);
      render();
    });
    $(".closePC").on("click", function(event) {
      // event.stopPropagation();
      if (window.confirm("确定要删除吗")) {
        hashMap.splice(index, 1);
        render();
      }
    });
  });
};
render();

$(".addButton").on("click", function() {
  let url = window.prompt("请输入你要添加的网址：").trim();
  console.log(url);
  if (url.indexOf("http") !== 0) {
    url = `https://${url}`;
  }
  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  });

  render();
});

$(".headerMenu").on("click", e => {
  $asideLeft.style.display = "block";
  $cover.style.display = "block";
});

$(".cover").on("click", () => {
  $asideLeft.style.display = "none";
  $cover.style.display = "none";
});

$(".email").on("click", () => {});

$(document).on("keypress", e => {
  const { key } = e;
  hashMap.forEach(item => {
    if (item.logo.toLowerCase() === key) {
      window.open(item.url);
    }
  });
});

window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap);
  localStorage.setItem("myNav", string);
};

// 移动端滑动;
// console.log($siteList);

// console.log($liSite);

// slide();
