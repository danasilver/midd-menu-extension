/**
 * Middlebury Menu
 * v0.1.2
 *
 * Copyright 2014 Dana Silver <dsilver@middlebury.edu>
 * Released under the MIT License.
 */

(function($, moment, document) {
  var $pricesContext = $('.view-header')
    , $menuContext = $('.views-exposed-form')
    , $dateInputWrapper = $('#edit-field-day-value-wrapper', $menuContext)
    , $dateInput = $dateInputWrapper.find('input')
    , $applyBtnWrapper = $('.views-submit-button', $menuContext)
    , $applyBtn = $applyBtnWrapper.find('input')

    // The date currently displayed
    , webDate = $dateInput.val()
    , webDateFormat = 'dddd, MMMM D, YYYY'

  ////////////////////////////////
  //// Style existing menu buttons
  ////////////////////////////////

  // Force relative positioning on the form wrapper
  // so the previous and next date buttons
  // can be positioned absolutely
  $menuContext
    .css('position', 'relative')

  // Remove excess width on the wrapper around the inputs
  $menuContext
    .find('.views-exposed-widgets')
      .css('width', '225px')
      .css('margin', 'auto')

  // Remove padding on the div wrapping the date input
  $dateInputWrapper
    .css('padding', '0')
    .css('width', '100%')

  // Set the width for all input elements to 100%
  // so the final text takes the full space
  $dateInputWrapper.find('*').css('width', '100%')

  // Hide the real input and wrap it in a div.
  // The wrapping div contains the displayed text
  // so the hidden input can hold the YYYY-MM-DD value
  // that jQuery UI Datepicker uses.
  $dateInput
    .css('position', 'absolute')
    .css('left', '0')
    .css('right', '0')
    .css('max-width', '100%')
    .css('opacity', '0')
    .attr('type', 'button')
    .wrap('<div id="dateInputWrapper"></div>')

  $dateInputWrapper.find('#dateInputWrapper')
    .css('position', 'relative')
    .css('margin', 'auto')
    .css('max-width', '100%')
    .css('outline', 'none')
    .css('border', 'none')
    .css('text-align', 'center')
    .css('font-size', '24px')
    .css('border-bottom', '#333 dashed 1px')
    .css('background-color', 'rgba(0, 0, 0, 0)')
    .css('cursor', 'pointer')
    .prepend('<span id="dateInputText">'
            + moment(webDate, webDateFormat).format('ddd, MMMM D')
            + '</span>')

  // Hide the default apply button
  $applyBtnWrapper
    .css('display', 'none')

  // Hide the visitor prices
  $pricesContext
    .css('display', 'none')

  //////////////////////////////////////////
  //// Create previous and next date buttons
  //////////////////////////////////////////

  var
      // The base URL for a custom day's menu
      baseURL = 'http://menus.middlebury.edu?field_day_value[value][date]='

      // Get a 'moment' (http://momentjs.com/)
      // for the previous and next days
    , menuPrevMoment = moment(webDate, webDateFormat).subtract('days', 1)
    , menuNextMoment = moment(webDate, webDateFormat).add('days', 1)

    // Create a base element for the buttons
    , $baseElem = $('<a></a>')
        .css('position', 'absolute')
        .css('top', '16px')
        .css('color', '#333')
        .css('background-color', 'rgba(0, 0, 0, 0)')
        .css('text-decoration', 'none')
        .css('border-bottom', '1px #333 dashed')

    // Create the actual previous and next date buttons
    // Clone the base element so it isn't affected for the 2nd button
    , $menuPrevElem = $baseElem.clone()
        .attr('href', baseURL + menuPrevMoment.format(webDateFormat))
        .text(menuPrevMoment.format('MMMM D'))
        .css('left', '0')

    , $menuNextElem = $baseElem.clone()
        .attr('href', baseURL + menuNextMoment.format(webDateFormat))
        .text(menuNextMoment.format('MMMM D'))
        .css('right', '0')

  $menuContext
    .prepend($menuPrevElem)
    .append($menuNextElem)

  ///////////////////////////////////////////
  //// Handle clicks on the menu popup widget
  ///////////////////////////////////////////

  // These vars will be set when the date input is clicked.
  var $calendar
    , $month
    , $year

  $dateInput.on('click', function() {

    // The datepicker widget does not exist until the date input
    // is clicked. 100ms timeout to wait for the datepicker js
    // to execute and build the widget.
    setTimeout(function() {
      cacheCalendarSelectors()
      bindCalendarHeaderEvents()
      bindCalendarEvents()
    }, 100)
  })

  function cacheCalendarSelectors() {

    // Cache jQuery selectors for the calendar elements.
    $calendar = $('#ui-datepicker-div')
    $month = $('.ui-datepicker-month', $calendar)
    $year = $('.ui-datepicker-year', $calendar)
  }

  function bindCalendarHeaderEvents() {

    // Every time a header button is clicked, the calendar elements
    // (including the header) are unbound, so rebind all the events.
    $month
      .add($year)
      .add($('.ui-datepicker-next, .ui-datepicker-prev', $calendar))
      .on('change click', function() {
        setTimeout(function() {
          cacheCalendarSelectors()
          bindCalendarHeaderEvents()
          bindCalendarEvents()
        }, 100)
      })
  }

  function bindCalendarEvents() {
    $('#ui-datepicker-div tbody a').on('click', function(e) {

      // Get the month, year, and day as strings when
      // a date is clicked in the calendar widget
      var month = parseInt($month.val()) + 1 + ''
        , year = $year.val()
        , day = $(this).text()

        , selectedDateMoment = moment(year + '-' + month + '-' + day, 'YYYY-M-D')

      // The page replaces the date input value to a YYYY-MM-DD
      // value. If $dateInput value is set too soon, the page
      // will overwrite the extension's change.
      setTimeout(function() {
        $('#dateInputText', $calendar).val(selectedDateMoment.format('ddd, MMMM D'))
      }, 5)

      // If the selected date is the same as the current page date,
      // don't reload the page.
      if (selectedDateMoment.format('YYYY-MM-DD') !== webDate) {
        window.location.href = baseURL + selectedDateMoment.format(webDateFormat)
      }

    })
  }


})(jQuery, moment, document)
