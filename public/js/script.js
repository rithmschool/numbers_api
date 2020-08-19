(function () {
  // TODO: mvc to keep url, selected example, search text, and result in sync
  //		 +1 (david)
  let currentUrl = null;
  let currentNumber = 42;
  let currentType = "trivia";

  function escapeForHtml(text) {
    return $("<div>").text(text).html();
  }

  // From http://stackoverflow.com/questions/901115/get-query-string-values-in-javascript
  function getParameterByName(query, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    const regexS = `[\\?&]${name}=([^&#]*)`;
    const regex = new RegExp(regexS);
    const results = regex.exec(query);
    if (results == null) return "";
    else return decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  function processWidgetText(text) {
    let htmlEscaped = escapeForHtml(text);

    htmlEscaped = htmlEscaped.replace(/\^{(.*?)}/g, "<sup>$1</sup>");
    htmlEscaped = htmlEscaped.replace(/\_{(.*?)}/g, "<sub>$1</sub>");

    return htmlEscaped;
  }

  function setSandboxResult(html, scriptStyle) {
    let $text = $("#result-temporary-text");
    $text
      .css({
        opacity: 0,
        top: "50%",
        marginTop: 0,
      })
      .html(html)
      .toggleClass("script", scriptStyle);

    if ($text.height() < $("#search-result").height()) {
      // vertically centered (top 50% + abs position)
      $text.css("marginTop", $text.height() / -2);
    } else {
      // handle text overflow
      $text.css({ "padding-top": 10, "padding-bottom": 10, top: 0 });
    }

    $text.animate({ opacity: 1.0 }, 300);
    // add scrollbars if the search result text overflows
    $("#search-result").css("overflow", "auto");
  }

  function update_result(url, $result) {
    $.ajax({
      url: url,
      dataType: "text",
      success: function (data, httpStatus, xhr) {
        const contentType = xhr.getResponseHeader("Content-Type");
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
    $("#counter").counter("set", utils.getNumFromUrl(url), false);
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
    let hash = window.location.hash;
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
        const numShares = $(".addthis_button_expanded").text();
        if (numShares.length < 1) return;

        const path = `${numShares}?fragment&notfound=floor`;
        const url = `http://numbersapi.com/${path}`;
        $.get(url, function (data) {
          $(".visit-text")
            .prop("title", `Generated using ${url}`)
            .find("a")
            .text(`This page has been shared more times than ${data}.`)
            .prop("href", `#${path}`);
        });
      }, 3000);
    });
  }

  const ADD_FACT_FADE_TIME = 100;

  function update_add_fact(number, type, addMode) {
    $("#add-fact-prefix").text(utils.getStandalonePrefix(number, type) + "...");
    let $label = $("#add-fact-label");
    if (addMode) {
      $label.text(`Submit ${type} fact for ${number}!`);
      $("#add-fact-area").fadeIn(ADD_FACT_FADE_TIME);
      $("#result-temporary-text").fadeOut(ADD_FACT_FADE_TIME);
    } else {
      $label.text(`+ Add a ${type} fact for ${number}`);
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
        update_all(
          utils.changeUrlToNum(window.location.hash.substr(1), newVal)
        );
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

    let $prev_selected = undefined;
    $("#search-examples a").click(function (e) {
      e.stopPropagation();

      const $this = $(this);
      let hash = $this.attr("href");
      hash = hash.substring(1, hash.length);
      if ($prev_selected) {
        $prev_selected.removeClass("selected");
      }
      let $parent = $this.parent();
      $parent.addClass("selected");
      $("#search-text").val(hash);

      update_all(hash, /* force */ true);

      $prev_selected = $parent;
    });

    $prev_selected = undefined;
    // Note: Using keydown instead of keypress to catch arrow key events
    $("#search-text")
      .keydown(function (e) {
        const code = e.keyCode || e.which;
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

    // initialize scroll bars for facts that overflow container
    $(".scroll").css("overflow", "auto");

    registerUpdateShareMessage();

    registerAddFactUi();
  });
})();
