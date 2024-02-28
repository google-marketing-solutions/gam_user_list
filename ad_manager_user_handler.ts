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
 * @fileoverview This module contains functions to get users from Ad Manager.
 */

import {AdManagerService} from 'gam_apps_script/ad_manager_service';
import {StatementBuilder} from 'gam_apps_script/statement_builder';

/**
 * Interface for user information.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  roleName: string;
  isActive: boolean;
}

interface UserPage {
  totalResultSetSize: number;
  startIndex: number;
  results?: User[];
}

/**
 * Class to handle user related operations in Ad Manager.
 */
export class AdManagerUserHandler {
  readonly networkCode: string;

  constructor(private readonly userService: AdManagerService) {
    this.networkCode = String(userService.networkCode);
  }

  /**
   * Get all users from Ad Manager.
   * @return List of users.
   */
  getAllUsers(): User[] {
    let users: User[] = [];
    const statementBuilder = new StatementBuilder();
    while (true) {
      const userPage = this.userService.performOperation(
        'getUsersByStatement',
        statementBuilder.toStatement(),
      ) as UserPage;
      const newUsers = userPage?.results;
      users = newUsers ? users.concat(newUsers) : users;
      statementBuilder.offset += statementBuilder.limit;
      if (!newUsers || newUsers.length < statementBuilder.limit) {
        break;
      }
    }
    return users;
  }
}
