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
 * @fileoverview The main entry point for User List Export application.
 */

import {AdManagerClient} from 'gam_apps_script/ad_manager_client';
import {AdManagerUserHandler} from './ad_manager_user_handler';
import {SpreadsheetHandler} from './spreadsheet_handler';

const TEMPLATE_SHEET = 'USER_LIST_TEMPLATE';
const NAMED_RANGE_NETWORK_CODE = 'NETWORK_CODE';
const NAMED_RANGE_API_VERSION = 'API_VERSION';

let spreadsheetHandler: SpreadsheetHandler;

function getSpreadsheetHandler(): SpreadsheetHandler {
  if (!spreadsheetHandler) {
    spreadsheetHandler = new SpreadsheetHandler(
      SpreadsheetApp.getActiveSpreadsheet(),
      SpreadsheetApp.getUi(),
    );
  }
  return spreadsheetHandler;
}

function createAdManagerUserHandler(): AdManagerUserHandler {
  const spreadsheetHandler = getSpreadsheetHandler();
  const networkCode = spreadsheetHandler.getValueFromNamedRangeOrThrow(
    NAMED_RANGE_NETWORK_CODE,
  );
  const apiVersion = spreadsheetHandler.getValueFromNamedRangeOrThrow(
    NAMED_RANGE_API_VERSION,
  );
  const adManagerClient = new AdManagerClient(
    ScriptApp.getOAuthToken(),
    'gam_user_list',
    networkCode,
    apiVersion,
  );
  const userService = adManagerClient.getService('UserService');
  return new AdManagerUserHandler(userService);
}

/**
 * Exports users from Ad Manager to a new sheet.
 * @param spreadsheetHandler The spreadsheet handler.
 * @param userHandler The Ad Manager user handler.
 * @param dateString The current date as a string.
 */
export function onExportUsersSelected(
  spreadsheetHandler = getSpreadsheetHandler(),
  userHandler = createAdManagerUserHandler(),
  dateString = Utilities.formatDate(new Date(), 'GMT+0', 'M/d/yy'),
) {
  // export users
  const users = userHandler.getAllUsers();
  const userList = users.map((user) => [
    String(user.id),
    String(user.name),
    String(user.email),
    String(user.roleName),
    String(user.isActive),
  ]);
  let values = [['ID', 'Name', 'Email', 'Role', 'Active']];
  values = values.concat(userList);
  // create new sheet with values
  const newSheetName = `[${dateString}] Network code: ${userHandler.networkCode}`;
  let attempt = 0;
  let sheetCreated = false;
  while (!sheetCreated) {
    try {
      const sheetName = attempt ? `${newSheetName} (${attempt})` : newSheetName;
      spreadsheetHandler.createSheetFromTemplate(
        sheetName,
        TEMPLATE_SHEET,
        values,
      );
      sheetCreated = true;
    } catch {
      attempt++;
    }
  }
}

/**
 * Creates a menu entry in the Google Sheets UI.
 * @param spreadsheetHandler The spreadsheet handler.
 */
export function createMenu(spreadsheetHandler: SpreadsheetHandler) {
  spreadsheetHandler.createMenu('Ad Manager', [
    {itemName: 'Export users', functionName: 'onExportUsersSelected'},
  ]);
}

/**
 * Main entry point for the app. Triggered when the spreadsheet is opened.
 */
export function onOpen() {
  const spreadsheetHandler = getSpreadsheetHandler();
  createMenu(spreadsheetHandler);
}

global.onOpen = onOpen;



