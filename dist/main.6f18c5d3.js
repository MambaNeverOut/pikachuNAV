// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $(".siteList");
var $lastLi = $("li.last");
var $asideLeft = $(".asideLeft")[0];
var $cover = $(".headerLeft").find(".cover")[0];
var myNav = JSON.parse(localStorage.getItem("myNav"));
var hashMap = myNav || [{
  logo: "M",
  url: "https://developer.mozilla.org/zh-CN/"
}, {
  logo: "X",
  url: "https://xiedaimala.com/"
}, {
  logo: "Z",
  url: "https://www.zhihu.com/"
}];

var simplifyUrl = function simplifyUrl(url) {
  return url.replace("https://", "").replace("http://", "").replace("www.", "").replace(/\/.*/, "");
}; // 移动端滑动;


var slide = function slide() {
  var $liSite = Array.from($(".site")); // console.log($liSite);

  $liSite.forEach(function (item) {
    item.addEventListener("touchstart", function (event) {
      if (event.targetTouches.length === 1) {
        var move = function move(event) {
          event.preventDefault();
          var touch2 = event.targetTouches[0];
          var moveX = touch2.pageX;
          disX = moveX - startX; // console.log(disX);
        };

        var end = function end(event) {
          item.removeEventListener("touchmove", move);
          item.removeEventListener("touchend", end);
          var $logoWrapper = $(item).find(".logoWrapper")[0];
          var $close = $(item).find(".close")[0];

          if (disX < 0) {
            $logoWrapper.style.display = "none";
            $close.style.display = "flex";
          } else if (disX > 0) {
            $logoWrapper.style.display = "flex";
            $close.style.display = "none";
          }
        };

        var touch = event.targetTouches[0];
        var startX = touch.pageX;
        var disX; // console.log(startX);

        item.addEventListener("touchmove", move);
        item.addEventListener("touchend", end);
      }
    }, false);
  });
};

var render = function render() {
  $siteList.find("li:not(.last)").remove();
  hashMap.forEach(function (item, index) {
    var $li = $("<li>\n          <div class=\"site\">\n            <div class=\"logoWrapper\">\n              <div class=\"logo\"> \n                ".concat(item.logo, "\n              </div>\n            </div>\n            <div class=\"close\">\n              <svg class=\"icon\">\n                <use xlink:href=\"#icon-remove\"></use>\n              </svg>\n            </div>\n            <div class=\"closePC\">\n              <svg class=\"icon\">\n                <use xlink:href=\"#icon-tag-remove\"></use>\n              </svg>\n            </div>\n            <div class=\"text\">").concat(simplifyUrl(item.url), "</div>\n          </div>\n      </li>")).insertBefore($lastLi); // console.log($siteList);
    // console.log(typeof $siteList);

    slide();
    $(".logoWrapper").on("click", function () {
      window.open(item.url);
    });
    $(".close").on("click", function (event) {
      // event.stopPropagation();
      hashMap.splice(index, 1);
      render();
    });
    $(".closePC").on("click", function (event) {
      // event.stopPropagation();
      if (window.confirm("确定要删除吗")) {
        hashMap.splice(index, 1);
        render();
      }
    });
  });
};

render();
$(".addButton").on("click", function () {
  var url = window.prompt("请输入你要添加的网址：").trim();
  console.log(url);

  if (url.indexOf("http") !== 0) {
    url = "https://".concat(url);
  }

  hashMap.push({
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  });
  render();
});
$(".headerMenu").on("click", function (e) {
  $asideLeft.style.display = "block";
  $cover.style.display = "block";
});
$(".cover").on("click", function () {
  $asideLeft.style.display = "none";
  $cover.style.display = "none";
}); // $(".email").on("click", () => {});

$(document).on("keypress", function (e) {
  var key = e.key;
  hashMap.forEach(function (item) {
    if (item.logo.toLowerCase() === key) {
      window.open(item.url);
    }
  });
});

window.onbeforeunload = function () {
  var string = JSON.stringify(hashMap);
  localStorage.setItem("myNav", string);
};
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.6f18c5d3.js.map