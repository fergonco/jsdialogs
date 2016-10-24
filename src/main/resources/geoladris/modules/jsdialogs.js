define([ "message-bus", "jquery" ], function(bus, $) {
   var uniqueId = 0;

   function show(id, options, question) {
      var overlay = $("<div/>").appendTo("body")//
      .attr("id", "jsdialogs-overlay" + id)//
      .attr("class", "jsdialogs-modal-overlay")//
      .css("text-align", "center");

      function close() {
         overlay.remove();
         if (options.closeAction) {
            options.closeAction();
         }
         $(document).unbind("keydown.close");
      }

      var message = options.div ? $("#" + options.div) : $("<div/>").attr("id", "jsdialogs-message" + id);

      message.appendTo(overlay)//
      .attr("class", "jsdialogs-modal-message")//
      .css("display", "inline-block");

      if (options.message) {
         message.html(options.message);
      }

      $("<br/>").appendTo(message);

      var txtId = "jsdialogs-text-" + id;
      if (question == "text") {
         var value = options.initialValue ? options.initialValue : "";
         $("<input/>").appendTo(message)//
         .attr("id", txtId).val(value)//
         .focus()//
         .select();
      } else if (question == "choice") {
         for (var i = 0; i < options.choices.length; i++) {
            var choiceDiv = $("<div/>").appendTo(message);

            var radioId = "radio-" + txtId + "-" + i;

            var radioButton = $("<input/>").appendTo(choiceDiv)//
            .attr("type", "radio")//
            .css("vertical-align", "middle")//
            .attr("name", "radio-" + txtId)//
            .attr("id", radioId)//
            .val(options.choices[i]);
            if (i == 0) {
               radioButton.attr('checked', 'checked');
            }

            $("<label/>")//
            .html(options.choices[i])//
            .attr("for", radioId)//
            .appendTo(choiceDiv);
         }
      }

      $("<br/>").appendTo(message);

      $("<span>").appendTo(message)//
      .attr("class", "jsdialogs-button")//
      .html("ok")//
      .on("click", function() {
         var answer = null;
         if (question == "text") {
            answer = $("#" + txtId).val();
         } else if (question == "choice") {
            answer = $("input[name=" + ("radio-" + txtId) + "]:checked", message).val();
         }
         options.okAction(answer);
         close();
      });

      $("<span>").appendTo(message)//
      .attr("class", "jsdialogs-button")//
      .html("Cancelar")//
      .on("click", function() {
         close();
      });

      $(document).on("keydown.close", function(e) {
         if (e.keyCode == 27) {
            close();
         }
      });
   }

   bus.listen("jsdialogs.confirm", function(e, options) {
      show(uniqueId++, options);
   });

   bus.listen("jsdialogs.message", function(e, options) {
      show(uniqueId++, options);
   });

   bus.listen("jsdialogs.question", function(e, options) {
      show(uniqueId++, options, "text");
   });

   bus.listen("jsdialogs.choiceQuestion", function(e, options) {
      show(uniqueId++, options, "choice");
   });
});
