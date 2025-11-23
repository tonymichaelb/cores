# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin

class TupanaPlugin(octoprint.plugin.SettingsPlugin,
                   octoprint.plugin.AssetPlugin,
                   octoprint.plugin.TemplatePlugin,
                   octoprint.plugin.StartupPlugin):

    ##~~ SettingsPlugin mixin

    def get_settings_defaults(self):
        return dict(
            # Adicione suas configurações padrão aqui
            cores_enabled=True
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

    ##~~ Softwareupdate hook

    def get_update_information(self):
        return dict(
            tupana=dict(
                displayName="Tupana Plugin",
                displayVersion=self._plugin_version,

                # version check: github repository
                type="github_release",
                user="seuusuario",
                repo="OctoPrint-Tupana",
                current=self._plugin_version,

                # update method: pip
                pip="https://github.com/seuusuario/OctoPrint-Tupana/archive/{target_version}.zip"
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
