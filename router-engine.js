(function (global, factory) {
    global.RouterEngine = factory();
}(this, (function () {

    // Rotas:
    var Routes = [
        {
            hash: '',
            callBack: null,
            root: false
        }
    ];

    // Flag indicando se roteamento foi iniciado:
    var Started = false;

    // Flag indicando se o Root foi definido:
    var Root = false;

    // RenderEngine Object:
    var Render;

    // Callbacks:
    var NotFoundCallBack;
    var OnChangeCallBack;

    /**
     * RouterEngine
     *
     * @version 1.0
     * @author Leonardo Valcarenghi
     *
     * @constructor
     * 
     * @returns {RouterEngine}
     */
    function RouterEngine() {
        Routes = [];
        return this;
    }


    // Definir callback para erro 404:
    Object.defineProperty(RouterEngine.prototype, 'NotFound', {
        set: function (callBack) {
            NotFoundCallBack = typeof callBack === 'function' ? callBack : null;
        }
    });

    // Definir callback de 'onChange':
    Object.defineProperty(RouterEngine.prototype, 'OnChange', {
        set: function (callBack) {
            OnChangeCallBack = typeof callBack === 'function' ? callBack : null;
        }
    });

    // Definir Root:
    Object.defineProperty(RouterEngine.prototype, 'Root', {
        set: function (callBack) {
            if (Root) { throw '[SetRoot] Não é possível adicionar mais de uma rota como root.' }
            Root = true;
            Routes.push({ root: true, hash: '/', callBack });
            return this;
        }
    });

    // Obter array com rotas adicionadas e configuradas:
    RouterEngine.prototype.GetRoutes = function () {
        return Routes;
    };

    // Definir RenderEngine:
    RouterEngine.prototype.SetRenderEngine = function (object) {
        Render = object;
        return this;
    };

    // Definir Root:
    RouterEngine.prototype.SetRoot = function (callBack) {
        if (Root) { throw '[SetRoot] Não é possível adicionar mais de uma rota para o root.' }
        if (callBack == null) { throw '[SetRoot] Não é possível atribuir \'null\' como callBack do Root.'; }
        if (callBack == undefined) { throw '[SetRoot] Não é possível atribuir \'undefined\' como callBack do Root.'; }
        if (typeof callBack != 'function') { throw '[SetRoot] Somente funções podem serem atribuidas como callBack para o Root.'; }

        Root = true;
        Routes.push({ root: true, hash: '/', callBack });
        return this;
    };

    // Adicionar Hash para Roteamento:
    RouterEngine.prototype.Add = function (data, callBack) {
        if (typeof data === 'string') {
            let hash = this._trimSlashes(data);
            if (!hash) { throw '[Add] Informe qual \'hash\' você quer adicionar no mapeamento.'; }
            hash = hash == '' ? '/' : hash;
            if (this._routeExists(hash)) { throw '[Add] Não é possível adicionar hashs repetidas para mapeamento.'; }
            Routes.push({ hash, callBack });
        }
        else {

            if (!data) { throw '[Add] Objeto inválido.'; }

            data.hash = this._trimSlashes(data.hash);
            if (!data.hash) { throw '[Add] Informe qual \'hash\' você quer adicionar no mapeamento.'; }

            data.hash = data.hash == '' ? '/' : data.hash;
            if (this._routeExists(data.hash)) { throw '[Add] Não é possível adicionar hashs repetidas para mapeamento.'; }

            if (data.root) {
                if (Root) { throw '[Add] Não é possível adicionar mais de uma rota como root.' }
                Root = true;
            }

            Routes.push(data.callBack ? { ...data } : { ...data, callBack });
        }
        return this;
    };

    // Remover rota do roteamento:
    RouterEngine.prototype.Remove = function (hash) {
        hash = this._trimSlashes(hash);
        if (!hash) { throw '[Remove] Informe qual \'hash\' você quer remover do mapeamento.'; }
        if (!this._routeExists(hash)) { throw '[Remove] Não foi encontrado nenhuma rota mapeada usando essa hash.'; }
        const route = Routes.find(r => r.hash == hash);
        const index = Routes.indexOf(route);
        if (index) {
            if (route.root) { Root = false; }
            Routes.splice(index, 1);
        }
        return this;
    };

    // Definir/alterar callback de uma rota específica:
    RouterEngine.prototype.SetListener = function (hash, callBack) {
        hash = this._trimSlashes(hash);
        if (!hash) { throw '[SetListener] Informe para qual \'hash\' você quer definir o callBack.'; }
        if (!this._routeExists(hash)) { throw '[SetListener] Não foi encontrado nenhuma rota mapeada usando essa hash.'; }
        if (callBack == null) { throw '[SetListener] Não é possível atribuir \'null\' como callBack da rota.'; }
        if (callBack == undefined) { throw '[SetListener] Não é possível atribuir \'undefined\' como callBack da rota.'; }
        if (typeof callBack != 'function') { throw '[SetListener] Somente funções podem serem atribuidas como callBack para as rotas.'; }

        const route = Routes.find(R => R.hash == hash);
        route.callBack = callBack;
        return this;
    }

    // Remover callback de uma rota específica:
    RouterEngine.prototype.RemoveListener = function (hash) {
        if (!hash) { throw '[RemoveListener] Informe para qual \'hash\' você quer remover o callBack.'; }
        hash = this._trimSlashes(hash);
        if (!this._routeExists(hash)) { throw '[RemoveListener] Não foi encontrado nenhuma rota mapeada usando essa hash.'; }
        const route = Routes.find(R => R.hash == hash);
        route.callBack = null;
        return this;
    }

    // Definir/alterar o título de uma rota:
    RouterEngine.prototype.SetTitle = function (hash, title) {
        hash = this._trimSlashes(hash);
        if (!hash) { throw '[SetTitle] Informe para qual \'hash\' você quer definir o título.'; }
        if (!this._routeExists(hash)) { throw '[SetTitle] Não foi encontrado nenhuma rota mapeada usando essa hash.'; }
        const route = Routes.find(R => R.hash == hash);
        route['title'] = title || '';
        return this;
    };

    // Navegar para uma hash específica:
    RouterEngine.prototype.NavigateTo = function (hash) {
        hash = this._trimSlashes(hash);
        if (!hash) { throw '[NavigateTo] Informe para qual \'hash\' você quer redirecionar o usuário.'; }
        if (!this._routeExists(hash)) { throw '[NavigateTo] Não foi encontrado nenhuma rota mapeada usando essa hash.'; }
        window.location.hash = hash;
        return this;
    };

    // Iniciar Monitoramento:
    RouterEngine.prototype.Start = function () {
        if (Started) { console.warn('Roteamento já foi iniciado.'); return; } else { Started = true; }

        // Primeira Hash:
        this._routingMonitoring();

        // Iniciar:
        window.onhashchange = (e) => { this._routingMonitoring(); }

        return this;
    };

    // Parar Monitoramento:
    RouterEngine.prototype.Stop = function () {
        if (!Started) { console.warn('Roteamento está parado.'); return; } else { Started = false; }

        // Parar:
        window.onhashchange = null;

        return this;
    };

    // ------------------------------------------------------------------------------------------------------------------ //

    // Monitoramento do Roteamento:
    RouterEngine.prototype._routingMonitoring = async function () {

        const hash = this._getHash();
        const routeExists = this._routeExists(hash);

        // Caso a rota não exista:
        if (hash != '/' & !routeExists) {
            this._callNotFoundCallback(hash);
            return;
        }

        if (hash == '/' && !Root) { console.warn("Não foi definido um root para o roteamento."); }

        this._setTitle(hash);
        this._callOnChangeCallBack(hash);
        if (Render) { await this._renderPage(hash); } // Renderizar página se RenderEngine foi referenciado.
        this._callCallback(hash);

    };

    // Obter hash atual:
    RouterEngine.prototype._getHash = function () {
        let hash = window.location.hash.substr(1).replace(/(\?.*)$/, "");
        if (hash == '') { hash = '/' }
        return hash;
    };

    // Obter rota:
    RouterEngine.prototype._getRoute = function (hash) {
        const route = Routes.find(ROUTE => ROUTE.hash == hash);
        return route || null;
    };

    // Renderizar página com RenderEngine:
    RouterEngine.prototype._renderPage = async function (hash) {
        const route = this._getRoute(hash);
        if (Render) {
            if (route.path) {
                await Render.Page(route.path);
            }
        }
    };

    // Chamar evento de callback definida para a rota:
    RouterEngine.prototype._callCallback = function (hash) {

        const route = this._getRoute(hash);
        const parameters = this._getUrlParams();
        const details = { ...route, hash, parameters };

        if (typeof route.callBack === 'function') { route.callBack(details); }

    };

    // Chamar evento de callback definido para casos de Erro 404:
    RouterEngine.prototype._callNotFoundCallback = function (hash) {

        const parameters = this._getUrlParams();
        const details = { hash, parameters };

        if (typeof NotFoundCallBack === 'function') { NotFoundCallBack(details); }

    };

    // Chamar evento de escuta definido pelo desenvolvedor:
    RouterEngine.prototype._callOnChangeCallBack = function (hash) {

        const route = this._getRoute(hash);
        const parameters = this._getUrlParams();
        const details = { ...route, hash, parameters };

        // OnChange:
        if (OnChangeCallBack) { OnChangeCallBack(details); }

    };

    // Obter parâmetros recebidos pela URL:
    RouterEngine.prototype._getUrlParams = function () {
        let href = window.location.href;
        let index = href.indexOf('?');
        if (index == -1) { return null; }
        href = href.substr(index + 1, href.length);
        let parameters = href.split('&');
        var params = {};
        parameters.forEach(P => {
            const key = P.split('=')[0];
            const value = P.split('=')[1];
            params[key] = value;
        });
        return params;
    }

    // Definir título da página pela rota (se disponível):
    RouterEngine.prototype._setTitle = function (hash) {
        hash = this._trimSlashes(hash);
        const route = this._getRoute(hash);
        if (route) {
            const title = route.title;
            document.getElementsByTagName('title')[0].innerHTML = title || '';
        }
    };

    // Trim slashes for path
    RouterEngine.prototype._trimSlashes = function (path) {
        if (typeof path !== "string") { return ""; }
        path = path.toString().replace(/\/$/, "").replace(/^\//, "");
        return path == '' ? '/' : path;
    };


    // Verificar se existe uma hash mapeada para roteamento:
    RouterEngine.prototype._routeExists = function (hash) {
        const route = this._getRoute(hash);
        return route ? true : false;
    };

    // Requisição GET:
    RouterEngine.prototype._get = function (url) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open('GET', url, true);
            req.send(null);
            req.onload = () => {
                if (req.status == 404) {
                    reject(null);
                } else {
                    resolve(req.responseText);
                }
            }
            req.onerror = () => { reject(null); }
        });
    };

    return RouterEngine;

})));