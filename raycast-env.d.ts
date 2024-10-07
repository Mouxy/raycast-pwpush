/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Self-Hosted ONLY Server URL - The URL of the Self-Hosted PwPush server. For Pro/Premium accounts, only add the API Key. Your custom URL will be captured automatically */
  "serverUrl"?: string,
  /** API Key - Your PwPush API key. */
  "apiKey"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `pwpush` command */
  export type Pwpush = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `pwpush` command */
  export type Pwpush = {}
}



