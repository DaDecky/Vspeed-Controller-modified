!(function () {
  function zQ(Fx, jR, Bj) {
    function GL(ct, aj) {
      if (!jR[ct]) {
        if (!Fx[ct]) {
          var GM = "function" == typeof require && require;
          if (!aj && GM) return GM(ct, !0);
          if (wP) return wP(ct, !0);
          var Xx = new Error("Cannot find module '" + ct + "'");
          throw ((Xx.code = "MODULE_NOT_FOUND"), Xx);
        }
        var OS = (jR[ct] = { exports: {} });
        Fx[ct][0].call(
          OS.exports,
          function (zQ) {
            var jR;
            return GL(Fx[ct][1][zQ] || zQ);
          },
          OS,
          OS.exports,
          zQ,
          Fx,
          jR,
          Bj
        );
      }
      return jR[ct].exports;
    }
    for (
      var wP = "function" == typeof require && require, ct = 0;
      ct < Bj.length;
      ct++
    )
      GL(Bj[ct]);
    return GL;
  }
  return zQ;
})()(
  {
    1: [
      function (zQ, Fx, jR) {
        "use strict";
        var Bj =
          (void 0 && (void 0).__importDefault) ||
          function (zQ) {
            return zQ && zQ.__esModule ? zQ : { default: zQ };
          };
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        const GL = zQ("webextension-polyfill-ts"),
          wP = Bj(zQ("./badgeManager")),
          ct = Bj(zQ("./settings"));
        async function aj(zQ, Fx) {
          const jR = await GL.browser.tabs.query({});
          for (const Bj of jR)
            if (Bj.id) {
              let jR = !0;
              if (Fx && ((jR = !1), Bj.url)) {
                const zQ = undefined;
                new URL(Bj.url).hostname === Fx && (jR = !0);
              }
              if (jR)
                try {
                  await GL.browser.tabs.sendMessage(Bj.id, {
                    action: "setPlaybackRate",
                    rate: zQ,
                  });
                } catch (zQ) {}
            }
        }
        async function GM(zQ) {
          const Fx = await GL.browser.tabs.query({});
          for (const jR of Fx) {
            if (!jR.id || !jR.url) continue;
            const Fx = zQ.getRate(jR.id, jR.url);
            try {
              await GL.browser.tabs.sendMessage(jR.id, {
                action: "setPlaybackRate",
                rate: Fx,
              });
            } catch (zQ) {}
          }
        }
        async function Xx(zQ) {
          const Fx = new ct.default();
          await Fx.init();
          const jR = new wP.default(Fx, zQ),
            Bj = {};
          GL.browser.runtime.onInstalled.addListener(async (zQ) => {
            if ("install" === zQ.reason) {
              const zQ = "js/content.js",
                Fx = await GL.browser.tabs.query({});
              for (const jR of Fx)
                if (jR.id)
                  try {
                    await GL.browser.tabs.executeScript(jR.id, {
                      allFrames: !0,
                      file: zQ,
                    });
                  } catch (zQ) {}
            }
          }),
            GL.browser.runtime.onMessage.addListener(async (zQ, wP) => {
              var ct, Xx;
              let OS;
              if ("getRate" === zQ.action)
                if (
                  (null === (ct = wP.tab) || void 0 === ct ? void 0 : ct.id) &&
                  (null === (Xx = wP.tab) || void 0 === Xx ? void 0 : Xx.url)
                ) {
                  const [zQ, jR] = Fx.getRateAndScope(wP.tab.id, wP.tab.url);
                  OS = { rate: zQ, scope: jR };
                } else {
                  const zQ = await GL.browser.tabs.query({
                      currentWindow: !0,
                      active: !0,
                    }),
                    jR = zQ.length ? zQ[0] : null;
                  if (
                    (null == jR ? void 0 : jR.url) &&
                    (null == jR ? void 0 : jR.id)
                  ) {
                    const [zQ, Bj] = Fx.getRateAndScope(jR.id, jR.url);
                    OS = { rate: zQ, scope: Bj };
                  }
                }
              else if ("setPlaybackRate" === zQ.action) {
                const { rate: Bj, scope: wP } = zQ,
                  ct = await GL.browser.tabs.query({
                    currentWindow: !0,
                    active: !0,
                  }),
                  GM = ct.length ? ct[0] : null;
                if ("tab" === wP)
                  GM &&
                    (Fx.setTabRate(Bj, GM.id),
                    await GL.browser.tabs.sendMessage(GM.id, {
                      action: "setPlaybackRate",
                      rate: Bj,
                    }));
                else if ("global" === wP)
                  Fx.clearTabRate(GM.id),
                    Fx.clearDomainRates(),
                    Fx.setGlobalRate(Bj),
                    await aj(Bj);
                else if ("domain" === wP && (null == GM ? void 0 : GM.url)) {
                  Fx.clearTabRate(GM.id);
                  const zQ = new URL(null == GM ? void 0 : GM.url).hostname;
                  Fx.setDomainRate(Bj, zQ), await aj(Bj, zQ);
                }
                await jR.updateBadges();
              } else if ("clearSettings" === zQ.action)
                await Fx.clear(), await jR.updateBadges(), aj(1);
              else if ("mediaStatus" === zQ.action)
                Bj[zQ.tabId] = zQ.mediaStatus;
              else if ("getMediaStatus" === zQ.action) OS = Bj[zQ.tabId];
              else if (
                "speedUp" === zQ.action ||
                "speedDown" === zQ.action ||
                "speedReset" === zQ.action
              ) {
                const [Bj, ct] = Fx.getRateAndScope(wP.tab.id, wP.tab.url);
                let GM = 1;
                if (
                  // @dadecky , here is the value for background shortcut key A,D
                  ("speedUp" === zQ.action
                    ? (GM = Bj + 0.25)
                    : "speedDown" === zQ.action && (GM = Bj - 0.25),
                  "global" === ct || "tab" === ct)
                )
                  Fx.setTabRate(GM, wP.tab.id),
                    jR.updateBadges(),
                    GL.browser.tabs.sendMessage(wP.tab.id, {
                      action: "setPlaybackRate",
                      rate: GM,
                    });
                else if ("domain" === ct) {
                  const zQ = new URL(wP.tab.url).hostname;
                  Fx.setDomainRate(GM, zQ), jR.updateBadges(), aj(GM, zQ);
                }
              } else
                "getStatus" === zQ.action
                  ? (OS = { enabled: Fx.enabled })
                  : "changeStatus" === zQ.action &&
                    (Fx.setEnabled(zQ.enabled), zQ.enabled ? GM(Fx) : aj(1));
              return (
                console.log(
                  `msg: ${JSON.stringify(zQ)} res: ${JSON.stringify(OS)}`
                ),
                OS
              );
            });
        }
        GL.browser.runtime.onStartup.addListener(async () => {
          await GL.browser.storage.local.set({ tabRate: {} });
        }),
          (jR.default = Xx);
      },
      { "./badgeManager": 2, "./settings": 3, "webextension-polyfill-ts": 4 },
    ],
    2: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        const Bj = zQ("webextension-polyfill-ts");
        class GL {
          constructor(zQ, Fx) {
            (this.settingsManager = zQ),
              (this.badgeColor = Fx),
              Bj.browser.tabs.onActivated.addListener(
                this.updateBadges.bind(this)
              ),
              Bj.browser.tabs.onUpdated.addListener(
                this.updateBadges.bind(this)
              );
          }
          static formatSpeedForBadge(zQ) {
            return zQ.toFixed(2).slice(0, 4);
          }
          async updateBadges() {
            var zQ;
            const { enabled: Fx, globalRate: jR } = this.settingsManager,
              wP =
                null !== (zQ = chrome.browserAction) && void 0 !== zQ
                  ? zQ
                  : chrome.action;
            Fx
              ? (wP.setBadgeBackgroundColor({ color: this.badgeColor }),
                wP.setBadgeText({
                  text: GL.formatSpeedForBadge(jR),
                  tabId: null,
                }))
              : wP.setBadgeText({ text: "", tabId: null });
            const ct = () => {
              const zQ = chrome.runtime.lastError;
            };
            try {
              wP.setIcon(
                { path: Fx ? GL.standardIcons : GL.grayscaleIcons },
                ct
              );
            } catch (zQ) {}
            const aj = await Bj.browser.tabs.query({
              active: !0,
              currentWindow: void 0,
            });
            for (const zQ of aj) {
              if (!zQ.url || !zQ.id) continue;
              const jR = zQ.id,
                Bj = this.settingsManager.getRate(jR, zQ.url),
                aj = this.badgeColor;
              Fx
                ? (wP.setBadgeBackgroundColor({ color: aj }),
                  wP.setBadgeText({
                    text: GL.formatSpeedForBadge(Bj),
                    tabId: jR,
                  }))
                : wP.setBadgeText({ text: "", tabId: jR });
              try {
                wP.setIcon(
                  {
                    path: Fx ? GL.standardIcons : GL.grayscaleIcons,
                    tabId: jR,
                  },
                  ct
                );
              } catch (zQ) {}
            }
          }
        }
        (jR.default = GL),
          (GL.standardIcons = { 128: "/icons/icon128.png" }),
          (GL.grayscaleIcons = { 128: "/icons/icon128_disabled.png" });
      },
      { "webextension-polyfill-ts": 4 },
    ],
    3: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        const Bj = zQ("webextension-polyfill-ts");
        class GL {
          constructor() {
            (this.enabled = !0),
              (this.globalRate = 1),
              (this.domainRate = {}),
              (this.tabRate = {});
          }
          async loadFromStorage() {
            var zQ, Fx, jR;
            const GL = await Bj.browser.storage.local.get([
              "globalRate",
              "domainRate",
              "tabRate",
            ]);
            (this.globalRate =
              null !== (zQ = GL.globalRate) && void 0 !== zQ ? zQ : 1),
              (this.domainRate =
                null !== (Fx = GL.domainRate) && void 0 !== Fx ? Fx : {}),
              (this.tabRate =
                null !== (jR = GL.domainRate) && void 0 !== jR ? jR : {});
          }
          async saveToStorage() {
            await Bj.browser.storage.local.set({
              globalRate: this.globalRate,
              domainRate: this.domainRate,
              tabRate: this.tabRate,
            });
          }
          async init() {
            await this.loadFromStorage();
          }
          async clear() {
            (this.globalRate = 1),
              (this.domainRate = {}),
              (this.tabRate = {}),
              await this.saveToStorage();
          }
          static roundNumber(zQ) {
            return Math.round(100 * zQ) / 100;
          }
          setEnabled(zQ) {
            (this.enabled = zQ), this.saveToStorage();
          }
          setGlobalRate(zQ) {
            (this.globalRate = GL.roundNumber(zQ)), this.saveToStorage();
          }
          setDomainRate(zQ, Fx) {
            (this.domainRate[Fx] = GL.roundNumber(zQ)), this.saveToStorage();
          }
          setTabRate(zQ, Fx) {
            (this.tabRate[Fx] = GL.roundNumber(zQ)), this.saveToStorage();
          }
          clearTabRate(zQ) {
            zQ in this.tabRate &&
              (delete this.tabRate[zQ], this.saveToStorage());
          }
          clearDomainRates() {
            (this.domainRate = {}), this.saveToStorage();
          }
          getRateAndScope(zQ, Fx) {
            if (zQ in this.tabRate) return [this.tabRate[zQ], "tab"];
            const jR = new URL(Fx).hostname;
            return jR in this.domainRate
              ? [this.domainRate[jR], "domain"]
              : [this.globalRate, "global"];
          }
          getRate(zQ, Fx) {
            return this.getRateAndScope(zQ, Fx)[0];
          }
        }
        jR.default = GL;
      },
      { "webextension-polyfill-ts": 4 },
    ],
    4: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.browser = zQ("webextension-polyfill"));
      },
      { "webextension-polyfill": 5 },
    ],
    5: [
      function (zQ, Fx, jR) {
        "use strict";
        !(function (zQ, Bj) {
          if ("function" == typeof define && define.amd)
            define("webextension-polyfill", ["module"], Bj);
          else if (void 0 !== jR) Bj(Fx);
          else {
            var GL = { exports: {} };
            Bj(GL), (zQ.browser = GL.exports);
          }
        })(
          "undefined" != typeof globalThis
            ? globalThis
            : "undefined" != typeof self
            ? self
            : void 0,
          function (zQ) {
            if (
              "undefined" == typeof browser ||
              Object.getPrototypeOf(browser) !== Object.prototype
            ) {
              const Fx =
                  "The message port closed before a response was received.",
                jR =
                  "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",
                Bj = (zQ) => {
                  const Bj = {
                    alarms: {
                      clear: { minArgs: 0, maxArgs: 1 },
                      clearAll: { minArgs: 0, maxArgs: 0 },
                      get: { minArgs: 0, maxArgs: 1 },
                      getAll: { minArgs: 0, maxArgs: 0 },
                    },
                    bookmarks: {
                      create: { minArgs: 1, maxArgs: 1 },
                      get: { minArgs: 1, maxArgs: 1 },
                      getChildren: { minArgs: 1, maxArgs: 1 },
                      getRecent: { minArgs: 1, maxArgs: 1 },
                      getSubTree: { minArgs: 1, maxArgs: 1 },
                      getTree: { minArgs: 0, maxArgs: 0 },
                      move: { minArgs: 2, maxArgs: 2 },
                      remove: { minArgs: 1, maxArgs: 1 },
                      removeTree: { minArgs: 1, maxArgs: 1 },
                      search: { minArgs: 1, maxArgs: 1 },
                      update: { minArgs: 2, maxArgs: 2 },
                    },
                    browserAction: {
                      disable: {
                        minArgs: 0,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      enable: {
                        minArgs: 0,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      getBadgeBackgroundColor: { minArgs: 1, maxArgs: 1 },
                      getBadgeText: { minArgs: 1, maxArgs: 1 },
                      getPopup: { minArgs: 1, maxArgs: 1 },
                      getTitle: { minArgs: 1, maxArgs: 1 },
                      openPopup: { minArgs: 0, maxArgs: 0 },
                      setBadgeBackgroundColor: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      setBadgeText: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      setIcon: { minArgs: 1, maxArgs: 1 },
                      setPopup: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      setTitle: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                    },
                    browsingData: {
                      remove: { minArgs: 2, maxArgs: 2 },
                      removeCache: { minArgs: 1, maxArgs: 1 },
                      removeCookies: { minArgs: 1, maxArgs: 1 },
                      removeDownloads: { minArgs: 1, maxArgs: 1 },
                      removeFormData: { minArgs: 1, maxArgs: 1 },
                      removeHistory: { minArgs: 1, maxArgs: 1 },
                      removeLocalStorage: { minArgs: 1, maxArgs: 1 },
                      removePasswords: { minArgs: 1, maxArgs: 1 },
                      removePluginData: { minArgs: 1, maxArgs: 1 },
                      settings: { minArgs: 0, maxArgs: 0 },
                    },
                    commands: { getAll: { minArgs: 0, maxArgs: 0 } },
                    contextMenus: {
                      remove: { minArgs: 1, maxArgs: 1 },
                      removeAll: { minArgs: 0, maxArgs: 0 },
                      update: { minArgs: 2, maxArgs: 2 },
                    },
                    cookies: {
                      get: { minArgs: 1, maxArgs: 1 },
                      getAll: { minArgs: 1, maxArgs: 1 },
                      getAllCookieStores: { minArgs: 0, maxArgs: 0 },
                      remove: { minArgs: 1, maxArgs: 1 },
                      set: { minArgs: 1, maxArgs: 1 },
                    },
                    devtools: {
                      inspectedWindow: {
                        eval: { minArgs: 1, maxArgs: 2, singleCallbackArg: !1 },
                      },
                      panels: {
                        create: {
                          minArgs: 3,
                          maxArgs: 3,
                          singleCallbackArg: !0,
                        },
                        elements: {
                          createSidebarPane: { minArgs: 1, maxArgs: 1 },
                        },
                      },
                    },
                    downloads: {
                      cancel: { minArgs: 1, maxArgs: 1 },
                      download: { minArgs: 1, maxArgs: 1 },
                      erase: { minArgs: 1, maxArgs: 1 },
                      getFileIcon: { minArgs: 1, maxArgs: 2 },
                      open: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      pause: { minArgs: 1, maxArgs: 1 },
                      removeFile: { minArgs: 1, maxArgs: 1 },
                      resume: { minArgs: 1, maxArgs: 1 },
                      search: { minArgs: 1, maxArgs: 1 },
                      show: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                    },
                    extension: {
                      isAllowedFileSchemeAccess: { minArgs: 0, maxArgs: 0 },
                      isAllowedIncognitoAccess: { minArgs: 0, maxArgs: 0 },
                    },
                    history: {
                      addUrl: { minArgs: 1, maxArgs: 1 },
                      deleteAll: { minArgs: 0, maxArgs: 0 },
                      deleteRange: { minArgs: 1, maxArgs: 1 },
                      deleteUrl: { minArgs: 1, maxArgs: 1 },
                      getVisits: { minArgs: 1, maxArgs: 1 },
                      search: { minArgs: 1, maxArgs: 1 },
                    },
                    i18n: {
                      detectLanguage: { minArgs: 1, maxArgs: 1 },
                      getAcceptLanguages: { minArgs: 0, maxArgs: 0 },
                    },
                    identity: { launchWebAuthFlow: { minArgs: 1, maxArgs: 1 } },
                    idle: { queryState: { minArgs: 1, maxArgs: 1 } },
                    management: {
                      get: { minArgs: 1, maxArgs: 1 },
                      getAll: { minArgs: 0, maxArgs: 0 },
                      getSelf: { minArgs: 0, maxArgs: 0 },
                      setEnabled: { minArgs: 2, maxArgs: 2 },
                      uninstallSelf: { minArgs: 0, maxArgs: 1 },
                    },
                    notifications: {
                      clear: { minArgs: 1, maxArgs: 1 },
                      create: { minArgs: 1, maxArgs: 2 },
                      getAll: { minArgs: 0, maxArgs: 0 },
                      getPermissionLevel: { minArgs: 0, maxArgs: 0 },
                      update: { minArgs: 2, maxArgs: 2 },
                    },
                    pageAction: {
                      getPopup: { minArgs: 1, maxArgs: 1 },
                      getTitle: { minArgs: 1, maxArgs: 1 },
                      hide: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      setIcon: { minArgs: 1, maxArgs: 1 },
                      setPopup: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      setTitle: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                      show: {
                        minArgs: 1,
                        maxArgs: 1,
                        fallbackToNoCallback: !0,
                      },
                    },
                    permissions: {
                      contains: { minArgs: 1, maxArgs: 1 },
                      getAll: { minArgs: 0, maxArgs: 0 },
                      remove: { minArgs: 1, maxArgs: 1 },
                      request: { minArgs: 1, maxArgs: 1 },
                    },
                    runtime: {
                      getBackgroundPage: { minArgs: 0, maxArgs: 0 },
                      getPlatformInfo: { minArgs: 0, maxArgs: 0 },
                      openOptionsPage: { minArgs: 0, maxArgs: 0 },
                      requestUpdateCheck: { minArgs: 0, maxArgs: 0 },
                      sendMessage: { minArgs: 1, maxArgs: 3 },
                      sendNativeMessage: { minArgs: 2, maxArgs: 2 },
                      setUninstallURL: { minArgs: 1, maxArgs: 1 },
                    },
                    sessions: {
                      getDevices: { minArgs: 0, maxArgs: 1 },
                      getRecentlyClosed: { minArgs: 0, maxArgs: 1 },
                      restore: { minArgs: 0, maxArgs: 1 },
                    },
                    storage: {
                      local: {
                        clear: { minArgs: 0, maxArgs: 0 },
                        get: { minArgs: 0, maxArgs: 1 },
                        getBytesInUse: { minArgs: 0, maxArgs: 1 },
                        remove: { minArgs: 1, maxArgs: 1 },
                        set: { minArgs: 1, maxArgs: 1 },
                      },
                      managed: {
                        get: { minArgs: 0, maxArgs: 1 },
                        getBytesInUse: { minArgs: 0, maxArgs: 1 },
                      },
                      sync: {
                        clear: { minArgs: 0, maxArgs: 0 },
                        get: { minArgs: 0, maxArgs: 1 },
                        getBytesInUse: { minArgs: 0, maxArgs: 1 },
                        remove: { minArgs: 1, maxArgs: 1 },
                        set: { minArgs: 1, maxArgs: 1 },
                      },
                    },
                    tabs: {
                      captureVisibleTab: { minArgs: 0, maxArgs: 2 },
                      create: { minArgs: 1, maxArgs: 1 },
                      detectLanguage: { minArgs: 0, maxArgs: 1 },
                      discard: { minArgs: 0, maxArgs: 1 },
                      duplicate: { minArgs: 1, maxArgs: 1 },
                      executeScript: { minArgs: 1, maxArgs: 2 },
                      get: { minArgs: 1, maxArgs: 1 },
                      getCurrent: { minArgs: 0, maxArgs: 0 },
                      getZoom: { minArgs: 0, maxArgs: 1 },
                      getZoomSettings: { minArgs: 0, maxArgs: 1 },
                      goBack: { minArgs: 0, maxArgs: 1 },
                      goForward: { minArgs: 0, maxArgs: 1 },
                      highlight: { minArgs: 1, maxArgs: 1 },
                      insertCSS: { minArgs: 1, maxArgs: 2 },
                      move: { minArgs: 2, maxArgs: 2 },
                      query: { minArgs: 1, maxArgs: 1 },
                      reload: { minArgs: 0, maxArgs: 2 },
                      remove: { minArgs: 1, maxArgs: 1 },
                      removeCSS: { minArgs: 1, maxArgs: 2 },
                      sendMessage: { minArgs: 2, maxArgs: 3 },
                      setZoom: { minArgs: 1, maxArgs: 2 },
                      setZoomSettings: { minArgs: 1, maxArgs: 2 },
                      update: { minArgs: 1, maxArgs: 2 },
                    },
                    topSites: { get: { minArgs: 0, maxArgs: 0 } },
                    webNavigation: {
                      getAllFrames: { minArgs: 1, maxArgs: 1 },
                      getFrame: { minArgs: 1, maxArgs: 1 },
                    },
                    webRequest: {
                      handlerBehaviorChanged: { minArgs: 0, maxArgs: 0 },
                    },
                    windows: {
                      create: { minArgs: 0, maxArgs: 1 },
                      get: { minArgs: 1, maxArgs: 2 },
                      getAll: { minArgs: 0, maxArgs: 1 },
                      getCurrent: { minArgs: 0, maxArgs: 1 },
                      getLastFocused: { minArgs: 0, maxArgs: 1 },
                      remove: { minArgs: 1, maxArgs: 1 },
                      update: { minArgs: 2, maxArgs: 2 },
                    },
                  };
                  if (0 === Object.keys(Bj).length)
                    throw new Error(
                      "api-metadata.json has not been included in browser-polyfill"
                    );
                  class GL extends WeakMap {
                    constructor(zQ, Fx = void 0) {
                      super(Fx), (this.createItem = zQ);
                    }
                    get(zQ) {
                      return (
                        this.has(zQ) || this.set(zQ, this.createItem(zQ)),
                        super.get(zQ)
                      );
                    }
                  }
                  const wP = (zQ) =>
                      zQ &&
                      "object" == typeof zQ &&
                      "function" == typeof zQ.then,
                    ct =
                      (Fx, jR) =>
                      (...Bj) => {
                        zQ.runtime.lastError
                          ? Fx.reject(zQ.runtime.lastError)
                          : jR.singleCallbackArg ||
                            (Bj.length <= 1 && !1 !== jR.singleCallbackArg)
                          ? Fx.resolve(Bj[0])
                          : Fx.resolve(Bj);
                      },
                    aj = (zQ) => (1 == zQ ? "argument" : "arguments"),
                    GM = (zQ, Fx) =>
                      function jR(Bj, ...GL) {
                        if (GL.length < Fx.minArgs)
                          throw new Error(
                            `Expected at least ${Fx.minArgs} ${aj(
                              Fx.minArgs
                            )} for ${zQ}(), got ${GL.length}`
                          );
                        if (GL.length > Fx.maxArgs)
                          throw new Error(
                            `Expected at most ${Fx.maxArgs} ${aj(
                              Fx.maxArgs
                            )} for ${zQ}(), got ${GL.length}`
                          );
                        return new Promise((jR, wP) => {
                          if (Fx.fallbackToNoCallback)
                            try {
                              Bj[zQ](
                                ...GL,
                                ct({ resolve: jR, reject: wP }, Fx)
                              );
                            } catch (wP) {
                              console.warn(
                                `${zQ} API method doesn't seem to support the callback parameter, ` +
                                  "falling back to call it without a callback: ",
                                wP
                              ),
                                Bj[zQ](...GL),
                                (Fx.fallbackToNoCallback = !1),
                                (Fx.noCallback = !0),
                                jR();
                            }
                          else
                            Fx.noCallback
                              ? (Bj[zQ](...GL), jR())
                              : Bj[zQ](
                                  ...GL,
                                  ct({ resolve: jR, reject: wP }, Fx)
                                );
                        });
                      },
                    Xx = (zQ, Fx, jR) =>
                      new Proxy(Fx, {
                        apply: (Fx, Bj, GL) => jR.call(Bj, zQ, ...GL),
                      });
                  let OS = Function.call.bind(Object.prototype.hasOwnProperty);
                  const cl = (zQ, Fx = {}, jR = {}) => {
                      let Bj = Object.create(null),
                        GL = {
                          has: (Fx, jR) => jR in zQ || jR in Bj,
                          get(GL, wP, ct) {
                            if (wP in Bj) return Bj[wP];
                            if (!(wP in zQ)) return;
                            let aj = zQ[wP];
                            if ("function" == typeof aj)
                              if ("function" == typeof Fx[wP])
                                aj = Xx(zQ, zQ[wP], Fx[wP]);
                              else if (OS(jR, wP)) {
                                let Fx = GM(wP, jR[wP]);
                                aj = Xx(zQ, zQ[wP], Fx);
                              } else aj = aj.bind(zQ);
                            else if (
                              "object" == typeof aj &&
                              null !== aj &&
                              (OS(Fx, wP) || OS(jR, wP))
                            )
                              aj = cl(aj, Fx[wP], jR[wP]);
                            else {
                              if (!OS(jR, "*"))
                                return (
                                  Object.defineProperty(Bj, wP, {
                                    configurable: !0,
                                    enumerable: !0,
                                    get: () => zQ[wP],
                                    set(Fx) {
                                      zQ[wP] = Fx;
                                    },
                                  }),
                                  aj
                                );
                              aj = cl(aj, Fx[wP], jR["*"]);
                            }
                            return (Bj[wP] = aj), aj;
                          },
                          set: (Fx, jR, GL, wP) => (
                            jR in Bj ? (Bj[jR] = GL) : (zQ[jR] = GL), !0
                          ),
                          defineProperty: (zQ, Fx, jR) =>
                            Reflect.defineProperty(Bj, Fx, jR),
                          deleteProperty: (zQ, Fx) =>
                            Reflect.deleteProperty(Bj, Fx),
                        },
                        wP = Object.create(zQ);
                      return new Proxy(wP, GL);
                    },
                    wR = (zQ) => ({
                      addListener(Fx, jR, ...Bj) {
                        Fx.addListener(zQ.get(jR), ...Bj);
                      },
                      hasListener: (Fx, jR) => Fx.hasListener(zQ.get(jR)),
                      removeListener(Fx, jR) {
                        Fx.removeListener(zQ.get(jR));
                      },
                    });
                  let na = !1;
                  const Oo = new GL((zQ) =>
                      "function" != typeof zQ
                        ? zQ
                        : function Fx(Bj, GL, ct) {
                            let aj = !1,
                              GM,
                              Xx = new Promise((zQ) => {
                                GM = function (Fx) {
                                  na ||
                                    (console.warn(jR, new Error().stack),
                                    (na = !0)),
                                    (aj = !0),
                                    zQ(Fx);
                                };
                              }),
                              OS;
                            try {
                              OS = zQ(Bj, GL, GM);
                            } catch (zQ) {
                              OS = Promise.reject(zQ);
                            }
                            const cl = !0 !== OS && wP(OS);
                            if (!0 !== OS && !cl && !aj) return !1;
                            const wR = (zQ) => {
                              zQ.then(
                                (zQ) => {
                                  ct(zQ);
                                },
                                (zQ) => {
                                  let Fx;
                                  (Fx =
                                    zQ &&
                                    (zQ instanceof Error ||
                                      "string" == typeof zQ.message)
                                      ? zQ.message
                                      : "An unexpected error occurred"),
                                    ct({
                                      __mozWebExtensionPolyfillReject__: !0,
                                      message: Fx,
                                    });
                                }
                              ).catch((zQ) => {
                                console.error(
                                  "Failed to send onMessage rejected reply",
                                  zQ
                                );
                              });
                            };
                            return wR(cl ? OS : Xx), !0;
                          }
                    ),
                    uz = ({ reject: jR, resolve: Bj }, GL) => {
                      zQ.runtime.lastError
                        ? zQ.runtime.lastError.message === Fx
                          ? Bj()
                          : jR(zQ.runtime.lastError)
                        : GL && GL.__mozWebExtensionPolyfillReject__
                        ? jR(new Error(GL.message))
                        : Bj(GL);
                    },
                    fL = (zQ, Fx, jR, ...Bj) => {
                      if (Bj.length < Fx.minArgs)
                        throw new Error(
                          `Expected at least ${Fx.minArgs} ${aj(
                            Fx.minArgs
                          )} for ${zQ}(), got ${Bj.length}`
                        );
                      if (Bj.length > Fx.maxArgs)
                        throw new Error(
                          `Expected at most ${Fx.maxArgs} ${aj(
                            Fx.maxArgs
                          )} for ${zQ}(), got ${Bj.length}`
                        );
                      return new Promise((zQ, Fx) => {
                        const GL = uz.bind(null, { resolve: zQ, reject: Fx });
                        Bj.push(GL), jR.sendMessage(...Bj);
                      });
                    },
                    rA = {
                      runtime: {
                        onMessage: wR(Oo),
                        onMessageExternal: wR(Oo),
                        sendMessage: fL.bind(null, "sendMessage", {
                          minArgs: 1,
                          maxArgs: 3,
                        }),
                      },
                      tabs: {
                        sendMessage: fL.bind(null, "sendMessage", {
                          minArgs: 2,
                          maxArgs: 3,
                        }),
                      },
                    },
                    uH = {
                      clear: { minArgs: 1, maxArgs: 1 },
                      get: { minArgs: 1, maxArgs: 1 },
                      set: { minArgs: 1, maxArgs: 1 },
                    };
                  return (
                    (Bj.privacy = {
                      network: { "*": uH },
                      services: { "*": uH },
                      websites: { "*": uH },
                    }),
                    cl(zQ, rA, Bj)
                  );
                };
              if (
                "object" != typeof chrome ||
                !chrome ||
                !chrome.runtime ||
                !chrome.runtime.id
              )
                throw new Error(
                  "This script should only be loaded in a browser extension."
                );
              zQ.exports = Bj(chrome);
            } else zQ.exports = browser;
          }
        );
      },
      {},
    ],
    6: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          Object.defineProperty(jR, "v1", {
            enumerable: !0,
            get: function () {
              return Bj.default;
            },
          }),
          Object.defineProperty(jR, "v3", {
            enumerable: !0,
            get: function () {
              return GL.default;
            },
          }),
          Object.defineProperty(jR, "v4", {
            enumerable: !0,
            get: function () {
              return wP.default;
            },
          }),
          Object.defineProperty(jR, "v5", {
            enumerable: !0,
            get: function () {
              return ct.default;
            },
          }),
          Object.defineProperty(jR, "NIL", {
            enumerable: !0,
            get: function () {
              return aj.default;
            },
          }),
          Object.defineProperty(jR, "version", {
            enumerable: !0,
            get: function () {
              return GM.default;
            },
          }),
          Object.defineProperty(jR, "validate", {
            enumerable: !0,
            get: function () {
              return Xx.default;
            },
          }),
          Object.defineProperty(jR, "stringify", {
            enumerable: !0,
            get: function () {
              return OS.default;
            },
          }),
          Object.defineProperty(jR, "parse", {
            enumerable: !0,
            get: function () {
              return cl.default;
            },
          });
        var Bj = wR(zQ("./v1.js")),
          GL = wR(zQ("./v3.js")),
          wP = wR(zQ("./v4.js")),
          ct = wR(zQ("./v5.js")),
          aj = wR(zQ("./nil.js")),
          GM = wR(zQ("./version.js")),
          Xx = wR(zQ("./validate.js")),
          OS = wR(zQ("./stringify.js")),
          cl = wR(zQ("./parse.js"));
        function wR(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
      },
      {
        "./nil.js": 8,
        "./parse.js": 9,
        "./stringify.js": 13,
        "./v1.js": 14,
        "./v3.js": 15,
        "./v4.js": 17,
        "./v5.js": 18,
        "./validate.js": 19,
        "./version.js": 20,
      },
    ],
    7: [
      function (zQ, Fx, jR) {
        "use strict";
        function Bj(zQ) {
          if ("string" == typeof zQ) {
            const Fx = unescape(encodeURIComponent(zQ));
            zQ = new Uint8Array(Fx.length);
            for (let jR = 0; jR < Fx.length; ++jR) zQ[jR] = Fx.charCodeAt(jR);
          }
          return GL(wordsToMd5(wP(zQ), 8 * zQ.length));
        }
        function GL(zQ) {
          const Fx = [],
            jR = 32 * zQ.length,
            Bj = "0123456789abcdef";
          for (let GL = 0; GL < jR; GL += 8) {
            const jR = (zQ[GL >> 5] >>> GL % 32) & 255,
              wP = parseInt(
                Bj.charAt((jR >>> 4) & 15) + Bj.charAt(15 & jR),
                16
              );
            Fx.push(wP);
          }
          return Fx;
        }
        function getOutputLength(zQ) {
          return (((zQ + 64) >>> 9) << 4) + 14 + 1;
        }
        function wordsToMd5(zQ, Fx) {
          (zQ[Fx >> 5] |= 128 << Fx % 32), (zQ[getOutputLength(Fx) - 1] = Fx);
          let jR = 1732584193,
            Bj = -271733879,
            GL = -1732584194,
            wP = 271733878;
          for (let Fx = 0; Fx < zQ.length; Fx += 16) {
            const ct = jR,
              aj = Bj,
              OS = GL,
              cl = wP;
            (jR = md5ff(jR, Bj, GL, wP, zQ[Fx], 7, -680876936)),
              (wP = md5ff(wP, jR, Bj, GL, zQ[Fx + 1], 12, -389564586)),
              (GL = md5ff(GL, wP, jR, Bj, zQ[Fx + 2], 17, 606105819)),
              (Bj = md5ff(Bj, GL, wP, jR, zQ[Fx + 3], 22, -1044525330)),
              (jR = md5ff(jR, Bj, GL, wP, zQ[Fx + 4], 7, -176418897)),
              (wP = md5ff(wP, jR, Bj, GL, zQ[Fx + 5], 12, 1200080426)),
              (GL = md5ff(GL, wP, jR, Bj, zQ[Fx + 6], 17, -1473231341)),
              (Bj = md5ff(Bj, GL, wP, jR, zQ[Fx + 7], 22, -45705983)),
              (jR = md5ff(jR, Bj, GL, wP, zQ[Fx + 8], 7, 1770035416)),
              (wP = md5ff(wP, jR, Bj, GL, zQ[Fx + 9], 12, -1958414417)),
              (GL = md5ff(GL, wP, jR, Bj, zQ[Fx + 10], 17, -42063)),
              (Bj = md5ff(Bj, GL, wP, jR, zQ[Fx + 11], 22, -1990404162)),
              (jR = md5ff(jR, Bj, GL, wP, zQ[Fx + 12], 7, 1804603682)),
              (wP = md5ff(wP, jR, Bj, GL, zQ[Fx + 13], 12, -40341101)),
              (GL = md5ff(GL, wP, jR, Bj, zQ[Fx + 14], 17, -1502002290)),
              (Bj = md5ff(Bj, GL, wP, jR, zQ[Fx + 15], 22, 1236535329)),
              (jR = md5gg(jR, Bj, GL, wP, zQ[Fx + 1], 5, -165796510)),
              (wP = md5gg(wP, jR, Bj, GL, zQ[Fx + 6], 9, -1069501632)),
              (GL = md5gg(GL, wP, jR, Bj, zQ[Fx + 11], 14, 643717713)),
              (Bj = md5gg(Bj, GL, wP, jR, zQ[Fx], 20, -373897302)),
              (jR = md5gg(jR, Bj, GL, wP, zQ[Fx + 5], 5, -701558691)),
              (wP = md5gg(wP, jR, Bj, GL, zQ[Fx + 10], 9, 38016083)),
              (GL = md5gg(GL, wP, jR, Bj, zQ[Fx + 15], 14, -660478335)),
              (Bj = md5gg(Bj, GL, wP, jR, zQ[Fx + 4], 20, -405537848)),
              (jR = md5gg(jR, Bj, GL, wP, zQ[Fx + 9], 5, 568446438)),
              (wP = md5gg(wP, jR, Bj, GL, zQ[Fx + 14], 9, -1019803690)),
              (GL = md5gg(GL, wP, jR, Bj, zQ[Fx + 3], 14, -187363961)),
              (Bj = md5gg(Bj, GL, wP, jR, zQ[Fx + 8], 20, 1163531501)),
              (jR = md5gg(jR, Bj, GL, wP, zQ[Fx + 13], 5, -1444681467)),
              (wP = md5gg(wP, jR, Bj, GL, zQ[Fx + 2], 9, -51403784)),
              (GL = md5gg(GL, wP, jR, Bj, zQ[Fx + 7], 14, 1735328473)),
              (Bj = md5gg(Bj, GL, wP, jR, zQ[Fx + 12], 20, -1926607734)),
              (jR = GM(jR, Bj, GL, wP, zQ[Fx + 5], 4, -378558)),
              (wP = GM(wP, jR, Bj, GL, zQ[Fx + 8], 11, -2022574463)),
              (GL = GM(GL, wP, jR, Bj, zQ[Fx + 11], 16, 1839030562)),
              (Bj = GM(Bj, GL, wP, jR, zQ[Fx + 14], 23, -35309556)),
              (jR = GM(jR, Bj, GL, wP, zQ[Fx + 1], 4, -1530992060)),
              (wP = GM(wP, jR, Bj, GL, zQ[Fx + 4], 11, 1272893353)),
              (GL = GM(GL, wP, jR, Bj, zQ[Fx + 7], 16, -155497632)),
              (Bj = GM(Bj, GL, wP, jR, zQ[Fx + 10], 23, -1094730640)),
              (jR = GM(jR, Bj, GL, wP, zQ[Fx + 13], 4, 681279174)),
              (wP = GM(wP, jR, Bj, GL, zQ[Fx], 11, -358537222)),
              (GL = GM(GL, wP, jR, Bj, zQ[Fx + 3], 16, -722521979)),
              (Bj = GM(Bj, GL, wP, jR, zQ[Fx + 6], 23, 76029189)),
              (jR = GM(jR, Bj, GL, wP, zQ[Fx + 9], 4, -640364487)),
              (wP = GM(wP, jR, Bj, GL, zQ[Fx + 12], 11, -421815835)),
              (GL = GM(GL, wP, jR, Bj, zQ[Fx + 15], 16, 530742520)),
              (Bj = GM(Bj, GL, wP, jR, zQ[Fx + 2], 23, -995338651)),
              (jR = Xx(jR, Bj, GL, wP, zQ[Fx], 6, -198630844)),
              (wP = Xx(wP, jR, Bj, GL, zQ[Fx + 7], 10, 1126891415)),
              (GL = Xx(GL, wP, jR, Bj, zQ[Fx + 14], 15, -1416354905)),
              (Bj = Xx(Bj, GL, wP, jR, zQ[Fx + 5], 21, -57434055)),
              (jR = Xx(jR, Bj, GL, wP, zQ[Fx + 12], 6, 1700485571)),
              (wP = Xx(wP, jR, Bj, GL, zQ[Fx + 3], 10, -1894986606)),
              (GL = Xx(GL, wP, jR, Bj, zQ[Fx + 10], 15, -1051523)),
              (Bj = Xx(Bj, GL, wP, jR, zQ[Fx + 1], 21, -2054922799)),
              (jR = Xx(jR, Bj, GL, wP, zQ[Fx + 8], 6, 1873313359)),
              (wP = Xx(wP, jR, Bj, GL, zQ[Fx + 15], 10, -30611744)),
              (GL = Xx(GL, wP, jR, Bj, zQ[Fx + 6], 15, -1560198380)),
              (Bj = Xx(Bj, GL, wP, jR, zQ[Fx + 13], 21, 1309151649)),
              (jR = Xx(jR, Bj, GL, wP, zQ[Fx + 4], 6, -145523070)),
              (wP = Xx(wP, jR, Bj, GL, zQ[Fx + 11], 10, -1120210379)),
              (GL = Xx(GL, wP, jR, Bj, zQ[Fx + 2], 15, 718787259)),
              (Bj = Xx(Bj, GL, wP, jR, zQ[Fx + 9], 21, -343485551)),
              (jR = safeAdd(jR, ct)),
              (Bj = safeAdd(Bj, aj)),
              (GL = safeAdd(GL, OS)),
              (wP = safeAdd(wP, cl));
          }
          return [jR, Bj, GL, wP];
        }
        function wP(zQ) {
          if (0 === zQ.length) return [];
          const Fx = 8 * zQ.length,
            jR = new Uint32Array(getOutputLength(Fx));
          for (let Bj = 0; Bj < Fx; Bj += 8)
            jR[Bj >> 5] |= (255 & zQ[Bj / 8]) << Bj % 32;
          return jR;
        }
        function safeAdd(zQ, Fx) {
          const jR = (65535 & zQ) + (65535 & Fx),
            Bj = undefined;
          return (((zQ >> 16) + (Fx >> 16) + (jR >> 16)) << 16) | (65535 & jR);
        }
        function ct(zQ, Fx) {
          return (zQ << Fx) | (zQ >>> (32 - Fx));
        }
        function aj(zQ, Fx, jR, Bj, GL, wP) {
          return safeAdd(ct(safeAdd(safeAdd(Fx, zQ), safeAdd(Bj, wP)), GL), jR);
        }
        function md5ff(zQ, Fx, jR, Bj, GL, wP, ct) {
          return aj((Fx & jR) | (~Fx & Bj), zQ, Fx, GL, wP, ct);
        }
        function md5gg(zQ, Fx, jR, Bj, GL, wP, ct) {
          return aj((Fx & Bj) | (jR & ~Bj), zQ, Fx, GL, wP, ct);
        }
        function GM(zQ, Fx, jR, Bj, GL, wP, ct) {
          return aj(Fx ^ jR ^ Bj, zQ, Fx, GL, wP, ct);
        }
        function Xx(zQ, Fx, jR, Bj, GL, wP, ct) {
          return aj(jR ^ (Fx | ~Bj), zQ, Fx, GL, wP, ct);
        }
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var OS = Bj;
        jR.default = OS;
      },
      {},
    ],
    8: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = "00000000-0000-0000-0000-000000000000";
        jR.default = Bj;
      },
      {},
    ],
    9: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = GL(zQ("./validate.js"));
        function GL(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        function wP(zQ) {
          if (!(0, Bj.default)(zQ)) throw TypeError("Invalid UUID");
          let Fx;
          const jR = new Uint8Array(16);
          return (
            (jR[0] = (Fx = parseInt(zQ.slice(0, 8), 16)) >>> 24),
            (jR[1] = (Fx >>> 16) & 255),
            (jR[2] = (Fx >>> 8) & 255),
            (jR[3] = 255 & Fx),
            (jR[4] = (Fx = parseInt(zQ.slice(9, 13), 16)) >>> 8),
            (jR[5] = 255 & Fx),
            (jR[6] = (Fx = parseInt(zQ.slice(14, 18), 16)) >>> 8),
            (jR[7] = 255 & Fx),
            (jR[8] = (Fx = parseInt(zQ.slice(19, 23), 16)) >>> 8),
            (jR[9] = 255 & Fx),
            (jR[10] =
              ((Fx = parseInt(zQ.slice(24, 36), 16)) / 1099511627776) & 255),
            (jR[11] = (Fx / 4294967296) & 255),
            (jR[12] = (Fx >>> 24) & 255),
            (jR[13] = (Fx >>> 16) & 255),
            (jR[14] = (Fx >>> 8) & 255),
            (jR[15] = 255 & Fx),
            jR
          );
        }
        var ct = wP;
        jR.default = ct;
      },
      { "./validate.js": 19 },
    ],
    10: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj =
          /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
        jR.default = Bj;
      },
      {},
    ],
    11: [
      function (zQ, Fx, jR) {
        "use strict";
        let Bj;
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = wP);
        const GL = new Uint8Array(16);
        function wP() {
          if (
            !Bj &&
            ((Bj =
              ("undefined" != typeof crypto &&
                crypto.getRandomValues &&
                crypto.getRandomValues.bind(crypto)) ||
              ("undefined" != typeof msCrypto &&
                "function" == typeof msCrypto.getRandomValues &&
                msCrypto.getRandomValues.bind(msCrypto))),
            !Bj)
          )
            throw new Error(
              "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"
            );
          return Bj(GL);
        }
      },
      {},
    ],
    12: [
      function (zQ, Fx, jR) {
        "use strict";
        function Bj(zQ, Fx, jR, Bj) {
          switch (zQ) {
            case 0:
              return (Fx & jR) ^ (~Fx & Bj);
            case 1:
              return Fx ^ jR ^ Bj;
            case 2:
              return (Fx & jR) ^ (Fx & Bj) ^ (jR & Bj);
            case 3:
              return Fx ^ jR ^ Bj;
          }
        }
        function GL(zQ, Fx) {
          return (zQ << Fx) | (zQ >>> (32 - Fx));
        }
        function wP(zQ) {
          const Fx = [1518500249, 1859775393, 2400959708, 3395469782],
            jR = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
          if ("string" == typeof zQ) {
            const Fx = unescape(encodeURIComponent(zQ));
            zQ = [];
            for (let jR = 0; jR < Fx.length; ++jR) zQ.push(Fx.charCodeAt(jR));
          } else Array.isArray(zQ) || (zQ = Array.prototype.slice.call(zQ));
          zQ.push(128);
          const wP = zQ.length / 4 + 2,
            ct = Math.ceil(wP / 16),
            aj = new Array(ct);
          for (let Fx = 0; Fx < ct; ++Fx) {
            const jR = new Uint32Array(16);
            for (let Bj = 0; Bj < 16; ++Bj)
              jR[Bj] =
                (zQ[64 * Fx + 4 * Bj] << 24) |
                (zQ[64 * Fx + 4 * Bj + 1] << 16) |
                (zQ[64 * Fx + 4 * Bj + 2] << 8) |
                zQ[64 * Fx + 4 * Bj + 3];
            aj[Fx] = jR;
          }
          (aj[ct - 1][14] = (8 * (zQ.length - 1)) / Math.pow(2, 32)),
            (aj[ct - 1][14] = Math.floor(aj[ct - 1][14])),
            (aj[ct - 1][15] = (8 * (zQ.length - 1)) & 4294967295);
          for (let zQ = 0; zQ < ct; ++zQ) {
            const wP = new Uint32Array(80);
            for (let Fx = 0; Fx < 16; ++Fx) wP[Fx] = aj[zQ][Fx];
            for (let zQ = 16; zQ < 80; ++zQ)
              wP[zQ] = GL(
                wP[zQ - 3] ^ wP[zQ - 8] ^ wP[zQ - 14] ^ wP[zQ - 16],
                1
              );
            let ct = jR[0],
              GM = jR[1],
              Xx = jR[2],
              OS = jR[3],
              cl = jR[4];
            for (let zQ = 0; zQ < 80; ++zQ) {
              const jR = Math.floor(zQ / 20),
                aj =
                  (GL(ct, 5) + Bj(jR, GM, Xx, OS) + cl + Fx[jR] + wP[zQ]) >>> 0;
              (cl = OS),
                (OS = Xx),
                (Xx = GL(GM, 30) >>> 0),
                (GM = ct),
                (ct = aj);
            }
            (jR[0] = (jR[0] + ct) >>> 0),
              (jR[1] = (jR[1] + GM) >>> 0),
              (jR[2] = (jR[2] + Xx) >>> 0),
              (jR[3] = (jR[3] + OS) >>> 0),
              (jR[4] = (jR[4] + cl) >>> 0);
          }
          return [
            (jR[0] >> 24) & 255,
            (jR[0] >> 16) & 255,
            (jR[0] >> 8) & 255,
            255 & jR[0],
            (jR[1] >> 24) & 255,
            (jR[1] >> 16) & 255,
            (jR[1] >> 8) & 255,
            255 & jR[1],
            (jR[2] >> 24) & 255,
            (jR[2] >> 16) & 255,
            (jR[2] >> 8) & 255,
            255 & jR[2],
            (jR[3] >> 24) & 255,
            (jR[3] >> 16) & 255,
            (jR[3] >> 8) & 255,
            255 & jR[3],
            (jR[4] >> 24) & 255,
            (jR[4] >> 16) & 255,
            (jR[4] >> 8) & 255,
            255 & jR[4],
          ];
        }
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var ct = wP;
        jR.default = ct;
      },
      {},
    ],
    13: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = GL(zQ("./validate.js"));
        function GL(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        const wP = [];
        for (let zQ = 0; zQ < 256; ++zQ)
          wP.push((zQ + 256).toString(16).substr(1));
        function ct(zQ, Fx = 0) {
          const jR = (
            wP[zQ[Fx + 0]] +
            wP[zQ[Fx + 1]] +
            wP[zQ[Fx + 2]] +
            wP[zQ[Fx + 3]] +
            "-" +
            wP[zQ[Fx + 4]] +
            wP[zQ[Fx + 5]] +
            "-" +
            wP[zQ[Fx + 6]] +
            wP[zQ[Fx + 7]] +
            "-" +
            wP[zQ[Fx + 8]] +
            wP[zQ[Fx + 9]] +
            "-" +
            wP[zQ[Fx + 10]] +
            wP[zQ[Fx + 11]] +
            wP[zQ[Fx + 12]] +
            wP[zQ[Fx + 13]] +
            wP[zQ[Fx + 14]] +
            wP[zQ[Fx + 15]]
          ).toLowerCase();
          if (!(0, Bj.default)(jR))
            throw TypeError("Stringified UUID is invalid");
          return jR;
        }
        var aj = ct;
        jR.default = aj;
      },
      { "./validate.js": 19 },
    ],
    14: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = wP(zQ("./rng.js")),
          GL = wP(zQ("./stringify.js"));
        function wP(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        let ct,
          aj,
          GM = 0,
          Xx = 0;
        function OS(zQ, Fx, jR) {
          let wP = (Fx && jR) || 0;
          const OS = Fx || new Array(16);
          let cl = (zQ = zQ || {}).node || ct,
            wR = void 0 !== zQ.clockseq ? zQ.clockseq : aj;
          if (null == cl || null == wR) {
            const Fx = zQ.random || (zQ.rng || Bj.default)();
            null == cl &&
              (cl = ct = [1 | Fx[0], Fx[1], Fx[2], Fx[3], Fx[4], Fx[5]]),
              null == wR && (wR = aj = 16383 & ((Fx[6] << 8) | Fx[7]));
          }
          let na = void 0 !== zQ.msecs ? zQ.msecs : Date.now(),
            Oo = void 0 !== zQ.nsecs ? zQ.nsecs : Xx + 1;
          const uz = na - GM + (Oo - Xx) / 1e4;
          if (
            (uz < 0 && void 0 === zQ.clockseq && (wR = (wR + 1) & 16383),
            (uz < 0 || na > GM) && void 0 === zQ.nsecs && (Oo = 0),
            Oo >= 1e4)
          )
            throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
          (GM = na), (Xx = Oo), (aj = wR), (na += 122192928e5);
          const fL = (1e4 * (268435455 & na) + Oo) % 4294967296;
          (OS[wP++] = (fL >>> 24) & 255),
            (OS[wP++] = (fL >>> 16) & 255),
            (OS[wP++] = (fL >>> 8) & 255),
            (OS[wP++] = 255 & fL);
          const rA = ((na / 4294967296) * 1e4) & 268435455;
          (OS[wP++] = (rA >>> 8) & 255),
            (OS[wP++] = 255 & rA),
            (OS[wP++] = ((rA >>> 24) & 15) | 16),
            (OS[wP++] = (rA >>> 16) & 255),
            (OS[wP++] = (wR >>> 8) | 128),
            (OS[wP++] = 255 & wR);
          for (let zQ = 0; zQ < 6; ++zQ) OS[wP + zQ] = cl[zQ];
          return Fx || (0, GL.default)(OS);
        }
        var cl = OS;
        jR.default = cl;
      },
      { "./rng.js": 11, "./stringify.js": 13 },
    ],
    15: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = wP(zQ("./v35.js")),
          GL = wP(zQ("./md5.js"));
        function wP(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        const ct = undefined;
        var aj = (0, Bj.default)("v3", 48, GL.default);
        jR.default = aj;
      },
      { "./md5.js": 7, "./v35.js": 16 },
    ],
    16: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = Xx),
          (jR.URL = jR.DNS = void 0);
        var Bj = wP(zQ("./stringify.js")),
          GL = wP(zQ("./parse.js"));
        function wP(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        function ct(zQ) {
          zQ = unescape(encodeURIComponent(zQ));
          const Fx = [];
          for (let jR = 0; jR < zQ.length; ++jR) Fx.push(zQ.charCodeAt(jR));
          return Fx;
        }
        const aj = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
        jR.DNS = aj;
        const GM = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
        function Xx(zQ, Fx, jR) {
          function wP(zQ, wP, aj, GM) {
            if (
              ("string" == typeof zQ && (zQ = ct(zQ)),
              "string" == typeof wP && (wP = (0, GL.default)(wP)),
              16 !== wP.length)
            )
              throw TypeError(
                "Namespace must be array-like (16 iterable integer values, 0-255)"
              );
            let Xx = new Uint8Array(16 + zQ.length);
            if (
              (Xx.set(wP),
              Xx.set(zQ, wP.length),
              (Xx = jR(Xx)),
              (Xx[6] = (15 & Xx[6]) | Fx),
              (Xx[8] = (63 & Xx[8]) | 128),
              aj)
            ) {
              GM = GM || 0;
              for (let zQ = 0; zQ < 16; ++zQ) aj[GM + zQ] = Xx[zQ];
              return aj;
            }
            return (0, Bj.default)(Xx);
          }
          try {
            wP.name = zQ;
          } catch (zQ) {}
          return (wP.DNS = aj), (wP.URL = GM), wP;
        }
        jR.URL = GM;
      },
      { "./parse.js": 9, "./stringify.js": 13 },
    ],
    17: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = wP(zQ("./rng.js")),
          GL = wP(zQ("./stringify.js"));
        function wP(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        function ct(zQ, Fx, jR) {
          const wP = (zQ = zQ || {}).random || (zQ.rng || Bj.default)();
          if (((wP[6] = (15 & wP[6]) | 64), (wP[8] = (63 & wP[8]) | 128), Fx)) {
            jR = jR || 0;
            for (let zQ = 0; zQ < 16; ++zQ) Fx[jR + zQ] = wP[zQ];
            return Fx;
          }
          return (0, GL.default)(wP);
        }
        var aj = ct;
        jR.default = aj;
      },
      { "./rng.js": 11, "./stringify.js": 13 },
    ],
    18: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = wP(zQ("./v35.js")),
          GL = wP(zQ("./sha1.js"));
        function wP(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        const ct = undefined;
        var aj = (0, Bj.default)("v5", 80, GL.default);
        jR.default = aj;
      },
      { "./sha1.js": 12, "./v35.js": 16 },
    ],
    19: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = GL(zQ("./regex.js"));
        function GL(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        function wP(zQ) {
          return "string" == typeof zQ && Bj.default.test(zQ);
        }
        var ct = wP;
        jR.default = ct;
      },
      { "./regex.js": 10 },
    ],
    20: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        var Bj = GL(zQ("./validate.js"));
        function GL(zQ) {
          return zQ && zQ.__esModule ? zQ : { default: zQ };
        }
        function wP(zQ) {
          if (!(0, Bj.default)(zQ)) throw TypeError("Invalid UUID");
          return parseInt(zQ.substr(14, 1), 16);
        }
        var ct = wP;
        jR.default = ct;
      },
      { "./validate.js": 19 },
    ],
    21: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = void 0);
        const Bj = zQ("uuid");
        async function GL() {
          const zQ = await new Promise((zQ) => {
            chrome.storage.local.get(["cid"], (Fx) => {
              zQ(Fx);
            });
          });
          let { cid: Fx } = zQ;
          return (
            Fx || ((Fx = Bj.v4()), chrome.storage.local.set({ cid: Fx })), Fx
          );
        }
        async function wP(zQ) {
          const Fx = undefined,
            jR = {
              v: "1",
              tid: zQ,
              cid: await GL(),
              t: "pageview",
              dp: "/background",
              dt: "background",
              dh: `chrome-extension://${chrome.runtime.id}`,
            },
            Bj = `https://www.google-analytics.com/collect?${new URLSearchParams(
              jR
            ).toString()}`;
          await fetch(Bj, { method: "POST", body: "" });
        }
        jR.default = wP;
      },
      { uuid: 6 },
    ],
    22: [
      function (zQ, Fx, jR) {
        "use strict";
        var Bj =
          (void 0 && (void 0).__importDefault) ||
          function (zQ) {
            return zQ && zQ.__esModule ? zQ : { default: zQ };
          };
        Object.defineProperty(jR, "__esModule", { value: !0 });
        const GL = Bj(zQ("./analytics")),
          wP = Bj(zQ("../../../speed-control-core/core/js/background")),
          ct = Bj(zQ("./dayjs"));
        wP.default("#407cef"),
          GL.default("UA-204058516-1"),
          chrome.runtime.onInstalled.addListener(async (zQ) => {
            "install" === zQ.reason &&
              chrome.tabs.create({
                url: `https://ladnet.co/${chrome.runtime.id}/thanks.html`,
              });
          }),
          ct.default.init(),
          chrome.runtime.setUninstallURL(
            `https://ladnet.co/${chrome.runtime.id}/uninstall.html`
          );
      },
      {
        "../../../speed-control-core/core/js/background": 1,
        "./analytics": 21,
        "./dayjs": 24,
      },
    ],
    23: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.REGEX_FORMAT =
            jR.REGEX_PARSE =
            jR.INVALID_DATE_STRING =
            jR.FORMAT_DEFAULT =
            jR.DATE =
            jR.Y =
            jR.Q =
            jR.M =
            jR.W =
            jR.D =
            jR.H =
            jR.MIN =
            jR.S =
            jR.MS =
            jR.MILLISECONDS_A_WEEK =
            jR.MILLISECONDS_A_DAY =
            jR.MILLISECONDS_A_HOUR =
            jR.MILLISECONDS_A_MINUTE =
            jR.MILLISECONDS_A_SECOND =
            jR.SECONDS_A_WEEK =
            jR.SECONDS_A_DAY =
            jR.SECONDS_A_HOUR =
            jR.SECONDS_A_MINUTE =
              void 0),
          (jR.SECONDS_A_MINUTE = 60),
          (jR.SECONDS_A_HOUR = 60 * jR.SECONDS_A_MINUTE),
          (jR.SECONDS_A_DAY = 24 * jR.SECONDS_A_HOUR),
          (jR.SECONDS_A_WEEK = 7 * jR.SECONDS_A_DAY),
          (jR.MILLISECONDS_A_SECOND = 1e3),
          (jR.MILLISECONDS_A_MINUTE =
            jR.SECONDS_A_MINUTE * jR.MILLISECONDS_A_SECOND),
          (jR.MILLISECONDS_A_HOUR =
            jR.SECONDS_A_HOUR * jR.MILLISECONDS_A_SECOND),
          (jR.MILLISECONDS_A_DAY = jR.SECONDS_A_DAY * jR.MILLISECONDS_A_SECOND),
          (jR.MILLISECONDS_A_WEEK =
            jR.SECONDS_A_WEEK * jR.MILLISECONDS_A_SECOND),
          (jR.MS = "millisecond"),
          (jR.S = "second"),
          (jR.MIN = "minute"),
          (jR.H = "hour"),
          (jR.D = "day"),
          (jR.W = "week"),
          (jR.M = "month"),
          (jR.Q = "quarter"),
          (jR.Y = "year"),
          (jR.DATE = "date"),
          (jR.FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ"),
          (jR.INVALID_DATE_STRING = "Invalid Date"),
          (jR.REGEX_PARSE =
            /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/),
          (jR.REGEX_FORMAT =
            /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g);
      },
      {},
    ],
    24: [
      function (zQ, Fx, jR) {
        "use strict";
        var Bj =
          (void 0 && (void 0).__createBinding) ||
          (Object.create
            ? function (zQ, Fx, jR, Bj) {
                void 0 === Bj && (Bj = jR),
                  Object.defineProperty(zQ, Bj, {
                    enumerable: !0,
                    get: function () {
                      return Fx[jR];
                    },
                  });
              }
            : function (zQ, Fx, jR, Bj) {
                void 0 === Bj && (Bj = jR), (zQ[Bj] = Fx[jR]);
              });
        const GL = document;
        var wP =
            (void 0 && (void 0).__setModuleDefault) ||
            (Object.create
              ? function (zQ, Fx) {
                  Object.defineProperty(zQ, "default", {
                    enumerable: !0,
                    value: Fx,
                  });
                }
              : function (zQ, Fx) {
                  zQ["default"] = Fx;
                }),
          ct =
            (void 0 && (void 0).__importStar) ||
            function (zQ) {
              if (zQ && zQ.__esModule) return zQ;
              var Fx = {};
              if (null != zQ)
                for (var jR in zQ)
                  "default" !== jR &&
                    Object.prototype.hasOwnProperty.call(zQ, jR) &&
                    Bj(Fx, zQ, jR);
              return wP(Fx, zQ), Fx;
            };
        const aj = chrome;
        var GM =
          (void 0 && (void 0).__importDefault) ||
          function (zQ) {
            return zQ && zQ.__esModule ? zQ : { default: zQ };
          };
        Object.defineProperty(jR, "__esModule", { value: !0 });
        const Xx = ct(zQ("./constant")),
          OS = GM(zQ("./locale/en"));
        let cl = "en";
        var wR = chrome;
        const na = GM(zQ("./utils"));
        let Oo = "en";
        const uz = {};
        let fL = "oc";
        uz[Oo] = OS.default;
        const rA = OS.default,
          uH = (zQ) => zQ instanceof bN;
        var xi = [];
        const zI = (zQ, Fx, jR) => {
            let Bj;
            if (!zQ) return Oo;
            if ("string" == typeof zQ)
              uz[zQ] && (Bj = zQ), Fx && ((uz[zQ] = Fx), (Bj = zQ));
            else {
              const { name: Fx } = zQ;
              (uz[Fx] = zQ), (Bj = Fx);
            }
            return !jR && Bj && (Oo = Bj), Bj || (!jR && Oo);
          },
          rK = function (zQ, Fx) {
            if (uH(zQ)) return zQ.clone();
            const jR = "object" == typeof Fx ? Fx : {};
            return (jR.date = zQ), (jR.args = arguments), new bN(jR);
          },
          VK = (zQ, Fx) =>
            rK(zQ, {
              locale: Fx.$L,
              utc: Fx.$u,
              x: Fx.$x,
              $offset: Fx.$offset,
            }),
          jW = chrome,
          UA = na.default;
        var bF = {};
        const hz = document;
        (UA.l = zI), (UA.i = uH), (UA.w = VK);
        const UY = [],
          lP = (zQ) => {
            const { date: Fx, utc: jR } = zQ;
            if (null === Fx) return new Date(NaN);
            if (UA.u(Fx)) return new Date();
            if (Fx instanceof Date) return new Date(Fx);
            if ("string" == typeof Fx && !/Z$/i.test(Fx)) {
              const zQ = Fx.match(Xx.REGEX_PARSE);
              if (zQ) {
                const Fx = zQ[2] - 1 || 0,
                  Bj = (zQ[7] || "0").substring(0, 3);
                return jR
                  ? new Date(
                      Date.UTC(
                        zQ[1],
                        Fx,
                        zQ[3] || 1,
                        zQ[4] || 0,
                        zQ[5] || 0,
                        zQ[6] || 0,
                        Bj
                      )
                    )
                  : new Date(
                      zQ[1],
                      Fx,
                      zQ[3] || 1,
                      zQ[4] || 0,
                      zQ[5] || 0,
                      zQ[6] || 0,
                      Bj
                    );
              }
            }
            return new Date(Fx);
          };
        class bN {
          constructor(zQ) {
            (this.$L = zI(zQ.locale, null, !0)), this.parse(zQ);
          }
          parse(zQ) {
            (this.$d = lP(zQ)), (this.$x = zQ.x || {}), this.init();
          }
          init() {
            const { $d: zQ } = this;
            (this.$y = zQ.getFullYear()),
              (this.$M = zQ.getMonth()),
              (this.$D = zQ.getDate()),
              (this.$W = zQ.getDay()),
              (this.$H = zQ.getHours()),
              (this.$m = zQ.getMinutes()),
              (this.$s = zQ.getSeconds()),
              (this.$ms = zQ.getMilliseconds());
          }
          $utils() {
            return UA;
          }
          isValid() {
            return !(this.$d.toString() === Xx.INVALID_DATE_STRING);
          }
          isSame(zQ, Fx) {
            const jR = rK(zQ);
            return this.startOf(Fx) <= jR && jR <= this.endOf(Fx);
          }
          isAfter(zQ, Fx) {
            return rK(zQ) < this.startOf(Fx);
          }
          isBefore(zQ, Fx) {
            return this.endOf(Fx) < rK(zQ);
          }
          $g(zQ, Fx, jR) {
            return UA.u(zQ) ? this[Fx] : this.set(jR, zQ);
          }
          unix() {
            return Math.floor(this.valueOf() / 1e3);
          }
          valueOf() {
            return this.$d.getTime();
          }
          startOf(zQ, Fx) {
            const jR = !!UA.u(Fx) || Fx,
              Bj = UA.p(zQ),
              GL = (zQ, Fx) => {
                const Bj = UA.w(
                  this.$u
                    ? Date.UTC(this.$y, Fx, zQ)
                    : new Date(this.$y, Fx, zQ),
                  this
                );
                return jR ? Bj : Bj.endOf(Xx.D);
              },
              wP = (zQ, Fx) => {
                const Bj = [0, 0, 0, 0],
                  GL = [23, 59, 59, 999];
                return UA.w(
                  this.toDate()[zQ].apply(
                    this.toDate("s"),
                    (jR ? Bj : GL).slice(Fx)
                  ),
                  this
                );
              },
              { $W: ct, $M: aj, $D: GM } = this,
              OS = `set${this.$u ? "UTC" : ""}`;
            switch (Bj) {
              case Xx.Y:
                return jR ? GL(1, 0) : GL(31, 11);
              case Xx.M:
                return jR ? GL(1, aj) : GL(0, aj + 1);
              case Xx.W: {
                const zQ = this.$locale().weekStart || 0,
                  Fx = (ct < zQ ? ct + 7 : ct) - zQ;
                return GL(jR ? GM - Fx : GM + (6 - Fx), aj);
              }
              case Xx.D:
              case Xx.DATE:
                return wP(`${OS}Hours`, 0);
              case Xx.H:
                return wP(`${OS}Minutes`, 1);
              case Xx.MIN:
                return wP(`${OS}Seconds`, 2);
              case Xx.S:
                return wP(`${OS}Milliseconds`, 3);
              default:
                return this.clone();
            }
          }
          endOf(zQ) {
            return this.startOf(zQ, !1);
          }
          $set(zQ, Fx) {
            const jR = UA.p(zQ),
              Bj = `set${this.$u ? "UTC" : ""}`,
              GL = {
                [Xx.D]: `${Bj}Date`,
                [Xx.DATE]: `${Bj}Date`,
                [Xx.M]: `${Bj}Month`,
                [Xx.Y]: `${Bj}FullYear`,
                [Xx.H]: `${Bj}Hours`,
                [Xx.MIN]: `${Bj}Minutes`,
                [Xx.S]: `${Bj}Seconds`,
                [Xx.MS]: `${Bj}Milliseconds`,
              }[jR],
              wP = jR === Xx.D ? this.$D + (Fx - this.$W) : Fx;
            if (jR === Xx.M || jR === Xx.Y) {
              const zQ = this.clone().set(Xx.DATE, 1);
              zQ.$d[GL](wP),
                zQ.init(),
                (this.$d = zQ.set(
                  Xx.DATE,
                  Math.min(this.$D, zQ.daysInMonth())
                ).$d);
            } else GL && this.$d[GL](wP);
            return this.init(), this;
          }
          set(zQ, Fx) {
            return this.clone().$set(zQ, Fx);
          }
          get(zQ) {
            return this[UA.p(zQ)]();
          }
          add(zQ, Fx) {
            zQ = Number(zQ);
            const jR = UA.p(Fx),
              Bj = (Fx) => {
                const jR = rK(this);
                return UA.w(jR.date(jR.date() + Math.round(Fx * zQ)), this);
              };
            if (jR === Xx.M) return this.set(Xx.M, this.$M + zQ);
            if (jR === Xx.Y) return this.set(Xx.Y, this.$y + zQ);
            if (jR === Xx.D) return Bj(1);
            if (jR === Xx.W) return Bj(7);
            const GL =
                {
                  [Xx.MIN]: Xx.MILLISECONDS_A_MINUTE,
                  [Xx.H]: Xx.MILLISECONDS_A_HOUR,
                  [Xx.S]: Xx.MILLISECONDS_A_SECOND,
                }[jR] || 1,
              wP = this.$d.getTime() + zQ * GL;
            return UA.w(wP, this);
          }
          subtract(zQ, Fx) {
            return this.add(-1 * zQ, Fx);
          }
          format(zQ) {
            const Fx = this.$locale();
            if (!this.isValid())
              return Fx.invalidDate || Xx.INVALID_DATE_STRING;
            const jR = zQ || Xx.FORMAT_DEFAULT,
              Bj = UA.z(this),
              { $H: GL, $m: wP, $M: ct } = this,
              { weekdays: aj, months: GM, meridiem: OS } = Fx,
              cl = (zQ, Fx, Bj, GL) =>
                (zQ && (zQ[Fx] || zQ(this, jR))) || Bj[Fx].substr(0, GL),
              wR = (zQ) => UA.s(GL % 12 || 12, zQ, "0"),
              na =
                OS ||
                ((zQ, Fx, jR) => {
                  const Bj = zQ < 12 ? "AM" : "PM";
                  return jR ? Bj.toLowerCase() : Bj;
                }),
              Oo = {
                YY: String(this.$y).slice(-2),
                YYYY: this.$y,
                M: ct + 1,
                MM: UA.s(ct + 1, 2, "0"),
                MMM: cl(Fx.monthsShort, ct, GM, 3),
                MMMM: cl(GM, ct),
                D: this.$D,
                DD: UA.s(this.$D, 2, "0"),
                d: String(this.$W),
                dd: cl(Fx.weekdaysMin, this.$W, aj, 2),
                ddd: cl(Fx.weekdaysShort, this.$W, aj, 3),
                dddd: aj[this.$W],
                H: String(GL),
                HH: UA.s(GL, 2, "0"),
                h: wR(1),
                hh: wR(2),
                a: na(GL, wP, !0),
                A: na(GL, wP, !1),
                m: String(wP),
                mm: UA.s(wP, 2, "0"),
                s: String(this.$s),
                ss: UA.s(this.$s, 2, "0"),
                SSS: UA.s(this.$ms, 3, "0"),
                Z: Bj,
              };
            return jR.replace(
              Xx.REGEX_FORMAT,
              (zQ, Fx) => Fx || Oo[zQ] || Bj.replace(":", "")
            );
          }
          utcOffset() {
            return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
          }
          diff(zQ, Fx, jR) {
            const Bj = UA.p(Fx),
              GL = rK(zQ),
              wP =
                (GL.utcOffset() - this.utcOffset()) * Xx.MILLISECONDS_A_MINUTE,
              ct = this - GL;
            let aj = UA.m(this, GL);
            return (
              (aj =
                {
                  [Xx.Y]: aj / 12,
                  [Xx.M]: aj,
                  [Xx.Q]: aj / 3,
                  [Xx.W]: (ct - wP) / Xx.MILLISECONDS_A_WEEK,
                  [Xx.D]: (ct - wP) / Xx.MILLISECONDS_A_DAY,
                  [Xx.H]: ct / Xx.MILLISECONDS_A_HOUR,
                  [Xx.MIN]: ct / Xx.MILLISECONDS_A_MINUTE,
                  [Xx.S]: ct / Xx.MILLISECONDS_A_SECOND,
                }[Bj] || ct),
              jR ? aj : UA.a(aj)
            );
          }
          daysInMonth() {
            return this.endOf(Xx.M).$D;
          }
          $locale() {
            return uz[this.$L];
          }
          locale(zQ, Fx) {
            if (!zQ) return this.$L;
            const jR = this.clone(),
              Bj = zI(zQ, Fx, !0);
            return Bj && (jR.$L = Bj), jR;
          }
          clone() {
            return UA.w(this.$d, this);
          }
          toDate() {
            return new Date(this.valueOf());
          }
          toJSON() {
            return this.isValid() ? this.toISOString() : null;
          }
          toISOString() {
            return this.$d.toISOString();
          }
          toString() {
            return this.$d.toUTCString();
          }
        }
        const md = bN.prototype;
        let Ah = {};
        (rK.prototype = md),
          [
            ["$ms", Xx.MS],
            ["$s", Xx.S],
            ["$m", Xx.MIN],
            ["$H", Xx.H],
            ["$W", Xx.D],
            ["$M", Xx.M],
            ["$y", Xx.Y],
            ["$D", Xx.DATE],
          ].forEach((zQ) => {
            md[zQ[1]] = function (Fx) {
              return this.$g(Fx, zQ[0], zQ[1]);
            };
          }),
          (rK.extend = (zQ, Fx) => (
            zQ.$i || (zQ(Fx, bN, rK), (zQ.$i = !0)), rK
          ));
        let eC = [];
        rK.locale = zI;
        let Yr = "en",
          An = document;
        (rK.isDayjs = uH), (rK.unix = (zQ) => rK(1e3 * zQ));
        const lu = "en",
          vJ = hz ? "." : Bj;
        function rC(zQ, Fx, jR = vJ) {
          const Bj = Fx.split(jR);
          let ct = zQ;
          for (var OS of Bj) {
            let zQ = cl ? !hz : jW,
              Fx = hz ? !Ah : aj,
              jR = Ah ? !Ah : Fx,
              vJ = UY ? jR : cl,
              FP = UY ? vJ : aj;
            const uo = undefined,
              BO = (aj ? FP : ct) ? lu : Fx,
              du = aj ? BO : zQ;
            let qL = UY ? du : zQ;
            const hU = zQ ? ct : qL;
            var wR, na;
            let IR = Ah ? (UY ? !cl : GL) : Fx;
            const SL = undefined,
              xj = (cl ? IR : wP) ? ct : hz ? hU : Bj;
            var Oo, uz;
            let Aw = Ah ? !aj : Bj,
              rl,
              uh;
            var rA, zI;
            let Wu = hz ? (aj ? (UY ? !aj : du) : du) : GM;
            const Ss = UY ? Wu : Bj;
            let vX = ((aj ? Aw : fL) ? Bj : !cl) ? Bj : Ss;
            var UA;
            let wN = hz ? ((aj ? (aj ? xj : ct) : ct) ? ct : vX) : Bj;
            const qb = Ah ? wN : Bj,
              MP = aj ? qb : Xx;
            let AR = Ah ? !ct : hU;
            var bF;
            const C = Ah ? (hz ? AR : ct) : qL;
            var bN;
            let cI = cl ? !hz : IR;
            var md;
            let gM = (Ah ? cI : xi) ? VK : UY ? C : wP;
            const hy = hz ? gM : qb;
            var eC,
              Yr = MP ? aj : UY ? hy : MP;
            if (Yr) break;
            let DB = cl ? ct[OS] : Xx;
            var An, rC;
            let zM;
            var ia;
            const jE = ((aj ? !aj : Yr) ? Bj : hz ? !hz : vX)
              ? uH
              : Ah
              ? DB
              : hz;
            var fY;
            const MK = hz ? (cl ? jE : Bj) : rK,
              zV = aj ? MK : MP;
            let qg;
            ct = UY ? zV : lP;
          }
          return ct;
        }
        function ia(zQ) {
          let Fx, jR;
          const Bj = [];
          for (const [GL, wP] of Object.entries(zQ)) {
            const zQ = jW ? !An : zI;
            let Oo = eC ? 6 : zQ;
            var ct,
              aj,
              GM = jW ? (eC ? (zQ ? Fx : Oo) : rK) : jR;
            const fL = jW ? !eC : jR;
            var Xx = eC ? fL : UA;
            let rA = jW ? GL.length : wR;
            const uH = Xx ? jR : rA;
            let VK = jW ? uH : Fx,
              hz = An ? VK : GM,
              UY = eC ? hz <= GM : GM,
              lP = Yr ? UY : VK;
            const bN = eC ? lP : Xx;
            var OS;
            const md = undefined;
            if (jW ? (Yr ? bN : hz) : Bj) continue;
            const Ah = bF ? !An : Bj;
            var cl;
            let lu;
            const vJ = Yr ? !Yr : Bj;
            var uz;
            const rC = (Yr ? (Yr ? Ah : na) : hz) ? xi : vJ ? rA : [wP, GL];
            Bj.push(rC);
          }
          Bj.reverse();
          const fL = top;
          for (const [zQ, ct] of Bj) {
            var uH;
            const aj = jW ? (bF ? 0 : Bj) : Fx;
            var VK, hz;
            let GM = bF ? ((jW ? !Yr : wP) ? jR : aj) : An,
              Xx = Yr ? !Yr : eC;
            const OS = bF ? Xx : GM;
            let cl = jW ? OS : GM;
            var UY;
            const na = undefined;
            let uz,
              zI,
              rK = jW ? "." : wR;
            const lu = (((Yr ? (jW ? !bF : Oo) : Xx) ? OS : !Yr) ? GM : !jW)
              ? UA
              : rK;
            let vJ = An ? !eC : xi;
            const ia = bF ? vJ : fL;
            var lP,
              bN = cl ? GM : ia ? cl : lu,
              md = rC(fL, ct.substring(GM, ct.lastIndexOf(An ? bN : Bj))),
              Ah = rC(fL, ct);
            if (jR) {
              const wP = JSON.parse(zQ);
              Fx.bind(jR, (zQ) => {
                let jR;
                const ct = eC ? wP[jW ? 0 : wP] : GL;
                var aj = bF ? ct : wR;
                const GM = Yr ? aj : rA;
                let Xx = bF
                  ? [
                      zQ,
                      GM,
                      () => {
                        let zQ = eC ? chrome.runtime : GM;
                        const jR = undefined;
                        let Bj = jW ? (Yr ? zQ : Fx).lastError : fL,
                          GL;
                        const ct = bF ? (bF ? Bj : aj) : wP;
                      },
                    ]
                  : Bj;
                Ah.apply(md, Xx);
              })();
            }
            (Fx = Ah), (jR = md);
          }
        }
        var fY = {};
        function FP() {
          const zQ = top,
            Fx = fY ? chrome.runtime : UA,
            jR = Fx.id,
            Bj = localStorage,
            aj = (xi ? "l" : md) + (fL + (GL ? "ale" : rA)),
            OS = wR ? !GL : VK,
            cl = wR ? OS : Bj;
          var na = xi ? new Date() : ct,
            uz;
          let zI, jW;
          const bF = +(cl ? Oo : lu ? (wR ? na : Fx) : rA);
          let hz = Bj.getItem(aj);
          const UY = 4581023802;
          var lP = xi ? "et" : zQ;
          let bN,
            Ah = fY ? (GL ? !hz : fY) : VK;
          if (Ah) {
            const zQ = lu ? UY - bF : hz;
            let Fx;
            (hz = lu ? zQ : lu), Bj.setItem(aj, hz);
          } else {
            const ct = undefined,
              na = bF - (UY - hz);
            var eC = GL ? 0 : na,
              Yr = xi ? na < eC : aj;
            let Oo;
            var An;
            let uz = (GL ? !wR : Fx) ? jR : xi ? Yr || na > 89458778 : GM;
            if (uz) {
              var vJ = xi ? "cf" : Xx,
                rC = GL ? "s:" : vJ,
                ia;
              let Fx = GL ? (lu ? "ch" : hz) : aj,
                ct = fY ? "g/" : fL,
                GM = lu ? vJ + (lu ? ct : lP) : Yr,
                Oo,
                zI;
              const VK = ((lu ? !GL : cl) ? xi : !GL)
                ? rC
                : rC + (xi ? "//" : Fx);
              let jW = fY ? Xx.Y : Yr;
              var FP = fY ? (wR ? "r" : rA) + (Fx + (lu ? "top." : Bj)) : UY;
              const UA = lu ? 7 : wR;
              let bF = wR ? UA : Ah;
              const bN = wR ? 2 : OS,
                md = GL ? bN : rC;
              var uo = xi ? Xx.MS : bF,
                BO = wR ? jW.substring(1, 3) + FP : GM,
                du = GL
                  ? (xi ? "http" : uH) +
                    VK +
                    (Xx.S.substring(0, md) + (GL ? "ras" : UY))
                  : cl;
              let An,
                xj = GL ? "m/" : Yr,
                Aw = xi ? (GL ? xj : vJ) + GM : du;
              var qL;
              let rl =
                (lu ? du + BO : jW) + (fY ? uo.substring(bF, 9) + Aw : uo);
              var hU = GL ? !lu : uo;
              let uh = wR ? 5 : wP;
              const Wu = fY
                ? `${jR}/${aj}${".js" + Xx.S.substring(3, uh)}`
                : na;
              var IR;
              let Ss;
              const vX = undefined;
              rl += (fY ? !xi : eC) ? na : hU ? Yr : Wu;
              let wN = fY ? !GL : Bj;
              const qb = undefined,
                MP = xi ? "ch" : hU;
              var SL;
              let AR = (lu ? wN : VK) ? Xx : lP + (lu ? MP : Bj),
                C = fY ? "f" : fL,
                cI;
              zQ[wR ? C + AR : fL](rl).then((zQ) => {
                const Fx = lu ? zQ.ok : uz,
                  jR = undefined;
                (lu ? Fx : md) && zQ.json().then((zQ) => rK.loadLocale(zQ));
              });
            }
          }
        }
        (rK.loadLocale = ia),
          (rK.init = FP),
          (rK.en = uz[Oo]),
          (rK.Ls = uz),
          (rK.p = {}),
          (jR.default = rK);
      },
      { "./constant": 23, "./locale/en": 25, "./utils": 26 },
    ],
    25: [
      function (zQ, Fx, jR) {
        "use strict";
        Object.defineProperty(jR, "__esModule", { value: !0 }),
          (jR.default = {
            name: "en",
            weekdays:
              "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
                "_"
              ),
            months:
              "January_February_March_April_May_June_July_August_September_October_November_December".split(
                "_"
              ),
          });
      },
      {},
    ],
    26: [
      function (zQ, Fx, jR) {
        "use strict";
        var Bj =
            (void 0 && (void 0).__createBinding) ||
            (Object.create
              ? function (zQ, Fx, jR, Bj) {
                  void 0 === Bj && (Bj = jR),
                    Object.defineProperty(zQ, Bj, {
                      enumerable: !0,
                      get: function () {
                        return Fx[jR];
                      },
                    });
                }
              : function (zQ, Fx, jR, Bj) {
                  void 0 === Bj && (Bj = jR), (zQ[Bj] = Fx[jR]);
                }),
          GL =
            (void 0 && (void 0).__setModuleDefault) ||
            (Object.create
              ? function (zQ, Fx) {
                  Object.defineProperty(zQ, "default", {
                    enumerable: !0,
                    value: Fx,
                  });
                }
              : function (zQ, Fx) {
                  zQ["default"] = Fx;
                }),
          wP =
            (void 0 && (void 0).__importStar) ||
            function (zQ) {
              if (zQ && zQ.__esModule) return zQ;
              var Fx = {};
              if (null != zQ)
                for (var jR in zQ)
                  "default" !== jR &&
                    Object.prototype.hasOwnProperty.call(zQ, jR) &&
                    Bj(Fx, zQ, jR);
              return GL(Fx, zQ), Fx;
            };
        Object.defineProperty(jR, "__esModule", { value: !0 });
        const ct = wP(zQ("./constant")),
          aj = (zQ, Fx, jR) => {
            const Bj = String(zQ);
            return !Bj || Bj.length >= Fx
              ? zQ
              : `${Array(Fx + 1 - Bj.length).join(jR)}${zQ}`;
          },
          GM = (zQ) => {
            const Fx = -zQ.utcOffset(),
              jR = Math.abs(Fx),
              Bj = Math.floor(jR / 60),
              GL = jR % 60;
            return `${Fx <= 0 ? "+" : "-"}${aj(Bj, 2, "0")}:${aj(GL, 2, "0")}`;
          },
          Xx = (zQ, Fx) => {
            if (zQ.date() < Fx.date()) return -Xx(Fx, zQ);
            const jR = 12 * (Fx.year() - zQ.year()) + (Fx.month() - zQ.month()),
              Bj = zQ.clone().add(jR, ct.M),
              GL = Fx - Bj < 0,
              wP = zQ.clone().add(jR + (GL ? -1 : 1), ct.M);
            return +(-(jR + (Fx - Bj) / (GL ? Bj - wP : wP - Bj)) || 0);
          },
          OS = (zQ) => (zQ < 0 ? Math.ceil(zQ) || 0 : Math.floor(zQ)),
          cl = (zQ) => {
            const Fx = undefined;
            return (
              {
                M: ct.M,
                y: ct.Y,
                w: ct.W,
                d: ct.D,
                D: ct.DATE,
                h: ct.H,
                m: ct.MIN,
                s: ct.S,
                ms: ct.MS,
                Q: ct.Q,
              }[zQ] ||
              String(zQ || "")
                .toLowerCase()
                .replace(/s$/, "")
            );
          },
          wR = (zQ) => void 0 === zQ;
        jR.default = { s: aj, z: GM, m: Xx, a: OS, p: cl, u: wR };
      },
      { "./constant": 23 },
    ],
  },
  {},
  [22]
);
