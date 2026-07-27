if [[ $# -eq 0 ]]; then
  echo "Illegal number of parameters"
  exit 1
fi

echo "Changing directory"
cd src/main/frontend

case $1 in
link)
  echo "Uninstalling the lib"
  npm un --quiet @sztyro/core
  echo "Linking the lib"
  npm link --quiet @sztyro/core
  ;;
install)
  echo "Installing the lib"
  npm install --quiet @sztyro/core
  ;;
esac

echo "Done"

for arg in "$@"
do
    case $arg in
        --start)
          echo "Starting angular"
          ng s
            ;;
    esac
done
