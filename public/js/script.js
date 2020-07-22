(function () {
  // TODO: mvc to keep url, selected example, search text, and result in sync
  //		 +1 (david)
  var currentUrl = null;
  var currentNumber = 42;
  var currentType = "trivia";

  // TODO: This URL parsing stuff should be in shared_utils.js, and then we can
  //		 get rid of express routing
  var NUM_FROM_URL_REGEX = /(-?[0-9]+)(?:\/(-?[0-9]+))?/;
  function getNumFromUrl(url) {
    var matches = NUM_FROM_URL_REGEX.exec(url);
    if (!matches) return null;

    if (matches[2]) {
      // The number is a date, convert to day of year
      return utils.dateToDayOfYear(new Date(2004, matches[1] - 1, matches[2]));
    } else {
      return parseInt(matches[1], 10);
    }
  }

  function changeUrlToNum(url, num) {
    var matches = NUM_FROM_URL_REGEX.exec(url);
    var needle = NUM_FROM_URL_REGEX;
    if (!matches) {
      needle = "random";
    }

    if (url.match(/\/date/) || (matches && matches[2])) {
      // number is a day of year, so convert to date and into m/d notation
      var date = new Date(2004, 0);
      date.setDate(num);
      num = "" + (date.getMonth() + 1) + "/" + date.getDate();
    }
    return url.replace(needle, num);
  }

  function escapeForHtml(text) {
    return $("<div>").text(text).html();
  }

  // From http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
  function getParameterByName(query, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(query);
    if (results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function processWidgetText(text) {
    var htmlEscaped = escapeForHtml(text);

    htmlEscaped = htmlEscaped.replace(/\^{(.*?)}/g, "<sup>$1</sup>");
    htmlEscaped = htmlEscaped.replace(/\_{(.*?)}/g, "<sub>$1</sub>");

    return htmlEscaped;
  }

  function setSandboxResult(html, scriptStyle) {
    var $text = $("#result-temporary-text");
    $text
      .css({
        opacity: 0,
        top: "50%",
        marginTop: 0,
      })
      .html(html)
      .toggleClass("script", scriptStyle);

    $text.css("marginTop", $text.height() / -2); // vertically centered (top 50% + abs position)

    // TODO: buggy lionbars or something
    //if ($text.height() < $('#search-result').height()) {
    //$text.css('marginTop', $text.height() / -2);  // vertically centered (top 50% + abs position)
    //} else { // handle text overflow
    //// TODO: fix right padding before scrollbar
    //$text
    //.css({'padding-top': 10, 'padding-bottom': 10, 'top': 0});
    //}

    $text.animate({ opacity: 1.0 }, 300);
    // TODO: this crap is buggy
    //$('#search-result.scroll').lionbars();
  }

  function update_result(url, $result) {
    $.ajax({
      url: url,
      dataType: "text",
      success: function (data, httpStatus, xhr) {
        var contentType = xhr.getResponseHeader("Content-Type");
        if (contentType.indexOf("text/html") !== -1) {
          return;
        }

        if (contentType.indexOf("text/plain") !== -1) {
          data = processWidgetText(data);
        }

        setSandboxResult(data, contentType.indexOf("text/plain") === -1);

        currentNumber = xhr.getResponseHeader("X-Numbers-API-Number");
        $("#counter").counter(
          "set",
          currentNumber,
          /* dontTriggerEvent */ true
        );
        currentType = xhr.getResponseHeader("X-Numbers-API-Type");
        update_add_fact(currentNumber, currentType, false);

        $result.removeClass("error");
      },
      error: function () {
        setSandboxResult(
          "Uh oh, we don't understand that URL :( <br>" +
            'Maybe read the <a href="#api">API docs</a> below?',
          false
        );
        $result.addClass("error");
      },
    });
  }

  function update_query(url) {
    if ($("#search-text").val() !== url) {
      $("#search-text").val(url);
    }
    $("#search-link").prop("href", url);
    update_result(url, $("#search-result"));
  }

  function update_history(hash) {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, null, "#" + hash);
    } else {
      window.location.hash = hash;
    }
  }

  function update_counter(url) {
    $("#counter").counter("set", getNumFromUrl(url), false);
  }

  function update_all(url, force) {
    if (currentUrl === url && !force) return;
    currentUrl = url;
    update_history(url);
    update_query(url);
  }

  function switchTagline() {
    $("#tagline")
      .css("opacity", 0)
      .html(utils.randomChoice($("#tagline-alternates li")).innerHTML)
      .animate({ opacity: 1.0 }, 1000);
  }

  function updateAllFromHash() {
    var hash = window.location.hash;
    hash = hash && hash.substr(1);

    // Only update from hash if the hash is not a page ID (an anchor)
    if (
      hash &&
      $("*[id]").filter(function () {
        return this.id === hash;
      }).length === 0
    ) {
      update_all(hash);
    }
  }

  function registerUpdateShareMessage() {
    addthis.addEventListener("addthis.ready", function (event) {
      setTimeout(function () {
        var numShares = $(".addthis_button_expanded").text();
        if (numShares.length < 1) return;

        var path = numShares + "?fragment&notfound=floor";
        var url = "http://numbersapi.com/" + path;
        $.get(url, function (data) {
          $(".visit-text")
            .prop("title", "Generated using " + url)
            .find("a")
            .text("This page has been shared more times than " + data + ".")
            .prop("href", "#" + path);
        });
      }, 3000);
    });
  }

  var ADD_FACT_FADE_TIME = 100;

  function update_add_fact(number, type, addMode) {
    $("#add-fact-prefix").text(utils.getStandalonePrefix(number, type) + "...");
    $label = $("#add-fact-label");
    if (addMode) {
      $label.text("Submit " + type + " fact " + " for " + number + "!");
      $("#add-fact-area").fadeIn(ADD_FACT_FADE_TIME);
      $("#result-temporary-text").fadeOut(ADD_FACT_FADE_TIME);
    } else {
      $label.text("+ Add a " + type + " fact " + " for " + number);
      $("#add-fact-area").fadeOut(ADD_FACT_FADE_TIME);
      $("#result-temporary-text").fadeIn(ADD_FACT_FADE_TIME);
    }
  }

  function registerAddFactUi() {
    $("#add-fact-label")
      .show()
      .click(function (event) {
        $("#add-fact-label").text().indexOf("ubmit") === -1
          ? showAddFactText(event)
          : submitFact(event);
        event.preventDefault();
      });

    $("#add-fact-text")
      .focus(function () {
        $(this).parent().addClass("focused");
      })
      .blur(function () {
        $(this).parent().removeClass("focused");
      });

    $("#add-fact-prefix").click(function () {
      $("#add-fact-text").focus();
    });
  }

  function showAddFactText(event) {
    update_add_fact(currentNumber, currentType, true);
    $("#add-fact-area").find("#add-fact-text").val("").focus();
  }

  function submitFact(event) {
    $("#add-fact-label")
      .text("Submitting...")
      .prop("disabled", true)
      .prop("href", null);

    $.post(
      "/submit",
      {
        text: $("#add-fact-text").val(),
        number: currentNumber,
        type: currentType,
      },
      function () {
        $("#add-fact-area").fadeOut(ADD_FACT_FADE_TIME);
        $("#add-fact-label").prop("disabled", false).prop("href", "#");
        $("#result-temporary-text").show();
        setSandboxResult(
          "Thank you for your contribution! We'll add your fact as soon as we review it.",
          false
        );
        update_add_fact(currentNumber, currentType, false);
      }
    );
  }

  ////////////////////////////////////////////////////////////////////////////////

  // Main execution: what gets executed on DOM ready
  $(function () {
    // Randomly pick a tagline to use
    setInterval(switchTagline, 30 * 1000);

    // Initialize rolling counter widget
    $("#counter")
      .counter({
        digitWidth: 32,
        digitHeight: 46,
        numDigits: 4,
        showSides: false,
      })
      .bind("counterChanged", function (event, newVal) {
        update_all(changeUrlToNum(window.location.hash.substr(1), newVal));
      })
      .find(".counter-container-inner")
      .click(function (event) {
        update_all($("#search-text").val(), /* force */ true);
      })
      .mousewheel(function (event, delta) {
        $("#counter").counter(delta > 0 ? "increment" : "decrement");
        event.preventDefault();
      });

    // Load the examples using the api backend. Don't to reduce load.
    //$('.example').each(function(index, element) {
    //var $div = $(element).find('.example-box');
    //var href = $div.find('a').attr('href');
    //update_result(href, $div.find('.api-result'));
    //});

    // Listen for hash changes to keep UI in sync and on page load as well
    // TODO: The leading dot check is a hack to prevent addThis hash tags
    $(window).on("hashchange", updateAllFromHash);
    if (!window.location.hash || window.location.hash[1] === ".") {
      update_history("42");
    }
    setTimeout(updateAllFromHash, 0);

    var $prev_selected = undefined;
    $("#search-examples a").click(function (e) {
      e.stopPropagation();

      var $this = $(this);
      var hash = $this.attr("href");
      hash = hash.substring(1, hash.length);
      if ($prev_selected) {
        $prev_selected.removeClass("selected");
      }
      var $parent = $this.parent();
      $parent.addClass("selected");
      $("#search-text").val(hash);

      update_all(hash, /* force */ true);

      $prev_selected = $parent;
    });

    var $prev_selected = undefined;
    // Note: Using keydown instead of keypress to catch arrow key events
    $("#search-text")
      .keydown(function (e) {
        var code = e.keyCode || e.which;
        if (code == 13) {
          // enter
          update_all($(this).val(), /* force */ true);
        } else if (code === 38) {
          // up arrow
          $("#counter").counter("increment");
          e.preventDefault();
        } else if (code === 40) {
          // down arrow
          $("#counter").counter("decrement");
          e.preventDefault();
        }
      })
      .change(function (e) {
        $("#search-link").prop("href", $(this).val());
      });

    // initialize custom scroll bars for facts that overflow container
    $(".scroll").lionbars();

    registerUpdateShareMessage();

    registerAddFactUi();
  });
})();
