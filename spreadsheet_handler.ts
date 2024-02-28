/**
 * @license
 * Copyright 2024 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Handles interactions with the active Spreadsheet.
 */

export class SpreadsheetHandler {
  constructor(
    private readonly spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet,
    private readonly userInterface: GoogleAppsScript.Base.Ui,
  ) {}

  /**
   * Creates a menu in the active Spreadsheet.
   * @param menuName The name of the menu.
   * @param menuItems An array of menu items.
   */
  createMenu(
    menuName: string,
    menuItems: [{itemName: string; functionName: string}],
  ): void {
    const menu = this.userInterface.createMenu(menuName);
    menuItems.forEach((item) => {
      menu.addItem(item.itemName, item.functionName);
    });
    menu.addToUi();
  }

  /**
   * Creates a new sheet in the container Spreadsheet from a template. The
   * values are inserted at A1.
   * @param newSheetName The name of the new sheet.
   * @param templateSheetName The name of the template sheet.
   * @param values The values to set.
   */
  createSheetFromTemplate(
    newSheetName: string,
    templateSheetName: string,
    values: string[][],
  ): void {
    const templateSheet =
      this.spreadsheet.getSheetByName(templateSheetName) || undefined;
    const newSheet = this.spreadsheet.insertSheet(newSheetName, {
      template: templateSheet,
    });
    const range = newSheet.getRange(1, 1, values.length, values[0].length);
    range.setValues(values);
  }

  /**
   * Gets the value from a named range in the container Spreadsheet. If the
   * named range contains more than once cell, only the top-left most value
   * is returned.
   * @param rangeName The name of the named range.
   */
  getValueFromNamedRangeOrThrow(rangeName: string): string {
    const namedRange = this.spreadsheet.getRangeByName(rangeName);
    if (!namedRange) {
      throw new Error(`Range ${rangeName} not found.`);
    }
    return namedRange.getValue();
  }
}
