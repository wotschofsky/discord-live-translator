mkdir -p ./dist
rm -rf ./dist/*
cp -r ./src/lib ./dist
tsc
