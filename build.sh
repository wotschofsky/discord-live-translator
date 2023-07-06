mkdir -p ./dist
rm -rf ./dist/*
node-gyp rebuild
cp -r ./src/lib ./dist
tsc
