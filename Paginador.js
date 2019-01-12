/*
    Para que o paginador funcione corretamente, é necessário que a tabela a ser paginada esteja dentro de uma div.
    Esta div deve ter um ID (target) que será usado para construir a paginação e os elementos auxiliáres

    O funcionamento do paginador se dá da seguinte forma:
        1 - Cria um clone oculto da tabela original
        2 - Limpa a tabela original
        3 - Define o número de páginas de acordo com o PageSize informado pelo usuário(pageSize padrão = 10)
        4 - Preenche a tabela original com as linhas do clone de acordo com a página selecionada(página padrão = 1)
        5 - Aplica efeito na exibição da tabela
*/

var _tamanhoDaPagina = 10;//corresponde ao número de linhas que será exibido por páginas
var _paginaAtual = 1;//corresponde a página que está atualmente selecionada
var _numeroDePaginas = 0;//corresponde a quantidade de páginas em que a tabela será exibida
var _efeito = 'visibility';//corresponde ao efeito que será aplicado para exibir as linhas possíveis = ['visibility', 'fade', '']


/**
 * função que é chamada para iniciar o paginador
 * @param {string} target
 * @param {number} pageSize
 * @param {number} pagina
 */
function iniciarPaginador(target, pageSize, pagina, efeito) {

    //remove a tabela clone, se existir
    $('#divTabelaClone' + target).remove();

    setPageSize(pageSize);
    setPaginaAtual(pagina);

    if (efeito) {
        _efeito = efeito;
    }

    criarDivs(target);
    montarDivPaginacao(target);

    $('#divTabelaClone' + target).append(clonarTabela($('#' + target).find('table').first()));

    //seta a primeira página
    setPagina(target, _paginaAtual);
}

/**
 * função que monta a div de paginação
 * @param {string} target
 */
function montarDivPaginacao(target) {

    _numeroDePaginas = definirNumeroDePaginas($('#' + target).find('table').first());

    //monta o html da ul de paginação
    var html = '';
    html += '<ul id="paginador' + target + '" class="pagination bootpag">';
    html += '<li onclick="setPagina(\'' + target + '\', ' + 1 + ',\'' +'visibility'+ '\')" class="first"><a href="javascript:void(0);"><span aria-hidden="true">←</span></a></li>';
    html += '<li onclick="paginaAnterior(\'' + target + '\')" class="prev"><a href="javascript:void(0);">«</a></li>';

    for (var i = 1; i <= _numeroDePaginas; i++) {
        html += '<li onclick="setPagina(\'' + target + '\', ' + i + ')"><a href="javascript:void(0);">' + i + '</a></li>';
    }

    html += '<li onclick="proximaPagina(\'' + target + '\')" class="next"><a href="javascript:void(0);">»</a></li>';
    html += '<li onclick="setPagina(\'' + target + '\', ' + _numeroDePaginas + ')" class="last"><a href="javascript:void(0);"><span aria-hidden="true">→</span></a></li>';
    html += '</ul>';

    //adiciona a ul e centraliza o conteúdo
    $("#divPaginacao" + target).html(html);
    $("#divPaginacao" + target).addClass("text-center");
}

/**
 * função que define a página a ser exibida
 * @param {string} target
 * @param {number} pagina
 */
function setPagina(target, pagina) {

    _paginaAtual = pagina;

    //limpa tabela original
    var tabelaOriginal = $('#' + target).find('> table').first();
    tabelaOriginal.find('tbody').html('');

    //recupera as linhas da tabela clone
    var rows = $('#divTabelaClone' + target).find('> table > tbody > tr').clone();

    //preenche a tabela original
    for (var i = 0; i < _tamanhoDaPagina; i++) {
        var item = rows[(_tamanhoDaPagina * (_paginaAtual - 1)) + i];
        tabelaOriginal.first('> tbody').append(item);
    }

    aplicarEfeito(target);
    adicionarClasses(target);
}


function aplicarEfeito(target) {
    var d = 0;
    var tabelaOriginal = $('#' + target).find('> table').first();

    tabelaOriginal.find('> tbody > tr').each(function (i, item) {

        if (_efeito === 'fade') {
            $(item).delay(d).hide().fadeIn(800);
            d += 60;
        }
        else if (_efeito === 'visibility') {
            $(item).delay(d).css('visibility', 'hidden').css({ opacity: 0, visibility: "visible" }).animate({ opacity: 1 }, 300);
            d += 30;
        }
        else {
            tabelaOriginal.find('> tbody >tr').hide().fadeIn('slow');
            return false;
        }
    });
}

/**
 * Função que é chamada para voltar a página anterior
 * @param {string} target
 */
function paginaAnterior(target) {
    if (_paginaAtual <= 1) {
        return false;
    }
    setPagina(target, (_paginaAtual - 1));
}

/**
 * Função que é chamada para passar para a próxima página
 * @param {any} target
 */
function proximaPagina(target) {
    if (_paginaAtual >= _numeroDePaginas) {
        return false;
    }
    setPagina(target, (_paginaAtual + 1));
}

/**
 * Função que define o numero total de páginas
 * @param {number} tabelaOriginal
 */
function definirNumeroDePaginas(tabelaOriginal) {
    return Math.ceil(tabelaOriginal.find('tbody > tr').length / _tamanhoDaPagina);
}

/**
 * Função faz um clone da tabela original
 * @param {element} tabelaOriginal
 * @returns {element}
 */
function clonarTabela(tabelaOriginal) {
    var clone = tabelaOriginal.clone();
    clone.attr("style", "display:none");

    return clone;
}

/**
 * Função que cria as divs que vão guardar o paginaor e a tabela clone
 * @param {string} target
 */
function criarDivs(target) {
    var divPaginacao = document.createElement("div");
    var divTabelaClone = document.createElement("div");

    divPaginacao.setAttribute("id", "divPaginacao" + target);
    divTabelaClone.setAttribute("id", "divTabelaClone" + target);

    $('#' + target).append(divTabelaClone);
    $('#' + target).append(divPaginacao);

}

/**
 * função que adiciona o css na ul do paginador
 * @param {string} target
 */
function adicionarClasses(target) {
    $('#paginador'+target+' > li').each(function (i, item) {

        var li = parseInt($(this).find('a').html());

        if (li == _paginaAtual) {
            $(this).addClass('active');
        }
        else {
            $(this).removeClass('active');
        }
    });
}

/**
 * Função que define o o valor da variável global _paginaAtual
 * @param {string} pagina
 */
function setPaginaAtual(pagina) {
    _paginaAtual = 1;

    if (pagina > 0) {
        _paginaAtual = pagina;
    }
    return _paginaAtual;
}

/**
 * Função que define o valor da variável global _tamanhoDaPagina
 * @param {string} pageSize
 */
function setPageSize(pageSize) {
    _tamanhoDaPagina = 10;

    if (pageSize > 0) {
        _tamanhoDaPagina = pageSize;
    }
    return _tamanhoDaPagina
}