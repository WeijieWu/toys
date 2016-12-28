#!/bin/sh
echo "检测文件目录是否存在"
if ! test -d ~/.workspace; then mkdir ~/.workspace; fi
if ! test -d ~/.workspace/toys; then mkdir ~/.workspace/toys; fi
if ! test -d ~/.workspace/toys/sources; then mkdir ~/.workspace/toys/sources; fi
if ! test -d ~/.workspace/toys/packages; then mkdir ~/.workspace/toys/packages; fi
cd ~/.workspace/toys/sources
NEW_PROJECT_DIR=$(date +"%Y%m%d%H%M%S")
if test -z $BRANCH; then
  echo "branch不能为空"
  exit 2;
fi
echo $NEW_PROJECT_DIR
echo $BRANCH
git clone https://github.com/WeijieWu/toys.git -b $BRANCH $NEW_PROJECT_DIR
cd $NEW_PROJECT_DIR
cp package.json ~/.workspace/toys/packages
cd ~/.workspace/toys/packages
npm i --registry=https://registry.npm.taobao.org
cd -
ln -s ~/.workspace/toys/packages/node_modules node_modules
cd ..
if test -e current; then rm -rf current; fi
if ! test -d /var/www; then mkdir /var/www; fi
if test -e /var/www/toys; then rm -rf /var/www/toys; fi
cp -rf ~/.workspace/toys/sources/$NEW_PROJECT_DIR /var/www/toys
cd /var/www/toys
pm2 start pm2.json
echo "删除时间过长的文件"
cd ~/.workspace/toys/sources
find ../ -maxdepth 1 -name "*[0-9]*" | sort | head -n -3 | xargs rm -rf
