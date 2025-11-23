$(function() {
    function TupanaViewModel(parameters) {
        var self = this;

        self.settings = parameters[0];

        // Elementos de cores
        self.primaryColor = ko.observable("#FF0000");
        self.secondaryColor = ko.observable("#00FF00");
        self.tertiaryColor = ko.observable("#0000FF");

        // Inicialização após o binding
        self.onAfterBinding = function() {
            // Carregar cores salvas
            self.loadColors();
            
            // Event listeners para atualizar preview
            $("#tupana-primary-color").on("change", function() {
                self.primaryColor($(this).val());
                self.updatePreview();
            });
            
            $("#tupana-secondary-color").on("change", function() {
                self.secondaryColor($(this).val());
                self.updatePreview();
            });
            
            $("#tupana-tertiary-color").on("change", function() {
                self.tertiaryColor($(this).val());
                self.updatePreview();
            });
            
            // Botão salvar
            $("#tupana-save-colors").on("click", function() {
                self.saveColors();
            });
            
            // Botão resetar
            $("#tupana-reset-colors").on("click", function() {
                self.resetColors();
            });
            
            // Atualizar preview inicial
            self.updatePreview();
        };

        // Atualizar visualização das cores
        self.updatePreview = function() {
            $("#preview-primary").css("background-color", self.primaryColor());
            $("#preview-secondary").css("background-color", self.secondaryColor());
            $("#preview-tertiary").css("background-color", self.tertiaryColor());
        };

        // Salvar cores
        self.saveColors = function() {
            var colors = {
                primary: self.primaryColor(),
                secondary: self.secondaryColor(),
                tertiary: self.tertiaryColor()
            };
            
            localStorage.setItem("tupana_colors", JSON.stringify(colors));
            
            new PNotify({
                title: "Tupana",
                text: "Cores salvas com sucesso!",
                type: "success",
                hide: true
            });
        };

        // Carregar cores
        self.loadColors = function() {
            var savedColors = localStorage.getItem("tupana_colors");
            if (savedColors) {
                var colors = JSON.parse(savedColors);
                self.primaryColor(colors.primary || "#FF0000");
                self.secondaryColor(colors.secondary || "#00FF00");
                self.tertiaryColor(colors.tertiary || "#0000FF");
                
                $("#tupana-primary-color").val(self.primaryColor());
                $("#tupana-secondary-color").val(self.secondaryColor());
                $("#tupana-tertiary-color").val(self.tertiaryColor());
                
                self.updatePreview();
            }
        };

        // Resetar cores
        self.resetColors = function() {
            self.primaryColor("#FF0000");
            self.secondaryColor("#00FF00");
            self.tertiaryColor("#0000FF");
            
            $("#tupana-primary-color").val("#FF0000");
            $("#tupana-secondary-color").val("#00FF00");
            $("#tupana-tertiary-color").val("#0000FF");
            
            self.updatePreview();
            
            new PNotify({
                title: "Tupana",
                text: "Cores resetadas para o padrão!",
                type: "info",
                hide: true
            });
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: TupanaViewModel,
        dependencies: ["settingsViewModel"],
        elements: ["#tab_plugin_tupana"]
    });
});
