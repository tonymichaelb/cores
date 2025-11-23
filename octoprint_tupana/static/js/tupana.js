$(function() {
    function TupanaViewModel(parameters) {
        var self = this;

        self.settings = parameters[0];
        self.loginState = parameters[1];

        // Array de cores com seus comandos M182
        self.colors = ko.observableArray([
            {name: "Cor 1", command: "M182 A100 B0 C0", color: "#FF0000"},
            {name: "Cor 2", command: "M182 A0 B100 C0", color: "#00FF00"},
            {name: "Cor 3", command: "M182 A0 B0 C100", color: "#0000FF"},
            {name: "Cor 4", command: "M182 A20 B10 C70", color: "#3319B3"},
            {name: "Cor 5", command: "M182 A70 B10 C20", color: "#B31933"},
            {name: "Cor 6", command: "M182 A70 B20 C10", color: "#B33319"},
            {name: "Cor 7", command: "M182 A90 B0 C10", color: "#E60019"},
            {name: "Cor 8", command: "M182 A40 B0 C60", color: "#660099"},
            {name: "Cor 9", command: "M182 A15 B0 C85", color: "#2600D9"},
            {name: "Cor 10", command: "M182 A20 B10 C70", color: "#3319B3"},
            {name: "Cor 11", command: "M182 A0 B40 C60", color: "#006699"},
            {name: "Cor 12", command: "M182 A0 B25 C75", color: "#0040BF"},
            {name: "Cor 13", command: "M182 A10 B80 C10", color: "#19CC19"},
            {name: "Cor 14", command: "M182 A50 B50 C0", color: "#808000"},
            {name: "Cor 15", command: "M182 A80 B0 C20", color: "#CC0033"},
            {name: "Cor 16", command: "M182 A33 B33 C34", color: "#545557"},
            {name: "Cor 17", command: "M182 A40 B20 C40", color: "#663366"},
            {name: "Cor 18", command: "M182 A85 B0 C15", color: "#D90026"},
            {name: "Cor 19", command: "M182 A20 B10 C70", color: "#3319B3"}
        ]);

        // Status message
        self.statusMessage = ko.observable("");
        self.statusClass = ko.observable("");

        // Enviar comando de cor para a impressora
        self.sendColor = function(colorData) {
            console.log("sendColor chamado com:", colorData);
            
            // colorData vem direto do array, não são observables
            var colorName = colorData.name;
            var gcodeCommand = colorData.command;
            
            console.log("Nome da cor:", colorName);
            console.log("Comando M182:", gcodeCommand);
            
            if (!self.loginState.isUser()) {
                new PNotify({
                    title: "Tupana",
                    text: "Você precisa estar logado para enviar comandos!",
                    type: "error",
                    hide: true
                });
                return;
            }
            
            $.ajax({
                url: API_BASEURL + "api/plugin/tupana",
                type: "POST",
                dataType: "json",
                contentType: "application/json; charset=UTF-8",
                headers: {
                    "X-Api-Key": UI_API_KEY
                },
                data: JSON.stringify({
                    command: "send_color",
                    gcode: gcodeCommand
                }),
                success: function(response) {
                    console.log("Resposta:", response);
                    if (response.success) {
                        self.statusMessage(colorName + " enviada: " + gcodeCommand);
                        self.statusClass("alert-success");
                        
                        new PNotify({
                            title: "Tupana",
                            text: colorName + " aplicada: " + gcodeCommand,
                            type: "success",
                            hide: true
                        });

                        setTimeout(function() {
                            self.statusMessage("");
                        }, 3000);
                    }
                },
                error: function(xhr, status, error) {
                var errorMsg = "Erro ao enviar comando!";
                
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    if (xhr.responseJSON.error === "Printer not connected") {
                        errorMsg = "Impressora não está conectada!";
                    } else {
                        errorMsg = xhr.responseJSON.error;
                    }
                }
                
                self.statusMessage(errorMsg);
                self.statusClass("alert-error");
                
                new PNotify({
                    title: "Tupana",
                    text: errorMsg,
                    type: "error",
                    hide: true
                });
            });
        };

        // Inicialização
        self.onBeforeBinding = function() {
            // Carregar cores customizadas se existirem
            var savedColors = self.settings.settings.plugins.tupana.colors();
            if (savedColors && savedColors.length > 0) {
                self.colors(savedColors);
            }
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: TupanaViewModel,
        dependencies: ["settingsViewModel", "loginStateViewModel"],
        elements: ["#tab_plugin_tupana"]
    });
});
