if [  -z "$1" ]; then
dirs=($(find ./apis -type d -maxdepth 1 -mindepth 1 | egrep '[^e2e]$'))
echo "Building images for ${#dirs[@]} apps"
for dir in "${dirs[@]}"; do
  name=$(basename "$dir")
  echo "Building image for app: $name in directory: $dir"
  docker build -t "app-$name" --build-arg SERVER_DIR="$name" --network=host . -f ./apis/Dockerfile
done
exit 1
fi

echo "Building image for app: $1"
docker build -t "app-$1" --build-arg SERVER_DIR="$1" --network=host . -f ./apis/Dockerfile
exit 1
