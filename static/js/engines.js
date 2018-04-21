//Template  engine
(function(){
  var cache = {};
  this.tmpl = function tmpl(str, data){
    var fn = !/\W/.test(str) ?
      cache[str] = cache[str] ||
        tmpl(document.getElementById(str).innerHTML) :
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
        "with(obj){p.push('" +
        str
          .replace(/[\r\t\n]/g, " ")
          .split("<%").join("\t")
          .replace(/((^|%>)[^\t]*)'/g, "$1\r")
          .replace(/\t=(.*?)%>/g, "',$1,'")
          .split("\t").join("');")
          .split("%>").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');");
    return data ? fn( data ) : fn;
  };
})();

//Routes engine
(function () {
  var routes = {};
  var events = [];
  var el = null;
  var ctx = {
    /*on: function (selector, evt, handler) {
      events.push([selector, evt, handler]);
    },*/
    refresh: function (listeners) {
      listeners.forEach(function (fn) { fn(); });
    }

  };
  function route (path, templateId, controller) {
    if (typeof templateId === 'function') {
      controller = templateId;
      templateId = null;
    }
    var listeners = [];
    //Object.defineProperty(controller.prototype, '$on', {value: ctx.on});
    Object.defineProperty(controller.prototype, '$refresh', {value: ctx.refresh.bind(undefined, listeners)});
    routes[path] = {templateId: templateId, controller: controller, onRefresh: listeners.push.bind(listeners)};
  }
  function forEachEventElement(fnName) {
    for (var i = 0, len = events.length; i < len; i++) {
      var els = el.querySelectorAll(events[i][0]);
      for (var j = 0, elsLen = els.length; j < elsLen; j++) {
        els[j][fnName].apply(els[j], events[i].slice(1));
      }
    }
  }
  function addEventListeners() {
    forEachEventElement('addEventListener');
  }
  function removeEventListeners() {
    forEachEventElement('removeEventListener');
  }
  function router () {
    el = el || document.getElementById('view');
    removeEventListeners();
    events = [];
    var url = location.hash.slice(1) || '/';
    var route = routes[url] || routes['*'];
    if (route && route.controller) {
      var ctrl = new route.controller();
      if (!el || !route.templateId) {
        return;
      }
      route.onRefresh(function () {
        removeEventListeners();
        el.innerHTML = tmpl(route.templateId, ctrl);
        addEventListeners();
      });
      ctrl.$refresh();
    }
  }
  this.addEventListener('hashchange', router);
  this.addEventListener('load', router);
  this.route = route;
})();