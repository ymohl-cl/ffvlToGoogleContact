# ffvlToGoogleContact

Create a google contact from a new ffvl's member which has club's subscribed and send it a welkomer email

## Template

Define the welkomer email which will send to the new member after record it.
The format is HTML

## SRC

Source files to excute the script. `0_code.ts` contains the main script `run`

## Usage

To use typescript with google app script, you need to follow this [installation](https://developers.google.com/apps-script/guides/typescript)

Note: the typescript import cause a troobleshooting when google transform files to js files. So it's need to comment them before push the new version.

``` bash
# Push your modification on google App Script
<$ clasp push
```

``` bash
# Create a new version
<$ clasp version <new-version>

# You could checks the version exist
<$ clasp versions
~ 2 Versions ~
1 - 1.0.0
2 - (no description)
```

``` bash deploy  new version
<$ clasp deploy <version> <description>
```

## Contributing

You could contribute with a PR on github. Never update the files directly from the google app script.

Thanks a lot :D
