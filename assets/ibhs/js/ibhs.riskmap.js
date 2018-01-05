;
(function ($) {
  "use strict";

  $.fn.ibhsRiskMap = function (opts) {
    if (!opts) {
      throw new Error('ibhs.riskmap requires a defined options.api domain')
    } else if ('string' == typeof opts) {
      opts = {api: opts}
    }

    var pendingRequest,
      domain = opts.api,
      riskMap = $.extend({
        "earthquake": 275,
        "flood": 235,
        "freeze": 236,
        "hail": 234,
        "wind": 237,
        "high_wind": 237,
        "hurricane": 238,
        "tornado": 240,
        "water": 243,
        "wildfire": 242,
        "plumbing": 243,
        "maintenance": 243,
        "thunderstorm": 239,
        "thunderstorms": 239,
      }, opts.riskDefinitions),
      mapOptions = $.extend({
        map: 'usa_en',
        backgroundColor: null,
        color: '#0d2240',
        hoverColor: '#1C94B3',
        selectedColor: '#1C94B3',
        enableZoom: false,
        showTooltip: true,
        selectedRegion: ''
      }, opts.mapOptions)

    return this.each(function (i, element) {
      $(element)
        .vectorMap(mapOptions)

      $(element)
        .bind('regionClick.jqvmap', onRegionClick)
        //.bind('regionOver.jqvmap', onRegionOver)

      $('#ibhs-riskmap-submit')
        .on('click', onZipcodeSearch)


      $('.ibhs-riskmap-reset')
        .on('click', clearActive)


      //$('#risk-zipcode')
      //  .on('keyup', onZipcodeSearch)
    })

    function isMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            return true;
        } else {
            return false;
        }
    }

    function doQuery(uri, identifier) {
      clearActive()
      if (pendingRequest) {
        pendingRequest.xhr.abort()
      }

      pendingRequest = {
        identifier: identifier
      }

      $('.ibhs-riskmap-busy')
        .addClass('risk-active')

      pendingRequest.xhr = $.ajax({
        method: 'GET',
        url: domain + uri,
        dataType: 'json',
        success: onRegionResult,
        error: onRegionError
      })
    }

    function onZipcodeSearch(event) {
      var value = $('#ibhs-riskmap-zipcode').val()
      if (value && value.length == 5) {
        if (pendingRequest && pendingRequest.identifier == value) {
          return
        }
        doQuery('/disastersafety/risks/zipcode/' + value, value)
      }
    }

    function onRegionClick(event, regionCode, regionName) {

        // execute on non-mobile
       // if (!isMobile()) {
            if (pendingRequest && pendingRequest.identifier == regionCode) {
                return
            }
            doQuery('/disastersafety/risks/region/' + regionCode, regionCode)
        //}// if
    }

    function onRegionOver(event, regionCode, regionName) {

        // execute on mobile
        if (isMobile()) {
            if (pendingRequest && pendingRequest.identifier == regionCode) {
                return
            }
            doQuery('/disastersafety/risks/region/' + regionCode, regionCode)
        }// if
    }

    function clearActive() {
      $('.ibhs-riskmap-risk')
        .removeClass('risk-active')
        .addClass('risk-inactive')

      $('.ibhs-riskmap-result-success')
        .removeClass('risk-active')
    }

    function onRegionResult(response) {
      $('.ibhs-riskmap-result-success')
        .addClass('risk-active')

      $('.ibhs-riskmap-busy')
        .removeClass('risk-active')

      $.each(response.risks, function (i, risk) {
        $('.' + riskMap[risk])
          .removeClass('risk-inactive')
          .addClass('risk-active')
      })
      pendingRequest = undefined
    }

    function onRegionError(err) {
      $('.ibhs-riskmap-busy')
        .removeClass('risk-active')

      pendingRequest = undefined
    }

  }

}(jQuery));


