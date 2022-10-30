#!/usr/bin/env bash
usage() { echo "$0 usage:" && grep " .)\ #" $0; exit 0; }
[ $# -eq 0 ] && usage

while getopts ":hm:dt" arg; do
  case $arg in
    m) # Specify Module Name
      MODULE_NAME=${OPTARG}

      if ! echo "$MODULE_NAME" | grep -E '^[A-Z](([a-z]+[A-Z]?)*)$'; then
        echo -n "E: Module Name not PascalCase"
        exit 1
      fi

      ;;
    d) # Run dry
      DRY=1
      ;;
    t) # Make template from module
      CREATE_TEMPLATE=1
      ;;
    h | *) # Display help.
      usage
      exit 0
      ;;
  esac
done


cd "$(dirname "$0")"


MODULE_NAME_SPACED=$(echo "$MODULE_NAME" \
  | sed 's/\([^A-Z]\)\([A-Z0-9]\)/\1 \2/g' \
  | sed 's/\([A-Z0-9]\)\([A-Z0-9]\)\([^A-Z]\)/\1 \2\3/g')
MODULE_NAME_DASHED=$(echo "$MODULE_NAME" \
  | sed 's/\([^A-Z]\)\([A-Z0-9]\)/\1-\2/g' \
  | sed 's/\([A-Z0-9]\)\([A-Z0-9]\)\([^A-Z]\)/\1-\2\3/g' \
  | tr '[:upper:]' '[:lower:]')
MODULE_NAME_UNDERSCORE=$(echo "$MODULE_NAME" \
  | sed 's/\([^A-Z]\)\([A-Z0-9]\)/\1_\2/g' \
  | sed 's/\([A-Z0-9]\)\([A-Z0-9]\)\([^A-Z]\)/\1_\2\3/g' \
  | tr '[:upper:]' '[:lower:]')
MODULE_NAME_CAMEL=$(echo "$MODULE_NAME_UNDERSCORE" | sed -E 's/_(.)/\U\1/g')



MODULE_FOLDER="$MODULE_NAME_DASHED"
MODULE_DIR="../modules/$MODULE_FOLDER/"

if [ $DRY ]; then
  echo "Module Name: $MODULE_NAME"
  echo "Module Name Spaced: $MODULE_NAME_SPACED"
  echo "Module Name Dashed: $MODULE_NAME_DASHED"
  echo "Module Name Underscore: $MODULE_NAME_UNDERSCORE"
  echo "Module Name Camelcase: $MODULE_NAME_CAMEL"
  echo "Module Folder: $MODULE_FOLDER"
  echo "Module Directory: $MODULE_DIR"
fi


# create Template
if [ $CREATE_TEMPLATE ]; then
  echo "Creating template from $MODULE_DIR"

  if [ ! $DRY ]; then

    rm -r "module_template/"
    cp -r "$MODULE_DIR" "module_template/"

    find "module_template/" -type f

    find "module_template" -type f \
      -exec sed -i "s/$MODULE_NAME_CAMEL/\\\$MODULE_NAME_CAMEL\\\$/g" {} \+ \
      -exec sed -i "s/$MODULE_NAME/\\\$MODULE_NAME\\\$/g" {} \+  \
      -exec sed -i "s/$MODULE_NAME_UNDERSCORE/\\\$MODULE_NAME_UNDERSCORE\\\$/g" {} \+ \
      -exec sed -i "s/$MODULE_NAME_SPACED/\\\$MODULE_NAME_SPACED\\\$/g" {} \+ \
      -exec sed -i "s/$MODULE_NAME_DASHED/\\\$MODULE_NAME_DASHED\\\$/g" {} \+
  fi
else
  echo "Extracting template to $MODULE_DIR"

  if [[ -d "$MODULE_DIR" ]]; then
    echo -n "E: Module in directory '$MODULE_DIR' already exists"
    exit 1
  fi

  if [ ! $DRY ]; then
    
    cp -r "module_template/." "$MODULE_DIR"


    find "$MODULE_DIR" -type f \
      -exec sed -i "s/\\\$MODULE_NAME_CAMEL\\\$/$MODULE_NAME_CAMEL/g" {} \+ \
      -exec sed -i "s/\\\$MODULE_NAME\\\$/$MODULE_NAME/g" {} \+  \
      -exec sed -i "s/\\\$MODULE_NAME_UNDERSCORE\\\$/$MODULE_NAME_UNDERSCORE/g" {} \+ \
      -exec sed -i "s/\\\$MODULE_NAME_SPACED\\\$/$MODULE_NAME_SPACED/g" {} \+ \
      -exec sed -i "s/\\\$MODULE_NAME_DASHED\\\$/$MODULE_NAME_DASHED/g" {} \+
    

    # add export/import to 'modules/index.ts'
    echo -en "\nexport { ${MODULE_NAME_CAMEL}Module } from './${MODULE_FOLDER}';" >> "../modules/index.ts"

    find "$MODULE_DIR" -type f
  fi
fi