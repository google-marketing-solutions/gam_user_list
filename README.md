# gam_user_list

## Overview
This Apps Script-based solution exports Ad Manager user data (users of the
network not end users) to a Google Sheet. The script authenticates to Ad
Manager with the Sheets user's user credentials so only users that already have
access to the GAM network will be able to export the data.

## Deploy

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

## Disclaimer

This is not an officially supported Google product. The code samples shared
here are not formally supported by Google and are provided only as a reference.