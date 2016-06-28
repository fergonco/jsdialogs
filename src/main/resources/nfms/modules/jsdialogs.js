define([ "message-bus", "jquery" ], function(bus, $) {
   var uniqueId = 0;

   bus.send("jsdialogs.confirm", [ {
      "message" : "Are you sure you want to remove?",
      "okAction" : function() {
         remove(d);
      }
   } ]);

   function show(id, options) {
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

      var message = $("<div/>").appendTo(overlay)//
      .attr("id", "jsdialogs-message" + id)//
      .attr("class", "jsdialogs-modal-message")//
      .css("display", "inline-block")//
      .html(options.message);

      $("<br/>").appendTo(message);

      $("<span>").appendTo(message)//
      .attr("class", "jsdialogs-button")//
      .html("ok")//
      .on("click", function() {
         close();
         options.okAction();
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
});
