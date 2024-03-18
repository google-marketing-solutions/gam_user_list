# gam_user_list

## Overview
This Apps Script-based solution exports Ad Manager user data (users of the
network not end users) to a Google Sheet. The script authenticates to Ad
Manager with the Sheets user's user credentials so only users that already have
access to the GAM network will be able to export the data.

## Deploy

To get your own copy of this solution, make a copy of this
[Google Sheet](https://docs.google.com/spreadsheets/d/1ePO_k-CViE1xP1whPl-5K9pWZs8KgL4t5ZxY_fCOpzs/edit#gid=1907979383)
and follow the included setup instructions.

## Deploy manually

Install dependencies with npm:

```sh
$ npm install
```

Build:

```sh
$ npm run build
```

Use [clasp](https://developers.google.com/apps-script/guides/clasp#installation)
from the top level of the repository to create a Google Sheets script. Once
clasp is configured, build and deploy with:

```sh
$ npm run deploy
```

Once deployed, you need to make additional configurations in the container
spreadsheet:
* Create a one-cell named range called "NETWORK_CODE". Input the network code
that the export should be run against in this cell.
* Create a one-cell named range called "API_VERSION". Input the Ad Manager API
version that should be used (eg. v0000 - use the latest from
[here](https://developers.google.com/ad-manager/api/rel_notes)).
* Create a sheet called "USER_LIST_TEMPLATE". This will be copied and used as a
template for the exported data. Use this to create custom formatting. 

## Usage

If the project has been deployed and configured correctly, a new menu item
called ```Ad Manager``` will appear a few seconds after opening the container
Spreadsheet.

To export a list of users for the currently configured network, select
```Ad Manager > Export Users```.

Although only users with access to the Ad Manager network will be able to export
new data, please be aware that the exported data will be visible to anyone with
access to the Google Sheets file regardless of whether or not they have access
to the data in Google Ad Manager.

## Disclaimer

This is not an officially supported Google product. The code samples shared
here are not formally supported by Google and are provided only as a reference.