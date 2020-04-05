import "./style.css";
import $ from "jquery";

const myNav = JSON.parse(localStorage.getItem("myNav"));
const eventBus = $({})


const m = {
  data: {
    hashMap: myNav || [{
        logo: "M",
        url: "https://developer.mozilla.org/zh-CN/"
      },
      {
        logo: "X",
        url: "https://xiedaimala.com/"
      },
      {
        logo: "Z",
        url: "https://www.zhihu.com/"
      }
    ]
  },
  create() {},
  delete() {},
  update() {},
  get() {}
};

const v = {
  el: null,
  html: `
  <header class="globalHeader">
    <div class="headerLeft">
      <span class="headerMenu">
        <svg class="icon">
          <use xlink:href="#icon-menu"></use>
        </svg>
      </span>
      <aside class="asideLeft">
        <div class="asideLogo">
          <img src="./aside.87b9b813.jpg">
          <span>皮卡丘 1.0</span>
        </div>
        <div class="aside-content">
          <a href="./introduction.html">
            <svg class="icon">
              <use xlink:href="#icon-introduction"></use>
            </svg>
            <span>功能介绍</span>
          </a>
          <a href="https://mambaneverout.github.io/pikachu/dist/index.html">
            <svg class="icon">
              <use xlink:href="#icon-url"></use>
            </svg>
            <span>
              画个皮卡丘
            </span>
          </a>
          <a href="./BB.html">
            <svg class="icon">
              <use xlink:href="#icon-BB"></use>
            </svg>
            <span>
              小声BB
            </span>
          </a>
          <a href="mailto:yaokai729@outlook.com">
            <svg class="icon">
              <use xlink:href="#icon-email"></use>
            </svg>
            <span>与我联系</span>
          </a>
        </div>
      </aside>
      <div class="cover"></div>
    </div>
  </header>

  <main class="globalMain">
    <div class="piKaWrapper">
      <a class="piKa"  href="https://mambaneverout.github.io/pikachu/dist/index.html">
        <img src="./皮卡丘1.71732775.png" alt="皮卡皮卡">
      </a>
    </div>
    <form class="searchForm" method="GET" action="https://www.baidu.com/s">
      <input type="text" name="wd">
      <button type="submit">搜索</button>
    </form>
    <ul class="siteList">
      <li class="last">
        <div class="addButton">
          <div class="icon-wrapper">
            <svg class="icon">
              <use xlink:href="#icon-add"></use>
            </svg>
          </div>
          <div class="text">
            新增网站
          </div>
        </div>
      </li>
    </ul>
  </main>
  `,
  init(container) {
    v.el = $(container)
    $(v.html).appendTo(v.el);
  },
  render() {
    const $siteList = $(".siteList");
    const $lastLi = $("li.last");
    $siteList.find("li:not(.last)").remove();
    m.data.hashMap.forEach((item, index) => {
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
              <div class="text">${c.simplifyUrl(item.url)}</div>
            </div>
        </li>`
      ).insertBefore($lastLi);
      c.slide();
      $li.on('click','.logoWrapper', () => {
        window.open(item.url)
      })
      $li.on('click', '.close', (e) => {
        e.stopPropagation() // 阻止冒泡
        m.data.hashMap.splice(index, 1);
        v.render();
      })
      $li.on('click', '.closePC', (e) => {
        e.stopPropagation() // 阻止冒泡
        if (window.confirm("确定要删除吗")) {
            m.data.hashMap.splice(index, 1);
            v.render();
          }
      })
    });
  }
};

const c = {
  init(container) {
    v.init(container);
    v.render();
    c.events.addUrl();
    c.events.showMenu();
    c.events.hideMenu();
    c.events.keyOpen();
    window.onbeforeunload = () => {
      const string = JSON.stringify(m.data.hashMap);
      localStorage.setItem("myNav", string);
    };
  },
  events: {
    addUrl() {
      $(".addButton").on("click", function () {
        let url = window.prompt("请输入你要添加的网址：").trim();
        if (url.indexOf("http") !== 0) {
          url = `https://${url}`;
        }
        m.data.hashMap.push({
          logo: c.simplifyUrl(url)[0].toUpperCase(),
          url: url
        });
        v.render();
      });
    },
    showMenu() {
      const $asideLeft = $(".asideLeft")[0];
      const $cover = $(".headerLeft").find(".cover")[0];
      $(".headerMenu").on("click", e => {
        $asideLeft.style.display = "block";
        document.body.style.overflow='hidden'
        $cover.style.display = "block";
      });
    },
    hideMenu() {
      const $asideLeft = $(".asideLeft")[0];
      const $cover = $(".headerLeft").find(".cover")[0];
      $(".cover").on("click", () => {
        $asideLeft.style.display = "none";
        document.body.style.overflow='auto'
        $cover.style.display = "none";
      });
    },
    keyOpen() {
      $(document).on("keypress", e => {
        const {
          key
        } = e;
        m.data.hashMap.forEach(item => {
          if (item.logo.toLowerCase() === key) {
            window.open(item.url);
          }
        });
      });
    }
  },
  simplifyUrl(url) {
    return url
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "")
      .replace(/\/.*/, "");
  },
  slide() {
    const $liSite = Array.from($(".site"));
    // console.log($liSite);
    $liSite.forEach(item => {
      item.addEventListener(
        "touchstart",
        function (event) {
          if (event.targetTouches.length === 1) {
            let touch = event.targetTouches[0];
            let startX = touch.pageX;
            let disX;
            // console.log(startX);
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
  }
};

export default c;