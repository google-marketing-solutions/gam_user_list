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

describe('AdManagerUserHandler', () => {
  describe('getAllUsers', () => {
    it('gets all users from network', () => {
      const users: User[] = [];
      for (let i = 0; i < 100; i++) {
        users.push({
          id: i,
          name: `user${i}`,
          email: `user${i}@google.com`,
          roleName: `role${i}`,
          isActive: true,
        });
      }
      const userService = jasmine.createSpyObj('AdManagerService', [
        'performOperation',
      ]);
      userService.performOperation.and.returnValues(
        {
          totalResultSetSize: 100,
          startIndex: 0,
          results: users.slice(0, 75),
        },
        {
          totalResultSetSize: 100,
          startIndex: 75,
          results: users.slice(75, 100),
        },
      );
      const userHandler = new AdManagerUserHandler(userService);

      expect(userHandler.getAllUsers()).toEqual(users);
    });
  });
});
