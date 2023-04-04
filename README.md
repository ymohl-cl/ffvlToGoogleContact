# ffvlToGoogleContact

Create a google contact from a new ffvl's member which has club's subscribed and send it a welkomer email

## Template

Define the welkomer email which will send to the new member after record it.
The format is HTML

## SRC

Source files to excute the script. `0_code.ts` contains the main script `run`
Because they are a limitation usage of Google ressources, each call are a sleeper time of 1000.

## Usage

To use typescript with google app script, you need to follow this [installation](https://developers.google.com/apps-script/guides/typescript)

Note: the typescript import cause a troobleshooting when google transform files to js files. So it's need to comment them before push the new version.

``` bash
# Push your modification on google App Script
<$ clasp push
```

``` bash
# Create a new version
# the version should be automaticly create by clasp with the description version provided
<$ clasp version <description-version>

# You could checks the version exist
<$ clasp versions
~ 2 Versions ~
1 - 1.0.0
2 - (no description)
```

``` bash
# deploy will create a new version with the descriptions provided
<$ clasp deploy <version-description> <deploy-description>
```

## Contributing

You could contribute with a PR on github. Never update the files directly from the google app script.

Thanks a lot :D
