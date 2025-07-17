// DEPRECATED: Этот файл больше не используется. Новый content-script: src/executable/AltWhatcher/altWatcher.js
// Оставлен для референса.
// ==UserScript==
// @name         Alt Watcher v2
// @namespace    https://vk.com/shiki_ex
// @version      2.1.5
// @description  [shikimori.org] Добавляет ссылку на Альтернативные сайты просмотра аниме ###
// @author       STorn
// @match https://shikimori.org/*
// @match http://shikimori.org/*
// @match https://shikimori.one/*
// @match http://shikimori.one/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// @license      MIT
// @copyright    2018, Newt300 (https://openuserjs.org/users/Newt300)
// ==/UserScript==

// url, name, allowed page types bitmap(0 - blocked, 1 - hentai)
var selections = [
    ["https://smotret-anime.ru/catalog/search?q=", "Anime 365", 1],
    ["https://hentai365.ru/catalog/search?q=", "Hentai 365", 2],
    ["https://vk.com/video?q=", "VK", 3],
    ["https://sovetromantica.com/anime?query=", "SR", 1],
    ["https://online.anidub.com/index.php?do=search&subaction=search&search_start=1&full_search=0&result_from=1&story=", "AniDub", 1],
    ["https://video.sibnet.ru/search.php?panel=open&sortby=0&duration=0&inname=1&text=", "Sibnet", 3],
    ["http://www.animespirit.ru/index.php?do=search&story=", "animespirit", 1],
    ["http://desu.me/search/555/?o=date&c[title_only]=1&c[node]=20+22+21&q=", "Desu.me", 1]
];

var $ = jQuery.noConflict(true);

function getPrefService(pageType) {
    var matches = document.cookie.match(new RegExp('(?:^|; )altWatcherPrefServiceFor' + pageType + '=([^;]*)'));
    if (matches) {
        matches = decodeURIComponent(matches[1]);
        matches = selections.find(function (it) {
            return it[1] == matches;
        });
        if (matches && matches[2] & pageType) return matches;
    }

    for (var i = 0, v = selections[i]; i < selections.length; v = selections[++i])
        if ((v[2] & pageType) != 0)
            return v;

    return selections[0];
}

function setPrefService(pageType, value) {
    var d = new Date();
    d.setTime(d.getTime() + 666 * 1000);
    document.cookie = "altWatcherPrefServiceFor" + pageType + "=" + encodeURIComponent(value) + "; path=/; expires=" + d.toUTCString();
}

function getAltWatcherLanguage() {
    var matches = document.cookie.match(new RegExp('(?:^|; )altWatcherLanguage=([^;]*)'));
    if (matches) {
        matches = decodeURIComponent(matches[1]);
        return matches;
    }
    return "en";
}

function setAltWatcherLanguage(value) {
    var d = new Date();
    d.setTime(d.getTime() + 666 * 1000);
    document.cookie = "altWatcherLanguage=" + encodeURIComponent(value) + "; path=/; expires=" + d.toUTCString();
}

function start() {
    // if (window.location.pathname.indexOf("animes") && ($(".disabled").length || !$(".watch-online-placeholer").children().length)) {
    let lang = getAltWatcherLanguage();
    var animeName = $("#animes_show > section > div > header > h1").text().split(" / ")[lang === "en" ? 1 : 0],
        link = $('<a target="_blank"/>'),
        bar = $('<div/>'),
        pageType = (!!$('a.b-tag[href*="genre/12"]').length + 1),
        barItemClicked = function () {
            let lang = getAltWatcherLanguage();
            let animeName = $("#animes_show > section > div > header > h1").text().split(" / ")[lang === "en" ? 1 : 0];
            var i = selections[$(this).data('service-index')];
            link.attr('href', i[0] + encodeURIComponent(animeName)).text('Смотреть на ' + i[1]);
            setPrefService(pageType, i[1]);
            bar.hide();
        };

    for (var i = 0; i < selections.length; i++) {
        var v = selections[i];
        if ((v[2] & pageType) != 0)
            bar.append($('<a/>').addClass('b-link_button dark watch-online').text(v[1]).data('service-index', i).click(barItemClicked));
    }

    let en = $('<a>').addClass(lang === "en" ? "b-link_button dark" : "b-link_button").text('en').attr('title', "Искать по английскому названию").css({ minWidth: 0 });
    let ru = $('<a>').addClass(lang === "ru" ? "b-link_button dark" : "b-link_button").text('ru').attr('title', "Искать по русскому названию").css({ minWidth: 0 });
    let table = $('<table width="100%"/>').append($('<tr/>')
        .append($('<td/>').append(ru.click(function () {
            ru.addClass("dark")
            en.removeClass("dark")
            setAltWatcherLanguage("ru")
            start();
        })))
        .append($('<td/>').append(en.click(function () {
            en.addClass("dark")
            ru.removeClass("dark")
            setAltWatcherLanguage("en")
            start();
        }))));

    bar.append($('<div/>').addClass('block watch-online').css({ top: "5px" }).append(table));


    i = getPrefService(pageType);
    $('#altWatcher_userscript').remove();
    $('#altWatcher_userscript_block').remove();
    $("#animes_show > section > div:nth-child(1) > div.menu-slide-outer.x199 > div > div > div.block > div.b-db_entry > div.c-about > div > div.c-info-right").append(
        $('<div/>').css({ 'textAlign': 'center' }).attr('id', 'altWatcher_userscript').append(
            $('<div/>').css({ display: 'inline-flex' }).append(
                link.addClass("b-link_button dark")
                    .attr('href', i[0] + encodeURIComponent(animeName)).text('Смотреть на ' + i[1])
            ).append(
                $('<a/>').addClass("b-link_button dark").text('▼').css({
                    minWidth: 0,
                    marginBottom: '10px'
                }).click(function () {
                    bar.toggle();
                })
            )
        )
            .append(bar.addClass('block').css({ marginBottom: 0 }).attr('id', 'altWatcher_userscript_block').hide())
            .append($('<br/>'))
            .append(
                $('<a/>')
                    .attr('target', '_blank')
                    .attr('href', 'https://chrome.google.com/webstore/detail/shiki-extender/omonjfjfonodikianjjfdcdodjndnffe')
                    .text('Больше возможностей')
            )
    );

}

$(document).ready(start);
$(document).on('page:load', start);
$(document).on('turbolinks:load', start);
