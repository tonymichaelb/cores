# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin
import flask

class TupanaPlugin(octoprint.plugin.SettingsPlugin,
                   octoprint.plugin.AssetPlugin,
                   octoprint.plugin.TemplatePlugin,
                   octoprint.plugin.StartupPlugin,
                   octoprint.plugin.SimpleApiPlugin):

    ##~~ SettingsPlugin mixin

    def get_settings_defaults(self):
        return dict(
            cores_enabled=True,
            colors=[
                {"name": "Cor 1", "command": "M182 A100 B0 C0", "color": "#FF0000"},
                {"name": "Cor 2", "command": "M182 A0 B100 C0", "color": "#00FF00"},
                {"name": "Cor 3", "command": "M182 A0 B0 C100", "color": "#0000FF"},
                {"name": "Cor 4", "command": "M182 A20 B10 C70", "color": "#3319B3"},
                {"name": "Cor 5", "command": "M182 A70 B10 C20", "color": "#B31933"},
                {"name": "Cor 6", "command": "M182 A70 B20 C10", "color": "#B33319"},
                {"name": "Cor 7", "command": "M182 A90 B0 C10", "color": "#E60019"},
                {"name": "Cor 8", "command": "M182 A40 B0 C60", "color": "#660099"},
                {"name": "Cor 9", "command": "M182 A15 B0 C85", "color": "#2600D9"},
                {"name": "Cor 10", "command": "M182 A20 B10 C70", "color": "#3319B3"},
                {"name": "Cor 11", "command": "M182 A0 B40 C60", "color": "#006699"},
                {"name": "Cor 12", "command": "M182 A0 B25 C75", "color": "#0040BF"},
                {"name": "Cor 13", "command": "M182 A10 B80 C10", "color": "#19CC19"},
                {"name": "Cor 14", "command": "M182 A50 B50 C0", "color": "#808000"},
                {"name": "Cor 15", "command": "M182 A80 B0 C20", "color": "#CC0033"},
                {"name": "Cor 16", "command": "M182 A33 B33 C34", "color": "#545557"},
                {"name": "Cor 17", "command": "M182 A40 B20 C40", "color": "#663366"},
                {"name": "Cor 18", "command": "M182 A85 B0 C15", "color": "#D90026"},
                {"name": "Cor 19", "command": "M182 A20 B10 C70", "color": "#3319B3"}
            ]
        )

    ##~~ AssetPlugin mixin

    def get_assets(self):
        return dict(
            js=["js/tupana.js"],
            css=["css/tupana.css"]
        )

    ##~~ TemplatePlugin mixin

    def get_template_configs(self):
        return [
            dict(type="tab", name="Cores", custom_bindings=False)
        ]

    ##~~ StartupPlugin mixin

    def on_after_startup(self):
        self._logger.info("Tupana plugin iniciado!")

    ##~~ SimpleApiPlugin mixin

    def get_api_commands(self):
        return dict(
            send_color=["gcode"]
        )

    def on_api_command(self, command, data):
        self._logger.info("=" * 50)
        self._logger.info("API Command recebido: {}".format(command))
        self._logger.info("Data type: {}".format(type(data)))
        self._logger.info("Data content: {}".format(data))
        self._logger.info("Data keys: {}".format(data.keys() if hasattr(data, 'keys') else 'N/A'))
        self._logger.info("=" * 50)
        
        if command == "send_color":
            try:
                # Procurar pelo parâmetro gcode
                gcode_command = None
                
                if isinstance(data, dict):
                    # Tentar 'gcode' primeiro (novo formato)
                    gcode_command = data.get("gcode")
                    self._logger.info(">>> Tentativa 1 (gcode): '{}'".format(gcode_command))
                    
                    # Fallback para 'command' (compatibilidade)
                    if not gcode_command:
                        gcode_command = data.get("command")
                        self._logger.info(">>> Tentativa 2 (command): '{}'".format(gcode_command))
                
                self._logger.info(">>> GCode FINAL: '{}'".format(gcode_command))
                self._logger.info(">>> Type: {}".format(type(gcode_command)))
                
                if not gcode_command or gcode_command == "send_color":
                    self._logger.error("!!! Comando inválido ou vazio: '{}'".format(gcode_command))
                    return flask.jsonify(dict(success=False, error="No valid command provided")), 400
                
                # Verificar se a impressora está conectada
                if not self._printer.is_operational():
                    self._logger.warning("!!! Impressora não está conectada!")
                    return flask.jsonify(dict(success=False, error="Printer not connected")), 409
                
                # Enviar comando para a impressora
                self._logger.info(">>> ENVIANDO PARA PRINTER: '{}'".format(gcode_command))
                self._printer.commands([str(gcode_command)])
                self._logger.info(">>> COMANDO ENVIADO!")
                
                return flask.jsonify(dict(success=True, command=gcode_command))
                
            except Exception as e:
                self._logger.error("Erro ao enviar comando: {}".format(str(e)))
                return flask.jsonify(dict(success=False, error=str(e))), 500

    ##~~ Softwareupdate hook

    def get_update_information(self):
        return dict(
            tupana=dict(
                displayName="Tupana Plugin",
                displayVersion=self._plugin_version,

                # version check: github repository
                type="github_release",
                user="tonymichaelb",
                repo="cores",
                current=self._plugin_version,

                # update method: pip
                pip="https://github.com/tonymichaelb/cores/archive/{target_version}.zip"
            )
        )


__plugin_name__ = "Tupana"
__plugin_pythoncompat__ = ">=2.7,<4"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = TupanaPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }
