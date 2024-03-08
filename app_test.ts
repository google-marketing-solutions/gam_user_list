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

import 'jasmine';

import {AdManagerUserHandler, User} from './ad_manager_user_handler';
import {createMenu, onExportUsersSelected} from './app';
import {SpreadsheetHandler} from './spreadsheet_handler';

const TEST_USERS: User[] = [
  {
    id: 1,
    name: 'user1',
    email: 'user1@',
    roleName: 'role1',
    isActive: true,
  },
  {
    id: 2,
    name: 'user2',
    email: 'user2@',
    roleName: 'role2',
    isActive: false,
  },
];

const OUTPUT_VALUES_FOR_TEST_USERS = [
  ['ID', 'Name', 'Email', 'Role', 'Active'],
  ['1', 'user1', 'user1@', 'role1', 'true'],
  ['2', 'user2', 'user2@', 'role2', 'false'],
];

describe('App', () => {
  describe('createMenu', () => {
    it('creates a menu called "Ad Manager" with an item called "Export users"', () => {
      const spreadsheetHandler: SpreadsheetHandler = jasmine.createSpyObj(
        'SpreadsheetHandler',
        ['createMenu'],
      );

      createMenu(spreadsheetHandler);

      expect(spreadsheetHandler.createMenu).toHaveBeenCalledWith('Ad Manager', [
        {
          itemName: 'Export users',
          functionName: 'onExportUsersSelected',
        },
      ]);
    });
  });

  describe('onExportUsersSelected', () => {
    it('creates a new sheet with the correct name and values', () => {
      const spreadsheetHandler = jasmine.createSpyObj<SpreadsheetHandler>(
        'SpreadsheetHandler',
        ['createSheetFromTemplate'],
      );
      const userHandler = jasmine.createSpyObj<AdManagerUserHandler>(
        'UserHandler',
        ['getAllUsers'],
        {networkCode: 'NETWORK_CODE'},
      );
      userHandler.getAllUsers.and.returnValue(TEST_USERS);

      onExportUsersSelected(spreadsheetHandler, userHandler, 'DATE_STRING');

      expect(spreadsheetHandler.createSheetFromTemplate).toHaveBeenCalledWith(
        '[DATE_STRING] Network code: NETWORK_CODE',
        'USER_LIST_TEMPLATE',
        OUTPUT_VALUES_FOR_TEST_USERS,
      );
    });

    it('increments sheet name if it already exists', () => {
      const spreadsheetHandler = jasmine.createSpyObj<SpreadsheetHandler>(
        'SpreadsheetHandler',
        ['createSheetFromTemplate'],
      );
      spreadsheetHandler.createSheetFromTemplate.and.callFake(
        (sheetName, templateName, values) => {
          if (
            sheetName === '[DATE_STRING] Network code: NETWORK_CODE' ||
            sheetName === '[DATE_STRING] Network code: NETWORK_CODE (1)'
          ) {
            throw new Error('Sheet already exists');
          }
        },
      );
      const userHandler = jasmine.createSpyObj<AdManagerUserHandler>(
        'UserHandler',
        ['getAllUsers'],
        {networkCode: 'NETWORK_CODE'},
      );
      userHandler.getAllUsers.and.returnValue(TEST_USERS);

      onExportUsersSelected(spreadsheetHandler, userHandler, 'DATE_STRING');

      expect(spreadsheetHandler.createSheetFromTemplate).toHaveBeenCalledWith(
        '[DATE_STRING] Network code: NETWORK_CODE (2)',
        'USER_LIST_TEMPLATE',
        OUTPUT_VALUES_FOR_TEST_USERS,
      );
    });
  });
});
