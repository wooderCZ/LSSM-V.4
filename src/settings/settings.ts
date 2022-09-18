import { useSettingsStore } from '@stores/settings';

interface AbstractSetting<Tree extends SettingsTree, Type = unknown> {
    type: string;
    default: Type;
    // valueType: Type;

    noMapkit?: true;

    dependsOn?:
        | `!.${Exclude<keyof Tree, symbol>}` // value of local setting is falsy
        | `.${Exclude<keyof Tree, symbol>}`; // value of local setting is truthy
}

// explicit setting types

interface ColorSetting<Tree extends SettingsTree>
    extends AbstractSetting<Tree, `#${string}`> {
    type: 'color';
}

interface HiddenSetting<Tree extends SettingsTree>
    extends AbstractSetting<Tree> {
    type: 'hidden';
}

interface TextSetting<Tree extends SettingsTree>
    extends AbstractSetting<Tree, string> {
    type: 'text';
}

interface ToggleSetting<Tree extends SettingsTree>
    extends AbstractSetting<Tree, boolean> {
    type: 'toggle';
}

// further types

interface SettingsTree {
    [setting: string]:
        | ColorSetting<SettingsTree>
        | HiddenSetting<SettingsTree>
        | TextSetting<SettingsTree>
        | ToggleSetting<SettingsTree>;
}

interface SettingsDefinition<
    Module extends string,
    S extends SettingsTree = Record<string, never>
> {
    <Setting extends keyof S>(
        setting: Setting,
        defaultValue?: S[Setting]['default']
    ): Promise<S[Setting]['default']>;
    $module: Module;
    $get: this;
    $set<Setting extends keyof S>(
        setting: Setting,
        value: S[Setting]['default']
    ): typeof value;
}

// implementation

type SettingsTreeWithoutValueType<S extends SettingsTree> = {
    [Setting in keyof S]: Omit<S[Setting], 'valueType'>;
};

export const defineSettings = async <
    Module extends string,
    S extends SettingsTree
>(
    module: Module,
    settings: S /*SettingsTreeWithoutValueType<S>*/
) => {
    await useSettingsStore().registerModule({ moduleId: module, settings });

    const getSetting: SettingsDefinition<Module, S> = (setting, defaultValue) =>
        useSettingsStore().getSetting({
            moduleId: module,
            settingId: setting.toString(),
            defaultValue: defaultValue ?? settings[setting].default,
        });

    getSetting.$module = module;
    getSetting.$get = getSetting;
    getSetting.$set = (setting, value) =>
        useSettingsStore().setSetting({
            moduleId: module,
            settingId: setting.toString(),
            value,
        });

    return getSetting;
};
